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

### Basic Setup
```javascript
// Check if we're in UiPath
if (typeof App !== 'undefined') {
    // We're in UiPath - set up communication
    setupUiPathCommunication();
} else {
    // We're in regular browser - use fallbacks
    console.log('Running outside UiPath');
}

function setupUiPathCommunication() {
    // Listen for variable changes
    const listener = App.onVariableChange('myVariable', (value) => {
        console.log('Variable changed:', value);
        updateUI(value);
    });
    
    // Set variable value
    App.setVariable('myVariable', 'new value');
}
```

### Complete Example
```javascript
let variableListener = null;

function initializeUiPath() {
    if (typeof App !== 'undefined') {
        // Listen for changes
        variableListener = App.onVariableChange('status', (value) => {
            updateStatus(value);
        });
        
        // Get initial value
        const initialValue = App.getVariable('status');
        if (initialValue) {
            updateStatus(initialValue);
        }
    }
}

function updateStatus(value) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = value;
    }
}

function setStatus(value) {
    if (typeof App !== 'undefined') {
        App.setVariable('status', value);
    }
}

// Clean up when done
function cleanup() {
    if (variableListener) {
        variableListener();
        variableListener = null;
    }
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

## Initialization Pattern

### Safe Initialization
```javascript
function initializeApp() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupApp);
    } else {
        setupApp();
    }
    
    // Fallback for UiPath delays
    setTimeout(setupApp, 100);
    setTimeout(setupApp, 500);
}

function setupApp() {
    try {
        setupEventListeners();
        setupUiPath();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Start the app
initializeApp();
```

## Testing Checklist

### Before Deploying
- [ ] All file uploads check for 1MB limit
- [ ] No `window.alert()` or similar browser APIs
- [ ] All DOM elements checked before use
- [ ] Event listeners only attached to existing elements
- [ ] Z-index values set for modals/overlays
- [ ] Touch targets are 44px minimum

### Debugging in UiPath
1. Open browser console (F12)
2. Check "Selected context only"
3. Select "html-control-base.html" from dropdown
4. Look for JavaScript errors

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

1. **Always check if elements exist** before using them
2. **Never use browser APIs** that UiPath blocks
3. **Keep files under 1MB** for uploads
4. **Use proper z-index** for overlays
5. **Check for UiPath environment** before using App APIs
6. **Handle errors gracefully** with try-catch blocks

Follow these patterns and your UiPath component will work reliably! 