// Global variables
let auditData = null;

// DOM elements
const auditDataDisplay = document.getElementById('auditDataDisplay');

// Update display function
function updateDisplay(data) {
    if (data) {
        try {
            // Handle double-escaped JSON strings from UiPath
            let displayData = String(data);
            
            // // If it looks like a JSON string, try to parse and format it
            // if (displayData.startsWith('"') && displayData.endsWith('"')) {
            //     // Remove outer quotes and parse
            //     const unquoted = displayData.slice(1, -1);
            //     const parsed = JSON.parse(unquoted);
            //     displayData = JSON.stringify(parsed, null, 2);
            // }
            
            auditDataDisplay.value = displayData;
        } catch (e) {
            // If parsing fails, display as-is
            auditDataDisplay.value = String(data);
        }
    } else {
        auditDataDisplay.value = "No data available";
    }
}

// Initialize function
async function init() {
    try {
        // Get the auditData variable
        const data = await App.getVariable('auditData');
        
        // Store the data
        auditData = data;
        
        // Update display
        updateDisplay(data);
        
    } catch (e) {
        console.log("Error initializing:", e);
        updateDisplay(null);
    }
}

// Register listeners function
async function registerListeners() {
    App.onVariableChange('auditData', value => {
        init();
    });
    
    const data = await App.getVariable('auditData');
    if (data) {
        init();
    }
}

// Initialize when DOM is loaded

    registerListeners();

 