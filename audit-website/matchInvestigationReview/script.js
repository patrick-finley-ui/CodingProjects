// Global variables
let localMismatchData = [];
let filteredData = [];
let deregisterMismatchData = null;

// Testing boolean - set to true to use dummy data in previews
const USE_DUMMY_DATA = true;

// Dummy data for fallback - using the provided mismatch checks data
const dummyData = {
    "MatchEvaluation": {
        "MismatchChecks": [
            {
                "HeaderType": "Header-Level Mismatch",
                "CheckTitle": "ContractOrPONumberMismatch",
                "CheckDescription": "Invoice, DD250, and DD1155 reference different procurement identifiers (PIIDs).",
                "CheckExample": "Invoice lists FA4801-25-P-0049 while DD1155 and DD250 show FA4801-25-P-0047.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "All documents reference the same procurement identifier: FA4801-25-P-0047."
            },
            {
                "HeaderType": "Header-Level Mismatch",
                "CheckTitle": "VendorMismatch",
                "CheckDescription": "Vendor identifiers differ across documents, such as CAGE or UEI codes not matching between the invoice, DD1155, and DD250.",
                "CheckExample": "Invoice lists vendor CAGE 6Y7A2, while DD1155 lists CAGE 9K2L1 — indicating different registered entities under similar business names.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice does not include a Vendor CAGE or UEI code, while the DD250 lists CAGE 6Y7A2. This discrepancy requires further review."
            },
            {
                "HeaderType": "Header-Level Mismatch",
                "CheckTitle": "DateSequenceError",
                "CheckDescription": "Document dates are illogical or inconsistent across the workflow sequence.",
                "CheckExample": "Invoice date is earlier than DD250 acceptance date.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The Invoice date (2025-03-29) is consistent with the DD250 acceptance date (2025-03-29)."
            },
            {
                "HeaderType": "Header-Level Mismatch",
                "CheckTitle": "DuplicateInvoice",
                "CheckDescription": "Invoice number already exists in the payment system or duplicates a previous entry.",
                "CheckExample": "Invoice ARSI-INV-1025 already submitted to DFAS.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Skipped",
                "Reasoning": "No information provided to determine if the invoice is a duplicate."
            },
            {
                "HeaderType": "Line-Item Mismatch",
                "CheckTitle": "MissingLineItem",
                "CheckDescription": "A CLIN or SLIN listed on the PO or DD250 is missing from the invoice or vice versa.",
                "CheckExample": "CLIN 0003 present on DD1155 but not invoiced.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "All line items in the DD1155 and DD250 are present in the Invoice."
            },
            {
                "HeaderType": "Line-Item Mismatch",
                "CheckTitle": "QuantityMismatch",
                "CheckDescription": "Quantity invoiced differs from quantity accepted or ordered.",
                "CheckExample": "Invoice shows 50 units, DD250 accepted only 48.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice does not include the 'quantity ordered' or 'quantity accepted' fields, making it impossible to verify if the quantities match."
            },
            {
                "HeaderType": "Line-Item Mismatch",
                "CheckTitle": "OverBilledQuantity",
                "CheckDescription": "Invoice quantity exceeds PO or DD250 authorized amount.",
                "CheckExample": "Invoice lists 130 units; PO authorized 120.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The quantities invoiced match the quantities in the DD250 and DD1155 for all line items."
            },
            {
                "HeaderType": "Line-Item Mismatch",
                "CheckTitle": "PriceMismatch",
                "CheckDescription": "Unit price on invoice differs from price in DD1155 or acceptance record.",
                "CheckExample": "PO: $1,050 per unit; Invoice: $1,100 per unit.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The unit prices on the Invoice match the unit prices in the DD1155 and DD250 for all line items."
            },
            {
                "HeaderType": "Line-Item Mismatch",
                "CheckTitle": "ExtensionError",
                "CheckDescription": "Line total does not equal quantity × unit price.",
                "CheckExample": "Line shows $472,900 instead of $472,800.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "All line item totals on the Invoice are correctly calculated as quantity × unit price."
            },
            {
                "HeaderType": "Line-Item Mismatch",
                "CheckTitle": "FundingLineMismatch",
                "CheckDescription": "Invoice references incorrect or missing ACRN funding code.",
                "CheckExample": "CLIN 0002 billed under ACRN AB instead of AA.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice does not include ACRN funding codes, which are present in the DD1155 and DD250."
            },
            {
                "HeaderType": "Financial Mismatch",
                "CheckTitle": "TotalAmountDiscrepancy",
                "CheckDescription": "Invoice total does not match the sum of line item amounts or contract ceiling.",
                "CheckExample": "Sum of line items = $797,400, Invoice Total = $797,600.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The Invoice total ($797,600) matches the sum of the line item amounts."
            },
            {
                "HeaderType": "Financial Mismatch",
                "CheckTitle": "TaxOrFreightError",
                "CheckDescription": "Non-contractual charges added to invoice.",
                "CheckExample": "Vendor includes 7% tax when contract specifies tax-exempt.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "No tax or freight charges are included in the Invoice, and the total matches the DD1155 and DD250."
            },
            {
                "HeaderType": "Financial Mismatch",
                "CheckTitle": "CurrencyMismatch",
                "CheckDescription": "Currency code does not match contract requirement.",
                "CheckExample": "Invoice in EUR while PO specifies USD.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "All documents use the same currency (USD)."
            },
            {
                "HeaderType": "Acceptance and Receipt Mismatch",
                "CheckTitle": "UnacceptedShipment",
                "CheckDescription": "Invoice submitted before DD250 acceptance is complete.",
                "CheckExample": "Shipment SHP-002 still 'Pending Inspection' when invoice submitted.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The Invoice date (2025-03-29) is after the DD250 acceptance date (2025-03-29)."
            },
            {
                "HeaderType": "Acceptance and Receipt Mismatch",
                "CheckTitle": "RejectedLineItems",
                "CheckDescription": "Invoice includes items marked as 'Rejected' on DD250.",
                "CheckExample": "CLIN 0002 invoiced though DD250 shows 'Rejected for damage'.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "No line items are marked as 'Rejected' on the DD250."
            },
            {
                "HeaderType": "Acceptance and Receipt Mismatch",
                "CheckTitle": "AcceptanceQuantityMismatch",
                "CheckDescription": "Accepted quantity differs from invoice or PO.",
                "CheckExample": "Invoice 100 units; DD250 accepted 80.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice does not include the 'quantity accepted' field, making it impossible to verify if the accepted quantities match."
            },
            {
                "HeaderType": "Data Integrity Mismatch",
                "CheckTitle": "MissingMandatoryField",
                "CheckDescription": "Critical data field missing or blank.",
                "CheckExample": "Invoice missing PO number or invoice date.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice is missing the Vendor CAGE and UEI codes, which are critical fields."
            },
            {
                "HeaderType": "Data Integrity Mismatch",
                "CheckTitle": "FormatError",
                "CheckDescription": "Incorrect data format prevents matching.",
                "CheckExample": "Date entered as '29-March-25' instead of '2025-03-29'.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "All dates are in the correct format."
            },
            {
                "HeaderType": "Data Integrity Mismatch",
                "CheckTitle": "CharacterEncodingError",
                "CheckDescription": "Corrupt or non-ASCII characters cause mismatched fields.",
                "CheckExample": "Invoice shows FA4801\u001825\u0018P\u00180047 instead of FA4801-25-P-0047.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice contains non-ASCII characters in the line item descriptions, such as 'Rugged Laptop AR\\uE08812'."
            },
            {
                "HeaderType": "Logical or Contextual Mismatch",
                "CheckTitle": "PartialShipmentConflict",
                "CheckDescription": "Invoice claims full delivery though DD250 shows partial acceptance.",
                "CheckExample": "Invoice marked 'Final' though only 48/120 units delivered.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The Invoice and DD250 both reference the same shipment (SHP-001), and the quantities match for this shipment."
            },
            {
                "HeaderType": "Logical or Contextual Mismatch",
                "CheckTitle": "EarlyBilling",
                "CheckDescription": "Invoice submitted before goods or services were accepted.",
                "CheckExample": "Invoice dated before DD250 acceptance date.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The Invoice date (2025-03-29) is the same as the DD250 acceptance date (2025-03-29), so billing is not early."
            },
            {
                "HeaderType": "Logical or Contextual Mismatch",
                "CheckTitle": "LateAcceptance",
                "CheckDescription": "DD250 acceptance occurred beyond contract timeframe.",
                "CheckExample": "Acceptance completed after 30-day inspection window.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Passed",
                "Reasoning": "The DD250 acceptance date (2025-03-29) is within the contract delivery timeframe (by 2025-06-30)."
            },
            {
                "HeaderType": "Logical or Contextual Mismatch",
                "CheckTitle": "MissingDocumentLink",
                "CheckDescription": "Invoice not associated with any DD250 shipment record.",
                "CheckExample": "No DD250 or SHP reference found on invoice.",
                "Severity": "",
                "Justification": "",
                "CheckStatus": "",
                "AIReviewStatus": "Flagged",
                "Reasoning": "The Invoice does not reference a shipment number, but the DD250 references SHP-001. This requires further review."
            }
        ],
        "OverallStatus": "PartiallyMatched"
    }
};

// DOM elements
const searchInput = document.getElementById('searchInput');
const headerTypeFilter = document.getElementById('headerTypeFilter');
const checkStatusFilter = document.getElementById('checkStatusFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const tableBody = document.getElementById('tableBody');
const resultsCount = document.getElementById('resultsCount');

// Initialize the application
async function init() {
    try {
        // If testing mode is enabled, use dummy data
        if (USE_DUMMY_DATA) {
            localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
            filteredData = [...localMismatchData];
            renderTable();
            setupEventListeners();
            return;
        }
        
        // Check if UiPath App object is available
        if (typeof App === 'undefined') {
            throw new Error("UiPath App object not available");
        }
        
        // Get mismatch data from UiPath variable (as string)
        const initialDataString = await App.getVariable('mismatchData');
        
        // Parse the string data or use dummy data if empty/invalid
        if (initialDataString && initialDataString.trim() !== '') {
            try {
                const parsedData = JSON.parse(initialDataString);
                localMismatchData = parsedData.MatchEvaluation?.MismatchChecks || dummyData.MatchEvaluation.MismatchChecks;
            } catch (parseError) {
                localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
            }
        } else {
            localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
        }
        
        filteredData = [...localMismatchData];
        
        // Render the table with the loaded data
        renderTable();
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (e) {
        // Fallback to dummy data if variable doesn't exist or other error
        localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
        filteredData = [...localMismatchData];
        renderTable();
        setupEventListeners();
    }
}

// Initialize when DOM is loaded
registerListeners();

// Register listeners function
async function registerListeners() {
    // If testing mode is enabled, just initialize with dummy data
    if (USE_DUMMY_DATA) {
        init();
        return;
    }
    
    // Only register UiPath listeners if not in testing mode
    try {
        App.onVariableChange('mismatchData', value => {
            init();
        });
        
        const data = await App.getVariable('mismatchData');
        if (data) {
            init();
        } else {
            init(); // Initialize with dummy data if no UiPath data
        }
    } catch (e) {
        console.log('UiPath App not available, using dummy data');
        init(); // Initialize with dummy data
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', filterData);
    
    // Filter functionality
    headerTypeFilter.addEventListener('change', filterData);
    checkStatusFilter.addEventListener('change', filterData);
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Copy AI Review Status button
    const copyBtn = document.getElementById('copyAIStatusBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAIReviewStatus);
    }
}

// Toggle expandable row
function toggleExpandableRow(checkTitle) {
    const expandIcon = document.querySelector(`[data-check-title="${checkTitle}"] .expand-icon`);
    const expandableRow = document.querySelector(`[data-expandable="${checkTitle}"]`);
    
    if (expandableRow.classList.contains('expanded')) {
        expandableRow.classList.remove('expanded');
        expandIcon.classList.remove('expanded');
    } else {
        expandableRow.classList.add('expanded');
        expandIcon.classList.add('expanded');
    }
}

// Handle status change
async function handleStatusChange(checkTitle, status) {
    const item = localMismatchData.find(item => item.CheckTitle === checkTitle);
    if (item) {
        // Update the CheckStatus
        item.CheckStatus = status;
        
        // Update filtered data
        const filteredItem = filteredData.find(item => item.CheckTitle === checkTitle);
        if (filteredItem) {
            filteredItem.CheckStatus = status;
        }
        
        // Update UiPath variable (only if not in testing mode)
        if (!USE_DUMMY_DATA) {
            try {
                const updatedData = {
                    MatchEvaluation: {
                        MismatchChecks: localMismatchData,
                        OverallStatus: dummyData.MatchEvaluation.OverallStatus
                    }
                };
                await App.setVariable('mismatchData', JSON.stringify(updatedData));
                console.log('Updated UiPath variable');
            } catch (e) {
                console.error("Error updating mismatch data variable:", e);
            }
        }
        
        // Re-render the table to reflect changes
        renderTable();
    }
}

// Handle form submission in expandable row
async function handleExpandableFormSubmission(checkTitle) {
    const severity = document.querySelector(`[data-check-title="${checkTitle}"] .severity-select`).value;
    const justification = document.querySelector(`[data-check-title="${checkTitle}"] .justification-textarea`).value;
    const notes = document.querySelector(`[data-check-title="${checkTitle}"] .notes-textarea`).value;
    
    // Validate required fields
    if (!severity || !justification) {
        alert('Please fill in all required fields (Severity and Justification)');
        return;
    }
    
    const item = localMismatchData.find(item => item.CheckTitle === checkTitle);
    if (item) {
        item.Severity = severity;
        item.Justification = justification;
        item.Notes = notes;
        
        // Update filtered data
        const filteredItem = filteredData.find(item => item.CheckTitle === checkTitle);
        if (filteredItem) {
            filteredItem.Severity = severity;
            filteredItem.Justification = justification;
            filteredItem.Notes = notes;
        }
        
        // Update UiPath variable (only if not in testing mode)
        if (!USE_DUMMY_DATA) {
            try {
                const updatedData = {
                    MatchEvaluation: {
                        MismatchChecks: localMismatchData,
                        OverallStatus: dummyData.MatchEvaluation.OverallStatus
                    }
                };
                await App.setVariable('mismatchData', JSON.stringify(updatedData));
                console.log('Updated UiPath variable');
            } catch (e) {
                console.error("Error updating mismatch data variable:", e);
            }
        }
        
        // Re-render the table to reflect changes
        renderTable();
        
        // Close the expandable row
        toggleExpandableRow(checkTitle);
    }
}

// Copy AI Review Status to Check Status
async function copyAIReviewStatus() {
    let updatedCount = 0;
    
    localMismatchData.forEach(item => {
        if (item.AIReviewStatus === 'Passed') {
            item.CheckStatus = 'Passed';
            updatedCount++;
        }
    });
    
    // Update filtered data
    filteredData.forEach(item => {
        if (item.AIReviewStatus === 'Passed') {
            item.CheckStatus = 'Passed';
        }
    });
    
    // Update UiPath variable (only if not in testing mode)
    if (!USE_DUMMY_DATA) {
        try {
            const updatedData = {
                MatchEvaluation: {
                    MismatchChecks: localMismatchData,
                    OverallStatus: dummyData.MatchEvaluation.OverallStatus
                }
            };
            await App.setVariable('mismatchData', JSON.stringify(updatedData));
            console.log('Updated UiPath variable');
        } catch (e) {
            console.error("Error updating mismatch data variable:", e);
        }
    }
    
    // Re-render the table to reflect changes
    renderTable();
    
    // Show success message
    alert(`Successfully copied ${updatedCount} "Passed" AI Review Status values to Check Status column.`);
}

// Filter data based on search and filters
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const headerTypeValue = headerTypeFilter.value;
    const checkStatusValue = checkStatusFilter.value;
    
    filteredData = localMismatchData.filter(item => {
        const matchesSearch = 
            item.CheckTitle.toLowerCase().includes(searchTerm) ||
            item.CheckDescription.toLowerCase().includes(searchTerm) ||
            item.Reasoning.toLowerCase().includes(searchTerm);
        
        const matchesHeaderType = !headerTypeValue || item.HeaderType === headerTypeValue;
        const matchesCheckStatus = !checkStatusValue || item.CheckStatus === checkStatusValue;
        
        return matchesSearch && matchesHeaderType && matchesCheckStatus;
    });
    
    renderTable();
    updateClearFiltersButton();
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    headerTypeFilter.value = '';
    checkStatusFilter.value = '';
    filterData();
}

// Update clear filters button visibility
function updateClearFiltersButton() {
    const hasActiveFilters = 
        searchInput.value || 
        headerTypeFilter.value || 
        checkStatusFilter.value;
    
    clearFiltersBtn.style.display = hasActiveFilters ? 'block' : 'none';
}

// Render the table
function renderTable() {
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No mismatch checks match your criteria</p>
                </td>
            </tr>
        `;
    } else {
        let html = '';
        filteredData.forEach(item => {
            html += createTableRow(item);
            html += createExpandableRow(item);
        });
        tableBody.innerHTML = html;
    }
    
    resultsCount.textContent = `Showing ${filteredData.length} of ${localMismatchData.length} mismatch checks`;
}

// Create a table row
function createTableRow(item) {
    const checkStatusBadgeClass = getCheckStatusBadgeClass(item.CheckStatus);
    const severityBadgeClass = getSeverityBadgeClass(item.Severity);
    
    return `
        <tr data-check-title="${item.CheckTitle}">
            <td>
                <span class="expand-icon" onclick="toggleExpandableRow('${item.CheckTitle}')">▶</span>
            </td>
            <td class="font-medium">${item.CheckTitle}</td>
            <td><span class="header-type">${item.HeaderType}</span></td>
            <td>
                <span class="badge ${getCheckStatusBadgeClass(item.AIReviewStatus)}">${item.AIReviewStatus}</span>
            </td>
            <td class="hidden-mobile truncate">${item.CheckDescription}</td>
            <td>
                ${item.Severity ? `<span class="badge ${severityBadgeClass}">${item.Severity}</span>` : '<span class="badge badge-informational">Not Set</span>'}
            </td>
            <td class="action-buttons-container">
                <div class="action-buttons-row">
                    <button class="action-btn action-btn-pass ${item.CheckStatus === 'Passed' ? 'active' : ''}" 
                            onclick="handleStatusChange('${item.CheckTitle}', 'Passed')">
                        Pass
                    </button>
                    <button class="action-btn action-btn-deny ${item.CheckStatus === 'Denied' ? 'active' : ''}" 
                            onclick="handleStatusChange('${item.CheckTitle}', 'Denied')">
                        Deny
                    </button>
                    <button class="action-btn action-btn-override ${item.CheckStatus === 'Overridden' ? 'active' : ''}" 
                            onclick="handleStatusChange('${item.CheckTitle}', 'Overridden')">
                        Override
                    </button>
                </div>
            </td>
            <td>
                <span class="badge ${getCheckStatusBadgeClass(item.CheckStatus)}">${item.CheckStatus}</span>
            </td>
        </tr>
    `;
}

// Create expandable row
function createExpandableRow(item) {
    return `
        <tr class="expandable-row" data-expandable="${item.CheckTitle}">
            <td colspan="8">
                <div class="expandable-content">
                    <div class="expandable-details">
                        <div class="expandable-detail-item">
                            <div class="expandable-detail-label">Description:</div>
                            <div class="expandable-detail-value">${item.CheckDescription}</div>
                        </div>
                        <div class="expandable-detail-item">
                            <div class="expandable-detail-label">Reasoning:</div>
                            <div class="expandable-detail-value">${item.Reasoning}</div>
                        </div>
                        <div class="expandable-detail-item">
                            <div class="expandable-detail-label">Current Status:</div>
                            <div class="expandable-detail-value">
                                <span class="badge ${getCheckStatusBadgeClass(item.CheckStatus)}">${item.CheckStatus}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="expandable-form">
                        
                        <div class="expandable-form-item">
                            <label class="expandable-form-label">Review Notes:</label>
                            <textarea class="expandable-form-input expandable-form-textarea notes-textarea" 
                                      placeholder="Add your review notes here...">${item.Notes || ''}</textarea>
                        </div>
                        <div class="expandable-form-item">
                            <label class="expandable-form-label">Additional Comments:</label>
                            <textarea class="expandable-form-input expandable-form-textarea" 
                                      placeholder="Any additional comments..."></textarea>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button type="button" class="btn-cancel" onclick="cancelExpandableForm('${item.CheckTitle}')">Cancel</button>
                        <button type="button" class="btn-save" onclick="handleExpandableFormSubmission('${item.CheckTitle}')">Save Changes</button>
                    </div>
                </div>
            </td>
        </tr>
    `;
}

// Get check status badge class
function getCheckStatusBadgeClass(status) {
    switch (status) {
        case 'Passed':
            return 'badge-passed';
        case 'Flagged':
            return 'badge-flagged';
        case 'Skipped':
            return 'badge-skipped';
        case 'Denied':
            return 'badge-denied';
        case 'Overridden':
            return 'badge-overridden';
        default:
            return 'badge-skipped';
    }
}

// Get severity badge class
function getSeverityBadgeClass(severity) {
    switch (severity) {
        case 'Critical':
            return 'badge-critical';
        case 'High':
            return 'badge-high';
        case 'Medium':
            return 'badge-medium';
        case 'Low':
            return 'badge-low';
        case 'Informational':
            return 'badge-informational';
        default:
            return 'badge-informational';
    }
}

// Export data functionality (optional)
function exportData() {
    const dataStr = JSON.stringify({
        MatchEvaluation: {
            MismatchChecks: localMismatchData,
            OverallStatus: dummyData.MatchEvaluation.OverallStatus
        }
    }, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mismatch-checks-data.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import data functionality (optional)
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                localMismatchData = importedData.MatchEvaluation?.MismatchChecks || [];
                filteredData = [...localMismatchData];
                
                // Update UiPath variable (following UiPath best practices)
                try {
                    await App.setVariable('mismatchData', JSON.stringify(importedData));
                } catch (e) {
                    console.error("Error updating mismatch data variable:", e);
                }
                
                filterData();
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Cleanup function to deregister variable listeners (following UiPath best practices)
function cleanup() {
    if (deregisterMismatchData) {
        deregisterMismatchData();
    }
}

// Cleanup on page unload (following UiPath best practices)
window.addEventListener('beforeunload', cleanup);

// Refresh mismatch data from UiPath
window.refreshMismatchData = async function() {
    try {
        // If testing mode is enabled, use dummy data
        if (USE_DUMMY_DATA) {
            localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
            filteredData = [...localMismatchData];
            renderTable();
            return;
        }
        
        // Get fresh data from UiPath
        const freshData = await App.getVariable('mismatchData');
        
        // Parse the fresh data
        if (freshData && freshData.trim() !== '') {
            try {
                const parsedData = JSON.parse(freshData);
                localMismatchData = parsedData.MatchEvaluation?.MismatchChecks || dummyData.MatchEvaluation.MismatchChecks;
            } catch (parseError) {
                localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
            }
        } else {
            localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
        }
        
        // Update filtered data and re-render
        filteredData = [...localMismatchData];
        renderTable();
        
    } catch (e) {
        // Fallback to dummy data
        localMismatchData = dummyData.MatchEvaluation.MismatchChecks;
        filteredData = [...localMismatchData];
        renderTable();
    }
};
