// Sample audit data
const initialAuditData = [
    {
        id: "MIPR-AI020-2025",
        issueType: "Missing Link",
        severity: "Critical",
        description: "The MIPR is not linked to any contract in the provided data.",
        recommendedAction: "Investigate why the MIPR is not associated with a contract and ensure proper linkage.",
        resolution: "Not Resolved",
        notes: ""
    },
    {
        id: "09ead760-4417-45cb-8754-1de973512ab8",
        issueType: "Anomaly",
        severity: "High",
        description: "The contract value ($56,813,981.44) does not match the total invoice amount ($482,437,376.56).",
        recommendedAction: "Review the contract and invoice details to resolve the discrepancy.",
        resolution: "In Progress",
        notes: ""
    },
    {
        id: "ca4a5e89-9b59-4c6e-9022-ca364f9232b6",
        issueType: "Anomaly",
        severity: "High",
        description: "The invoice total ($482,437,376.56) significantly exceeds the purchase order total ($15,827,239.50).",
        recommendedAction: "Verify the invoice and purchase order details for accuracy and compliance.",
        resolution: "Not Resolved",
        notes: ""
    },
    {
        id: "458d856c-6f1a-477b-bbd8-9d5d489f964f",
        issueType: "Missing Link",
        severity: "Medium",
        description: "The purchase order references MIPRs (MIPR-AR039-2025, MIPR-MA043-2025) not included in the provided data.",
        recommendedAction: "Locate the missing MIPRs and ensure they are properly documented.",
        resolution: "Resolved",
        notes: ""
    }
];

// Global variables
let auditData = [...initialAuditData];
let filteredData = [...auditData];
let currentIssue = null;

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
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    setupEventListeners();
});

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
}

// Filter data based on search and filters
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const severityValue = severityFilter.value;
    const issueTypeValue = issueTypeFilter.value;
    const resolutionValue = resolutionFilter.value;
    
    filteredData = auditData.filter(item => {
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
    
    resultsCount.textContent = `Showing ${filteredData.length} of ${auditData.length} audit findings`;
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
                <select class="resolution-select ${resolutionBadgeClass}" onchange="updateResolution('${item.id}', this.value)">
                    <option value="Resolved" ${item.resolution === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    <option value="Not Resolved" ${item.resolution === 'Not Resolved' ? 'selected' : ''}>Not Resolved</option>
                    <option value="In Progress" ${item.resolution === 'In Progress' ? 'selected' : ''}>In Progress</option>
                </select>
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
function updateResolution(id, newResolution) {
    const item = auditData.find(item => item.id === id);
    if (item) {
        item.resolution = newResolution;
        // Update the filtered data as well
        const filteredItem = filteredData.find(item => item.id === id);
        if (filteredItem) {
            filteredItem.resolution = newResolution;
        }
        renderTable();
    }
}

// Open modal with issue details
function openModal(id) {
    currentIssue = auditData.find(item => item.id === id);
    if (currentIssue) {
        document.getElementById('modalId').textContent = currentIssue.id;
        document.getElementById('modalIssueType').textContent = currentIssue.issueType;
        document.getElementById('modalSeverity').innerHTML = `<span class="badge ${getSeverityBadgeClass(currentIssue.severity)}">${currentIssue.severity}</span>`;
        document.getElementById('modalDescription').textContent = currentIssue.description;
        document.getElementById('modalRecommendedAction').textContent = currentIssue.recommendedAction;
        document.getElementById('modalResolution').value = currentIssue.resolution;
        document.getElementById('modalNotes').value = currentIssue.notes || '';
        
        modal.style.display = 'block';
    }
}

// Close modal
function closeModalHandler() {
    modal.style.display = 'none';
    if (currentIssue) {
        // Save notes when closing modal
        const notes = document.getElementById('modalNotes').value;
        currentIssue.notes = notes;
        
        // Update the main data
        const item = auditData.find(item => item.id === currentIssue.id);
        if (item) {
            item.notes = notes;
        }
        
        // Update filtered data
        const filteredItem = filteredData.find(item => item.id === currentIssue.id);
        if (filteredItem) {
            filteredItem.notes = notes;
        }
        
        currentIssue = null;
    }
}

// Handle modal resolution change
document.getElementById('modalResolution').addEventListener('change', function() {
    if (currentIssue) {
        const newResolution = this.value;
        currentIssue.resolution = newResolution;
        
        // Update the main data
        const item = auditData.find(item => item.id === currentIssue.id);
        if (item) {
            item.resolution = newResolution;
        }
        
        // Update filtered data
        const filteredItem = filteredData.find(item => item.id === currentIssue.id);
        if (filteredItem) {
            filteredItem.resolution = newResolution;
        }
        
        // Re-render the table to reflect changes
        renderTable();
    }
});

// Export data functionality (optional)
function exportData() {
    const dataStr = JSON.stringify(auditData, null, 2);
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
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                auditData = importedData;
                filterData();
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
} 