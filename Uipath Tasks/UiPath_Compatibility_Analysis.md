# UiPath Custom HTML Component - Quick Start Guide

## What This Is
A simplified guide for building UiPath Custom HTML components that actually work.

## Key Rules (Don't Break These)

### 1. **File Size Limit: 1MB MAX**
- All file uploads must be under 1MB
- UiPath will fail silently if you exceed this

### 2. **No Browser APIs**
These will fail silently in UiPath:
- `window.alert()`, `window.confirm()`, `window.print()`
- `navigator.geolocation()`
- `navigator.share()`
- `requestFullscreen()`

### 3. **HTML Structure**
- Don't use `<html>` or `<head>` tags
- UiPath automatically adds them
- Start with `<body>` content only

## Essential Code Patterns

### DOM Element Access (Always Safe)
```javascript
// WRONG - Will crash if element doesn't exist
const element = document.getElementById('myElement');
element.addEventListener('click', handler);

// RIGHT - Safe for UiPath
function initializeElements() {
    const element = document.getElementById('myElement');
    if (element) {
        element.addEventListener('click', handler);
    }
}
```

### Event Listeners (Always Check First)
```javascript
function setupEventListeners() {
    const button = document.getElementById('submitBtn');
    if (button) {
        button.addEventListener('click', handleSubmit);
    }
}
```

### File Upload (With Size Check)
```javascript
function handleFileUpload(file) {
    // UiPath requirement: 1MB max
    if (file.size > 1024 * 1024) {
        showMessage('File too large. Max size: 1MB');
        return false;
    }
    
    // Process file here
    console.log('File accepted:', file.name);
}
```

### Custom Alerts (Replace Browser APIs)
```javascript
function showMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(alertDiv);
}
```

## UiPath Variable Communication

### Robust Variable Communication Pattern
```javascript
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
```

### Bidirectional Variable Communication
```javascript
// Initialize UiPath variable change listeners
function initializeUiPathVariableListeners() {
    try {
        // Check if we're in UiPath environment
        if (typeof App !== 'undefined' && App.onVariableChange) {
            // Listen for variable changes from UiPath
            App.onVariableChange('conditionCode', value => {
                console.log('ConditionCode variable changed:', value);
                if (elements.conditionCode && elements.conditionCode.value !== value) {
                    elements.conditionCode.value = value || '';
                    updateConditionCodeDescription();
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
            // Get initial values for all form fields
            const conditionCodeValue = await App.getVariable('conditionCode');
            if (conditionCodeValue && elements.conditionCode) {
                elements.conditionCode.value = conditionCodeValue;
                updateConditionCodeDescription();
            }
            
            // Update calculated values after setting initial values
            updateCalculatedNRV();
            
            console.log('Initial variable values retrieved from UiPath');
        }
    } catch (error) {
        console.error('Error getting initial variable values:', error);
    }
}
```

### Smart Event Handling for Different Input Types
```javascript
function setupEventListeners() {
    // Dropdown/Select - Update immediately on change
    elements.conditionCode.addEventListener('change', function() {
        updateConditionCodeDescription();
        setVariable('conditionCode', elements.conditionCode.value);
    });

    // Number inputs - Update on every keystroke for real-time calculation
    elements.scrapAdjustment.addEventListener('input', function() {
        updateCalculatedNRV();
        setVariable('scrapAdjustment', elements.scrapAdjustment.value);
    });

    // Text areas - Update only when user finishes typing (on blur)
    elements.reviewComments.addEventListener('blur', function(e) {
        const commentsValue = e.target.value.trim();
        setVariable('reviewComments', commentsValue);
    });

    // Decision buttons - Set single decision variable
    elements.approveBtn.addEventListener('click', function() {
        showConfirmationModal('Approve NRV Adjustment', 
            'Are you sure you want to approve this NRV adjustment?', 
            'approve');
    });
}

// Process review decision
function processReviewDecision(action) {
    // Set the decision variable for UiPath
    setVariable('reviewDecision', action);
    
    // Continue with processing...
}
```

## CSS Requirements

### Z-Index (Important for Modals)
```css
.modal {
    z-index: 9999;
}

.notification {
    z-index: 10000;
}
```

### Touch Targets (For Mobile/iFrame)
```css
.button {
    min-height: 44px;
    min-width: 44px;
}
```

## Robust Initialization Pattern

### Multi-Fallback Initialization (Recommended)
```javascript
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
    console.log('Initializing app...');
    
    if (!initializeElements()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    try {
        setupEventListeners();
        setupFileUpload();
        updateCalculatedValues();
        initializeUiPathVariableListeners();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

// Initialize DOM elements with error handling
function initializeElements() {
    try {
        elements.conditionCode = document.getElementById('conditionCode');
        elements.scrapAdjustment = document.getElementById('scrapAdjustment');
        elements.disposalAdjustment = document.getElementById('disposalAdjustment');
        elements.reviewComments = document.getElementById('reviewComments');
        // ... other elements
        
        console.log('DOM elements initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        return false;
    }
}

// Start the application
initializeApplication();
```

### Event Listener Setup with Validation
```javascript
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
    if (!elements.reviewComments) {
        console.error('reviewComments element not found');
        return;
    }

    // Safe event listener attachment
    elements.conditionCode.addEventListener('change', function() {
        updateConditionCodeDescription();
        setVariable('conditionCode', elements.conditionCode.value);
    });

    // ... other event listeners
}
```

## Testing Checklist

### Before Deploying
- [ ] All file uploads check for 1MB limit
- [ ] No `window.alert()` or similar browser APIs
- [ ] All DOM elements checked before use
- [ ] Event listeners only attached to existing elements
- [ ] Z-index values set for modals/overlays
- [ ] Touch targets are 44px minimum
- [ ] **Variable communication properly implemented**
- [ ] **Bidirectional variable sync working**
- [ ] **Text inputs use blur events for performance**
- [ ] **Number inputs update in real-time**
- [ ] **Decision variables set on user actions**

### Variable Communication Testing
- [ ] Variables update when user interacts with form
- [ ] Variables sync from UiPath to web app
- [ ] Initial values load from UiPath on startup
- [ ] Console shows proper variable communication logs
- [ ] No infinite loops in variable change listeners
- [ ] Text areas only update on blur (not every keystroke)

### Debugging in UiPath
1. Open browser console (F12)
2. Check "Selected context only"
3. Select "html-control-base.html" from dropdown
4. Look for JavaScript errors
5. **Check for variable communication logs**
6. **Verify App.setVariable and App.getVariable calls**
7. **Test bidirectional variable sync**

## Common Mistakes to Avoid

### ❌ Don't Do This
```javascript
// Will crash if element doesn't exist
document.getElementById('button').addEventListener('click', handler);

// Will fail silently in UiPath
window.alert('Hello');

// Will cause issues if file is too large
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    // Process file without size check
});
```

### ✅ Do This Instead
```javascript
// Safe element access
const button = document.getElementById('button');
if (button) {
    button.addEventListener('click', handler);
}

// Custom alert for UiPath
showMessage('Hello');

// Safe file handling
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1024 * 1024) {
        // Process file
    } else {
        showMessage('File too large. Max: 1MB');
    }
});
```

## Quick Template

```html
<!-- Start with body content only -->
<div class="container">
    <h1>My UiPath Component</h1>
    <button id="actionBtn">Click Me</button>
    <div id="output"></div>
</div>

<script>
// Safe initialization
function init() {
    const button = document.getElementById('actionBtn');
    if (button) {
        button.addEventListener('click', handleClick);
    }
    
    // UiPath communication
    if (typeof App !== 'undefined') {
        App.onVariableChange('data', updateOutput);
    }
}

function handleClick() {
    const output = document.getElementById('output');
    if (output) {
        output.textContent = 'Button clicked!';
    }
}

function updateOutput(value) {
    const output = document.getElementById('output');
    if (output) {
        output.textContent = value;
    }
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
</script>
```

## Summary

### Core Requirements
1. **Always check if elements exist** before using them
2. **Never use browser APIs** that UiPath blocks
3. **Keep files under 1MB** for uploads
4. **Use proper z-index** for overlays
5. **Check for UiPath environment** before using App APIs
6. **Handle errors gracefully** with try-catch blocks

### Variable Communication Best Practices
7. **Implement bidirectional variable sync** using `App.onVariableChange()`
8. **Use smart event handling** - blur for text, input for numbers, change for dropdowns
9. **Set decision variables** on user actions (approve/reject/hold)
10. **Load initial values** from UiPath on startup
11. **Prevent infinite loops** by checking current values before updating
12. **Use robust initialization** with multiple fallback attempts

### Performance Optimizations
13. **Text areas update on blur** (not every keystroke) for better performance
14. **Number inputs update in real-time** for immediate calculations
15. **Dropdowns update immediately** on selection
16. **Console logging** for debugging variable communication

### Recent Improvements
- ✅ **Robust multi-fallback initialization** for UiPath compatibility
- ✅ **Bidirectional variable communication** with proper error handling
- ✅ **Smart event handling** optimized for different input types
- ✅ **Performance-optimized text input** using blur events
- ✅ **Comprehensive error handling** and logging

Follow these patterns and your UiPath component will work reliably with proper variable communication! 