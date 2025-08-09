// DOM Elements - with null checks for UiPath compatibility
let physicalCountInput1, erpCountElement, notesTextarea;
let statusIndicator, fileUploadInput, fileUploadArea, filePreview;
let itemSummary, itemDetailsExpanded, expandButton, collapseButton;
let photoButton, itemPhotoExpanded, collapsePhotoButton;
let selectAllCheckbox, itemCheckboxes, verifiedNumberElement;

// State
let uploadedFiles = [];
let verifiedItemsCount = 0;
let totalItemsCount = 5; // Total number of items
let locationStatuses = {
    'FRC North Island': 'pending'
};

// UiPath Variable Communication
let uipathVariables = {
    notes: '',
    verifiedCount: 0
};

// Variable change listeners for deregistration
let notesChangeListener = null;
let verifiedCountChangeListener = null;

// Initialize DOM elements with error handling
function initializeDOMElements() {
    try {
        physicalCountInput1 = document.getElementById('physicalCount1');
        erpCountElement = document.getElementById('erpCount');
        notesTextarea = document.getElementById('notes');
        statusIndicator = document.getElementById('statusIndicator');
        fileUploadInput = document.getElementById('photoEvidence');
        fileUploadArea = document.getElementById('fileUploadArea');
        filePreview = document.getElementById('filePreview');
        
        // Expandable Item Details Elements
        itemSummary = document.getElementById('itemSummary');
        itemDetailsExpanded = document.getElementById('itemDetailsExpanded');
        expandButton = document.getElementById('expandButton');
        collapseButton = document.getElementById('collapseButton');
        
        // Photo Elements
        photoButton = document.getElementById('photoButton');
        itemPhotoExpanded = document.getElementById('itemPhotoExpanded');
        collapsePhotoButton = document.getElementById('collapsePhotoButton');
        
        // Checkbox Elements
        selectAllCheckbox = document.getElementById('selectAll');
        itemCheckboxes = document.querySelectorAll('.item-checkbox:not(#selectAll)');
        verifiedNumberElement = document.querySelector('.verified-number');
        
        console.log('DOM elements initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        return false;
    }
}

// Initialize the application with multiple fallback methods
function initializeApplication() {
    console.log('Initializing step2 application...');
    
    // Try multiple initialization methods for UiPath compatibility
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        initializeApp();
    }
    
    // Fallback: try again after a short delay
    setTimeout(() => {
        if (!document.body.querySelector('.main-card')) {
            console.log('Retrying initialization...');
            initializeApp();
        }
    }, 100);
    
    // Additional fallback for UiPath
    setTimeout(() => {
        if (!document.body.querySelector('.main-card')) {
            console.log('Final initialization attempt...');
            initializeApp();
        }
    }, 500);
}

function initializeApp() {
    console.log('Initializing step2 app...');
    
    if (!initializeDOMElements()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    try {
        initializeEventListeners();
        initializeUiPathVariableListeners();
        updateStatus('pending', '#f59e0b');
        updateVerificationCount();
        console.log('Step2 application initialized successfully');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

function initializeEventListeners() {
    try {
        // Physical count input (now readonly)
        if (physicalCountInput1) {
            physicalCountInput1.addEventListener('input', validateForm);
        }
        
        // Notes textarea - with UiPath variable communication
        if (notesTextarea) {
            notesTextarea.addEventListener('blur', handleNotesChange);
            notesTextarea.addEventListener('input', updateNotesVisualFeedback);
        }
        
        // File upload
        if (fileUploadInput) {
            fileUploadInput.addEventListener('change', handleFileUpload);
        }
        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', () => {
                if (fileUploadInput) fileUploadInput.click();
            });
            fileUploadArea.addEventListener('dragover', handleDragOver);
            fileUploadArea.addEventListener('drop', handleDrop);
        }
        
        // Expandable item details
        if (itemSummary) {
            itemSummary.addEventListener('click', toggleItemDetails);
        }
        if (expandButton) {
            expandButton.addEventListener('click', toggleItemDetails);
        }
        if (collapseButton) {
            collapseButton.addEventListener('click', toggleItemDetails);
        }
        
        // Photo functionality
        if (photoButton) {
            photoButton.addEventListener('click', togglePhoto);
        }
        if (collapsePhotoButton) {
            collapsePhotoButton.addEventListener('click', togglePhoto);
        }
        
        // Checkbox functionality
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', handleSelectAll);
        }
        if (itemCheckboxes && itemCheckboxes.length > 0) {
            itemCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleItemCheckbox);
            });
        }
        
        console.log('Event listeners initialized successfully');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// Initialize UiPath variable change listeners
function initializeUiPathVariableListeners() {
    try {
        // Check if we're in UiPath environment
        if (typeof App !== 'undefined' && App.onVariableChange) {
            // Listen for notes variable changes
            notesChangeListener = App.onVariableChange('notes', value => {
                console.log('Notes variable changed:', value);
                if (notesTextarea && notesTextarea.value !== value) {
                    notesTextarea.value = value || '';
                    uipathVariables.notes = value || '';
                    updateNotesVisualFeedback();
                }
            });
            
            // Listen for verifiedCount variable changes
            verifiedCountChangeListener = App.onVariableChange('verifiedCount', value => {
                console.log('VerifiedCount variable changed:', value);
                const newCount = parseInt(value) || 0;
                if (verifiedItemsCount !== newCount) {
                    verifiedItemsCount = newCount;
                    updateVerificationCount();
                    updateCheckboxesFromCount();
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
            // Get initial notes value
            const notesValue = await App.getVariable('notes');
            if (notesValue && notesTextarea) {
                notesTextarea.value = notesValue;
                uipathVariables.notes = notesValue;
                updateNotesVisualFeedback();
            }
            
            // Get initial verifiedCount value
            const verifiedCountValue = await App.getVariable('verifiedCount');
            if (verifiedCountValue !== null && verifiedCountValue !== undefined) {
                const count = parseInt(verifiedCountValue) || 0;
                verifiedItemsCount = count;
                updateVerificationCount();
                updateCheckboxesFromCount();
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

// Handle notes change when user finishes typing (on blur)
function handleNotesChange(e) {
    const notesValue = e.target.value.trim();
    uipathVariables.notes = notesValue;
    
    // Update UiPath variable when user finishes typing
    setVariable('notes', notesValue);
}

// Update notes visual feedback
function updateNotesVisualFeedback() {
    if (notesTextarea) {
        const notesValue = notesTextarea.value.trim();
        if (!notesValue) {
            notesTextarea.style.borderColor = '#f59e0b'; // Navy gold for warning
        } else {
            notesTextarea.style.borderColor = '#e2e8f0';
        }
    }
}

// Checkbox Functions
function handleSelectAll(e) {
    const isChecked = e.target.checked;
    
    if (itemCheckboxes && itemCheckboxes.length > 0) {
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }
    
    verifiedItemsCount = isChecked ? totalItemsCount : 0;
    updateVerificationCount();
    updateUiPathVerifiedCount();
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
    if (selectAllCheckbox && itemCheckboxes) {
        const checkedCount = document.querySelectorAll('.item-checkbox:not(#selectAll):checked').length;
        selectAllCheckbox.checked = checkedCount === totalItemsCount;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalItemsCount;
    }
    
    updateVerificationCount();
    updateUiPathVerifiedCount();
    validateForm();
}

// Update checkboxes based on verified count (for external variable changes)
function updateCheckboxesFromCount() {
    if (!itemCheckboxes || itemCheckboxes.length === 0) return;
    
    const targetCount = verifiedItemsCount;
    const currentCheckedCount = document.querySelectorAll('.item-checkbox:not(#selectAll):checked').length;
    
    if (targetCount === 0) {
        // Uncheck all items
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
    } else if (targetCount === totalItemsCount) {
        // Check all items
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        }
    } else {
        // Check first N items
        itemCheckboxes.forEach((checkbox, index) => {
            checkbox.checked = index < targetCount;
        });
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
}

function updateVerificationCount() {
    if (verifiedNumberElement) {
        verifiedNumberElement.textContent = verifiedItemsCount;
    }
    if (physicalCountInput1) {
        physicalCountInput1.value = verifiedItemsCount;
    }
}

// Update UiPath verifiedCount variable immediately
function updateUiPathVerifiedCount() {
    try {
        uipathVariables.verifiedCount = verifiedItemsCount;
        setVariable('verifiedCount', verifiedItemsCount);
        console.log(`Updated verified count: ${verifiedItemsCount}`);
    } catch (error) {
        console.error('Error updating UiPath verified count:', error);
    }
}

// Expandable Item Details Functions
function toggleItemDetails(e) {
    if (e) e.stopPropagation();
    
    if (!itemDetailsExpanded || !expandButton) {
        console.error('Required elements for toggle not found');
        return;
    }
    
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
    if (e) e.stopPropagation();
    
    if (!itemPhotoExpanded || !photoButton) {
        console.error('Required elements for photo toggle not found');
        return;
    }
    
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
    const notes = notesTextarea ? notesTextarea.value.trim() : '';
    const erpCountElement = document.getElementById('erpCount');
    const erpCount = erpCountElement ? parseInt(erpCountElement.textContent) : 5; // Default to 5 if not found

    let isValid = true;

    // Validate that at least one item is verified
    if (verifiedItemsCount === 0) {
        isValid = false;
        if (physicalCountInput1) {
            physicalCountInput1.style.borderColor = '#e53e3e';
        }
    } else {
        if (physicalCountInput1) {
            physicalCountInput1.style.borderColor = '#48bb78';
        }
    }

    // Validate notes (optional but recommended)
    if (!notes) {
        if (notesTextarea) {
            notesTextarea.style.borderColor = '#f59e0b'; // Navy gold for warning
        }
    } else {
        if (notesTextarea) {
            notesTextarea.style.borderColor = '#e2e8f0';
        }
    }

    return isValid;
}

// Status Update
function updateStatus(status, color) {
    if (!statusIndicator) {
        console.error('Status indicator not found');
        return;
    }
    
    const statusContent = statusIndicator.querySelector('.status-content');
    if (!statusContent) {
        console.error('Status content not found');
        return;
    }
    
    const icon = statusContent.querySelector('i');
    const text = statusContent.querySelector('span');
    
    if (icon) icon.style.color = color;
    
    if (text) {
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
    if (fileUploadArea) {
        fileUploadArea.style.borderColor = '#1e3a8a';
        fileUploadArea.style.background = '#ebf8ff';
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (fileUploadArea) {
        fileUploadArea.style.borderColor = '#cbd5e0';
        fileUploadArea.style.background = '#f7fafc';
    }
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
        if (validateFile(file)) {
            uploadedFiles.push(file);
            displayFilePreview(file);
        }
    });
}

function validateFile(file) {
    const maxSize = 1 * 1024 * 1024; // 1MB limit for UiPath compatibility
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
        showNotification('File too large. Maximum size is 1MB for UiPath compatibility.', 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload JPG, PNG, or GIF images.', 'error');
        return false;
    }
    
    return true;
}

function displayFilePreview(file) {
    if (!filePreview) {
        console.error('File preview element not found');
        return;
    }
    
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
    
    // Add inline styles for UiPath compatibility
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
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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
    if (notesChangeListener) {
        notesChangeListener();
        notesChangeListener = null;
    }
    if (verifiedCountChangeListener) {
        verifiedCountChangeListener();
        verifiedCountChangeListener = null;
    }
    console.log('Variable listeners cleaned up');
}

// Start the application
initializeApplication(); 