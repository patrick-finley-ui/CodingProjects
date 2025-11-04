import { useState, useEffect, useMemo } from 'react';
import { UiPath, StartStrategy, JobPriority} from '@uipath/uipath-typescript';
import type { InvoiceRecord, InvoiceMetrics } from '../types/invoices';
import type { ProcessInstanceExecutionHistoryResponse } from '@uipath/uipath-typescript';
import { InvoiceGrid } from './InvoiceGrid';
import { InvoiceDetails } from './InvoiceDetails';
import { DebugBox } from './DebugBox';
import { Header } from './Header';
import { formatCurrency } from '../utils/formatters';

interface DashboardProps {
  sdk: UiPath;
}

const ENTITY_UUID = '9f8f532a-a6ae-f011-8e61-002248862cce';

export const Dashboard = ({ sdk }: DashboardProps) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipsCollapsed, setTipsCollapsed] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [processDetails, setProcessDetails] = useState<{
    executionHistory?: ProcessInstanceExecutionHistoryResponse[];
    variables?: Record<string, Array<{ name: string; value: string; type: string }>>;
    bpmnXml?: string;
    taskLink?: string;
    activityType?: string;
    activityName?: string;
    taskCompleted?: boolean;
    loading: boolean;
    error?: string;
  }>({ loading: false });
  const [isStartProcessModalOpen, setIsStartProcessModalOpen] = useState(false);
  const [invoiceFilePath, setInvoiceFilePath] = useState('Invoice-INV-1025.pdf');
  const [isStartingProcess, setIsStartingProcess] = useState(false);
  const [startProcessError, setStartProcessError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const records = await sdk.entities.getRecordsById(ENTITY_UUID, {
        pageSize: 100,
        $orderby: 'UpdateTime desc',
      });

      setInvoices(records.items as InvoiceRecord[]);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [sdk]);

  const fetchProcessDetails = async (invoice: InvoiceRecord) => {
    if (!invoice.maestroProcessKey || !invoice.folderId) {
      // No process instance associated with this invoice
      return;
    }

    try {
      setProcessDetails({ loading: true });

      const [bpmnXml, executionHistory, variables] = await Promise.all([
        sdk.maestro.processes.instances.getBpmn(invoice.maestroProcessKey, invoice.folderId),
        sdk.maestro.processes.instances.getExecutionHistory(invoice.maestroProcessKey),
        sdk.maestro.processes.instances.getVariables(invoice.maestroProcessKey, invoice.folderId),
      ]);

      // Group variables by source
      const groupedVariables: Record<string, Array<{ name: string; value: string; type: string }>> = {};
      if (variables && Array.isArray(variables)) {
        variables.forEach((variable: any) => {
          const source = variable.source || 'Unknown';
          if (!groupedVariables[source]) {
            groupedVariables[source] = [];
          }
          groupedVariables[source].push({
            name: variable.name,
            value: JSON.stringify(variable.value),
            type: variable.type || 'string',
          });
        });
      }

      // Extract task link and activity type from execution history if available
      let taskLink: string | undefined;
      let activityType: string | undefined;
      let activityName: string | undefined;
      let taskCompleted: boolean = false;
      if (executionHistory && executionHistory.length > 0) {
        // Find the first activity with an actionCenterTaskLink in attributes
        for (const activity of executionHistory) {
          const attributes = (activity as any).attributes;
          if (attributes && attributes.actionCenterTaskLink) {
            taskLink = attributes.actionCenterTaskLink;
            activityType = 'user task';
            activityName = (activity as any).name;
            taskCompleted = attributes.status === 'Completed';
            break;
          }
        }
      }

      setProcessDetails({
        executionHistory: executionHistory as ProcessInstanceExecutionHistoryResponse[],
        variables: groupedVariables,
        bpmnXml: bpmnXml as string,
        taskLink,
        activityType,
        activityName,
        taskCompleted,
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching process details:', err);
      setProcessDetails({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch process details',
      });
    }
  };

  const handleInvoiceSelect = async (invoice: InvoiceRecord) => {
    setSelectedInvoice(invoice);
    await fetchProcessDetails(invoice);
  };

  const handleStartProcess = async () => {
    if (!invoiceFilePath.trim()) {
      setStartProcessError('Invoice file path is required');
      return;
    }

    try {
      setIsStartingProcess(true);
      setStartProcessError(null);

      const processKey = '44479d67-c3d0-41e4-9ae0-3b337e320f9e';
      const folderId = 2465659;

      const requestPayload = {
        processKey: processKey,
        strategy: StartStrategy.ModernJobsCount,
        runAsMe: true, 
        jobPriority: JobPriority.Normal,
        inputArguments: JSON.stringify({
          invoiceFilePath: invoiceFilePath,
        }),
        requiresUserInteraction: false,
      };

      console.group('🚀 Starting Process');
      console.log('Process Key:', processKey);
      console.log('Folder ID:', folderId);
      console.log('Invoice File Path:', invoiceFilePath);
      console.log('Request Payload:', requestPayload);
      console.log('Full Request:', {
        payload: requestPayload,
        folderId: folderId,
      });
      console.groupEnd();

      const result = await sdk.processes.start(requestPayload, folderId);

      console.group('✅ Process Started Successfully');
      console.log('Result:', result);
      console.log('Result Type:', typeof result);
      console.log('Result Keys:', Object.keys(result || {}));
      if (Array.isArray(result)) {
        console.log('Job Count:', result.length);
        result.forEach((job, index) => {
          console.log(`Job ${index + 1}:`, job);
        });
      }
      console.groupEnd();

      // Close modal and reset
      setIsStartProcessModalOpen(false);
      setInvoiceFilePath('Invoice-INV-1025.pdf');

      // Refresh invoices list
      const records = await sdk.entities.getRecordsById(ENTITY_UUID, {
        pageSize: 100,
        $orderby: 'UpdateTime desc',
      });
      setInvoices(records.items as InvoiceRecord[]);

    } catch (err) {
      console.group('❌ Error Starting Process');
      console.error('Error Object:', err);
      console.error('Error Type:', typeof err);
      console.error('Error Message:', err instanceof Error ? err.message : String(err));
      if (err instanceof Error) {
        console.error('Error Stack:', err.stack);
      }
      // Log any response data if available
      if (err && typeof err === 'object') {
        console.error('Error Details:', JSON.stringify(err, null, 2));
      }
      console.groupEnd();

      setStartProcessError(err instanceof Error ? err.message : 'Failed to start process');
    } finally {
      setIsStartingProcess(false);
    }
  };

  const metrics = useMemo((): InvoiceMetrics => {
    const totalInvoiceValue = invoices.reduce((sum, inv) => sum + (inv.invoiceTotal || 0), 0);
    const invoicesByStatus = invoices.reduce((acc, inv) => {
      const status = inv.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInvoices: invoices.length,
      totalInvoiceValue,
      pendingReview: invoicesByStatus['Pending Review'] || 0,
      approved: invoicesByStatus['Approved'] || 0,
      rejected: invoicesByStatus['Rejected'] || 0,
      paid: invoicesByStatus['Paid'] || 0,
      averageInvoiceValue: invoices.length > 0 ? totalInvoiceValue / invoices.length : 0,
      invoicesByStatus,
    };
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uipath-orange"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded m-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading invoices</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Invoices',
      value: metrics.totalInvoices,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-uipath-orange',
      textColor: 'text-uipath-orange',
      bgColor: 'bg-uipath-orange-subtle',
      description: 'All invoices in the system',
    },
    {
      title: 'Total Invoice Value',
      value: formatCurrency(metrics.totalInvoiceValue),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-gray-700',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      description: 'Sum of all invoice amounts',
    },
    {
      title: 'Pending Review',
      value: metrics.pendingReview,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Invoices awaiting review',
    },
    {
      title: 'Approved',
      value: metrics.approved,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Approved invoices',
    },
    {
      title: 'Paid',
      value: metrics.paid,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Invoices that have been paid',
    },
    {
      title: 'Avg. Invoice Value',
      value: formatCurrency(metrics.averageInvoiceValue),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-gray-700',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      description: 'Average invoice amount',
    },
  ];

  const showDebugBox = import.meta.env.VITE_SHOW_DEBUG_BOX === 'true';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logos */}
      <Header />

      <div className="space-y-6 p-6">
        {/* Debug Box */}
        {showDebugBox && <DebugBox />}

        {/* Subtitle */}
        <div>
          <p className="text-gray-600">Real-time tracking and analytics for your invoice workflows</p>
        </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${card.textColor} mb-1`}>{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
              <div className={card.textColor}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-blue-800">Processing Tips</h3>
              <button
                onClick={() => setTipsCollapsed(!tipsCollapsed)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label={tipsCollapsed ? "Expand tips" : "Collapse tips"}
              >
                <svg
                  className="h-5 w-5 transform transition-transform"
                  style={{ transform: tipsCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {!tipsCollapsed && (
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Pending Review invoices require attention within 24 hours</li>
                  <li>Click "View Details" to see full invoice information</li>
                  <li>Approved invoices are ready for payment processing</li>
                  <li>Check invoice totals and vendor information regularly</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Invoice Grid + Details */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Invoice Management</h3>
          <button
            onClick={() => setIsStartProcessModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start Invoice Processing
          </button>
        </div>
        <div className="flex gap-4 h-[calc(100vh-700px)] min-h-[500px]">
          {/* Left Side - Invoice Grid (dynamic width based on selection) */}
          <div className={`${selectedInvoice ? 'w-[40%]' : 'w-full'} overflow-y-auto transition-all duration-300`}>
            <InvoiceGrid
              invoices={invoices}
              onInvoiceSelect={handleInvoiceSelect}
              selectedInvoiceId={selectedInvoice?.id}
              onRefresh={fetchInvoices}
            />
          </div>

          {/* Right Side - Invoice Details (60% width, only shown when invoice is selected) */}
          {selectedInvoice && (
            <div className="w-[60%] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm">
              <InvoiceDetails
                selectedInvoice={selectedInvoice}
                processDetails={processDetails}
                onRefreshData={() => {
                  if (selectedInvoice) {
                    fetchProcessDetails(selectedInvoice);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Start Process Modal */}
      {isStartProcessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-[90vw]">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                Start Invoice Processing
              </h3>
              <button
                onClick={() => {
                  setIsStartProcessModalOpen(false);
                  setStartProcessError(null);
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="invoiceFilePath" className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice File Path
                </label>
                <input
                  id="invoiceFilePath"
                  type="text"
                  value={invoiceFilePath}
                  onChange={(e) => setInvoiceFilePath(e.target.value)}
                  placeholder="e.g., Invoice-INV-1025.pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the file path or name of the invoice to process
                </p>
              </div>

              {startProcessError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{startProcessError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsStartProcessModalOpen(false);
                    setStartProcessError(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isStartingProcess}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartProcess}
                  disabled={isStartingProcess}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStartingProcess ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Start Process
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

