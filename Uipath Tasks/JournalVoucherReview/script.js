// Global variables
let jvData = {
    journal_voucher_task: {
        task_id: "JV-2025-Q3-0123",
        status: "Pending Finance Officer Review",
        submitted_by: "Depot Logistics Team",
        submission_date: "2025-09-02",
        jv_summary: {
            transaction_type: "Inventory Write-Down to NRV",
            nsn: "1630-01-222-3333",
            item_description: "Landing Gear Wheel",
            quantity: 7,
            total_write_down_amount: 44012.50,
            write_down_impact_per_unit: 6287.50
        },
        accounting_entries: [
            {
                account_number: "5293.001",
                account_name: "Gain/Loss on Disposal of Personal Property",
                entry_type: "Debit",
                amount: 44012.50
            },
            {
                account_number: "1521.001",
                account_name: "Inventory, Supplies, and Materiel",
                entry_type: "Credit",
                amount: 44012.50
            }
        ],
        explanation: "To record the write-down of seven unserviceable Landing Gear Wheel assets (NSN: 1630-01-222-3333). The write-down adjusts the inventory value to its calculated Net Realizable Value (NRV). The debit increases the loss account (recognizing the expense), while the credit decreases the inventory asset account (reducing the recorded value).",
        depot_review_data: {
            current_carrying_unit_cost: 8400.00,
            proposed_nrv_per_unit: 2112.50,
            suggested_condition_code: "G",
            condition_code_description: "Unserviceable - Repairable",
            average_scrap_proceeds_per_unit: 2425.00,
            average_disposal_cost_per_unit: 312.50
        },
        finance_officer_input: {
            review_comments: "",
            decision: "",
            decision_date: ""
        }
    }
};

// DOM elements
const elements = {
    taskId: null,
    taskStatus: null,
    submittedBy: null,
    submissionDate: null,
    transactionType: null,
    nsn: null,
    itemDescription: null,
    quantity: null,
    totalWriteDownAmount: null,
    writeDownImpactPerUnit: null,
    accountingEntriesTable: null,
    explanation: null,
    currentCarryingUnitCost: null,
    proposedNrvPerUnit: null,
    suggestedConditionCode: null,
    conditionCodeDescription: null,
    averageScrapProceedsPerUnit: null,
    averageDisposalCostPerUnit: null,
    docNsn: null,
    viewDepotReport: null,
    viewSupportingDocs: null,
    reviewComments: null,
    approveBtn: null,
    rejectBtn: null,
    holdBtn: null,
    confirmationModal: null,
    modalTitle: null,
    modalMessage: null,
    modalConfirm: null,
    modalCancel: null,
    modalClose: null,
    successNotification: null,
    notificationMessage: null
};

// Initialize the application with multiple fallback methods
function initializeApplication() {
    console.log('Initializing Journal Voucher Review application...');
    
    // Try multiple initialization methods for UiPath compatibility
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        initializeApp();
    }
    
    // Fallback: try again after a short delay
    setTimeout(() => {
        if (!document.body.querySelector('.container')) {
            console.log('Retrying initialization...');
            initializeApp();
        }
    }, 100);
    
    // Additional fallback for UiPath
    setTimeout(() => {
        if (!document.body.querySelector('.container')) {
            console.log('Final initialization attempt...');
            initializeApp();
        }
    }, 500);
}

function initializeApp() {
    console.log('Initializing Journal Voucher Review app...');
    
    if (!initializeElements()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    try {
        setupEventListeners();
        populateData();
        initializeUiPathVariableListeners();
        console.log('Journal Voucher Review application initialized successfully');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

// Start the application
initializeApplication();

// Initialize DOM elements with error handling
function initializeElements() {
    try {
        elements.taskId = document.getElementById('taskId');
        elements.taskStatus = document.getElementById('taskStatus');
        elements.submittedBy = document.getElementById('submittedBy');
        elements.submissionDate = document.getElementById('submissionDate');
        elements.transactionType = document.getElementById('transactionType');
        elements.nsn = document.getElementById('nsn');
        elements.itemDescription = document.getElementById('itemDescription');
        elements.quantity = document.getElementById('quantity');
        elements.totalWriteDownAmount = document.getElementById('totalWriteDownAmount');
        elements.writeDownImpactPerUnit = document.getElementById('writeDownImpactPerUnit');
        elements.accountingEntriesTable = document.getElementById('accountingEntriesTable');
        elements.explanation = document.getElementById('explanation');
        elements.currentCarryingUnitCost = document.getElementById('currentCarryingUnitCost');
        elements.proposedNrvPerUnit = document.getElementById('proposedNrvPerUnit');
        elements.suggestedConditionCode = document.getElementById('suggestedConditionCode');
        elements.conditionCodeDescription = document.getElementById('conditionCodeDescription');
        elements.averageScrapProceedsPerUnit = document.getElementById('averageScrapProceedsPerUnit');
        elements.averageDisposalCostPerUnit = document.getElementById('averageDisposalCostPerUnit');
        elements.docNsn = document.getElementById('docNsn');
        elements.viewDepotReport = document.getElementById('viewDepotReport');
        elements.viewSupportingDocs = document.getElementById('viewSupportingDocs');
        elements.reviewComments = document.getElementById('reviewComments');
        elements.approveBtn = document.getElementById('approveBtn');
        elements.rejectBtn = document.getElementById('rejectBtn');
        elements.holdBtn = document.getElementById('holdBtn');
        elements.confirmationModal = document.getElementById('confirmationModal');
        elements.modalTitle = document.getElementById('modalTitle');
        elements.modalMessage = document.getElementById('modalMessage');
        elements.modalConfirm = document.getElementById('modalConfirm');
        elements.modalCancel = document.getElementById('modalCancel');
        elements.modalClose = document.getElementById('modalClose');
            elements.successNotification = document.getElementById('successNotification');
    elements.notificationMessage = document.getElementById('notificationMessage');
    elements.explanationHeader = document.getElementById('explanationHeader');
    elements.explanationToggle = document.getElementById('explanationToggle');
    elements.explanationContent = document.getElementById('explanationContent');
        
        console.log('DOM elements initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        return false;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Check if elements exist before adding listeners
    if (!elements.reviewComments) {
        console.error('reviewComments element not found');
        return;
    }
    if (!elements.approveBtn) {
        console.error('approveBtn element not found');
        return;
    }
    if (!elements.rejectBtn) {
        console.error('rejectBtn element not found');
        return;
    }
    if (!elements.holdBtn) {
        console.error('holdBtn element not found');
        return;
    }

    // Review comments change - update when user finishes typing (on blur)
    elements.reviewComments.addEventListener('blur', function(e) {
        const commentsValue = e.target.value.trim();
        setVariable('reviewComments', commentsValue);
        validateForm();
    });

    // Real-time validation on input
    elements.reviewComments.addEventListener('input', function() {
        validateForm();
    });

    // Decision buttons
    elements.approveBtn.addEventListener('click', function() {
        showConfirmationModal('Approve Journal Voucher', 
            'Are you sure you want to approve this Journal Voucher? This action will finalize the write-down and update the financial records.', 
            'approve');
    });

    elements.rejectBtn.addEventListener('click', function() {
        showConfirmationModal('Reject Journal Voucher', 
            'Are you sure you want to reject this Journal Voucher? This will return the item to the previous valuation state.', 
            'reject');
    });

    elements.holdBtn.addEventListener('click', function() {
        showConfirmationModal('Place on Hold', 
            'Are you sure you want to place this review on hold? This will pause the review process until further action.', 
            'hold');
    });

    // Documentation buttons
    if (elements.viewDepotReport) {
        elements.viewDepotReport.addEventListener('click', function() {
            showNotification('Depot Review Report would open in new window', 'info');
        });
    }

    if (elements.viewSupportingDocs) {
        elements.viewSupportingDocs.addEventListener('click', function() {
            showNotification('Supporting Documents would open in new window', 'info');
        });
    }

    // Modal events
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', hideConfirmationModal);
    }
    if (elements.modalCancel) {
        elements.modalCancel.addEventListener('click', hideConfirmationModal);
    }
    if (elements.modalConfirm) {
        elements.modalConfirm.addEventListener('click', handleModalConfirm);
    }

    // Close modal when clicking outside
    if (elements.confirmationModal) {
        elements.confirmationModal.addEventListener('click', function(e) {
            if (e.target === elements.confirmationModal) {
                hideConfirmationModal();
            }
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.confirmationModal && elements.confirmationModal.classList.contains('show')) {
            hideConfirmationModal();
        }
    });

    // Explanation section toggle
    if (elements.explanationHeader) {
        elements.explanationHeader.addEventListener('click', toggleExplanation);
    }
}

// Populate data from JSON
function populateData() {
    const data = jvData.journal_voucher_task;
    
    // Task Information
    if (elements.taskId) elements.taskId.textContent = data.task_id;
    if (elements.taskStatus) elements.taskStatus.textContent = data.status;
    if (elements.submittedBy) elements.submittedBy.textContent = data.submitted_by;
    if (elements.submissionDate) elements.submissionDate.textContent = data.submission_date;
    if (elements.transactionType) elements.transactionType.textContent = data.jv_summary.transaction_type;
    
    // JV Summary
    if (elements.nsn) elements.nsn.textContent = data.jv_summary.nsn;
    if (elements.itemDescription) elements.itemDescription.textContent = data.jv_summary.item_description;
    if (elements.quantity) elements.quantity.textContent = data.jv_summary.quantity;
    if (elements.totalWriteDownAmount) elements.totalWriteDownAmount.textContent = formatCurrency(data.jv_summary.total_write_down_amount);
    if (elements.writeDownImpactPerUnit) elements.writeDownImpactPerUnit.textContent = formatCurrency(data.jv_summary.write_down_impact_per_unit);
    
    // Accounting Entries
    if (elements.accountingEntriesTable) {
        elements.accountingEntriesTable.innerHTML = data.accounting_entries.map(entry => {
            let effect = '';
            if (entry.entry_type === 'Debit') {
                if (entry.account_name.includes('Gain/Loss')) {
                    effect = 'Increases Loss';
                } else if (entry.account_name.includes('Inventory')) {
                    effect = 'Decreases Asset';
                }
            } else if (entry.entry_type === 'Credit') {
                if (entry.account_name.includes('Gain/Loss')) {
                    effect = 'Decreases Loss';
                } else if (entry.account_name.includes('Inventory')) {
                    effect = 'Decreases Asset';
                }
            }
            
            return `
                <tr>
                    <td>${entry.account_number}</td>
                    <td>${entry.account_name}</td>
                    <td><span class="entry-type ${entry.entry_type.toLowerCase()}">${entry.entry_type}</span></td>
                    <td class="amount">${formatCurrency(entry.amount)}</td>
                    <td class="effect">${effect}</td>
                </tr>
            `;
        }).join('');
    }
    
    // Explanation
    if (elements.explanation) elements.explanation.textContent = data.explanation;
    
    // Depot Review Data
    if (elements.currentCarryingUnitCost) elements.currentCarryingUnitCost.textContent = formatCurrency(data.depot_review_data.current_carrying_unit_cost);
    if (elements.proposedNrvPerUnit) elements.proposedNrvPerUnit.textContent = formatCurrency(data.depot_review_data.proposed_nrv_per_unit);
    if (elements.suggestedConditionCode) elements.suggestedConditionCode.textContent = data.depot_review_data.suggested_condition_code;
    if (elements.conditionCodeDescription) elements.conditionCodeDescription.textContent = data.depot_review_data.condition_code_description;
    if (elements.averageScrapProceedsPerUnit) elements.averageScrapProceedsPerUnit.textContent = formatCurrency(data.depot_review_data.average_scrap_proceeds_per_unit);
    if (elements.averageDisposalCostPerUnit) elements.averageDisposalCostPerUnit.textContent = formatCurrency(data.depot_review_data.average_disposal_cost_per_unit);
    
    // Documentation
    if (elements.docNsn) elements.docNsn.textContent = data.jv_summary.nsn;
    
    // Initialize form validation
    validateForm();
}

// Form validation
function validateForm() {
    const comments = elements.reviewComments ? elements.reviewComments.value.trim() : '';
    const isValid = comments.length >= 10;
    
    // Update button states
    if (elements.approveBtn) {
        elements.approveBtn.disabled = !isValid;
    }
    if (elements.rejectBtn) {
        elements.rejectBtn.disabled = !isValid;
    }
    if (elements.holdBtn) {
        elements.holdBtn.disabled = !isValid;
    }
    
    // Update textarea styling
    if (elements.reviewComments) {
        if (comments.length === 0) {
            elements.reviewComments.style.borderColor = '#f59e0b';
        } else if (comments.length < 10) {
            elements.reviewComments.style.borderColor = '#f59e0b';
        } else {
            elements.reviewComments.style.borderColor = '#e2e8f0';
        }
    }
    
    return isValid;
}

// Show confirmation modal
function showConfirmationModal(title, message, action) {
    if (!elements.modalTitle || !elements.modalMessage || !elements.modalConfirm || !elements.confirmationModal) {
        console.error('Modal elements not found');
        return;
    }
    
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modalConfirm.dataset.action = action;
    
    // Update modal button styling based on action
    elements.modalConfirm.className = 'btn';
    if (action === 'approve') {
        elements.modalConfirm.classList.add('btn-approve');
        elements.modalConfirm.textContent = 'Approve';
    } else if (action === 'reject') {
        elements.modalConfirm.classList.add('btn-reject');
        elements.modalConfirm.textContent = 'Reject';
    } else if (action === 'hold') {
        elements.modalConfirm.classList.add('btn-hold');
        elements.modalConfirm.textContent = 'Place on Hold';
    }
    
    elements.confirmationModal.classList.add('show');
}

// Hide confirmation modal
function hideConfirmationModal() {
    if (elements.confirmationModal) {
        elements.confirmationModal.classList.remove('show');
    }
}

// Handle modal confirmation
function handleModalConfirm() {
    if (!elements.modalConfirm) return;
    
    const action = elements.modalConfirm.dataset.action;
    
    // Validate required fields
    if (!validateReviewSubmission()) {
        hideConfirmationModal();
        return;
    }
    
    // Process the action
    processReviewDecision(action);
    
    hideConfirmationModal();
}

// Validate review submission
function validateReviewSubmission() {
    const comments = elements.reviewComments ? elements.reviewComments.value.trim() : '';
    
    if (comments.length < 10) {
        showNotification('Please provide review comments (minimum 10 characters).', 'error');
        return false;
    }
    
    return true;
}

// Process review decision
function processReviewDecision(action) {
    const reviewData = {
        action: action,
        timestamp: new Date().toISOString(),
        reviewer: 'Finance Officer', // This would come from authentication
        task_id: jvData.journal_voucher_task.task_id,
        review_comments: elements.reviewComments ? elements.reviewComments.value.trim() : '',
        jv_summary: jvData.journal_voucher_task.jv_summary,
        accounting_entries: jvData.journal_voucher_task.accounting_entries,
        depot_review_data: jvData.journal_voucher_task.depot_review_data
    };
    
    // Set the decision variable for UiPath
    setVariable('jvDecision', action);
    setVariable('jvComments', reviewData.review_comments);
    setVariable('jvTaskId', reviewData.task_id);
    
    // Simulate API call
    simulateAPIProcessing(reviewData, action);
}

// Simulate API processing
function simulateAPIProcessing(reviewData, action) {
    // Show loading state
    const buttons = [elements.approveBtn, elements.rejectBtn, elements.holdBtn];
    buttons.forEach(btn => {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    });
    
    // Simulate processing delay
    setTimeout(() => {
        // Reset button states
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = false;
                if (btn === elements.approveBtn) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Approve Journal Voucher';
                } else if (btn === elements.rejectBtn) {
                    btn.innerHTML = '<i class="fas fa-times"></i> Reject Journal Voucher';
                } else if (btn === elements.holdBtn) {
                    btn.innerHTML = '<i class="fas fa-pause"></i> Place on Hold';
                }
            }
        });
        
        // Show success message
        let message = '';
        switch (action) {
            case 'approve':
                message = 'Journal Voucher approved successfully. Financial records have been updated.';
                updateStatusBadge('approved');
                break;
            case 'reject':
                message = 'Journal Voucher rejected. Item returned to previous valuation state.';
                updateStatusBadge('rejected');
                break;
            case 'hold':
                message = 'Review placed on hold. Process paused until further action.';
                updateStatusBadge('on-hold');
                break;
        }
        
        showNotification(message, 'success');
        
        // Log the review data (in real app, this would go to backend)
        console.log('Journal Voucher Decision:', reviewData);
        
    }, 2000);
}

// Update status badge
function updateStatusBadge(status) {
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.className = `status-badge ${status}`;
        
        let icon, text;
        
        switch (status) {
            case 'approved':
                icon = 'fa-check-circle';
                text = 'Approved';
                break;
            case 'rejected':
                icon = 'fa-times-circle';
                text = 'Rejected';
                break;
            case 'on-hold':
                icon = 'fa-pause-circle';
                text = 'On Hold';
                break;
        }
        
        statusBadge.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    if (!elements.notificationMessage || !elements.successNotification) {
        console.error('Notification elements not found');
        return;
    }
    
    elements.notificationMessage.textContent = message;
    
    // Update notification styling based on type
    elements.successNotification.className = 'notification';
    if (type === 'error') {
        elements.successNotification.style.borderLeftColor = '#dc2626';
        elements.successNotification.querySelector('i').style.color = '#dc2626';
        elements.successNotification.querySelector('i').className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        elements.successNotification.style.borderLeftColor = '#f59e0b';
        elements.successNotification.querySelector('i').style.color = '#f59e0b';
        elements.successNotification.querySelector('i').className = 'fas fa-exclamation-triangle';
    } else if (type === 'info') {
        elements.successNotification.style.borderLeftColor = '#3b82f6';
        elements.successNotification.querySelector('i').style.color = '#3b82f6';
        elements.successNotification.querySelector('i').className = 'fas fa-info-circle';
    } else {
        elements.successNotification.style.borderLeftColor = '#059669';
        elements.successNotification.querySelector('i').style.color = '#059669';
        elements.successNotification.querySelector('i').className = 'fas fa-check-circle';
    }
    
    elements.successNotification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.successNotification.classList.remove('show');
    }, 5000);
}

// Toggle explanation section
function toggleExplanation() {
    if (!elements.explanationContent || !elements.explanationToggle) return;
    
    const isCollapsed = elements.explanationContent.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expand
        elements.explanationContent.classList.remove('collapsed');
        elements.explanationContent.classList.add('expanded');
        elements.explanationToggle.classList.add('expanded');
    } else {
        // Collapse
        elements.explanationContent.classList.remove('expanded');
        elements.explanationContent.classList.add('collapsed');
        elements.explanationToggle.classList.remove('expanded');
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// UiPath Variable Communication Functions
function setVariable(variableName, value) {
    try {
        // Check if we're in UiPath environment
        if (typeof App !== 'undefined' && App.setVariable) {
            App.setVariable(variableName, value);
            console.log(`UiPath variable set: ${variableName} = ${value}`);
        } else {
            console.log(`Variable would be set: ${variableName} = ${value}`);
        }
    } catch (error) {
        console.error(`Error setting UiPath variable ${variableName}:`, error);
    }
}

function getVariable(variableName) {
    try {
        // Check if we're in UiPath environment
        if (typeof App !== 'undefined' && App.getVariable) {
            return App.getVariable(variableName);
        } else {
            console.log(`Variable would be retrieved: ${variableName}`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting UiPath variable ${variableName}:`, error);
        return null;
    }
}

// Initialize UiPath variable change listeners
function initializeUiPathVariableListeners() {
    try {
        // Check if we're in UiPath environment
        if (typeof App !== 'undefined' && App.onVariableChange) {
            // Listen for reviewComments variable changes
            App.onVariableChange('reviewComments', value => {
                console.log('ReviewComments variable changed:', value);
                if (elements.reviewComments && elements.reviewComments.value !== value) {
                    elements.reviewComments.value = value || '';
                    validateForm();
                }
            });
            
            // Listen for jvDecision variable changes
            App.onVariableChange('jvDecision', value => {
                console.log('JVDecision variable changed:', value);
                // Handle external decision changes if needed
            });
            
            // Get initial values
            getInitialVariableValues();
            
            console.log('UiPath variable listeners initialized successfully');
        } else {
            console.log('Not in UiPath environment, skipping variable listeners');
        }
    } catch (error) {
        console.error('Error initializing UiPath variable listeners:', error);
    }
}

// Get initial variable values from UiPath
async function getInitialVariableValues() {
    try {
        if (typeof App !== 'undefined' && App.getVariable) {
            // Get initial reviewComments value
            const reviewCommentsValue = await App.getVariable('reviewComments');
            if (reviewCommentsValue && elements.reviewComments) {
                elements.reviewComments.value = reviewCommentsValue;
                validateForm();
            }
            
            console.log('Initial variable values retrieved from UiPath');
        }
    } catch (error) {
        console.error('Error getting initial variable values:', error);
    }
}
