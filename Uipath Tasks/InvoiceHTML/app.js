// Invoice Validation Dashboard App
let variableListeners = {};
let isInitialized = false;

// Application data structure (loaded from UiPath variable 'appData')
let appData = {
    summaryData: {
        ContractNumber: "",
        InvoiceNumber: "",
        OverallStatus: "",
        ChecksPerformed: "0",
        ChecksPassed: "0",
        ChecksFailed_High: "0",
        ChecksFailed_Medium: "0",
        ChecksFailed_Low: "0",
        Status: "",
        ValidationScope: [],
        Warnings: "0",
        Timestamp: "",
        Recommendations: []
    },
    matchEvaluations: [], // Will be populated from UiPath variable 'appData'
    clinsData: [], // Will be populated from UiPath variable 'appData'
    keyDetails: {
        contract_number_purchase_order: "",
        contract_number_invoice: "",
        contract_number_goods_receipt: "",
        invoice_number_invoice: "",
        invoice_number_goods_receipt: "",
        vendor_invoice: "",
        vendor_goods_receipt: "",
        vendor_purchase_order: "",
        shipment_reference: "",
        delivery_point: "",
        total_amount_invoice: "",
        verification_summary: ""
    }
};

// State
let currentFilter = 'all';
let expandedRows = new Set();
let selectedClin = null;

// Utility Functions
function formatCurrency(value) {
    if (typeof value === 'string') {
        if (value.startsWith('$') || value.includes('USD')) return value;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numValue);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

function formatQuantity(value) {
    if (value === undefined || value === null) return '-';
    return typeof value === 'string' ? value : value.toString();
}

// Render Functions
function renderKeyDetails() {
    try {
        const grid = document.getElementById('key-details-grid');
        const summary = document.getElementById('verification-summary');
        const contractInfo = document.getElementById('contract-info');

        if (!grid || !summary) {
            console.warn('Key details grid or summary element not found');
            return;
        }

        const { keyDetails } = appData;

        // Safely set contract info with null checks
        if (contractInfo) {
            const contractNum = appData.summaryData?.ContractNumber || 'N/A';
            const invoiceNum = appData.summaryData?.InvoiceNumber || 'N/A';
            contractInfo.textContent = `Contract ${contractNum} - Invoice ${invoiceNum}`;
        }

        // Safe string comparison with null checks
        const cleanString = (str) => (str || '').replace(/[\u0010\-\s]/g, '').toUpperCase();

        const contractMatches =
            cleanString(keyDetails.contract_number_purchase_order) === cleanString(keyDetails.contract_number_invoice) &&
            cleanString(keyDetails.contract_number_purchase_order) === cleanString(keyDetails.contract_number_goods_receipt);

        const invoiceMatches =
            (keyDetails.invoice_number_invoice || '') === (keyDetails.invoice_number_goods_receipt || '');

        // Safe number formatting
        const formatAmount = (value) => {
            if (!value) return 'N/A';
            // Remove any existing $ and commas, then parse
            const numValue = parseFloat(String(value).replace(/[$,]/g, ''));
            if (isNaN(numValue)) return value;
            return `$${numValue.toLocaleString()}`;
        };

        const details = [
            {
                label: 'CONTRACT NUMBER',
                value: keyDetails.contract_number_purchase_order || 'N/A',
                status: contractMatches ? 'match' : 'mismatch'
            },
            {
                label: 'INVOICE NUMBER',
                value: keyDetails.invoice_number_invoice || 'N/A',
                status: invoiceMatches ? 'match' : 'mismatch'
            },
            {
                label: 'VENDOR',
                value: keyDetails.vendor_purchase_order || keyDetails.vendor_invoice || 'N/A'
            },
            {
                label: 'TOTAL INVOICE AMOUNT',
                value: formatAmount(keyDetails.total_amount_invoice)
            },
            {
                label: 'NUMBER OF CLINS',
                value: (appData.clinsData?.length || 0).toString()
            },
            {
                label: 'SHIPMENT REFERENCE',
                value: keyDetails.shipment_reference || 'N/A'
            },
            {
                label: 'DELIVERY POINT',
                value: keyDetails.delivery_point || 'N/A'
            }
        ];

        grid.innerHTML = details.map(detail => `
            <div class="detail-item">
                <div class="detail-label">
                    ${detail.label}
                    ${detail.status ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: ${detail.status === 'match' ? 'var(--success)' : 'var(--warning)'}">
                        ${detail.status === 'match' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
                    </svg>` : ''}
                </div>
                <div class="detail-value">${detail.value}</div>
            </div>
        `).join('');

        if (keyDetails.verification_summary) {
            summary.textContent = keyDetails.verification_summary;
            summary.style.display = 'block';
        } else {
            summary.style.display = 'none';
        }
    } catch (error) {
        console.error('Error rendering key details:', error);
    }
}

function renderStats() {
    try {
        const grid = document.getElementById('stats-grid');
        if (!grid) {
            console.warn('Stats grid element not found');
            return;
        }

        const { summaryData } = appData;

        // Safe integer parsing with fallback to 0
        const parseSafe = (value) => {
            const parsed = parseInt(value);
            return isNaN(parsed) ? 0 : parsed;
        };

        const checksPerformed = parseSafe(summaryData.ChecksPerformed);
        const checksPassed = parseSafe(summaryData.ChecksPassed);
        const checksFailedHigh = parseSafe(summaryData.ChecksFailed_High);
        const checksFailedMedium = parseSafe(summaryData.ChecksFailed_Medium);
        const checksFailedLow = parseSafe(summaryData.ChecksFailed_Low);
        const totalFailed = checksFailedHigh + checksFailedMedium + checksFailedLow;

        // Calculate pass percentage safely
        const passPercentage = checksPerformed > 0
            ? ((checksPassed / checksPerformed) * 100).toFixed(0)
            : '0';

        const stats = [
            { icon: '<i class="bi bi-clipboard-check"></i>', label: 'CHECKS PERFORMED', value: checksPerformed.toString(), iconBg: 'var(--primary)', iconColor: 'var(--primary)' },
            { icon: '<i class="bi bi-check-circle"></i>', label: 'CHECKS PASSED', value: checksPassed.toString(), iconBg: 'var(--success)', iconColor: 'var(--success)' },
            { icon: '<i class="bi bi-bar-chart"></i>', label: 'PASS RATE', value: `${passPercentage}%`, iconBg: 'var(--success)', iconColor: 'var(--success)' },
            { icon: '<i class="bi bi-x-circle"></i>', label: 'FAILED CHECKS', value: totalFailed.toString(), iconBg: 'var(--destructive)', iconColor: 'var(--destructive)', breakdown: `High: ${checksFailedHigh} | Med: ${checksFailedMedium} | Low: ${checksFailedLow}` },
            { icon: '<i class="bi bi-clipboard-data"></i>', label: 'OVERALL STATUS', value: totalFailed === 0 ? 'Pass' : 'Partial', iconBg: totalFailed === 0 ? 'var(--success)' : 'var(--warning)', iconColor: totalFailed === 0 ? 'var(--success)' : 'var(--warning)' }
        ];

        grid.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-icon" style="background-color: ${stat.iconBg}20; color: ${stat.iconColor};">
                    ${stat.icon}
                </div>
                <div class="stat-content">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                    ${stat.breakdown ? `<div class="stat-breakdown">${stat.breakdown}</div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering stats:', error);
    }
}

function getSeverityIcon(severity) {
    const icons = {
        high: '⚠️',
        medium: '⚡',
        low: 'ℹ️'
    };
    return icons[severity.toLowerCase()] || '✓';
}

function getSeverityClass(severity) {
    const classes = {
        high: 'badge-destructive',
        medium: 'badge-warning',
        low: 'badge-info'
    };
    return classes[severity.toLowerCase()] || 'badge-muted';
}

function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    if (statusLower === 'passed') {
        return 'badge-success';
    } else if (statusLower === 'not passed') {
        return 'badge-destructive';
    } else if (statusLower === 'flagged' || statusLower === 'warning') {
        return 'badge-warning';
    }
    return 'badge-muted';
}

function formatMismatchType(type) {
    return type.replace(/([A-Z])/g, ' $1').trim();
}

function renderEvaluations() {
    const grid = document.getElementById('evaluations-grid');
    if (!grid) return;
    
    const sortedEvaluations = [...appData.matchEvaluations].sort((a, b) => {
        const statusOrder = { 'Not Passed': 0, 'Flagged': 1, 'Warning': 1, 'Passed': 2 };
        const aOrder = statusOrder[a.Status] ?? 3;
        const bOrder = statusOrder[b.Status] ?? 3;
        return aOrder - bOrder;
    });
    
    const filteredEvaluations = sortedEvaluations.filter(evaluation => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'failed') return evaluation.Status.toLowerCase().includes('not passed');
        if (currentFilter === 'flagged') return evaluation.Status.toLowerCase().includes('flagged') || evaluation.Status.toLowerCase().includes('warning');
        if (currentFilter === 'passed') return evaluation.Status.toLowerCase().includes('passed') && !evaluation.Status.toLowerCase().includes('not');
        return true;
    });
    
    // Update counts
    document.getElementById('count-all').textContent = sortedEvaluations.length;
    document.getElementById('count-failed').textContent = sortedEvaluations.filter(e => e.Status.toLowerCase().includes('not passed')).length;
    document.getElementById('count-flagged').textContent = sortedEvaluations.filter(e => e.Status.toLowerCase().includes('flagged') || e.Status.toLowerCase().includes('warning')).length;
    document.getElementById('count-passed').textContent = sortedEvaluations.filter(e => e.Status.toLowerCase().includes('passed') && !e.Status.toLowerCase().includes('not')).length;
    
    if (filteredEvaluations.length === 0) {
        grid.innerHTML = '<p style="color: var(--muted-foreground);">No evaluations match the selected filter.</p>';
        return;
    }
    
    grid.innerHTML = filteredEvaluations.map(evaluation => `
        <div class="evaluation-card">
            <div class="evaluation-header">
                <h3 class="evaluation-title">${formatMismatchType(evaluation.MismatchType)}</h3>
                <div class="evaluation-badges">
                    <span class="badge ${getSeverityClass(evaluation.Severity)}">
                        ${getSeverityIcon(evaluation.Severity)} ${evaluation.Severity}
                    </span>
                    <span class="badge ${getStatusClass(evaluation.Status)}" style="margin-top: 0.25rem;">
                        ${evaluation.Status}
                    </span>
                </div>
            </div>
            <div class="evaluation-content">
                <div class="evaluation-field">
                    <span class="evaluation-field-label">Reason:</span>
                    <p class="evaluation-field-value">${evaluation.Reason}</p>
                </div>
                ${evaluation.Justification ? `
                <div class="evaluation-field">
                    <span class="evaluation-field-label">Justification:</span>
                    <p class="evaluation-field-value">${evaluation.Justification}</p>
                </div>
                ` : ''}
                <div class="evaluation-field">
                    <span class="evaluation-field-label">Documents:</span>
                    <div class="evaluation-documents">
                        ${evaluation.LinkedDocuments.map(doc => `
                            <span class="badge badge-outline">${doc}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderClins() {
    const tbody = document.getElementById('clin-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = appData.clinsData.map(clin => {
        const isExpanded = expandedRows.has(clin.line_item);
        const status = clin.acceptance_condition_goods_receipt || '-';
        const statusClass = status === 'Accepted' ? 'badge-success' : 
                          status === 'Partially Accepted' ? 'badge-warning' : 
                          'badge-muted';
        
        return `
            <tr class="${isExpanded ? 'expanded' : ''}" onclick="toggleClinRow('${clin.line_item}')">
                <td>
                    ${isExpanded ? 
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>' : 
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>'}
                </td>
                <td style="font-family: monospace; font-weight: 500;">${clin.line_item}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${clin.line_item_po}</td>
                <td class="text-right">${formatQuantity(clin.quantity_po)}</td>
                <td class="text-right">${formatCurrency(clin.unit_price_po)}</td>
                <td class="text-right" style="font-weight: 600;">${formatCurrency(clin.amount_po)}</td>
                <td>
                    <span class="badge ${statusClass}">${status}</span>
                </td>
                <td class="text-right">
                    <button class="btn-view" onclick="event.stopPropagation(); viewDocument(${JSON.stringify(clin).replace(/"/g, '&quot;')})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        View
                    </button>
                </td>
            </tr>
            ${isExpanded ? `
            <tr class="clin-table-expanded-row">
                <td colspan="8">
                    <div class="clin-expanded-content">
                        <div class="clin-expanded-grid">
                            ${renderDocumentColumn('Purchase Order', clin.line_item_po, clin.quantity_po, clin.unit_price_po, clin.amount_po, clin.po_shipment_number, clin.po_delivery_estimate_date, null, null, null, null, null)}
                            ${renderDocumentColumn('Invoice', clin.line_item_invoice, clin.quantity_invoice, clin.unit_price_invoice, clin.amount_invoice, null, null, null, null, null, null, null)}
                            ${renderDocumentColumn('Goods Receipt', clin.line_item_goods_receipt, clin.quantity_shipped_goods_receipt || clin.quantity_invoice, clin.unit_price_goods_receipt, clin.amount_goods_receipt, clin.shipment_number_goods_receipt, clin.delivery_date_goods_receipt, clin.quantity_accepted_goods_receipt, clin.quantity_rejected_goods_receipt, clin.acceptance_condition_goods_receipt, clin.acceptance_remarks_goods_receipt, 'Delivery Date')}
                        </div>
                        ${(clin.notes || clin.acceptance_remarks_goods_receipt) ? `
                        <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--muted-foreground); font-style: italic;">
                            ${clin.notes ? `<div><span style="font-weight: 600;">Note:</span> ${clin.notes}</div>` : ''}
                            ${clin.acceptance_remarks_goods_receipt ? `<div style="color: var(--warning); margin-top: 0.25rem;"><span style="font-weight: 600;">Acceptance Remarks:</span> ${clin.acceptance_remarks_goods_receipt}</div>` : ''}
                        </div>
                        ` : ''}
                    </div>
                </td>
            </tr>
            ` : ''}
        `;
    }).join('');
}

function renderDocumentColumn(title, description, quantity, unitPrice, amount, shipment, date, quantityAccepted, quantityRejected, acceptanceCondition, acceptanceRemarks, dateLabel) {
    return `
        <div class="document-column">
            <h4 class="document-column-title">${title}</h4>
            <div class="document-field">
                <span class="document-field-label">Description:</span>
                <span class="document-field-value">${description}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div class="document-field">
                    <span class="document-field-label">Quantity:</span>
                    <span class="document-field-value">${formatQuantity(quantity)}</span>
                    ${quantityAccepted !== undefined ? `<span style="color: var(--success); font-size: 0.7rem; margin-top: 0.25rem;">Accepted: ${formatQuantity(quantityAccepted)}</span>` : ''}
                    ${quantityRejected !== undefined && Number(quantityRejected) > 0 ? `<span style="color: var(--destructive); font-size: 0.7rem; margin-top: 0.25rem;">Rejected: ${formatQuantity(quantityRejected)}</span>` : ''}
                </div>
                <div class="document-field">
                    <span class="document-field-label">Unit Price:</span>
                    <span class="document-field-value">${formatCurrency(unitPrice)}</span>
                </div>
            </div>
            <div class="document-field">
                <span class="document-field-label">Amount:</span>
                <span class="document-field-value" style="font-weight: 600;">${formatCurrency(amount)}</span>
            </div>
            ${acceptanceCondition ? `
            <div class="document-field">
                <span class="document-field-label">Acceptance:</span>
                <span class="document-field-value" style="color: ${acceptanceCondition === 'Accepted' ? 'var(--success)' : acceptanceCondition === 'Partially Accepted' ? 'var(--warning)' : 'var(--destructive)'};">
                    ${acceptanceCondition}
                </span>
            </div>
            ` : ''}
            ${acceptanceRemarks ? `
            <div style="padding: 0.75rem; background-color: hsl(38, 92%, 50%, 0.1); border: 1px solid hsl(38, 92%, 50%, 0.2); border-radius: var(--radius); margin-top: 0.5rem;">
                <span style="font-size: 0.7rem; font-weight: 500; color: var(--warning);">Remarks:</span>
                <p style="font-size: 0.7rem; color: var(--foreground); margin-top: 0.25rem;">${acceptanceRemarks}</p>
            </div>
            ` : ''}
            ${shipment ? `
            <div class="document-field">
                <span class="document-field-label">Shipment:</span>
                <span class="document-field-value">${shipment}</span>
            </div>
            ` : ''}
            ${date ? `
            <div class="document-field">
                <span class="document-field-label">${dateLabel || 'Date'}:</span>
                <span class="document-field-value">${date}</span>
            </div>
            ` : ''}
        </div>
    `;
}

function renderRecommendations() {
    const list = document.getElementById('recommendations-list');
    const section = document.getElementById('recommendations-section');
    
    if (!list || !section) return;
    
    if (appData.summaryData.Recommendations && appData.summaryData.Recommendations.length > 0) {
        list.innerHTML = appData.summaryData.Recommendations.map(rec => `<li>${rec}</li>`).join('');
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}

// Event Handlers
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const chevron = document.getElementById(`chevron-${sectionId}`);
    
    if (content && chevron) {
        content.classList.toggle('collapsed');
        chevron.classList.toggle('rotated');
    }
}

function filterChecks(filter) {
    currentFilter = filter;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderEvaluations();
}

function toggleClinRow(lineItem) {
    if (expandedRows.has(lineItem)) {
        expandedRows.delete(lineItem);
    } else {
        expandedRows.add(lineItem);
    }
    renderClins();
}

function viewDocument(clin) {
    selectedClin = clin;
    const modal = document.getElementById('document-modal');
    const modalBody = document.getElementById('document-modal-body');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--foreground);">Document Details - CLIN ${clin.line_item}</h3>
            <span class="badge badge-success" style="margin-left: 0.5rem;">${clin.match_status || 'Verified'}</span>
        </div>
        
        <div class="modal-tabs">
            <button class="modal-tab active" onclick="switchModalTab('po', event)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Purchase Order
            </button>
            <button class="modal-tab" onclick="switchModalTab('invoice', event)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Invoice
            </button>
            <button class="modal-tab" onclick="switchModalTab('gr', event)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
                Goods Receipt
            </button>
        </div>
        
        <div class="modal-tab-content active" id="modal-tab-po">
            ${renderModalDocumentContent('Purchase Order', clin.line_item_po, clin.quantity_po, clin.unit_price_po, clin.amount_po, clin.po_shipment_number, clin.po_delivery_estimate_date, null, null, null, null, 'Estimated Delivery')}
        </div>
        
        <div class="modal-tab-content" id="modal-tab-invoice">
            ${renderModalDocumentContent('Invoice', clin.line_item_invoice, clin.quantity_invoice, clin.unit_price_invoice, clin.amount_invoice, null, null, null, null, null, null, null)}
        </div>
        
        <div class="modal-tab-content" id="modal-tab-gr">
            ${renderModalDocumentContent('Goods Receipt', clin.line_item_goods_receipt, clin.quantity_shipped_goods_receipt || clin.quantity_invoice, clin.unit_price_goods_receipt, clin.amount_goods_receipt, clin.shipment_number_goods_receipt, clin.delivery_date_goods_receipt, clin.quantity_accepted_goods_receipt, clin.quantity_rejected_goods_receipt, clin.acceptance_condition_goods_receipt, clin.acceptance_remarks_goods_receipt, 'Delivery Date')}
        </div>
        
        ${clin.notes ? `
        <div style="margin-top: 1rem; padding: 1rem; background-color: var(--muted); border-radius: var(--radius); border: 1px solid var(--border);">
            <p style="font-size: 0.875rem; color: var(--muted-foreground);">
                <span style="font-weight: 600; color: var(--foreground);">Notes: </span>
                ${clin.notes}
            </p>
        </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

function renderModalDocumentContent(title, lineItem, quantity, unitPrice, amount, shipment, date, quantityAccepted, quantityRejected, acceptanceCondition, acceptanceRemarks, dateLabel) {
    return `
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--primary); margin-bottom: 0.5rem;">${title}</h4>
            <p style="color: var(--foreground);">${lineItem}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1rem;">
            <div class="detail-item">
                <span class="detail-label">Quantity</span>
                <span class="detail-value">${formatQuantity(quantity)}</span>
                ${quantityAccepted !== undefined ? `<p style="font-size: 0.75rem; color: var(--success); margin-top: 0.25rem;">Accepted: ${formatQuantity(quantityAccepted)}</p>` : ''}
                ${quantityRejected !== undefined && Number(quantityRejected) > 0 ? `<p style="font-size: 0.75rem; color: var(--destructive); margin-top: 0.25rem;">Rejected: ${formatQuantity(quantityRejected)}</p>` : ''}
            </div>
            <div class="detail-item">
                <span class="detail-label">Unit Price</span>
                <span class="detail-value">${formatCurrency(unitPrice)}</span>
            </div>
            ${acceptanceCondition ? `
            <div class="detail-item">
                <span class="detail-label">Acceptance Status</span>
                <span class="detail-value" style="color: ${acceptanceCondition === 'Accepted' ? 'var(--success)' : acceptanceCondition === 'Partially Accepted' ? 'var(--warning)' : 'var(--destructive)'};">
                    ${acceptanceCondition}
                </span>
            </div>
            ` : ''}
            ${shipment ? `
            <div class="detail-item">
                <span class="detail-label">Shipment Number</span>
                <span class="detail-value">${shipment}</span>
            </div>
            ` : ''}
            ${date ? `
            <div class="detail-item">
                <span class="detail-label">${dateLabel || 'Date'}</span>
                <span class="detail-value">${date}</span>
            </div>
            ` : ''}
        </div>
        
        ${acceptanceRemarks ? `
        <div style="padding: 1rem; background-color: hsl(38, 92%, 50%, 0.1); border: 1px solid hsl(38, 92%, 50%, 0.2); border-radius: var(--radius); margin-bottom: 1rem;">
            <p style="font-size: 0.875rem; font-weight: 500; color: var(--warning); margin-bottom: 0.25rem;">Acceptance Remarks:</p>
            <p style="font-size: 0.875rem; color: var(--foreground);">${acceptanceRemarks}</p>
        </div>
        ` : ''}
        
        <div style="padding-top: 1rem; border-top: 1px solid var(--border);">
            <div class="detail-item">
                <span class="detail-label">Total Amount</span>
                <span class="detail-value" style="font-size: 1.125rem; font-weight: 700; color: var(--primary);">${formatCurrency(amount)}</span>
            </div>
        </div>
    `;
}

function switchModalTab(tab, event) {
    // Update tab buttons
    document.querySelectorAll('.modal-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.closest('.modal-tab').classList.add('active');
    } else {
        // Find button by data attribute if event not provided
        const btn = document.querySelector(`.modal-tab[onclick*="${tab}"]`);
        if (btn) btn.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('.modal-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const tabContent = document.getElementById(`modal-tab-${tab}`);
    if (tabContent) tabContent.classList.add('active');
}

function closeDocumentModal() {
    const modal = document.getElementById('document-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function exportReport() {
    // This will send data back to UiPath using App.setVariable
    try {
        if (typeof App !== 'undefined' && App.setVariable) {
            App.setVariable('appData', appData);
            console.log('Export: appData sent to UiPath successfully');
            alert('Report exported to UiPath successfully');
        } else {
            // Fallback: log data for non-UiPath environments
            console.log('Export data:', appData);
            alert('Export functionality requires UiPath integration. Data logged to console.');
        }
    } catch (error) {
        console.error('Error exporting report:', error);
        alert('Error exporting report. Check console for details.');
    }
}

// UiPath communication setup
function setupUiPathCommunication() {
    if (typeof App !== 'undefined') {
        console.log('UiPath environment detected');

        // Listen for appData changes from UiPath
        variableListeners.appData = App.onVariableChange('appData', (value) => {
            console.log('appData received from UiPath:', value);
            updateAppData(value);
        });

        // Get initial values asynchronously with a small delay to ensure HTML is fully rendered
        // Per UiPath guidance: "Check that the HTML control has fully rendered before accessing the variable"
        setTimeout(() => {
            getInitialVariableValues();
        }, 100);
    } else {
        console.log('Running outside UiPath - using demo/empty data');
        // Use setTimeout to delay demo data load
        setTimeout(() => {
            loadDemoData();
        }, 100);
    }
}

// Get initial variable values from UiPath (async function to handle promises)
async function getInitialVariableValues() {
    try {
        if (typeof App !== 'undefined' && App.getVariable) {
            console.log('Retrieving initial appData value from UiPath...');

            const initialAppData = await App.getVariable('appData');
            console.log('appData initial value:', initialAppData);

            if (initialAppData) {
                updateAppData(initialAppData);
                console.log('Initial appData loaded successfully');
            } else {
                console.log('No initial appData found, using empty structure');
                renderAll();
            }
        }
    } catch (error) {
        console.error('Error getting initial variable values:', error);
        // Still render with empty structure
        renderAll();
    }
}

// Load demo data for testing outside UiPath
function loadDemoData() {
    console.log('Loading demo data for testing...');

    // Optional: Add demo data here if you want to test outside UiPath
    // For now, just render the empty structure
    renderAll();
}

/**
 * Update Application Data
 * Updates the appData structure and re-renders the UI
 */
function updateAppData(newData) {
    try {
        console.log('updateAppData called with:', newData);
        console.log('Type of newData:', typeof newData);

        // Handle case where UiPath sends data as JSON string
        if (typeof newData === 'string') {
            console.log('newData is a string, attempting to parse as JSON...');
            try {
                newData = JSON.parse(newData);
                console.log('Successfully parsed JSON string:', newData);
            } catch (parseError) {
                console.error('Failed to parse JSON string:', parseError);
                console.error('String value:', newData);
                return;
            }
        }

        // Validate input
        if (!newData || typeof newData !== 'object') {
            console.warn('Invalid appData structure - not an object:', newData);
            return;
        }

        // Merge new data with existing structure
        if (newData.summaryData) {
            console.log('Updating summaryData...');
            appData.summaryData = { ...appData.summaryData, ...newData.summaryData };
        }

        if (newData.matchEvaluations && Array.isArray(newData.matchEvaluations)) {
            console.log(`Updating matchEvaluations (${newData.matchEvaluations.length} items)...`);
            appData.matchEvaluations = newData.matchEvaluations;
        }

        if (newData.clinsData && Array.isArray(newData.clinsData)) {
            console.log(`Updating clinsData (${newData.clinsData.length} items)...`);
            appData.clinsData = newData.clinsData;
        }

        if (newData.keyDetails) {
            console.log('Updating keyDetails...');
            appData.keyDetails = { ...appData.keyDetails, ...newData.keyDetails };
        }

        console.log('appData updated successfully, rendering UI...');

        // Re-render all sections
        renderAll();

        console.log('UI rendering complete');
    } catch (error) {
        console.error('Error updating app data:', error);
        console.error('Error stack:', error.stack);
        // Still try to render what we have
        try {
            renderAll();
        } catch (renderError) {
            console.error('Failed to render after error:', renderError);
        }
    }
}

function renderAll() {
    console.log('renderAll() called');

    try {
        console.log('Rendering key details...');
        renderKeyDetails();
    } catch (error) {
        console.error('Error in renderKeyDetails:', error);
    }

    try {
        console.log('Rendering stats...');
        renderStats();
    } catch (error) {
        console.error('Error in renderStats:', error);
    }

    try {
        console.log('Rendering evaluations...');
        renderEvaluations();
    } catch (error) {
        console.error('Error in renderEvaluations:', error);
    }

    try {
        console.log('Rendering CLINs...');
        renderClins();
    } catch (error) {
        console.error('Error in renderClins:', error);
    }

    try {
        console.log('Rendering recommendations...');
        renderRecommendations();
    } catch (error) {
        console.error('Error in renderRecommendations:', error);
    }

    console.log('renderAll() complete');
}

// Safe initialization function
function initializeApp() {
    if (isInitialized) return;

    try {
        setupEventListeners();
        setupUiPathCommunication();

        isInitialized = true;
        console.log('Invoice Validation Dashboard initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Initialize the application with multiple fallback methods
function initializeApplication() {
    console.log('Initializing Invoice Validation Dashboard...');

    // Try multiple initialization methods for UiPath compatibility
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        initializeApp();
    }

    // Fallback: try again after a short delay
    setTimeout(() => {
        if (!isInitialized) {
            console.log('Retrying initialization...');
            initializeApp();
        }
    }, 100);

    // Additional fallback for UiPath
    setTimeout(() => {
        if (!isInitialized) {
            console.log('Final initialization attempt...');
            initializeApp();
        }
    }, 500);
}

// Setup event listeners with safety checks
function setupEventListeners() {
    try {
        // Initialize all sections as expanded by default
        const sections = ['key-details', 'check-summary', 'validation-checks', 'clins'];
        sections.forEach(sectionId => {
            const content = document.getElementById(`${sectionId}-content`);
            const chevron = document.getElementById(`chevron-${sectionId}`);
            if (content && chevron) {
                content.classList.remove('collapsed');
                chevron.classList.add('rotated');
            }
        });

        // Initialize filter tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons) {
            tabButtons.forEach(btn => {
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                }
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                exportReport();
            });
        }

        // Modal close on outside click
        const modal = document.getElementById('document-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeDocumentModal();
                }
            });
        }

        // Keyboard support - ESC to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('document-modal');
                if (modal && modal.classList.contains('active')) {
                    closeDocumentModal();
                }
            }
        });

        console.log('Event listeners setup successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Cleanup function
function cleanup() {
    Object.values(variableListeners).forEach(listener => {
        if (typeof listener === 'function') {
            listener();
        }
    });
    variableListeners = {};
}

// Start the application
initializeApplication();

// Expose functions globally for inline handlers
window.toggleSection = toggleSection;
window.filterChecks = filterChecks;
window.toggleClinRow = toggleClinRow;
window.viewDocument = viewDocument;
window.switchModalTab = switchModalTab;
window.closeDocumentModal = closeDocumentModal;
window.exportReport = exportReport;

