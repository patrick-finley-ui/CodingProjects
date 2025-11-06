import { useState } from 'react';
import type { InvoiceRecord, ScriptResponseData } from '../types/invoices';
import type { ProcessInstanceExecutionHistoryResponse } from '@uipath/uipath-typescript';
import { formatDateTime, getStatusColor } from '../utils/formatters';

interface InvoiceDetailsProps {
  selectedInvoice: InvoiceRecord | null;
  processDetails: {
    executionHistory?: ProcessInstanceExecutionHistoryResponse[];
    variables?: Record<string, Array<{ name: string; value: string; type: string }>>;
    scriptResponse?: ScriptResponseData;
    bpmnXml?: string;
    taskLink?: string;
    activityType?: string;
    activityName?: string;
    taskCompleted?: boolean;
    loading: boolean;
    error?: string;
  };
  onRefreshData?: () => void;
}

export const InvoiceDetails = ({ selectedInvoice, processDetails }: InvoiceDetailsProps) => {
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [variablesData, setVariablesData] = useState<any>(null);
  const [variablesError, setVariablesError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'clins' | 'evaluations' | 'execution'>('clins');
  const showDebugBox = import.meta.env.VITE_SHOW_DEBUG_BOX === 'true';

  // Hardcoded process definition key - same as in Dashboard.tsx
  const PROCESS_DEFINITION_KEY = '44479d67-c3d0-41e4-9ae0-3b337e320f9e';

  const openMaestroProcess = () => {
    if (!selectedInvoice?.maestroProcessKey || !selectedInvoice?.folderId) {
      console.error('Missing maestroProcessKey or folderId');
      return;
    }

    const url = `https://staging.uipath.com/uipathlabs/Playground/maestro_/processes/${PROCESS_DEFINITION_KEY}/instances/${selectedInvoice.maestroProcessKey}?folderKey=${selectedInvoice.folderId}`;
    window.open(url, '_blank');
  };

  const fetchVariablesDebug = async () => {
    if (!selectedInvoice?.maestroProcessKey || !selectedInvoice?.folderId) {
      setVariablesError('No process key or folder ID available');
      return;
    }

    try {
      setIsLoadingVariables(true);
      setVariablesError(null);

      const variables = await (window as any).sdk.maestro.processes.instances.getVariables(
        selectedInvoice.maestroProcessKey,
        selectedInvoice.folderId
      );

      // Extract the scriptResponse variable with id 'vDuNTvAij' from globalVariables
      const variablesArray = (variables as any)?.globalVariables || variables;
      let scriptResponseVariable = null;

      if (Array.isArray(variablesArray)) {
        scriptResponseVariable = variablesArray.find(
          (v: any) => v.id === 'vDuNTvAij' && v.name === 'scriptResponse'
        );
      }

      if (scriptResponseVariable) {
        setVariablesData(scriptResponseVariable);
      } else {
        setVariablesError('scriptResponse variable with id "vDuNTvAij" not found in response');
        setVariablesData(variables); // Show full response for debugging
      }
    } catch (err) {
      console.error('Error fetching variables:', err);
      setVariablesError(err instanceof Error ? err.message : 'Failed to fetch variables');
    } finally {
      setIsLoadingVariables(false);
    }
  };

  // Empty state - no invoice selected
  if (!selectedInvoice) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="max-w-md mx-auto p-8">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Details</h3>
          <p className="text-gray-500 leading-relaxed">Select an invoice from the left panel to view detailed information, process execution data, and associated documents.</p>
        </div>
      </div>
    );
  }

  const hasProcessInstance = selectedInvoice.maestroProcessKey && selectedInvoice.folderId;

  return (
    <>
      <div className="h-full overflow-y-auto">
        {/* Invoice Header Section - Enhanced with 3 Tiers */}
        <div className="bg-white border-b border-white p-6">
          {/* Tier 1: Most Important - Invoice #, Status, Vendor */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Invoice: {selectedInvoice.invoiceId || selectedInvoice.id}
              </h1>
              <p className="text-xl font-semibold text-orange-700 mb-1">
                Vendor: {selectedInvoice.vendorName || 'Unknown Vendor'}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <span className={`px-5 py-2.5 text-base font-bold rounded-full shadow-sm border whitespace-nowrap ${getStatusColor(selectedInvoice.status)}`}>
                Status: {selectedInvoice.status || 'Unknown'}
              </span>
              {processDetails.activityType?.toLowerCase() === 'user task' && !processDetails.taskCompleted && processDetails.taskLink ? (
                <button
                  onClick={() => setIsTaskPopupOpen(true)}
                  className={`px-5 py-2.5 text-base font-bold rounded-full shadow-sm border whitespace-nowrap transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 flex items-center gap-2`}
                >
                  Audit Review: Active
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              ) : (
                <span className={`px-5 py-2.5 text-base font-bold rounded-full shadow-sm border whitespace-nowrap flex items-center gap-2 ${
                  processDetails.scriptResponse?.summaryData?.OverallStatus === 'FullyMatched' ? 'bg-green-100 text-green-800 border-green-200' :
                  processDetails.activityType?.toLowerCase() === 'user task' && !processDetails.taskCompleted ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  processDetails.scriptResponse ? 'bg-green-100 text-green-800 border-green-200' :
                  'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  Audit Review: {
                    processDetails.scriptResponse?.summaryData?.OverallStatus === 'FullyMatched' ? 'Completed' :
                    processDetails.activityType?.toLowerCase() === 'user task' && !processDetails.taskCompleted ? 'Active' :
                    processDetails.scriptResponse ? 'Completed' :
                    'Not Ready Yet'
                  }
                  {processDetails.scriptResponse?.summaryData?.OverallStatus === 'FullyMatched' || processDetails.scriptResponse ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : processDetails.activityType?.toLowerCase() === 'user task' && !processDetails.taskCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </span>
              )}
              {hasProcessInstance && (
                <button
                  onClick={openMaestroProcess}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md"
                  title="Open in Maestro"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 007.42.8l.13-.13a5 5 0 000-7.08 5.01 5.01 0 00-7.07-.01l-3 3"/> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11a5 5 0 00-7.42-.8l-.13.13a5 5 0 000 7.08 5.01 5.01 0 007.07.01l3-3"/> 
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="w-full h-1 bg-orange-100 my-6 rounded"></div>

          {/* Tier 2 & 3: Side-by-side cards - Key Details and AI Agent Match Summary */}
          {processDetails.scriptResponse && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Key Details Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Key Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Contract Number */}
                  {(() => {
                    const contractNumber = processDetails.scriptResponse.summaryData?.ContractNumber ||
                                          processDetails.scriptResponse.keyDetails?.contract_number_invoice ||
                                          processDetails.scriptResponse.keyDetails?.contract_number_purchase_order;
                    return contractNumber ? (
                      <div>
                        <span className="text-base text-gray-500 block mb-1">Contract Number</span>
                        <span className="text-lg font-semibold text-gray-900 font-mono block">
                          {contractNumber}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Invoice Number */}
                  {(() => {
                    const invoiceNumber = processDetails.scriptResponse.summaryData?.InvoiceNumber ||
                                         processDetails.scriptResponse.keyDetails?.invoice_number_invoice ||
                                         selectedInvoice.invoiceId;
                    return invoiceNumber ? (
                      <div>
                        <span className="text-base text-gray-500 block mb-1">Invoice Number</span>
                        <span className="text-lg font-semibold text-gray-900 font-mono block">
                          {invoiceNumber}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Invoice Date */}
                  {(() => {
                    const invoiceDate = processDetails.scriptResponse.keyDetails?.invoice_date ||
                                       processDetails.scriptResponse.summaryData?.Timestamp ||
                                       selectedInvoice.createdBy;
                    return invoiceDate ? (
                      <div>
                        <span className="text-base text-gray-500 block mb-1">Invoice Date</span>
                        <span className="text-lg font-semibold text-gray-900 block">
                          {new Date(invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Number of CLINs */}
                  {processDetails.scriptResponse.clinsData && (
                    <div>
                      <span className="text-base text-gray-500 block mb-1">Number of CLINs</span>
                      <span className="text-lg font-semibold text-gray-900 block">
                        {processDetails.scriptResponse.clinsData.length}
                      </span>
                    </div>
                  )}

                  {/* Total Amount */}
                  {(() => {
                    let totalAmount = processDetails.scriptResponse.keyDetails?.total_amount_invoice ||
                                     processDetails.scriptResponse.summaryData?.TotalAmount;

                    // If not found, sum up clinsData amounts
                    if (!totalAmount && processDetails.scriptResponse.clinsData) {
                      totalAmount = processDetails.scriptResponse.clinsData.reduce((sum: number, clin: any) => {
                        const amount = parseFloat(clin.amount_invoice || clin.amount || 0);
                        return sum + amount;
                      }, 0);
                    }

                    return totalAmount ? (
                      <div>
                        <span className="text-base text-gray-500 block mb-1">Total Amount (Invoice)</span>
                        <span className="text-lg font-semibold text-gray-900 block">
                          ${Number(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Payment Date */}
                  {(() => {
                    let paymentDate = processDetails.scriptResponse.keyDetails?.payment_date ||
                                      processDetails.scriptResponse.keyDetails?.paymentDueDate;

                    if (!paymentDate) {
                      // If the first two fields are empty, use 30 days from now
                      paymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                    } else if (!paymentDate) {
                      paymentDate = (selectedInvoice as any).payment_date ||
                                    (selectedInvoice as any).payment_due ||
                                    processDetails.scriptResponse.keyDetails?.settlement_date;
                    }
                    return (
                      <div>
                        <span className="text-base text-gray-500 block mb-1">Payment Date</span>
                        <span className="text-lg font-semibold text-gray-900 block">
                          {paymentDate ? new Date(paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Shipment Number */}
                  {(() => {
                    const shipmentNumber = processDetails.scriptResponse.keyDetails?.shipment_reference ||
                                          (processDetails.scriptResponse.clinsData && processDetails.scriptResponse.clinsData[0]?.po_shipment_number) ||
                                          (processDetails.scriptResponse.clinsData && processDetails.scriptResponse.clinsData[0]?.shipment_number_goods_receipt);
                    return (
                      <div>
                        <span className="text-base text-gray-500 block mb-1">Shipment Number</span>
                        <span className="text-lg font-semibold text-gray-900 block">
                          {shipmentNumber || 'N/A'}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Ship Address */}
                  {(() => {
                    const shipAddress = processDetails.scriptResponse.keyDetails?.delivery_point ||
                                       '123 Main Street, Washington, DC 20001';
                    return (
                      <div className="col-span-2">
                        <span className="text-base text-gray-500 block mb-1">Ship Address</span>
                        <span className="text-lg font-semibold text-gray-900 block">
                          {shipAddress}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* AI Agent Match Summary Card */}
              {processDetails.scriptResponse.summaryData && (
                <div 
                  onClick={() => setActiveTab('evaluations')}
                  className="bg-white rounded-lg p-6 shadow-sm border border-orange-200 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all duration-200"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    AI Agent Match Summary
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </h3>
                  <div className="space-y-5 text-lg">
                    {/* Overall Status */}
                    {processDetails.scriptResponse.summaryData.OverallStatus && (
                      <div className="">
                        <span className="text-gray-500 text-lg block mb-1">Status:</span>
                        <span className={`px-4 py-2 rounded-full text-base font-semibold ${
                          processDetails.scriptResponse.summaryData.OverallStatus === 'FullyMatched' ? 'bg-green-100 text-green-800' :
                          processDetails.scriptResponse.summaryData.OverallStatus === 'PartiallyMatched' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {processDetails.scriptResponse.summaryData.OverallStatus}
                        </span>
                      </div>
                    )}
                    {/* Recommendations */}
                    {processDetails.scriptResponse.summaryData.Recommendations && (
                      <div>
                        <span className="text-gray-500 block mb-2 text-lg">Recommendations:</span>
                        <ul className="list-disc pl-8 text-gray-900 text-base leading-relaxed bg-gray-50 p-4 rounded space-y-2">
                          {Array.isArray(processDetails.scriptResponse.summaryData.Recommendations)
                            ? processDetails.scriptResponse.summaryData.Recommendations.map((rec: string, i: number) => (
                                <li key={i}>{rec}</li>
                              ))
                            : <li>{processDetails.scriptResponse.summaryData.Recommendations}</li>
                          }
                        </ul>
                      </div>
                    )}
                    {/* Check Breakdown - KPI Style */}
                    <div>
                      <span className="text-gray-500 block mb-2 text-lg">Validation Checks:</span>
                      <div className="flex divide-x divide-gray-300">
                        {/* Passed */}
                        <div className="text-center flex-1 px-3">
                          <div className="text-2xl font-bold text-green-700">
                            {processDetails.scriptResponse.summaryData.ChecksPassed || 0}
                          </div>
                          <div className="text-xs text-green-600 font-medium mt-1">Passed</div>
                        </div>
                        
                        {/* Failed High */}
                        <div className="text-center flex-1 px-3">
                          <div className="text-2xl font-bold text-red-700">
                            {processDetails.scriptResponse.summaryData.ChecksFailed_High || 0}
                          </div>
                          <div className="text-xs text-red-600 font-medium mt-1">Failed High</div>
                        </div>
                        
                        {/* Failed Medium */}
                        <div className="text-center flex-1 px-3">
                          <div className="text-2xl font-bold text-orange-700">
                            {processDetails.scriptResponse.summaryData.ChecksFailed_Medium || 0}
                          </div>
                          <div className="text-xs text-orange-600 font-medium mt-1">Failed Medium</div>
                        </div>
                        
                        {/* Failed Low */}
                        <div className="text-center flex-1 px-3">
                          <div className="text-2xl font-bold text-yellow-700">
                            {processDetails.scriptResponse.summaryData.ChecksFailed_Low || 0}
                          </div>
                          <div className="text-xs text-yellow-600 font-medium mt-1">Failed Low</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Debug Box - Maestro Data */}
          {showDebugBox && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug: Maestro Process Data</h3>
                  <div className="text-xs font-mono space-y-1 mb-3">
                    <div className="flex gap-2">
                      <span className="text-yellow-700 font-semibold">Process Key:</span>
                      <span className="text-yellow-900">{selectedInvoice.maestroProcessKey || 'Not set'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-700 font-semibold">Folder ID:</span>
                      <span className="text-yellow-900">{selectedInvoice.folderId || 'Not set'}</span>
                    </div>
                  </div>

                  <button
                    onClick={fetchVariablesDebug}
                    disabled={isLoadingVariables || !selectedInvoice.maestroProcessKey || !selectedInvoice.folderId}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingVariables ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Fetch Variables Data
                      </>
                    )}
                  </button>

                  {variablesError && (
                    <div className="mt-3 bg-red-100 border border-red-300 rounded p-2">
                      <p className="text-xs text-red-800 font-semibold">Error:</p>
                      <p className="text-xs text-red-700">{variablesError}</p>
                    </div>
                  )}

                  {variablesData && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-yellow-800 font-semibold">scriptResponse Variable (id: vDuNTvAij)</p>
                          {variablesData.id && (
                            <p className="text-xs text-yellow-600 mt-1">
                              ID: {variablesData.id} | Name: {variablesData.name} | Type: {variablesData.type}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setVariablesData(null)}
                          className="text-yellow-600 hover:text-yellow-800 text-xs font-medium"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="bg-yellow-100 border border-yellow-300 rounded p-3 max-h-96 overflow-auto">
                        <pre className="text-xs text-yellow-900 whitespace-pre-wrap break-words">
                          {JSON.stringify(variablesData.value || variablesData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
<div className="w-full h-1 bg-orange-100 my-6 rounded"></div>
  
        </div>

        {/* Process Details Sections Below - Full Width */}
        {hasProcessInstance && (
          <div className="px-4 space-y-4">
            {processDetails.loading ? (
              <div>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
                    <h3 className="text-md font-semibold text-gray-900 mb-1">Loading Process Details</h3>
                    <p className="text-gray-600 text-sm">Fetching execution history and variables...</p>
                  </div>
                </div>
              </div>
            ) : processDetails.error ? (
              <div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-red-800">Unable to load process details</h3>
                      <p className="text-red-700 mt-1">{processDetails.error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Tab Navigation */}
                {processDetails.scriptResponse?.clinsData && processDetails.scriptResponse.clinsData.length > 0 &&
                 processDetails.scriptResponse?.matchEvaluations && processDetails.scriptResponse.matchEvaluations.length > 0 && (
                  <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex gap-1 px-4 pt-4">
                      <button
                        onClick={() => setActiveTab('clins')}
                        className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200 ${
                          activeTab === 'clins'
                            ? 'bg-white text-purple-700 border-t-2 border-l border-r border-purple-500 shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        role="tab"
                        aria-selected={activeTab === 'clins'}
                        aria-controls="clins-panel"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Contract Line Items
                          {processDetails.scriptResponse.clinsData && (
                            <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                              {processDetails.scriptResponse.clinsData.length}
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('evaluations')}
                        className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200 ${
                          activeTab === 'evaluations'
                            ? 'bg-white text-blue-700 border-t-2 border-l border-r border-blue-500 shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        role="tab"
                        aria-selected={activeTab === 'evaluations'}
                        aria-controls="evaluations-panel"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          AI Match Evaluations
                          {processDetails.scriptResponse.matchEvaluations && (
                            <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {processDetails.scriptResponse.matchEvaluations.length}
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('execution')}
                        className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200 ${
                          activeTab === 'execution'
                            ? 'bg-white text-blue-700 border-t-2 border-l border-r border-blue-500 shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        role="tab"
                        aria-selected={activeTab === 'execution'}
                        aria-controls="execution-panel"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          Execution History
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* CLINs Data Section */}
                {activeTab === 'clins' && processDetails.scriptResponse?.clinsData && processDetails.scriptResponse.clinsData.length > 0 && (
                  <div id="clins-panel" role="tabpanel" aria-labelledby="clins-tab">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          Contract Line Items (CLINs)
                        </h3>
                        <p className="text-purple-700 mt-1">Detailed line item information</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {processDetails.scriptResponse.clinsData.length > 0 && Object.keys(processDetails.scriptResponse.clinsData[0]).map((key) => (
                                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {key.replace(/_/g, ' ')}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {processDetails.scriptResponse.clinsData.map((clin, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {Object.values(clin).map((value, valueIndex) => (
                                  <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {value !== undefined && value !== null ? String(value) : '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Match Evaluations Section */}
                {activeTab === 'evaluations' && processDetails.scriptResponse?.matchEvaluations && processDetails.scriptResponse.matchEvaluations.length > 0 && (
                  <div id="evaluations-panel" role="tabpanel" aria-labelledby="evaluations-tab">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          </div>
                          AI Match Evaluations
                        </h3>
                        <p className="text-blue-700 mt-1">Detailed AI mismatch analysis</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mismatch Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Justification</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {processDetails.scriptResponse.matchEvaluations.map((evaluation: any, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {evaluation.MismatchType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    evaluation.Status === 'Passed' ? 'bg-green-100 text-green-800' :
                                    evaluation.Status === 'Not Passed' ? 'bg-red-100 text-red-800' :
                                    evaluation.Status === 'Flagged' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {evaluation.Status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    evaluation.Severity === 'High' ? 'bg-red-50 text-red-700' :
                                    evaluation.Severity === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                                    'bg-gray-50 text-gray-700'
                                  }`}>
                                    {evaluation.Severity}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                                  {evaluation.Reason}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                                  {evaluation.Justification}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Execution History Section */}
                {activeTab === 'execution' && processDetails.executionHistory && processDetails.executionHistory.length > 0 && (
                  <div>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          Execution History
                        </h3>
                        <p className="text-blue-700 mt-1">Activity trail for this invoice process</p>
                      </div>

                      <div className="max-h-96 overflow-y-auto p-4">
                        <div className="space-y-4">
                          {[...processDetails.executionHistory].reverse().map((event: any, index) => {
                            const isCompleted = event.status === 1;
                            return (
                              <div key={index} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  {isCompleted ? (
                                    <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full">
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 flex items-center justify-center">
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600"></div>
                                    </div>
                                  )}
                                  {index < (processDetails.executionHistory?.length ?? 0) - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <h4 className="text-sm font-semibold text-gray-900">{event.name || 'Activity'}</h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {event.endTime && formatDateTime(event.endTime)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* No Process Instance Message */}
        {!hasProcessInstance && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">No Process Instance</h4>
                <p className="text-blue-700 text-sm">This invoice does not have an associated process instance</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Popup */}
      {isTaskPopupOpen && processDetails.taskLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
              <button
                onClick={() => setIsTaskPopupOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-1">
              <iframe
                src={processDetails.taskLink}
                className="w-full h-full rounded border-0"
                title="Task Details"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
