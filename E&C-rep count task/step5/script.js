// DOM Elements - with null checks for UiPath compatibility
let investigationForm, awpStatusRadios, custodyLocationSelect, notesTextarea;
let evidenceUploadInput, fileUploadArea, filePreview;
let reconcileUpdateBtn, flagForReviewBtn, statusIndicator;
let confirmationModal, modalTitle, modalMessage;
let closeModalBtn, cancelActionBtn, confirmActionBtn;
let aiInvestigationHeader, aiInvestigationContent, aiToggleIcon;

// State management
let currentAction = null;
let uploadedFiles = [];
let formData = {
    awpStatus: '',
    custodyLocation: '',
    notes: '',
    files: []
};

// UiPath Variable Communication
let uipathVariables = {
    awpStatus: '',
    custodyLocation: '',
    notes: ''
};

// Variable change listeners for deregistration
let awpStatusChangeListener = null;
let custodyLocationChangeListener = null;
let notesChangeListener = null;

// Initialize DOM elements with error handling
function initializeDOMElements() {
    try {
        investigationForm = document.getElementById('investigationForm');
        awpStatusRadios = document.querySelectorAll('input[name="awpStatus"]');
        custodyLocationSelect = document.getElementById('custodyLocation');
        notesTextarea = document.getElementById('notes');
        evidenceUploadInput = document.getElementById('evidenceUpload');
        fileUploadArea = document.getElementById('fileUploadArea');
        filePreview = document.getElementById('filePreview');
        reconcileUpdateBtn = document.getElementById('reconcileUpdate');
        flagForReviewBtn = document.getElementById('flagForReview');
        statusIndicator = document.getElementById('statusIndicator');
        confirmationModal = document.getElementById('confirmationModal');
        modalTitle = document.getElementById('modalTitle');
        modalMessage = document.getElementById('modalMessage');
        closeModalBtn = document.getElementById('closeModal');
        cancelActionBtn = document.getElementById('cancelAction');
        confirmActionBtn = document.getElementById('confirmAction');
        
        // Collapsible elements
        aiInvestigationHeader = document.getElementById('aiInvestigationHeader');
        aiInvestigationContent = document.getElementById('aiInvestigationContent');
        aiToggleIcon = document.getElementById('aiToggleIcon');
        
        console.log('DOM elements initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        return false;
    }
}

// Initialize the application with multiple fallback methods
function initializeApplication() {
    console.log('Initializing application...');
    
    // Try multiple initialization methods for UiPath compatibility
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        initializeApp();
    }
    
    // Fallback: try again after a short delay
    setTimeout(() => {
        if (!document.body.querySelector('.card')) {
            console.log('Retrying initialization...');
            initializeApp();
        }
    }, 100);
    
    // Additional fallback for UiPath
    setTimeout(() => {
        if (!document.body.querySelector('.card')) {
            console.log('Final initialization attempt...');
            initializeApp();
        }
    }, 500);
}

function initializeApp() {
    console.log('Initializing app...');
    
    if (!initializeDOMElements()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    try {
        initializeEventListeners();
        initializeUiPathVariableListeners();
        setupFileUpload();
        setupCollapsible();
        updateStatus('Task Pending Investigation', 'clock', '#f6ad55');
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

// Initialize UiPath variable change listeners
function initializeUiPathVariableListeners() {
    try {
        // Check if we're in UiPath environment
        if (typeof App !== 'undefined' && App.onVariableChange) {
            // Listen for awpStatus variable changes
            awpStatusChangeListener = App.onVariableChange('awpStatus', value => {
                console.log('AWP Status variable changed:', value);
                if (formData.awpStatus !== value) {
                    formData.awpStatus = value || '';
                    updateAWPStatusFromVariable(value);
                }
            });
            
            // Listen for custodyLocation variable changes
            custodyLocationChangeListener = App.onVariableChange('custodyLocation', value => {
                console.log('Custody Location variable changed:', value);
                if (custodyLocationSelect && custodyLocationSelect.value !== value) {
                    custodyLocationSelect.value = value || '';
                    formData.custodyLocation = value || '';
                    validateForm();
                }
            });
            
            // Listen for notes variable changes
            notesChangeListener = App.onVariableChange('notes', value => {
                console.log('Notes variable changed:', value);
                if (notesTextarea && notesTextarea.value !== value) {
                    notesTextarea.value = value || '';
                    formData.notes = value || '';
                    updateNotesVisualFeedback();
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
            // Get initial awpStatus value
            const awpStatusValue = await App.getVariable('awpStatus');
            if (awpStatusValue) {
                formData.awpStatus = awpStatusValue;
                updateAWPStatusFromVariable(awpStatusValue);
            }
            
            // Get initial custodyLocation value
            const custodyLocationValue = await App.getVariable('custodyLocation');
            if (custodyLocationValue && custodyLocationSelect) {
                custodyLocationSelect.value = custodyLocationValue;
                formData.custodyLocation = custodyLocationValue;
            }
            
            // Get initial notes value
            const notesValue = await App.getVariable('notes');
            if (notesValue && notesTextarea) {
                notesTextarea.value = notesValue;
                formData.notes = notesValue;
                updateNotesVisualFeedback();
            }
            
            console.log('Initial variable values retrieved');
        }
    } catch (error) {
        console.error('Error getting initial variable values:', error);
    }
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

// Update AWP status from external variable changes
function updateAWPStatusFromVariable(value) {
    if (!awpStatusRadios || awpStatusRadios.length === 0) return;
    
    // Update radio button selection
    awpStatusRadios.forEach(radio => {
        if (radio.value === value) {
            radio.checked = true;
            const radioOption = radio.closest('.radio-option');
            if (radioOption) {
                radioOption.style.borderColor = '#48bb78';
                radioOption.style.background = '#f0fff4';
            }
        } else {
            radio.checked = false;
            const radioOption = radio.closest('.radio-option');
            if (radioOption) {
                radioOption.style.borderColor = '#e2e8f0';
                radioOption.style.background = 'white';
            }
        }
    });
    
    // Update custody location options based on AWP status
    updateCustodyLocationOptions(value);
    validateForm();
}

// Update notes visual feedback
function updateNotesVisualFeedback() {
    if (notesTextarea) {
        const notesValue = notesTextarea.value.trim();
        if (!notesValue) {
            notesTextarea.style.borderColor = '#f6ad55'; // Warning color
        } else {
            notesTextarea.style.borderColor = '#e2e8f0';
        }
    }
}

// Event Listeners with error handling
function initializeEventListeners() {
    try {
        // Form inputs
        if (awpStatusRadios && awpStatusRadios.length > 0) {
            awpStatusRadios.forEach(radio => {
                radio.addEventListener('change', handleAWPStatusChange);
            });
        }
        
        if (custodyLocationSelect) {
            custodyLocationSelect.addEventListener('change', handleCustodyLocationChange);
        }
        
        if (notesTextarea) {
            notesTextarea.addEventListener('blur', handleNotesChange);
            notesTextarea.addEventListener('input', updateNotesVisualFeedback);
        }
        
        // Action buttons
        if (reconcileUpdateBtn) {
            reconcileUpdateBtn.addEventListener('click', () => handleAction('reconcile'));
        }
        
        if (flagForReviewBtn) {
            flagForReviewBtn.addEventListener('click', () => handleAction('flag'));
        }
        
        // Modal controls
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        if (cancelActionBtn) {
            cancelActionBtn.addEventListener('click', closeModal);
        }
        
        if (confirmActionBtn) {
            confirmActionBtn.addEventListener('click', executeAction);
        }
        
        // Close modal on outside click
        if (confirmationModal) {
            confirmationModal.addEventListener('click', (e) => {
                if (e.target === confirmationModal) {
                    closeModal();
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        console.log('Event listeners initialized successfully');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// Handle AWP status change
function handleAWPStatusChange(e) {
    const selectedValue = e.target.value;
    formData.awpStatus = selectedValue;
    uipathVariables.awpStatus = selectedValue;
    
    // Update radio button styling
    if (awpStatusRadios && awpStatusRadios.length > 0) {
        awpStatusRadios.forEach(radio => {
            const radioOption = radio.closest('.radio-option');
            if (radio.checked) {
                radioOption.style.borderColor = '#48bb78';
                radioOption.style.background = '#f0fff4';
            } else {
                radioOption.style.borderColor = '#e2e8f0';
                radioOption.style.background = 'white';
            }
        });
    }
    
    // Update custody location options based on AWP status
    updateCustodyLocationOptions(selectedValue);
    
    // Update UiPath variable
    setVariable('awpStatus', selectedValue);
    
    validateForm();
}

// Handle custody location change
function handleCustodyLocationChange(e) {
    const selectedValue = e.target.value;
    formData.custodyLocation = selectedValue;
    uipathVariables.custodyLocation = selectedValue;
    
    // Update UiPath variable
    setVariable('custodyLocation', selectedValue);
    
    validateForm();
}

// Handle notes change when user finishes typing (on blur)
function handleNotesChange(e) {
    const notesValue = e.target.value.trim();
    formData.notes = notesValue;
    uipathVariables.notes = notesValue;
    
    // Update UiPath variable when user finishes typing
    setVariable('notes', notesValue);
}

// Update custody location options based on AWP status
function updateCustodyLocationOptions(awpStatus) {
    const currentValue = custodyLocationSelect ? custodyLocationSelect.value : '';
    if (!custodyLocationSelect) {
        console.error('Custody location select element not found.');
        return;
    }
    custodyLocationSelect.innerHTML = '<option value="">Select custody location...</option>';
    
    if (awpStatus === 'yes') {
        // Add AWP-specific locations
        custodyLocationSelect.innerHTML += `
            <option value="FRC-North-Island-AWP">FRC North Island - AWP Section</option>
            <option value="NAVSUP-FLC-San-Diego-AWP">NAVSUP FLC San Diego - AWP Section</option>
            <option value="NAVSUP-WSS-Mechanicsburg-AWP">NAVSUP WSS Mechanicsburg - AWP Section</option>
        `;
    } else if (awpStatus === 'no') {
        // Add G-Condition and other locations
        custodyLocationSelect.innerHTML += `
            <option value="FRC-North-Island-G-Condition">FRC North Island - G-Condition Storage</option>
            <option value="NAVSUP-FLC-San-Diego-G-Condition">NAVSUP FLC San Diego - G-Condition Storage</option>
            <option value="NAVSUP-WSS-Mechanicsburg-G-Condition">NAVSUP WSS Mechanicsburg - G-Condition Storage</option>
            <option value="Repair-Cell-C">FRC Repair Cell C</option>
        `;
    }
    
    // Restore previous selection if it's still valid
    if (currentValue && custodyLocationSelect.querySelector(`option[value="${currentValue}"]`)) {
        custodyLocationSelect.value = currentValue;
    }
}

// File Upload Setup
function setupFileUpload() {
    const fileInput = evidenceUploadInput;
    
    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }
    
    // Drag and drop functionality
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#4299e1';
            fileUploadArea.style.background = '#ebf8ff';
        });
        
        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#cbd5e0';
            fileUploadArea.style.background = '#f7fafc';
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#cbd5e0';
            fileUploadArea.style.background = '#f7fafc';
            
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });
    }
    
    // Click to upload
    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', () => {
            if (evidenceUploadInput) {
                evidenceUploadInput.click();
            }
        });
    }
}

// Handle file selection
function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// Process uploaded files
function handleFiles(files) {
    if (!filePreview) {
        console.error('File preview element not found.');
        return;
    }
    files.forEach(file => {
        if (validateFile(file)) {
            uploadedFiles.push(file);
            createFilePreview(file);
        }
    });
    
    validateForm();
}

// Validate file
function validateFile(file) {
    const maxSize = 1 * 1024 * 1024; // 1MB limit for UiPath compatibility
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload images, PDF, or DOC files only.', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('File size too large. Maximum size is 1MB for UiPath compatibility.', 'error');
        return false;
    }
    
    return true;
}

// Create file preview
function createFilePreview(file) {
    if (!filePreview) {
        console.error('File preview element not found.');
        return;
    }
    const reader = new FileReader();
    const previewItem = document.createElement('div');
    previewItem.className = 'file-preview-item';
    
    reader.onload = (e) => {
        const isImage = file.type.startsWith('image/');
        const fileIcon = isImage ? `<img src="${e.target.result}" alt="Preview">` : '<i class="fas fa-file-alt" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 4px; color: #4a5568;"></i>';
        
        previewItem.innerHTML = `
            ${fileIcon}
            <div>
                <div style="font-weight: 600; font-size: 0.875rem;">${file.name}</div>
                <div style="color: #718096; font-size: 0.75rem;">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="remove-file" onclick="removeFile('${file.name}')" style="
                background: none; border: none; color: #e53e3e; cursor: pointer; margin-left: auto; padding: 0.25rem;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
    };
    
    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else {
        // For non-image files, create preview immediately
        previewItem.innerHTML = `
            <i class="fas fa-file-alt" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 4px; color: #4a5568;"></i>
            <div>
                <div style="font-weight: 600; font-size: 0.875rem;">${file.name}</div>
                <div style="color: #718096; font-size: 0.75rem;">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="remove-file" onclick="removeFile('${file.name}')" style="
                background: none; border: none; color: #e53e3e; cursor: pointer; margin-left: auto; padding: 0.25rem;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
    }
    
    filePreview.appendChild(previewItem);
}

// Remove file
function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    updateFilePreview();
    validateForm();
}

// Update file preview
function updateFilePreview() {
    if (!filePreview) {
        console.error('File preview element not found.');
        return;
    }
    filePreview.innerHTML = '';
    uploadedFiles.forEach(file => createFilePreview(file));
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form validation
function validateForm() {
    const awpStatus = formData.awpStatus;
    const custodyLocation = custodyLocationSelect ? custodyLocationSelect.value.trim() : '';
    const notes = notesTextarea ? notesTextarea.value.trim() : '';
    
    let isValid = true;
    
    // Validate AWP status
    if (!awpStatus) {
        isValid = false;
        showFieldError('awpStatus', 'Please select whether the item was found in AWP');
    } else {
        clearFieldError('awpStatus');
    }
    
    // Validate custody location
    if (!custodyLocation) {
        isValid = false;
        if (custodyLocationSelect) {
            custodyLocationSelect.style.borderColor = '#e53e3e';
        }
        showFieldError('custodyLocation', 'Please select the updated custody location');
    } else {
        if (custodyLocationSelect) {
            custodyLocationSelect.style.borderColor = '#48bb78';
        }
        clearFieldError('custodyLocation');
    }
    
    // Validate notes (optional but recommended)
    if (!notes) {
        if (notesTextarea) {
            notesTextarea.style.borderColor = '#f6ad55';
        }
    } else {
        if (notesTextarea) {
            notesTextarea.style.borderColor = '#e2e8f0';
        }
    }
    
    // Update button states
    if (reconcileUpdateBtn) {
        reconcileUpdateBtn.disabled = !isValid;
        reconcileUpdateBtn.style.opacity = isValid ? '1' : '0.5';
    }
    if (flagForReviewBtn) {
        flagForReviewBtn.disabled = !isValid;
        flagForReviewBtn.style.opacity = isValid ? '1' : '0.5';
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldName, message) {
    // Remove existing error message
    clearFieldError(fieldName);
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    
    // Add error message to the appropriate field
    if (fieldName === 'awpStatus') {
        if (awpStatusRadios && awpStatusRadios.length > 0) {
            const radioGroup = awpStatusRadios[0].closest('.radio-group'); // Assuming all radios are in the same group
            if (radioGroup) {
                radioGroup.parentNode.insertBefore(errorElement, radioGroup.nextSibling);
            }
        }
    } else if (fieldName === 'custodyLocation') {
        if (custodyLocationSelect) {
            const inputWrapper = custodyLocationSelect.closest('.input-wrapper');
            if (inputWrapper) {
                inputWrapper.parentNode.insertBefore(errorElement, inputWrapper.nextSibling);
            }
        }
    }
}

// Clear field error
function clearFieldError(fieldName) {
    const existingError = document.querySelector(`.field-error`);
    if (existingError) {
        existingError.remove();
    }
}

// Handle action button clicks
function handleAction(action) {
    currentAction = action;
    
    if (confirmationModal) {
        if (action === 'reconcile') {
            showConfirmationModal(
                'Reconcile & Update Records',
                'Are you sure you want to reconcile and update the records? This will update the custody information and mark the investigation as complete.',
                'reconcile'
            );
        } else if (action === 'flag') {
            showConfirmationModal(
                'Flag for Further Review',
                'Are you sure you want to flag this item for further review? This will escalate the investigation to additional personnel.',
                'flag'
            );
        }
    }
}

// Show confirmation modal
function showConfirmationModal(title, message, action) {
    if (modalTitle) {
        modalTitle.textContent = title;
    }
    if (modalMessage) {
        modalMessage.textContent = message;
    }
    if (confirmActionBtn) {
        confirmActionBtn.textContent = action === 'reconcile' ? 'Reconcile & Update' : 'Flag for Review';
        confirmActionBtn.className = `btn ${action === 'reconcile' ? 'btn-success' : 'btn-warning'}`;
    }
    if (confirmationModal) {
        confirmationModal.classList.add('show');
    }
}

// Close modal
function closeModal() {
    if (confirmationModal) {
        confirmationModal.classList.remove('show');
    }
    currentAction = null;
}

// Execute the confirmed action
function executeAction() {
    if (!currentAction) return;
    
    const submissionData = {
        awpStatus: formData.awpStatus,
        custodyLocation: custodyLocationSelect ? custodyLocationSelect.value.trim() : '',
        notes: notesTextarea ? notesTextarea.value.trim() : '',
        files: uploadedFiles,
        action: currentAction,
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    simulateSubmission(submissionData);
    
    closeModal();
}

// Simulate form submission
function simulateSubmission(submissionData) {
    if (reconcileUpdateBtn) {
        reconcileUpdateBtn.disabled = true;
        reconcileUpdateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    if (flagForReviewBtn) {
        flagForReviewBtn.disabled = true;
        flagForReviewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    // Simulate API delay
    setTimeout(() => {
        if (submissionData.action === 'reconcile') {
            handleReconciliationSuccess(submissionData);
        } else {
            handleFlagForReview(submissionData);
        }
        
        // Reset buttons
        if (reconcileUpdateBtn) {
            reconcileUpdateBtn.disabled = false;
            reconcileUpdateBtn.innerHTML = '<i class="fas fa-check-circle"></i> Reconcile & Update Records';
        }
        if (flagForReviewBtn) {
            flagForReviewBtn.disabled = false;
            flagForReviewBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Flag for Further Review';
        }
    }, 2000);
}

// Handle successful reconciliation
function handleReconciliationSuccess(submissionData) {
    if (statusIndicator) {
        updateStatus('Records Reconciled Successfully', 'check-circle', '#48bb78');
    }
    showNotification('Records have been successfully reconciled and updated. The automated follow-up process will now begin.', 'success');
    
    // Log the submission
    console.log('Reconciliation submitted:', submissionData);
    
    // Disable form inputs
    disableForm();
    
    // Show automated follow-up status
    setTimeout(() => {
        showAutomatedFollowUpStatus();
    }, 1000);
}

// Handle flag for review
function handleFlagForReview(submissionData) {
    if (statusIndicator) {
        updateStatus('Flagged for Further Review', 'exclamation-triangle', '#f6ad55');
    }
    showNotification('Item has been flagged for further review and will be escalated to additional personnel.', 'warning');
    
    // Log the submission
    console.log('Flag for review submitted:', submissionData);
    
    // Disable form inputs
    disableForm();
}

// Show automated follow-up status
function showAutomatedFollowUpStatus() {
    if (statusIndicator) {
        const steps = [
            { title: 'ERP & WMS Update', icon: 'database', delay: 1000 },
            { title: 'Journal Voucher Generation', icon: 'file-invoice', delay: 2000 },
            { title: 'Audit Trail Update', icon: 'history', delay: 3000 }
        ];
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                updateStatus(`${step.title} in Progress`, step.icon, '#4299e1');
                showNotification(`${step.title} is being processed...`, 'info');
            }, step.delay);
        });
        
        // Final completion status
        setTimeout(() => {
            updateStatus('Investigation Complete', 'check-double', '#48bb78');
            showNotification('All automated follow-up processes have been completed successfully.', 'success');
        }, 5000);
    }
}

// Update status indicator
function updateStatus(message, icon, color) {
    if (statusIndicator) {
        const statusContent = statusIndicator.querySelector('.status-content');
        if (statusContent) {
            statusContent.innerHTML = `
                <i class="fas fa-${icon}" style="color: ${color}"></i>
                <span>${message}</span>
            `;
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : type === 'warning' ? '#f6ad55' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Disable form
function disableForm() {
    if (awpStatusRadios && awpStatusRadios.length > 0) {
        awpStatusRadios.forEach(radio => {
            radio.disabled = true;
        });
    }
    if (custodyLocationSelect) {
        custodyLocationSelect.disabled = true;
    }
    if (notesTextarea) {
        notesTextarea.disabled = true;
    }
    if (evidenceUploadInput) {
        evidenceUploadInput.disabled = true;
    }
    if (reconcileUpdateBtn) {
        reconcileUpdateBtn.disabled = true;
    }
    if (flagForReviewBtn) {
        flagForReviewBtn.disabled = true;
    }
    if (fileUploadArea) {
        fileUploadArea.style.pointerEvents = 'none';
        fileUploadArea.style.opacity = '0.5';
    }
}

// Initialize CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Custom Alert System for UiPath (replaces browser alerts that fail silently)
function showCustomAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert custom-alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'error' ? '#e53e3e' : type === 'warning' ? '#f6ad55' : '#4299e1'};
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10002;
        max-width: 400px;
        text-align: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    alertDiv.innerHTML = `
        <p style="margin: 0 0 1rem 0; font-weight: 600;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: ${type === 'error' ? '#e53e3e' : type === 'warning' ? '#f6ad55' : '#4299e1'};
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        ">OK</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Add fadeIn animation for custom alerts
const alertStyle = document.createElement('style');
alertStyle.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(alertStyle);

// Export functions for global access
window.removeFile = removeFile;

// Cleanup function for variable listeners (if needed)
function cleanupVariableListeners() {
    if (awpStatusChangeListener) {
        awpStatusChangeListener();
        awpStatusChangeListener = null;
    }
    if (custodyLocationChangeListener) {
        custodyLocationChangeListener();
        custodyLocationChangeListener = null;
    }
    if (notesChangeListener) {
        notesChangeListener();
        notesChangeListener = null;
    }
    console.log('Variable listeners cleaned up');
}

// Start the application
initializeApplication(); 