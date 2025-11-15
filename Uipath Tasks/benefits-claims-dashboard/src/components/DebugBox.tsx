import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const DebugBox = () => {
  const { sdk } = useAuth();
  const [processesData, setProcessesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchProcesses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const processes = await sdk.maestro.processes.getAll();
      setProcessesData(processes);
      console.log('Maestro Processes:', processes);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch processes';
      setError(errorMessage);
      console.error('Error fetching processes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg mb-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-500 rounded-full p-2">
            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Debug Panel - Maestro SDK Test</h3>
            <p className="text-sm text-gray-400">Testing: sdk.maestro.processes.getAll()</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
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
          {/* Action Button */}
          <button
            onClick={fetchProcesses}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
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
            <div className="bg-red-900 border border-red-700 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-300">Error</p>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Display */}
          {processesData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-green-400">Response Data:</h4>
                <span className="text-xs text-gray-400">
                  {Array.isArray(processesData)
                    ? `${processesData.length} process(es)`
                    : 'Object returned'}
                </span>
              </div>
              <div className="bg-gray-800 rounded-md p-3 overflow-auto max-h-96 border border-gray-700">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(processesData, null, 2)}
                </pre>
              </div>
              <p className="text-xs text-gray-400 italic">
                * Data is also logged to browser console
              </p>
            </div>
          )}

          {/* Console Instructions */}
          <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Console Testing</span>
            </h4>
            <p className="text-xs text-gray-300 mb-2">
              To test in the browser console:
            </p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Open Developer Tools (F12 or Ctrl+Shift+I)</li>
              <li>Go to Console tab</li>
              <li>The SDK is exposed globally - type: <code className="bg-gray-900 px-1 py-0.5 rounded text-yellow-400">window.sdk</code></li>
              <li>Run: <code className="bg-gray-900 px-1 py-0.5 rounded text-yellow-400">await window.sdk.maestro.processes.getAll()</code></li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
