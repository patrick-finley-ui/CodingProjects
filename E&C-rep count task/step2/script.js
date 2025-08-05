// DOM Elements
const verificationForm = document.getElementById('verificationForm');
const physicalCountInput1 = document.getElementById('physicalCount1');
const physicalCountInput2 = document.getElementById('physicalCount2');
const physicalCountInput3 = document.getElementById('physicalCount3');
const notesTextarea = document.getElementById('notes');
const photoEvidenceInput = document.getElementById('photoEvidence');
const fileUploadArea = document.getElementById('fileUploadArea');
const filePreview = document.getElementById('filePreview');
const markVerifiedBtn = document.getElementById('markVerified');
const reportDiscrepancyBtn = document.getElementById('reportDiscrepancy');
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
let locationStatuses = {
    'FRC North Island': 'pending',
    'NAVSUP FLC San Diego': 'pending',
    'NAVSUP WSS Mechanicsburg': 'pending'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFileUpload();
    updateStatus('Task Pending Verification', 'clock', '#f6ad55');
});

// Event Listeners
function initializeEventListeners() {
    // Form inputs
    physicalCountInput1.addEventListener('input', () => validateLocation('FRC North Island', physicalCountInput1));
    physicalCountInput2.addEventListener('input', () => validateLocation('NAVSUP FLC San Diego', physicalCountInput2));
    physicalCountInput3.addEventListener('input', () => validateLocation('NAVSUP WSS Mechanicsburg', physicalCountInput3));
    notesTextarea.addEventListener('input', validateForm);
    
    // Action buttons
    markVerifiedBtn.addEventListener('click', () => handleAction('verify'));
    reportDiscrepancyBtn.addEventListener('click', () => handleAction('discrepancy'));
    
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

// File Upload Setup
function setupFileUpload() {
    const fileInput = photoEvidenceInput;
    
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload JPG, PNG, or GIF files only.', 'error');
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
        previewItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
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
    
    reader.readAsDataURL(file);
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

// Validate individual location
function validateLocation(locationName, inputElement) {
    const physicalCount = inputElement.value.trim();
    
    if (physicalCount) {
        inputElement.style.borderColor = '#48bb78';
        locationStatuses[locationName] = 'verified';
        updateLocationStatus(locationName, 'verified');
    } else {
        inputElement.style.borderColor = '#e2e8f0';
        locationStatuses[locationName] = 'pending';
        updateLocationStatus(locationName, 'pending');
    }
    
    validateForm();
}

// Update location status display
function updateLocationStatus(locationName, status) {
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        const header = card.querySelector('.location-header h3');
        if (header.textContent.includes(locationName)) {
            const statusElement = card.querySelector('.location-status');
            statusElement.textContent = status === 'verified' ? 'Verified' : 'Pending Verification';
            statusElement.className = `location-status ${status}`;
        }
    });
}

// Form validation
function validateForm() {
    const physicalCount1 = physicalCountInput1.value.trim();
    const physicalCount2 = physicalCountInput2.value.trim();
    const physicalCount3 = physicalCountInput3.value.trim();
    const notes = notesTextarea.value.trim();
    
    let isValid = true;
    let verifiedLocations = 0;
    
    // Validate all physical counts
    if (!physicalCount1) {
        isValid = false;
        physicalCountInput1.style.borderColor = '#e53e3e';
    } else {
        physicalCountInput1.style.borderColor = '#48bb78';
        verifiedLocations++;
    }
    
    if (!physicalCount2) {
        isValid = false;
        physicalCountInput2.style.borderColor = '#e53e3e';
    } else {
        physicalCountInput2.style.borderColor = '#48bb78';
        verifiedLocations++;
    }
    
    if (!physicalCount3) {
        isValid = false;
        physicalCountInput3.style.borderColor = '#e53e3e';
    } else {
        physicalCountInput3.style.borderColor = '#48bb78';
        verifiedLocations++;
    }
    
    // Validate notes (optional but recommended)
    if (!notes) {
        notesTextarea.style.borderColor = '#f6ad55';
    } else {
        notesTextarea.style.borderColor = '#e2e8f0';
    }
    
    // Update button states
    if (verifiedLocations === 3) {
        markVerifiedBtn.disabled = false;
        markVerifiedBtn.style.opacity = '1';
    } else {
        markVerifiedBtn.disabled = true;
        markVerifiedBtn.style.opacity = '0.5';
    }
    
    return isValid;
}

// Handle action button clicks
function handleAction(action) {
    currentAction = action;
    
    if (action === 'verify') {
        showConfirmationModal(
            'Mark All Locations Verified',
            'Are you sure you want to mark all locations as verified? This action will confirm that the physical counts match the expected quantities from all systems.',
            'verify'
        );
    } else if (action === 'discrepancy') {
        showConfirmationModal(
            'Report Discrepancies',
            'Are you sure you want to report discrepancies? This will flag the item for further investigation at the locations with mismatches.',
            'discrepancy'
        );
    }
}

// Show confirmation modal
function showConfirmationModal(title, message, action) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    confirmActionBtn.textContent = action === 'verify' ? 'Mark All Verified' : 'Report Discrepancies';
    confirmActionBtn.className = `btn ${action === 'verify' ? 'btn-success' : 'btn-danger'}`;
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
    
    const formData = {
        physicalCounts: {
            'FRC North Island': physicalCountInput1.value.trim(),
            'NAVSUP FLC San Diego': physicalCountInput2.value.trim(),
            'NAVSUP WSS Mechanicsburg': physicalCountInput3.value.trim()
        },
        notes: notesTextarea.value.trim(),
        files: uploadedFiles,
        action: currentAction,
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    simulateSubmission(formData);
    
    closeModal();
}

// Simulate form submission
function simulateSubmission(formData) {
    // Show loading state
    markVerifiedBtn.disabled = true;
    reportDiscrepancyBtn.disabled = true;
    markVerifiedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    reportDiscrepancyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate API delay
    setTimeout(() => {
        if (formData.action === 'verify') {
            handleVerificationSuccess(formData);
        } else {
            handleDiscrepancyReport(formData);
        }
        
        // Reset buttons
        markVerifiedBtn.disabled = false;
        reportDiscrepancyBtn.disabled = false;
        markVerifiedBtn.innerHTML = '<i class="fas fa-check-circle"></i> Mark All Locations Verified';
        reportDiscrepancyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Report Discrepancies';
    }, 2000);
}

// Handle successful verification
function handleVerificationSuccess(formData) {
    updateStatus('All Locations Verified Successfully', 'check-circle', '#48bb78');
    showNotification('All locations have been successfully verified and marked as complete.', 'success');
    
    // Update all location statuses
    Object.keys(locationStatuses).forEach(location => {
        updateLocationStatus(location, 'verified');
    });
    
    // Log the submission
    console.log('Verification submitted:', formData);
    
    // Disable form inputs
    disableForm();
}

// Handle discrepancy report
function handleDiscrepancyReport(formData) {
    updateStatus('Discrepancies Reported', 'exclamation-triangle', '#e53e3e');
    showNotification('Discrepancies have been reported and will be investigated.', 'warning');
    
    // Update location statuses based on discrepancies
    Object.keys(formData.physicalCounts).forEach(location => {
        const count = formData.physicalCounts[location];
        if (count) {
            updateLocationStatus(location, 'discrepancy');
        }
    });
    
    // Log the submission
    console.log('Discrepancy reported:', formData);
    
    // Disable form inputs
    disableForm();
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
    physicalCountInput1.disabled = true;
    physicalCountInput2.disabled = true;
    physicalCountInput3.disabled = true;
    notesTextarea.disabled = true;
    photoEvidenceInput.disabled = true;
    markVerifiedBtn.disabled = true;
    reportDiscrepancyBtn.disabled = true;
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