// DOM Elements
const physicalCountInput1 = document.getElementById('physicalCount1');
const erpCountElement = document.getElementById('erpCount');
const notesTextarea = document.getElementById('notes');
const markVerifiedBtn = document.getElementById('markVerified');
const reportDiscrepancyBtn = document.getElementById('reportDiscrepancy');
const statusIndicator = document.getElementById('statusIndicator');
const fileUploadInput = document.getElementById('photoEvidence');
const fileUploadArea = document.getElementById('fileUploadArea');
const filePreview = document.getElementById('filePreview');

// Expandable Item Details Elements
const itemSummary = document.getElementById('itemSummary');
const itemDetailsExpanded = document.getElementById('itemDetailsExpanded');
const expandButton = document.getElementById('expandButton');
const collapseButton = document.getElementById('collapseButton');

// Photo Elements
const photoButton = document.getElementById('photoButton');
const itemPhotoExpanded = document.getElementById('itemPhotoExpanded');
const collapsePhotoButton = document.getElementById('collapsePhotoButton');

// Checkbox Elements
const selectAllCheckbox = document.getElementById('selectAll');
const itemCheckboxes = document.querySelectorAll('.item-checkbox:not(#selectAll)');
const verifiedNumberElement = document.querySelector('.verified-number');

// State
let uploadedFiles = [];
let currentAction = null;
let verifiedItemsCount = 0;
let totalItemsCount = 5; // Total number of items
let locationStatuses = {
    'FRC North Island': 'pending'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateStatus('pending', '#f59e0b');
    updateVerificationCount();
});

// Event Listeners
function initializeEventListeners() {
    // Physical count input (now readonly)
    physicalCountInput1.addEventListener('input', validateForm);
    
    // Notes textarea
    notesTextarea.addEventListener('input', validateForm);
    
    // Action buttons
    markVerifiedBtn.addEventListener('click', () => handleAction('markVerified'));
    reportDiscrepancyBtn.addEventListener('click', () => handleAction('reportDiscrepancy'));
    
    // File upload
    fileUploadInput.addEventListener('change', handleFileUpload);
    fileUploadArea.addEventListener('click', () => fileUploadInput.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('drop', handleDrop);
    
    // Expandable item details
    itemSummary.addEventListener('click', toggleItemDetails);
    expandButton.addEventListener('click', toggleItemDetails);
    collapseButton.addEventListener('click', toggleItemDetails);
    
    // Photo functionality
    photoButton.addEventListener('click', togglePhoto);
    collapsePhotoButton.addEventListener('click', togglePhoto);
    
    // Checkbox functionality
    selectAllCheckbox.addEventListener('change', handleSelectAll);
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleItemCheckbox);
    });
}

// Checkbox Functions
function handleSelectAll(e) {
    const isChecked = e.target.checked;
    
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    verifiedItemsCount = isChecked ? totalItemsCount : 0;
    updateVerificationCount();
    validateForm();
}

function handleItemCheckbox(e) {
    const isChecked = e.target.checked;
    
    if (isChecked) {
        verifiedItemsCount++;
    } else {
        verifiedItemsCount--;
    }
    
    // Update select all checkbox
    const checkedCount = document.querySelectorAll('.item-checkbox:not(#selectAll):checked').length;
    selectAllCheckbox.checked = checkedCount === totalItemsCount;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalItemsCount;
    
    updateVerificationCount();
    validateForm();
}

function updateVerificationCount() {
    verifiedNumberElement.textContent = verifiedItemsCount;
    physicalCountInput1.value = verifiedItemsCount;
}

// Expandable Item Details Functions
function toggleItemDetails(e) {
    e.stopPropagation();
    
    const isExpanded = itemDetailsExpanded.style.display !== 'none';
    
    if (isExpanded) {
        // Collapse
        itemDetailsExpanded.style.display = 'none';
        expandButton.classList.remove('expanded');
        expandButton.innerHTML = '<i class="fas fa-chevron-down"></i><span>View Details</span>';
    } else {
        // Expand
        itemDetailsExpanded.style.display = 'block';
        expandButton.classList.add('expanded');
        expandButton.innerHTML = '<i class="fas fa-chevron-up"></i><span>Hide Details</span>';
    }
}

// Photo Toggle Function
function togglePhoto(e) {
    e.stopPropagation();
    
    const isExpanded = itemPhotoExpanded.style.display !== 'none';
    
    if (isExpanded) {
        // Collapse
        itemPhotoExpanded.style.display = 'none';
        photoButton.classList.remove('expanded', 'showing');
        photoButton.innerHTML = '<i class="fas fa-image"></i><span>Show Photo</span>';
    } else {
        // Expand
        itemPhotoExpanded.style.display = 'block';
        photoButton.classList.add('expanded', 'showing');
        photoButton.innerHTML = '<i class="fas fa-image"></i><span>Hide Photo</span>';
    }
}

// Form Validation
function validateForm() {
    const notes = notesTextarea.value.trim();
    const erpCountElement = document.getElementById('erpCount');
    const erpCount = erpCountElement ? parseInt(erpCountElement.textContent) : 5; // Default to 5 if not found

    let isValid = true;

    // Validate that at least one item is verified
    if (verifiedItemsCount === 0) {
        isValid = false;
        physicalCountInput1.style.borderColor = '#e53e3e';
    } else {
        physicalCountInput1.style.borderColor = '#48bb78';
    }

    // Validate notes (optional but recommended)
    if (!notes) {
        notesTextarea.style.borderColor = '#f59e0b'; // Navy gold for warning
    } else {
        notesTextarea.style.borderColor = '#e2e8f0';
    }

    // Update button states based on verified count and ERP comparison
    if (verifiedItemsCount > 0) {
        // Enable "Mark Verified" button if verified count equals ERP count
        if (verifiedItemsCount === erpCount) {
            markVerifiedBtn.disabled = false;
            markVerifiedBtn.style.opacity = '1';
            reportDiscrepancyBtn.disabled = true;
            reportDiscrepancyBtn.style.opacity = '0.5';
        } else {
            // Enable "Report Discrepancies" button if counts don't match
            markVerifiedBtn.disabled = true;
            markVerifiedBtn.style.opacity = '0.5';
            reportDiscrepancyBtn.disabled = false;
            reportDiscrepancyBtn.style.opacity = '1';
        }
    } else {
        // Disable both buttons if no items verified
        markVerifiedBtn.disabled = true;
        markVerifiedBtn.style.opacity = '0.5';
        reportDiscrepancyBtn.disabled = true;
        reportDiscrepancyBtn.style.opacity = '0.5';
    }

    return isValid;
}

// Action Handlers
function handleAction(action) {
    currentAction = action;
    
    let modalTitle, modalMessage;
    const erpCountElement = document.getElementById('erpCount');
    const erpCount = erpCountElement ? parseInt(erpCountElement.textContent) : 5;
    
    if (action === 'markVerified') {
        modalTitle = 'Confirm Verification';
        modalMessage = `Are you sure you want to mark FRC North Island as verified? This will confirm that ${verifiedItemsCount} items have been verified.`;
    } else if (action === 'reportDiscrepancy') {
        modalTitle = 'Report Discrepancy';
        modalMessage = `Are you sure you want to report a discrepancy? Verified count (${verifiedItemsCount}) does not match ERP count (${erpCount}).`;
    }
    
    showConfirmationModal(modalTitle, modalMessage);
}

// Modal Functions
function showConfirmationModal(title, message) {
    const modal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
}

function hideConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('show');
}

// Modal Event Listeners
document.getElementById('closeModal').addEventListener('click', hideConfirmationModal);
document.getElementById('cancelAction').addEventListener('click', hideConfirmationModal);
document.getElementById('confirmAction').addEventListener('click', executeAction);

// Execute Action
function executeAction() {
    hideConfirmationModal();
    
    if (currentAction === 'markVerified') {
        handleVerificationSuccess();
    } else if (currentAction === 'reportDiscrepancy') {
        handleDiscrepancyReport();
    }
}

// Success Handlers
function handleVerificationSuccess() {
    updateStatus('verified', '#38a169');
    locationStatuses['FRC North Island'] = 'verified';
    
    showNotification('Location verified successfully!', 'success');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Records updated in Navy ERP system', 'info');
    }, 1000);
}

function handleDiscrepancyReport() {
    updateStatus('discrepancy', '#e53e3e');
    locationStatuses['FRC North Island'] = 'discrepancy';
    
    showNotification('Discrepancy reported successfully!', 'warning');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Discrepancy logged for investigation', 'info');
    }, 1000);
}

// Status Update
function updateStatus(status, color) {
    const statusContent = statusIndicator.querySelector('.status-content');
    const icon = statusContent.querySelector('i');
    const text = statusContent.querySelector('span');
    
    icon.style.color = color;
    
    switch (status) {
        case 'pending':
            text.textContent = 'Task Pending Verification';
            break;
        case 'verified':
            text.textContent = 'Location Verified Successfully';
            break;
        case 'discrepancy':
            text.textContent = 'Discrepancy Reported';
            break;
    }
}

// File Upload Functions
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (validateFile(file)) {
            uploadedFiles.push(file);
            displayFilePreview(file);
        }
    });
}

function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#1e3a8a';
    fileUploadArea.style.background = '#ebf8ff';
}

function handleDrop(e) {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#cbd5e0';
    fileUploadArea.style.background = '#f7fafc';
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
        if (validateFile(file)) {
            uploadedFiles.push(file);
            displayFilePreview(file);
        }
    });
}

function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
        showNotification('File too large. Maximum size is 10MB.', 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload JPG, PNG, or GIF images.', 'error');
        return false;
    }
    
    return true;
}

function displayFilePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewItem = document.createElement('div');
        previewItem.className = 'file-preview-item';
        previewItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <span>${file.name}</span>
            <button onclick="removeFile(this)" class="remove-file">
                <i class="fas fa-times"></i>
            </button>
        `;
        filePreview.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
}

function removeFile(button) {
    const previewItem = button.parentElement;
    const fileName = previewItem.querySelector('span').textContent;
    
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    previewItem.remove();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Export functions for global access
window.removeFile = removeFile; 