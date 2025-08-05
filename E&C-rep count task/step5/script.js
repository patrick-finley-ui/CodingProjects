// DOM Elements
const investigationForm = document.getElementById('investigationForm');
const awpStatusRadios = document.querySelectorAll('input[name="awpStatus"]');
const custodyLocationSelect = document.getElementById('custodyLocation');
const notesTextarea = document.getElementById('notes');
const evidenceUploadInput = document.getElementById('evidenceUpload');
const fileUploadArea = document.getElementById('fileUploadArea');
const filePreview = document.getElementById('filePreview');
const reconcileUpdateBtn = document.getElementById('reconcileUpdate');
const flagForReviewBtn = document.getElementById('flagForReview');
const statusIndicator = document.getElementById('statusIndicator');
const confirmationModal = document.getElementById('confirmationModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const closeModalBtn = document.getElementById('closeModal');
const cancelActionBtn = document.getElementById('cancelAction');
const confirmActionBtn = document.getElementById('confirmAction');

// State management
let currentAction = null;
let uploadedFiles = [];
let formData = {
    awpStatus: '',
    custodyLocation: '',
    notes: '',
    files: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFileUpload();
    updateStatus('Task Pending Investigation', 'clock', '#f6ad55');
});

// Event Listeners
function initializeEventListeners() {
    // Form inputs
    awpStatusRadios.forEach(radio => {
        radio.addEventListener('change', handleAWPStatusChange);
    });
    
    custodyLocationSelect.addEventListener('change', validateForm);
    notesTextarea.addEventListener('input', validateForm);
    
    // Action buttons
    reconcileUpdateBtn.addEventListener('click', () => handleAction('reconcile'));
    flagForReviewBtn.addEventListener('click', () => handleAction('flag'));
    
    // Modal controls
    closeModalBtn.addEventListener('click', closeModal);
    cancelActionBtn.addEventListener('click', closeModal);
    confirmActionBtn.addEventListener('click', executeAction);
    
    // Close modal on outside click
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Handle AWP status change
function handleAWPStatusChange(e) {
    const selectedValue = e.target.value;
    formData.awpStatus = selectedValue;
    
    // Update radio button styling
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
    
    // Update custody location options based on AWP status
    updateCustodyLocationOptions(selectedValue);
    validateForm();
}

// Update custody location options based on AWP status
function updateCustodyLocationOptions(awpStatus) {
    const currentValue = custodyLocationSelect.value;
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
    fileInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop functionality
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
    
    // Click to upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

// Handle file selection
function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// Process uploaded files
function handleFiles(files) {
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
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload images, PDF, or DOC files only.', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('File size too large. Maximum size is 10MB.', 'error');
        return false;
    }
    
    return true;
}

// Create file preview
function createFilePreview(file) {
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
    const custodyLocation = custodyLocationSelect.value.trim();
    const notes = notesTextarea.value.trim();
    
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
        custodyLocationSelect.style.borderColor = '#e53e3e';
        showFieldError('custodyLocation', 'Please select the updated custody location');
    } else {
        custodyLocationSelect.style.borderColor = '#48bb78';
        clearFieldError('custodyLocation');
    }
    
    // Validate notes (optional but recommended)
    if (!notes) {
        notesTextarea.style.borderColor = '#f6ad55';
    } else {
        notesTextarea.style.borderColor = '#e2e8f0';
    }
    
    // Update button states
    if (isValid) {
        reconcileUpdateBtn.disabled = false;
        flagForReviewBtn.disabled = false;
        reconcileUpdateBtn.style.opacity = '1';
        flagForReviewBtn.style.opacity = '1';
    } else {
        reconcileUpdateBtn.disabled = true;
        flagForReviewBtn.disabled = true;
        reconcileUpdateBtn.style.opacity = '0.5';
        flagForReviewBtn.style.opacity = '0.5';
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
        const radioGroup = document.querySelector('.radio-group');
        radioGroup.parentNode.insertBefore(errorElement, radioGroup.nextSibling);
    } else if (fieldName === 'custodyLocation') {
        const inputWrapper = custodyLocationSelect.closest('.input-wrapper');
        inputWrapper.parentNode.insertBefore(errorElement, inputWrapper.nextSibling);
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

// Show confirmation modal
function showConfirmationModal(title, message, action) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    confirmActionBtn.textContent = action === 'reconcile' ? 'Reconcile & Update' : 'Flag for Review';
    confirmActionBtn.className = `btn ${action === 'reconcile' ? 'btn-success' : 'btn-warning'}`;
    confirmationModal.classList.add('show');
}

// Close modal
function closeModal() {
    confirmationModal.classList.remove('show');
    currentAction = null;
}

// Execute the confirmed action
function executeAction() {
    if (!currentAction) return;
    
    const submissionData = {
        awpStatus: formData.awpStatus,
        custodyLocation: custodyLocationSelect.value.trim(),
        notes: notesTextarea.value.trim(),
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
    // Show loading state
    reconcileUpdateBtn.disabled = true;
    flagForReviewBtn.disabled = true;
    reconcileUpdateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    flagForReviewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate API delay
    setTimeout(() => {
        if (submissionData.action === 'reconcile') {
            handleReconciliationSuccess(submissionData);
        } else {
            handleFlagForReview(submissionData);
        }
        
        // Reset buttons
        reconcileUpdateBtn.disabled = false;
        flagForReviewBtn.disabled = false;
        reconcileUpdateBtn.innerHTML = '<i class="fas fa-check-circle"></i> Reconcile & Update Records';
        flagForReviewBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Flag for Further Review';
    }, 2000);
}

// Handle successful reconciliation
function handleReconciliationSuccess(submissionData) {
    updateStatus('Records Reconciled Successfully', 'check-circle', '#48bb78');
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
    updateStatus('Flagged for Further Review', 'exclamation-triangle', '#f6ad55');
    showNotification('Item has been flagged for further review and will be escalated to additional personnel.', 'warning');
    
    // Log the submission
    console.log('Flag for review submitted:', submissionData);
    
    // Disable form inputs
    disableForm();
}

// Show automated follow-up status
function showAutomatedFollowUpStatus() {
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

// Update status indicator
function updateStatus(message, icon, color) {
    const statusContent = statusIndicator.querySelector('.status-content');
    statusContent.innerHTML = `
        <i class="fas fa-${icon}" style="color: ${color}"></i>
        <span>${message}</span>
    `;
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
    awpStatusRadios.forEach(radio => {
        radio.disabled = true;
    });
    custodyLocationSelect.disabled = true;
    notesTextarea.disabled = true;
    evidenceUploadInput.disabled = true;
    reconcileUpdateBtn.disabled = true;
    flagForReviewBtn.disabled = true;
    fileUploadArea.style.pointerEvents = 'none';
    fileUploadArea.style.opacity = '0.5';
}

// Add CSS animations for notifications
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

// Export functions for global access
window.removeFile = removeFile; 