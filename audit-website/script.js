// Global variables
let localauditData = [];
let filteredData = [];
let currentIssue = null;
let deregisterauditData = null;

// Testing boolean - set to true to use dummy data in previews
const USE_DUMMY_DATA = false;

// Dummy data for fallback
const dummyData = [
    {
        id: "MIPR-AI020-2025",
        issueType: "Missing Link",
        severity: "Critical",
        description: "The MIPR is not linked to any contract in the provided data.",
        recommendedAction: "Investigate why the MIPR is not associated with a contract and ensure proper linkage.",
        resolution: "Not Resolved",
        resolutionAction: "",
        complete: "",
        notes: ""
    },
    {
        id: "09ead760-4417-45cb-8754-1de973512ab8",
        issueType: "Anomaly",
        severity: "High",
        description: "The contract value ($56,813,981.44) does not match the total invoice amount ($482,437,376.56).",
        recommendedAction: "Review the contract and invoice details to resolve the discrepancy.",
        resolution: "In Progress",
        resolutionAction: "",
        complete: "",
        notes: ""
    },
    {
        id: "ca4a5e89-9b59-4c6e-9022-ca364f9232b6",
        issueType: "Anomaly",
        severity: "High",
        description: "The invoice total ($482,437,376.56) significantly exceeds the purchase order total ($15,827,239.50).",
        recommendedAction: "Verify the invoice and purchase order details for accuracy and compliance.",
        resolution: "Not Resolved",
        resolutionAction: "",
        complete: "",
        notes: ""
    },
    {
        id: "458d856c-6f1a-477b-bbd8-9d5d489f964f",
        issueType: "Missing Link",
        severity: "Medium",
        description: "The purchase order references MIPRs (MIPR-AR039-2025, MIPR-MA043-2025) not included in the provided data.",
        recommendedAction: "Locate the missing MIPRs and ensure they are properly documented.",
        resolution: "Resolved",
        resolutionAction: "",
        complete: "",
        notes: ""
    }
];

// DOM elements
const searchInput = document.getElementById('searchInput');
const severityFilter = document.getElementById('severityFilter');
const issueTypeFilter = document.getElementById('issueTypeFilter');
const resolutionFilter = document.getElementById('resolutionFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const tableBody = document.getElementById('tableBody');
const resultsCount = document.getElementById('resultsCount');
const modal = document.getElementById('issueModal');
const closeModal = document.querySelector('.close');



// Initialize the application
async function init() {
    try {
        // If testing mode is enabled, use dummy data
        if (USE_DUMMY_DATA) {
            localauditData = dummyData;
            filteredData = [...localauditData];
            renderTable();
            setupEventListeners();
            return;
        }
        
        // Check if UiPath App object is available
        if (typeof App === 'undefined') {
            throw new Error("UiPath App object not available");
        }
        
        // Get audit data from UiPath variable (as string)
        const initialDataString = await App.getVariable('auditData');
        
        // Parse the string data or use dummy data if empty/invalid
        if (initialDataString && initialDataString.trim() !== '') {
            try {
                const parsedData = JSON.parse(initialDataString);
                localauditData = Array.isArray(parsedData) ? parsedData : dummyData;
            } catch (parseError) {
                localauditData = dummyData;
            }
        } else {
            localauditData = dummyData;
        }
        
        filteredData = [...localauditData];
        
        // Render the table with the loaded data
        renderTable();
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (e) {
        // Fallback to dummy data if variable doesn't exist or other error
        localauditData = dummyData;
        filteredData = [...localauditData];
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
        App.onVariableChange('auditData', value => {
            init();
        });
        
        const data = await App.getVariable('auditData');
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
    severityFilter.addEventListener('change', filterData);
    issueTypeFilter.addEventListener('change', filterData);
    resolutionFilter.addEventListener('change', filterData);
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Modal functionality
    closeModal.addEventListener('click', closeModalHandler);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalHandler();
        }
    });
    
    // Form submission
    document.getElementById('issueForm').addEventListener('submit', handleFormSubmission);
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    
    console.log('Form submission started');
    
    if (!currentIssue) {
        console.error('No current issue found');
        return;
    }
    
    const resolutionAction = document.getElementById('modalResolutionAction').value;
    const complete = document.getElementById('modalComplete').value;
    const notes = document.getElementById('modalNotes').value;
    
    console.log('Form values:', { resolutionAction, complete, notes });
    
    // Validate required fields
    if (!resolutionAction || !complete) {
        alert('Please fill in all required fields (Resolution Action and Complete?)');
        console.log('Validation failed - missing required fields');
        return;
    }
    
    console.log('Validation passed, updating data...');
    
    // Update the current issue
    currentIssue.resolutionAction = resolutionAction;
    currentIssue.complete = complete;
    currentIssue.notes = notes;
    
    // Update resolution based on completion status
    if (complete === 'Yes') {
        currentIssue.resolution = 'Resolved';
    } else if (complete === 'No') {
        currentIssue.resolution = 'Not Resolved';
    } else if (complete === 'In Progress') {
        currentIssue.resolution = 'In Progress';
    }
    
    console.log('Updated current issue:', currentIssue);
    
    // Update the main data
    const item = localauditData.find(item => item.id === currentIssue.id);
    if (item) {
        item.resolutionAction = resolutionAction;
        item.complete = complete;
        item.notes = notes;
        item.resolution = currentIssue.resolution;
        console.log('Updated main data item:', item);
    }
    
    // Update filtered data
    const filteredItem = filteredData.find(item => item.id === currentIssue.id);
    if (filteredItem) {
        filteredItem.resolutionAction = resolutionAction;
        filteredItem.complete = complete;
        filteredItem.notes = notes;
        filteredItem.resolution = currentIssue.resolution;
        console.log('Updated filtered data item:', filteredItem);
    }
    
    // Update UiPath variable (only if not in testing mode)
    if (!USE_DUMMY_DATA) {
        try {
            await App.setVariable('auditData', JSON.stringify(localauditData));
            console.log('Updated UiPath variable');
        } catch (e) {
            console.error("Error updating audit data variable:", e);
        }
    } else {
        console.log('Testing mode - skipping UiPath variable update');
    }
    
    // Re-render the table to reflect changes
    renderTable();
    console.log('Table re-rendered');
    
    // Close the modal
    closeModalHandler();
    console.log('Modal closed');
}

// Filter data based on search and filters
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const severityValue = severityFilter.value;
    const issueTypeValue = issueTypeFilter.value;
    const resolutionValue = resolutionFilter.value;
    
    filteredData = localauditData.filter(item => {
        const matchesSearch = 
            item.id.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm);
        
        const matchesSeverity = !severityValue || item.severity === severityValue;
        const matchesIssueType = !issueTypeValue || item.issueType === issueTypeValue;
        const matchesResolution = !resolutionValue || item.resolution === resolutionValue;
        
        return matchesSearch && matchesSeverity && matchesIssueType && matchesResolution;
    });
    
    renderTable();
    updateClearFiltersButton();
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    severityFilter.value = '';
    issueTypeFilter.value = '';
    resolutionFilter.value = '';
    filterData();
}

// Update clear filters button visibility
function updateClearFiltersButton() {
    const hasActiveFilters = 
        searchInput.value || 
        severityFilter.value || 
        issueTypeFilter.value || 
        resolutionFilter.value;
    
    clearFiltersBtn.style.display = hasActiveFilters ? 'block' : 'none';
}

// Render the table
function renderTable() {
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No audit findings match your criteria</p>
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = filteredData.map(item => createTableRow(item)).join('');
    }
    
    resultsCount.textContent = `Showing ${filteredData.length} of ${localauditData.length} audit findings`;
}

// Create a table row
function createTableRow(item) {
    const severityBadgeClass = getSeverityBadgeClass(item.severity);
    const resolutionBadgeClass = getResolutionBadgeClass(item.resolution);
    
    return `
        <tr>
            <td class="font-medium">${item.id}</td>
            <td>${item.issueType}</td>
            <td>
                <span class="badge ${severityBadgeClass}">${item.severity}</span>
            </td>
            <td class="hidden-mobile truncate">${item.description}</td>
            <td class="hidden-desktop truncate">${item.recommendedAction}</td>
            <td>
                <span class="resolution-display ${resolutionBadgeClass}">${item.resolution}</span>
            </td>
            <td>
                <button class="btn btn-sm" onclick="openModal('${item.id}')">View</button>
            </td>
        </tr>
    `;
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
        default:
            return 'badge-medium';
    }
}

// Get resolution badge class
function getResolutionBadgeClass(resolution) {
    switch (resolution) {
        case 'Resolved':
            return 'badge-resolved';
        case 'Not Resolved':
            return 'badge-not-resolved';
        case 'In Progress':
            return 'badge-in-progress';
        default:
            return 'badge-not-resolved';
    }
}

// Update resolution
async function updateResolution(id, newResolution) {
    const item = localauditData.find(item => item.id === id);
    if (item) {
        item.resolution = newResolution;
        // Update the filtered data as well
        const filteredItem = filteredData.find(item => item.id === id);
        if (filteredItem) {
            filteredItem.resolution = newResolution;
        }
        
        // Update UiPath variable (following UiPath best practices)
        try {
            await App.setVariable('auditData', JSON.stringify(localauditData));
        } catch (e) {
            console.error("Error updating audit data variable:", e);
        }
        
        renderTable();
    }
}

// Open modal with issue details
function openModal(id) {
    console.log('Opening modal for issue:', id);
    currentIssue = localauditData.find(item => item.id === id);
    if (currentIssue) {
        console.log('Found current issue:', currentIssue);
        document.getElementById('modalId').textContent = currentIssue.id;
        document.getElementById('modalIssueType').textContent = currentIssue.issueType;
        document.getElementById('modalSeverity').innerHTML = `<span class="badge ${getSeverityBadgeClass(currentIssue.severity)}">${currentIssue.severity}</span>`;
        document.getElementById('modalDescription').textContent = currentIssue.description;
        document.getElementById('modalRecommendedAction').textContent = currentIssue.recommendedAction;
        document.getElementById('modalResolutionAction').value = currentIssue.resolutionAction || '';
        document.getElementById('modalComplete').value = currentIssue.complete || '';
        document.getElementById('modalNotes').value = currentIssue.notes || '';
        
        modal.style.display = 'block';
        console.log('Modal opened successfully');
    } else {
        console.error('Issue not found:', id);
    }
}

// Close modal
async function closeModalHandler() {
    modal.style.display = 'none';
    if (currentIssue) {
        // Save notes when closing modal
        const notes = document.getElementById('modalNotes').value;
        currentIssue.notes = notes;
        
        // Update the main data
        const item = localauditData.find(item => item.id === currentIssue.id);
        if (item) {
            item.notes = notes;
        }
        
        // Update filtered data
        const filteredItem = filteredData.find(item => item.id === currentIssue.id);
        if (filteredItem) {
            filteredItem.notes = notes;
        }
        
        // Update UiPath variable (only if not in testing mode)
        if (!USE_DUMMY_DATA) {
            try {
                await App.setVariable('auditData', JSON.stringify(localauditData));
            } catch (e) {
                console.error("Error updating audit data variable:", e);
            }
        }
        
        currentIssue = null;
    }
}

// Export data functionality (optional)
function exportData() {
    const dataStr = JSON.stringify(localauditData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-data.json';
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
                localauditData = importedData;
                filteredData = [...localauditData];
                
                // Update UiPath variable (following UiPath best practices)
                try {
                    await App.setVariable('auditData', JSON.stringify(localauditData));
                } catch (e) {
                    console.error("Error updating audit data variable:", e);
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
    if (deregisterauditData) {
        deregisterauditData();
    }
}

// Cleanup on page unload (following UiPath best practices)
window.addEventListener('beforeunload', cleanup);

// Refresh audit data from UiPath
window.refreshAuditData = async function() {
    try {
        // If testing mode is enabled, use dummy data
        if (USE_DUMMY_DATA) {
            localauditData = dummyData;
            filteredData = [...localauditData];
            renderTable();
            return;
        }
        
        // Get fresh data from UiPath
        const freshData = await App.getVariable('auditData');
        
        // Parse the fresh data
        if (freshData && freshData.trim() !== '') {
            try {
                const parsedData = JSON.parse(freshData);
                localauditData = Array.isArray(parsedData) ? parsedData : dummyData;
            } catch (parseError) {
                localauditData = dummyData;
            }
        } else {
            localauditData = dummyData;
        }
        
        // Update filtered data and re-render
        filteredData = [...localauditData];
        renderTable();
        
    } catch (e) {
        // Fallback to dummy data
        localauditData = dummyData;
        filteredData = [...localauditData];
        renderTable();
    }
}; 