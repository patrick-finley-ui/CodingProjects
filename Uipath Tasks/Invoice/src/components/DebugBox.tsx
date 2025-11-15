import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ENTITY_UUID = '9f8f532a-a6ae-f011-8e61-002248862cce';

export const DebugBox = () => {
  const { sdk } = useAuth();
  const [processesData, setProcessesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Processes.getAll state
  const [processesGetAllData, setProcessesGetAllData] = useState<any>(null);
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(false);
  const [processesError, setProcessesError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await sdk.entities.getRecordsById(ENTITY_UUID, {
        pageSize: 100,
        $orderby: 'UpdateTime desc',
      });
      setProcessesData(records);
      console.log('Entity Records:', records);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch records';
      setError(errorMessage);
      console.error('Error fetching records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProcessesGetAll = async () => {
    setIsLoadingProcesses(true);
    setProcessesError(null);

    try {
      console.group('🔍 Testing processes.getAll()');
      console.log('SDK instance:', sdk);
      console.log('SDK.processes:', sdk.processes);
      console.log('Is authenticated:', sdk.isAuthenticated());
      console.log('Trying WITHOUT folder ID first...');
      
      try {
        const processes = await sdk.processes.getAll();
        
        console.log('✅ Processes Response (no folder):', processes);
        console.log('Type:', typeof processes);
        console.log('Is Array:', Array.isArray(processes));
        if (Array.isArray(processes)) {
          console.log('Count:', processes.length);
        }
        console.groupEnd();
        
        setProcessesGetAllData(processes);
        return;
      } catch (err1: any) {
        console.log('⚠️ Failed without folder ID, trying WITH folder ID...');
        console.log('Error:', err1?.message);
        
        // Try with folder ID from env
        const folderId = import.meta.env.VITE_MAESTRO_FOLDER_ID 
          ? Number(import.meta.env.VITE_MAESTRO_FOLDER_ID) 
          : 2465659;
        
        console.log('Folder ID:', folderId);
        const processes = await sdk.processes.getAll({ folderId: folderId });
        
        console.log('✅ Processes Response (with folder):', processes);
        console.log('Type:', typeof processes);
        console.log('Is Array:', Array.isArray(processes));
        if (Array.isArray(processes)) {
          console.log('Count:', processes.length);
        }
        console.groupEnd();
        
        setProcessesGetAllData(processes);
      }
    } catch (err: any) {
      console.group('❌ Error Details');
      console.error('Full error:', err);
      console.error('Error message:', err?.message);
      console.error('Error name:', err?.name);
      console.error('Error stack:', err?.stack);
      console.error('Error response:', err?.response);
      console.error('Error status:', err?.status);
      console.error('Error url:', err?.url);
      console.groupEnd();
      
      const errorMessage = err?.message || err?.toString() || 'Failed to fetch processes';
      setProcessesError(`${errorMessage} (Check console for details)`);
    } finally {
      setIsLoadingProcesses(false);
    }
  };

  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-100 rounded-full p-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Debug Panel - API Testing</h3>
            <p className="text-sm text-gray-600">Test entities.getRecordsById() and processes.getAll()</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Entity Records Test Section */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">Entity Records Test</h4>
              <p className="text-sm text-gray-600">Testing: sdk.entities.getRecordsById()</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={fetchProcesses}
            disabled={isLoading}
            className="bg-uipath-orange hover:bg-uipath-orange-light active:bg-uipath-orange-dark disabled:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Test API Call</span>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Display */}
          {processesData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-green-700">Response Data:</h4>
                <span className="text-xs text-gray-600">
                  {processesData?.items && Array.isArray(processesData.items)
                    ? `${processesData.items.length} record(s)`
                    : 'Object returned'}
                </span>
              </div>
              <div className="bg-white rounded-md p-3 overflow-auto max-h-96 border border-gray-300">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(processesData, null, 2)}
                </pre>
              </div>
              <p className="text-xs text-gray-600 italic">
                * Data is also logged to browser console
              </p>
            </div>
          )}

          {/* Console Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Console Testing</span>
            </h4>
            <p className="text-xs text-gray-700 mb-2">
              To test in the browser console:
            </p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Open Developer Tools (F12 or Ctrl+Shift+I)</li>
              <li>Go to Console tab</li>
              <li>The SDK is exposed globally - type: <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono">window.sdk</code></li>
              <li>Run: <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono text-xs">await window.sdk.entities.getRecordsById('{ENTITY_UUID}', {'{ pageSize: 100, $orderby: "UpdateTime desc" }'})</code></li>
            </ol>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 my-6"></div>

          {/* Processes.getAll() Test Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-full p-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Processes Test</h4>
                <p className="text-sm text-gray-600">Testing: sdk.processes.getAll()</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={fetchProcessesGetAll}
              disabled={isLoadingProcesses}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
            >
              {isLoadingProcesses ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Fetching Processes...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Test processes.getAll()</span>
                </>
              )}
            </button>

            {/* Error Display */}
            {processesError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-800">Error</p>
                    <p className="text-sm text-red-700">{processesError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Display */}
            {processesGetAllData && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-purple-700">Processes Response:</h4>
                  <span className="text-xs text-gray-600">
                    {Array.isArray(processesGetAllData)
                      ? `${processesGetAllData.length} process(es)`
                      : 'Object returned'}
                  </span>
                </div>
                <div className="bg-white rounded-md p-3 overflow-auto max-h-96 border border-gray-300">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(processesGetAllData, null, 2)}
                  </pre>
                </div>
                <p className="text-xs text-gray-600 italic">
                  * Data is also logged to browser console
                </p>
              </div>
            )}

            {/* Console Instructions for Processes */}
            <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Console Testing</span>
              </h4>
              <p className="text-xs text-gray-700 mb-2">
                To test in the browser console:
              </p>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>Open Developer Tools (F12 or Ctrl+Shift+I)</li>
                <li>Go to Console tab</li>
                <li>Run: <code className="bg-gray-100 px-1 py-0.5 rounded text-purple-700 font-mono text-xs">await sdk.processes.getAll()</code></li>
                <li>Or with folder: <code className="bg-gray-100 px-1 py-0.5 rounded text-purple-700 font-mono text-xs">await sdk.processes.getAll(folderId)</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
