import React, { useState, useEffect, useRef } from 'react';
import { UiPath } from '@uipath/uipath-typescript';

interface OAuthAppProps {}

interface InvoiceRecord {
  invoiceId?: string;
  contractNumber?: string;
  vendorName?: string;
  vendorCAGE?: string;
  vendorUEI?: string;
  invoiceDate?: string;
  shipmentNumber?: string;
  acceptanceDate?: string;
  paymentDueDate?: string;
  invoiceTotal?: number;
  status?: string;
  remarks?: string;
  invoiceDoc?: string;
}

const OAuthApp: React.FC<OAuthAppProps> = () => {
  const [sdk, setSdk] = useState<UiPath | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const oauthCompleted = useRef(false);

  useEffect(() => {
    // Initialize SDK
    const initializeSDK = () => {
      const sdkInstance = new UiPath({
        baseUrl: import.meta.env.VITE_UIPATH_BASE_URL || 'https://cloud.uipath.com',
        orgName: import.meta.env.VITE_UIPATH_ORG_NAME!,
        tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME!,
        clientId: import.meta.env.VITE_UIPATH_CLIENT_ID!,
        redirectUri: import.meta.env.VITE_UIPATH_REDIRECT_URI || 'http://localhost:5173',
        scope: import.meta.env.VITE_UIPATH_SCOPE!
      });
      setSdk(sdkInstance);
    };

    initializeSDK();
  }, []);

  useEffect(() => {
    // Handle OAuth callback - check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && sdk && !oauthCompleted.current) {
      console.log('OAuth callback detected with code:', code);
      oauthCompleted.current = true;
      
      try {
        sdk.completeOAuth();
        setIsAuthenticated(sdk.isAuthenticated());
      } catch (error) {
        console.error('OAuth completion error:', error);
        setError('Failed to complete OAuth flow');
      }
    }
  }, [sdk]);

  const handleLogin = async () => {
    if (!sdk) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting OAuth initialization...');
      await sdk.initialize();
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        sdk.completeOAuth();
      }
      
      setIsAuthenticated(sdk.isAuthenticated());
    } catch (err) {
      console.error('OAuth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadInvoices = async () => {
    if (!sdk || !sdk.isAuthenticated()) {
      setError('Please authenticate first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const entityId = import.meta.env.VITE_UIPATH_ENTITY_ID;
      if (!entityId) {
        setError('Entity ID not configured. Please set VITE_UIPATH_ENTITY_ID in .env.local');
        return;
      }

      console.log('Fetching invoices from entity:', entityId);
      const records = await sdk.entities.getRecordsById(entityId);
      
      console.log('Fetched records:', records);
      
      // Convert records to invoice format
      const invoiceData = Array.isArray(records) ? records : [records];
      setInvoices(invoiceData as InvoiceRecord[]);
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Invoice Management System</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2 style={{ marginTop: 0 }}>Authentication Status</h2>
        <p>Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
        
        {!isAuthenticated && (
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Login with UiPath'}
          </button>
        )}

        {isAuthenticated && (
          <button 
            onClick={loadInvoices}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginLeft: '10px'
            }}
          >
            {isLoading ? 'Loading...' : 'Load Invoices'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {invoices.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <h2>Invoices ({invoices.length})</h2>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Invoice ID</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Contract Number</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Vendor Name</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Vendor CAGE</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Vendor UEI</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Invoice Date</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Shipment #</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Acceptance Date</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Due Date</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}>Invoice Total</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Remarks</th>
                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Doc</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' 
                }}>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.invoiceId || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.contractNumber || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.vendorName || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.vendorCAGE || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.vendorUEI || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{formatDate(invoice.invoiceDate)}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.shipmentNumber || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{formatDate(invoice.acceptanceDate)}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{formatDate(invoice.paymentDueDate)}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>{formatCurrency(invoice.invoiceTotal)}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.status || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{invoice.remarks || '-'}</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                    {invoice.invoiceDoc ? (
                      <a href={invoice.invoiceDoc} target="_blank" rel="noopener noreferrer">View</a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OAuthApp;