// Global variables
let variableData = null;
let isInitialized = false;

// DOM elements
const statusElement = document.getElementById('status');
const variableDisplay = document.getElementById('variableDisplay');

// Debug logging function
function debugLog(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    if (data) {
        console.log(`[${timestamp}] DEBUG: ${message}`, data);
    } else {
        console.log(`[${timestamp}] DEBUG: ${message}`);
    }
}

// Update status display
function updateStatus(message, type = 'loading') {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    debugLog(`Status updated: ${message} (${type})`);
}

// Update variable display
function updateVariableDisplay(data) {
    if (data) {
        try {
            // Try to format as JSON if it's a string
            if (typeof data === 'string') {
                const parsed = JSON.parse(data);
                variableDisplay.textContent = JSON.stringify(parsed, null, 2);
            } else {
                variableDisplay.textContent = JSON.stringify(data, null, 2);
            }
            debugLog("Variable display updated with formatted data");
        } catch (e) {
            // If it's not JSON, display as-is
            variableDisplay.textContent = String(data);
            debugLog("Variable display updated with raw data");
        }
    } else {
        variableDisplay.textContent = "No data available";
        debugLog("Variable display updated - no data");
    }
}

// Initialize the application
async function init() {
    try {
        debugLog("Starting initialization...");
        updateStatus("Initializing...", "loading");
        
        // Check if UiPath App is available
        if (typeof App === 'undefined') {
            throw new Error("UiPath App object not available");
        }
        
        debugLog("UiPath App object found");
        updateStatus("Connecting to UiPath...", "loading");
        
        // Get the variable (change 'auditdata' to your actual variable name)
        const data = await App.getVariable('auditdata');
        debugLog("Received data from UiPath:", data);
        
        // Store the data
        variableData = data;
        isInitialized = true;
        
        // Update display
        updateVariableDisplay(data);
        updateStatus("Data loaded successfully", "success");
        
        debugLog("Initialization complete");
        
    } catch (e) {
        debugLog("Initialization failed:", e);
        updateStatus(`Error: ${e.message}`, "error");
        updateVariableDisplay(null);
    }
}

// Test variable access
window.testVariable = async function() {
    debugLog("Testing UiPath variable access...");
    try {
        const testValue = await App.getVariable('auditdata');
        debugLog("Variable test successful:", testValue);
        updateStatus("Variable test successful", "success");
        return testValue;
    } catch (e) {
        debugLog("Variable test failed:", e);
        updateStatus(`Variable test failed: ${e.message}`, "error");
        return null;
    }
};

// Refresh data
window.refreshData = async function() {
    debugLog("Refreshing data...");
    updateStatus("Refreshing data...", "loading");
    await init();
};

// Refresh UiPath variable
window.refreshVariable = async function() {
    debugLog("Refreshing UiPath variable...");
    updateStatus("Refreshing variable...", "loading");
    
    try {
        // Get fresh data from UiPath
        const data = await App.getVariable('auditdata');
        debugLog("Refreshed data received:", data);
        
        // Update display with new data
        updateVariableDisplay(data);
        updateStatus("Variable refreshed successfully", "success");
        
        // Store the refreshed data
        variableData = data;
        
    } catch (e) {
        debugLog("Error refreshing variable:", e);
        updateStatus(`Error refreshing variable: ${e.message}`, "error");
    }
};

// Check status
window.checkStatus = function() {
    debugLog("Checking status...");
    debugLog("UiPath App available:", typeof App !== 'undefined');
    debugLog("Variable data:", variableData);
    debugLog("Is initialized:", isInitialized);
    debugLog("Status element:", statusElement.textContent);
    debugLog("Display content length:", variableDisplay.textContent.length);
};

// Clear console
window.clearConsole = function() {
    console.clear();
    debugLog("Console cleared");
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debugLog("DOM Content Loaded - starting initialization");
    
    // Use the registerListeners pattern for UiPath
    async function registerListeners() {
        try {
            debugLog("Setting up UiPath variable listeners...");
            
            // Register listener for variable changes
            App.onVariableChange('auditdata', value => {
                debugLog("Variable changed, reinitializing...");
                init();
            });
            
            // Get initial data
            const data = await App.getVariable('auditdata');
            debugLog("Initial data received:", data);
            
            if (data) {
                debugLog("Initial data exists, calling init()");
                init();
            } else {
                debugLog("No initial data available");
                updateStatus("No data available", "error");
            }
            
        } catch (e) {
            debugLog("Error in registerListeners:", e);
            updateStatus(`Error setting up listeners: ${e.message}`, "error");
        }
    }
    
    // Start the registration process
    registerListeners();
}); 