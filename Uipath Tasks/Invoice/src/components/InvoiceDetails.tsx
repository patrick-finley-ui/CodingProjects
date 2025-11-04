import { useState } from 'react';
import type { InvoiceRecord } from '../types/invoices';
import type { ProcessInstanceExecutionHistoryResponse } from '@uipath/uipath-typescript';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../utils/formatters';

interface InvoiceDetailsProps {
  selectedInvoice: InvoiceRecord | null;
  processDetails: {
    executionHistory?: ProcessInstanceExecutionHistoryResponse[];
    variables?: Record<string, Array<{ name: string; value: string; type: string }>>;
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
  const showDebugBox = import.meta.env.VITE_SHOW_DEBUG_BOX === 'true';

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
        {/* Invoice Header Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Invoice Details
              </h2>
              <p className="text-orange-700 mt-2 font-semibold">{selectedInvoice.vendorName || 'Unknown Vendor'}</p>
              <p className="text-orange-600 text-sm mt-1 font-mono">Invoice ID: {selectedInvoice.invoiceId || selectedInvoice.id}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm border ${getStatusColor(selectedInvoice.status)}`}>
              {selectedInvoice.status || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Debug Box - Maestro Data */}
          {showDebugBox && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug: Maestro Process Data</h3>
                  <div className="text-xs font-mono space-y-1">
                    <div className="flex gap-2">
                      <span className="text-yellow-700 font-semibold">Process Key:</span>
                      <span className="text-yellow-900">{selectedInvoice.maestroProcessKey || 'Not set'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-700 font-semibold">Folder ID:</span>
                      <span className="text-yellow-900">{selectedInvoice.folderId || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Key Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Invoice Total</h3>
              </div>
              <p className="text-gray-900 font-bold text-lg">{formatCurrency(selectedInvoice.invoiceTotal)}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Acceptance Date</h3>
              </div>
              <p className="text-gray-900 font-medium">{formatDate(selectedInvoice.acceptanceDate)}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Contract Number</h3>
              </div>
              <p className="text-gray-900 font-medium">{selectedInvoice.contractNumber || '-'}</p>
            </div>
          </div>

          {/* Invoice Details Section */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Shipment Number</p>
                <p className="text-gray-900 font-medium mt-1">{selectedInvoice.shipmentNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Record Owner</p>
                <p className="text-gray-900 font-medium mt-1">{selectedInvoice.recordOwner || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="text-gray-900 font-medium mt-1">{selectedInvoice.createdBy || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-gray-900 font-medium mt-1">{formatDate(selectedInvoice.updateTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Details Section - Only if process instance exists */}
        {hasProcessInstance && (
          <>
            {processDetails.loading ? (
              <div className="px-4 pb-4">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
                    <h3 className="text-md font-semibold text-gray-900 mb-1">Loading Process Details</h3>
                    <p className="text-gray-600 text-sm">Fetching execution history and variables...</p>
                  </div>
                </div>
              </div>
            ) : processDetails.error ? (
              <div className="px-4 pb-4">
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
                {/* Tasks Section */}
                <div className="px-4 pb-4">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                        Tasks
                      </h3>
                      <p className="text-green-700 mt-1">Active tasks and human interaction points</p>
                    </div>

                    <div className="p-4">
                      {processDetails.activityType?.toLowerCase() === 'user task' ? (
                        processDetails.taskCompleted ? (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Task Completed</h4>
                              <p className="text-gray-600 text-sm">{processDetails.activityName || 'User task has been completed'}</p>
                            </div>
                          </div>
                        ) : processDetails.taskLink ? (
                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-semibold text-green-900">{processDetails.activityName || 'Active User Task'}</h4>
                              </div>
                            </div>
                            <button
                              onClick={() => setIsTaskPopupOpen(true)}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open Task
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-yellow-900">Task Link Unavailable</h4>
                              <p className="text-yellow-700 text-sm">No action center link available for this user task</p>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="p-3 bg-gray-100 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Automated Process</h4>
                            <p className="text-gray-600 text-sm">No human tasks required for this invoice</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Variables Section */}
                {processDetails.variables && Object.keys(processDetails.variables).length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v1.586a1 1 0 00.293.707l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-5.586a1 1 0 01-.707-.293L7.707 21.707A1 1 0 017 21z" />
                            </svg>
                          </div>
                          Process Variables
                        </h3>
                        <p className="text-purple-700 mt-1">Variables organized by source</p>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {Object.entries(processDetails.variables).map(([source, variables]) => (
                          <div key={source} className="border-b border-gray-100 last:border-b-0">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                {source}
                              </h4>
                            </div>
                            <div className="divide-y divide-gray-100">
                              {variables.map((variable, index) => (
                                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                      </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h5 className="text-sm font-semibold text-gray-900">{variable.name}</h5>
                                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                          {variable.type}
                                        </span>
                                      </div>
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <span className="text-sm font-mono text-gray-800 break-all">{variable.value}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Execution History Section */}
                {processDetails.executionHistory && processDetails.executionHistory.length > 0 && (
                  <div className="px-4 pb-4">
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
          </>
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
