// Global variables
let uploadedFiles = [];
let currentData = {
    item: {
        nsn: "1630-01-222-3333",
        description: "Landing Gear Wheel",
        org: "USA",
        qtyOnHand: 7,
        carryingMethod: "STD",
        carryingUnitCost: 8400
    },
    nrv: {
        avgScrapProceedsPerUnit: 2425,
        avgDisposalCostPerUnit: 312.5,
        proposedNRVUnit: 2112.5
    },
    conditionCodeSuggested: "G",
    appliedRuleId: "EOU-NRV-02"
};

// DOM elements
const elements = {
    conditionCode: null,
    scrapAdjustment: null,
    disposalAdjustment: null,
    calculatedNrv: null,
    uploadArea: null,
    fileInput: null,
    uploadedFiles: null,
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
    console.log('Initializing NRV Review application...');
    
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
    console.log('Initializing NRV Review app...');
    
    if (!initializeElements()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    try {
        setupEventListeners();
        setupFileUpload();
        updateCalculatedNRV();
        populateConditionCodeDescriptions();
        initializeUiPathVariableListeners();
        console.log('NRV Review application initialized successfully');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

// Start the application
initializeApplication();

// Initialize DOM elements with error handling
function initializeElements() {
    try {
        elements.conditionCode = document.getElementById('conditionCode');
        elements.scrapAdjustment = document.getElementById('scrapAdjustment');
        elements.disposalAdjustment = document.getElementById('disposalAdjustment');
        elements.calculatedNrv = document.querySelector('.calculated-nrv');
        elements.uploadArea = document.getElementById('uploadArea');
        elements.fileInput = document.getElementById('fileInput');
        elements.uploadedFiles = document.getElementById('uploadedFiles');
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
    if (!elements.conditionCode) {
        console.error('conditionCode element not found');
        return;
    }
    if (!elements.scrapAdjustment) {
        console.error('scrapAdjustment element not found');
        return;
    }
    if (!elements.disposalAdjustment) {
        console.error('disposalAdjustment element not found');
        return;
    }
    if (!elements.reviewComments) {
        console.error('reviewComments element not found');
        return;
    }

    // Condition code change
    elements.conditionCode.addEventListener('change', function() {
        updateConditionCodeDescription();
        setVariable('conditionCode', elements.conditionCode.value);
    });

    // Manual adjustment inputs
    elements.scrapAdjustment.addEventListener('input', function() {
        updateCalculatedNRV();
        setVariable('scrapAdjustment', elements.scrapAdjustment.value);
    });

    elements.disposalAdjustment.addEventListener('input', function() {
        updateCalculatedNRV();
        setVariable('disposalAdjustment', elements.disposalAdjustment.value);
    });

    // Review comments change - update when user finishes typing (on blur)
    elements.reviewComments.addEventListener('blur', function(e) {
        const commentsValue = e.target.value.trim();
        setVariable('reviewComments', commentsValue);
    });

    // Decision buttons
    elements.approveBtn.addEventListener('click', function() {
        showConfirmationModal('Approve NRV Adjustment', 
            'Are you sure you want to approve this NRV adjustment? This action will finalize the write-down and update the inventory valuation.', 
            'approve');
    });

    elements.rejectBtn.addEventListener('click', function() {
        showConfirmationModal('Reject NRV Adjustment', 
            'Are you sure you want to reject this NRV adjustment? This will return the item to the previous valuation state.', 
            'reject');
    });

    elements.holdBtn.addEventListener('click', function() {
        showConfirmationModal('Place on Hold', 
            'Are you sure you want to place this review on hold? This will pause the review process until further action.', 
            'hold');
    });

    // Modal events
    elements.modalClose.addEventListener('click', hideConfirmationModal);
    elements.modalCancel.addEventListener('click', hideConfirmationModal);
    elements.modalConfirm.addEventListener('click', handleModalConfirm);

    // Close modal when clicking outside
    elements.confirmationModal.addEventListener('click', function(e) {
        if (e.target === elements.confirmationModal) {
            hideConfirmationModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.confirmationModal.classList.contains('show')) {
            hideConfirmationModal();
        }
    });
}

// Setup file upload functionality
function setupFileUpload() {
    // Click to upload
    elements.uploadArea.addEventListener('click', function() {
        elements.fileInput.click();
    });

    // File input change
    elements.fileInput.addEventListener('change', function(e) {
        handleFileSelection(e.target.files);
    });

    // Drag and drop
    elements.uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        elements.uploadArea.classList.add('dragover');
    });

    elements.uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        elements.uploadArea.classList.remove('dragover');
    });

    elements.uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        elements.uploadArea.classList.remove('dragover');
        handleFileSelection(e.dataTransfer.files);
    });
}

// Handle file selection
function handleFileSelection(files) {
    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            addFileToList(file);
        }
    });
}

// Validate file
function validateFile(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
        showNotification('File type not supported. Please upload PDF, Word, Excel, or image files.', 'error');
        return false;
    }

    if (file.size > maxSize) {
        showNotification('File size too large. Maximum size is 10MB.', 'error');
        return false;
    }

    return true;
}

// Add file to list
function addFileToList(file) {
    const fileId = Date.now() + Math.random();
    const fileItem = {
        id: fileId,
        file: file,
        name: file.name,
        size: file.size,
        type: file.type
    };

    uploadedFiles.push(fileItem);
    renderFileList();
    showNotification(`File "${file.name}" uploaded successfully.`);
}

// Remove file from list
function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(item => item.id !== fileId);
    renderFileList();
}

// Render file list
function renderFileList() {
    if (uploadedFiles.length === 0) {
        elements.uploadedFiles.innerHTML = '<p class="no-files">No files uploaded</p>';
        return;
    }

    elements.uploadedFiles.innerHTML = uploadedFiles.map(item => `
        <div class="file-item">
            <div class="file-info">
                <i class="fas ${getFileIcon(item.type)} file-icon"></i>
                <div class="file-details">
                    <span class="file-name">${item.name}</span>
                    <span class="file-size">${formatFileSize(item.size)}</span>
                </div>
            </div>
            <button class="file-remove" onclick="removeFile(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Get file icon based on type
function getFileIcon(type) {
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word')) return 'fa-file-word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
    if (type.includes('image')) return 'fa-file-image';
    return 'fa-file';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update calculated NRV
function updateCalculatedNRV() {
    const scrapValue = parseFloat(elements.scrapAdjustment.value) || currentData.nrv.avgScrapProceedsPerUnit;
    const disposalValue = parseFloat(elements.disposalAdjustment.value) || currentData.nrv.avgDisposalCostPerUnit;
    
    const calculatedNRV = scrapValue - disposalValue;
    
    if (elements.calculatedNrv) {
        elements.calculatedNrv.textContent = `$${calculatedNRV.toFixed(2)}`;
    }
}

// Update condition code description
function updateConditionCodeDescription() {
    const selectedCode = elements.conditionCode.value;
    const description = getConditionCodeDescription(selectedCode);
    
    // Update the description in the UI
    const descriptionElement = document.querySelector('.condition-description');
    if (descriptionElement) {
        descriptionElement.textContent = description;
    }
}

// Get condition code description
function getConditionCodeDescription(code) {
    const descriptions = {
        'A': 'Serviceable - New',
        'B': 'Serviceable - Good',
        'C': 'Serviceable - Fair',
        'D': 'Unserviceable - Repairable',
        'E': 'Unserviceable - Repairable',
        'F': 'Unserviceable - Repairable',
        'G': 'Unserviceable - Repairable',
        'H': 'Unserviceable - Repairable',
        'J': 'Unserviceable - Repairable',
        'K': 'Unserviceable - Repairable',
        'L': 'Unserviceable - Repairable',
        'M': 'Unserviceable - Repairable',
        'N': 'Unserviceable - Repairable',
        'P': 'Unserviceable - Repairable',
        'Q': 'Unserviceable - Repairable',
        'R': 'Unserviceable - Repairable',
        'S': 'Unserviceable - Repairable',
        'T': 'Unserviceable - Repairable',
        'U': 'Unserviceable - Repairable',
        'V': 'Unserviceable - Repairable',
        'W': 'Unserviceable - Repairable',
        'X': 'Unserviceable - Repairable',
        'Y': 'Unserviceable - Repairable',
        'Z': 'Unserviceable - Repairable'
    };
    
    return descriptions[code] || 'Unknown condition code';
}

// Populate condition code descriptions
function populateConditionCodeDescriptions() {
    const select = elements.conditionCode;
    Array.from(select.options).forEach(option => {
        const description = getConditionCodeDescription(option.value);
        option.textContent = `${option.value} - ${description}`;
    });
}

// Show confirmation modal
function showConfirmationModal(title, message, action) {
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
    elements.confirmationModal.classList.remove('show');
}

// Handle modal confirmation
function handleModalConfirm() {
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
    const conditionCode = elements.conditionCode.value;
    const comments = elements.reviewComments.value.trim();
    
    if (!conditionCode) {
        showNotification('Please select a condition code.', 'error');
        return false;
    }
    
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
        reviewer: 'Depot/Logistician', // This would come from authentication
        conditionCode: elements.conditionCode.value,
        scrapAdjustment: parseFloat(elements.scrapAdjustment.value) || currentData.nrv.avgScrapProceedsPerUnit,
        disposalAdjustment: parseFloat(elements.disposalAdjustment.value) || currentData.nrv.avgDisposalCostPerUnit,
        calculatedNRV: parseFloat(elements.calculatedNrv.textContent.replace('$', '')),
        comments: elements.reviewComments.value.trim(),
        uploadedFiles: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        originalData: currentData
    };
    
    // Set the decision variable for UiPath
    setVariable('reviewDecision', action);
    
    // Simulate API call
    simulateAPIProcessing(reviewData, action);
}

// Simulate API processing
function simulateAPIProcessing(reviewData, action) {
    // Show loading state
    const buttons = [elements.approveBtn, elements.rejectBtn, elements.holdBtn];
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    });
    
    // Simulate processing delay
    setTimeout(() => {
        // Reset button states
        buttons.forEach(btn => {
            btn.disabled = false;
            if (btn === elements.approveBtn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Approve NRV Adjustment';
            } else if (btn === elements.rejectBtn) {
                btn.innerHTML = '<i class="fas fa-times"></i> Reject NRV Adjustment';
            } else if (btn === elements.holdBtn) {
                btn.innerHTML = '<i class="fas fa-pause"></i> Place on Hold';
            }
        });
        
        // Show success message
        let message = '';
        switch (action) {
            case 'approve':
                message = 'NRV adjustment approved successfully. Inventory valuation has been updated.';
                updateStatusBadge('approved');
                break;
            case 'reject':
                message = 'NRV adjustment rejected. Item returned to previous valuation state.';
                updateStatusBadge('rejected');
                break;
            case 'hold':
                message = 'Review placed on hold. Process paused until further action.';
                updateStatusBadge('on-hold');
                break;
        }
        
        showNotification(message, 'success');
        
        // Log the review data (in real app, this would go to backend)
        console.log('Review Decision:', reviewData);
        
    }, 2000);
}

// Update status badge
function updateStatusBadge(status) {
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.className = `status-badge ${status}`;
        
        let icon, text, bgColor, textColor, borderColor;
        
        switch (status) {
            case 'approved':
                icon = 'fa-check-circle';
                text = 'Approved';
                bgColor = 'rgba(5, 150, 105, 0.2)';
                textColor = '#059669';
                borderColor = 'rgba(5, 150, 105, 0.3)';
                break;
            case 'rejected':
                icon = 'fa-times-circle';
                text = 'Rejected';
                bgColor = 'rgba(220, 38, 38, 0.2)';
                textColor = '#dc2626';
                borderColor = 'rgba(220, 38, 38, 0.3)';
                break;
            case 'on-hold':
                icon = 'fa-pause-circle';
                text = 'On Hold';
                bgColor = 'rgba(245, 158, 11, 0.2)';
                textColor = '#f59e0b';
                borderColor = 'rgba(245, 158, 11, 0.3)';
                break;
        }
        
        statusBadge.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        statusBadge.style.background = bgColor;
        statusBadge.style.color = textColor;
        statusBadge.style.borderColor = borderColor;
    }
}

// Show notification
function showNotification(message, type = 'success') {
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
            // Listen for conditionCode variable changes
            App.onVariableChange('conditionCode', value => {
                console.log('ConditionCode variable changed:', value);
                if (elements.conditionCode && elements.conditionCode.value !== value) {
                    elements.conditionCode.value = value || '';
                    updateConditionCodeDescription();
                }
            });
            
            // Listen for scrapAdjustment variable changes
            App.onVariableChange('scrapAdjustment', value => {
                console.log('ScrapAdjustment variable changed:', value);
                if (elements.scrapAdjustment && elements.scrapAdjustment.value !== value) {
                    elements.scrapAdjustment.value = value || '';
                    updateCalculatedNRV();
                }
            });
            
            // Listen for disposalAdjustment variable changes
            App.onVariableChange('disposalAdjustment', value => {
                console.log('DisposalAdjustment variable changed:', value);
                if (elements.disposalAdjustment && elements.disposalAdjustment.value !== value) {
                    elements.disposalAdjustment.value = value || '';
                    updateCalculatedNRV();
                }
            });
            
            // Listen for reviewComments variable changes
            App.onVariableChange('reviewComments', value => {
                console.log('ReviewComments variable changed:', value);
                if (elements.reviewComments && elements.reviewComments.value !== value) {
                    elements.reviewComments.value = value || '';
                }
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
            // Get initial conditionCode value
            const conditionCodeValue = await App.getVariable('conditionCode');
            if (conditionCodeValue && elements.conditionCode) {
                elements.conditionCode.value = conditionCodeValue;
                updateConditionCodeDescription();
            }
            
            // Get initial scrapAdjustment value
            const scrapAdjustmentValue = await App.getVariable('scrapAdjustment');
            if (scrapAdjustmentValue && elements.scrapAdjustment) {
                elements.scrapAdjustment.value = scrapAdjustmentValue;
            }
            
            // Get initial disposalAdjustment value
            const disposalAdjustmentValue = await App.getVariable('disposalAdjustment');
            if (disposalAdjustmentValue && elements.disposalAdjustment) {
                elements.disposalAdjustment.value = disposalAdjustmentValue;
            }
            
            // Get initial reviewComments value
            const reviewCommentsValue = await App.getVariable('reviewComments');
            if (reviewCommentsValue && elements.reviewComments) {
                elements.reviewComments.value = reviewCommentsValue;
            }
            
            // Update calculated NRV after setting initial values
            updateCalculatedNRV();
            
            console.log('Initial variable values retrieved from UiPath');
        }
    } catch (error) {
        console.error('Error getting initial variable values:', error);
    }
}

// Export functions for global access
window.removeFile = removeFile;
