import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { UiPath } from '@uipath/uipath-typescript';
const OAuthApp = () => {
    const [sdk, setSdk] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState(null);
    const oauthCompleted = useRef(false);
    useEffect(() => {
        // Initialize SDK
        const initializeSDK = () => {
            const sdkInstance = new UiPath({
                baseUrl: import.meta.env.VITE_UIPATH_BASE_URL || 'https://cloud.uipath.com',
                orgName: import.meta.env.VITE_UIPATH_ORG_NAME,
                tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME,
                clientId: import.meta.env.VITE_UIPATH_CLIENT_ID,
                redirectUri: import.meta.env.VITE_UIPATH_REDIRECT_URI || 'http://localhost:5173',
                scope: import.meta.env.VITE_UIPATH_SCOPE
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
            }
            catch (error) {
                console.error('OAuth completion error:', error);
                setError('Failed to complete OAuth flow');
            }
        }
    }, [sdk]);
    const handleLogin = async () => {
        if (!sdk)
            return;
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
        }
        catch (err) {
            console.error('OAuth error:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed');
        }
        finally {
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
            setInvoices(invoiceData);
        }
        catch (err) {
            console.error('Failed to load invoices:', err);
            setError(err instanceof Error ? err.message : 'Failed to load invoices');
        }
        finally {
            setIsLoading(false);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString)
            return '-';
        try {
            return new Date(dateString).toLocaleDateString();
        }
        catch {
            return dateString;
        }
    };
    const formatCurrency = (value) => {
        if (value === undefined || value === null)
            return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };
    return (_jsxs("div", { style: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' }, children: [_jsx("h1", { children: "Invoice Management System" }), _jsxs("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }, children: [_jsx("h2", { style: { marginTop: 0 }, children: "Authentication Status" }), _jsxs("p", { children: ["Status: ", isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'] }), !isAuthenticated && (_jsx("button", { onClick: handleLogin, disabled: isLoading, style: {
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }, children: isLoading ? 'Authenticating...' : 'Login with UiPath' })), isAuthenticated && (_jsx("button", { onClick: loadInvoices, disabled: isLoading, style: {
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            marginLeft: '10px'
                        }, children: isLoading ? 'Loading...' : 'Load Invoices' }))] }), error && (_jsxs("div", { style: {
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }, children: [_jsx("strong", { children: "Error:" }), " ", error] })), invoices.length > 0 && (_jsxs("div", { style: { overflowX: 'auto' }, children: [_jsxs("h2", { children: ["Invoices (", invoices.length, ")"] }), _jsxs("table", { style: {
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#343a40', color: 'white' }, children: [_jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Invoice ID" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Contract Number" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Vendor Name" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Vendor CAGE" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Vendor UEI" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Invoice Date" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Shipment #" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Acceptance Date" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Due Date" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }, children: "Invoice Total" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Status" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Remarks" }), _jsx("th", { style: { border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }, children: "Doc" })] }) }), _jsx("tbody", { children: invoices.map((invoice, index) => (_jsxs("tr", { style: {
                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                                    }, children: [_jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.invoiceId || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.contractNumber || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.vendorName || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.vendorCAGE || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.vendorUEI || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: formatDate(invoice.invoiceDate) }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.shipmentNumber || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: formatDate(invoice.acceptanceDate) }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: formatDate(invoice.paymentDueDate) }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }, children: formatCurrency(invoice.invoiceTotal) }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.status || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.remarks || '-' }), _jsx("td", { style: { border: '1px solid #dee2e6', padding: '8px' }, children: invoice.invoiceDoc ? (_jsx("a", { href: invoice.invoiceDoc, target: "_blank", rel: "noopener noreferrer", children: "View" })) : '-' })] }, index))) })] })] }))] }));
};
export default OAuthApp;
//# sourceMappingURL=App.js.map