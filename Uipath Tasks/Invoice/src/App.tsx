import { useState, useEffect } from 'react'
import { UiPath } from '@uipath/uipath-typescript'
import InvoiceGrid from './components/InvoiceGrid'
import './App.css'

function App() {
  const [sdk, setSdk] = useState<UiPath | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  const initializeSDK = async () => {
    try {
      const sdkInstance = new UiPath({
        baseUrl: import.meta.env.VITE_UIPATH_BASE_URL || 'https://cloud.uipath.com',
        orgName: import.meta.env.VITE_UIPATH_ORG_NAME!,
        tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME!,
        clientId: import.meta.env.VITE_UIPATH_CLIENT_ID!,
        redirectUri: import.meta.env.VITE_UIPATH_REDIRECT_URI || 'http://localhost:5173',
        scope: import.meta.env.VITE_UIPATH_SCOPE!
      })
      setSdk(sdkInstance)
      
      // Initialize OAuth flow
      await sdkInstance.initialize()
      setIsInitialized(true)
      setInitError(null)
    } catch (error) {
      console.error('Failed to initialize SDK:', error)
      setInitError(error instanceof Error ? error.message : 'Failed to initialize SDK')
    }
  }

  useEffect(() => {
    // Auto-initialize on mount
    initializeSDK()
  }, [])

  if (!sdk || !isInitialized) {
    return (
      <div className="app-container">
        <div className="loading-container">
          {initError ? (
            <>
              <h2>Configuration Error</h2>
              <p>{initError}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Please check your .env file configuration
              </p>
              <button onClick={initializeSDK} style={{ marginTop: '1rem' }}>Retry</button>
            </>
          ) : (
            <>
              <div className="spinner"></div>
              <p>Initializing UiPath SDK...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Invoice Processing App</h1>
      </header>
      <InvoiceGrid sdk={sdk} />
    </div>
  )
}

export default App
