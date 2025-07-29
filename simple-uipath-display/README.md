# Simple UiPath Variable Display

A minimal HTML project that displays the UiPath `auditData` variable as formatted text.

## Features

- **Simple Display**: Shows the raw `auditData` variable content
- **JSON Formatting**: Automatically formats JSON data for readability
- **Status Indicators**: Visual feedback on loading, success, and error states
- **Debug Panel**: Built-in debugging tools for troubleshooting
- **Retry Mechanism**: Handles UiPath timing issues with automatic retries
- **Separated Files**: Clean separation of HTML, CSS, and JavaScript

## File Structure

```
simple-uipath-display/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and layout
├── script.js           # JavaScript logic and UiPath integration
└── README.md          # This documentation
```

## Usage

### In UiPath Apps

1. **Add Custom HTML Control** to your UiPath app
2. **Copy all three files** (`index.html`, `styles.css`, `script.js`)
3. **Paste the HTML code** from `index.html` into the HTML editor in UiPath
4. **Set the variable** `auditData` in your UiPath workflow
5. **Run the app** to see the variable content

### Expected Variable Format

The `auditData` variable should be a **String** containing JSON data:

```json
[
    {
        "id": "MIPR-AI020-2025",
        "issueType": "Missing Link",
        "severity": "Critical",
        "description": "The MIPR is not linked to any contract...",
        "recommendedAction": "Investigate why the MIPR...",
        "resolution": "Not Resolved",
        "notes": ""
    }
]
```

## Debug Features

### Debug Panel Buttons

- **Test Variable**: Tests if the UiPath variable is accessible
- **Refresh Data**: Reloads the variable data
- **Check Status**: Shows current initialization status
- **Clear Console**: Clears browser console logs

### Console Logging

The project includes comprehensive logging:
- Initialization attempts and timing
- Variable access status
- Error details and retry information
- Data formatting results

## Troubleshooting

### Common Issues

1. **"UiPath App not available"**
   - Wait for UiPath to fully load
   - Check if running in UiPath environment

2. **"Variable not accessible"**
   - Verify variable name is `auditData`
   - Check variable permissions in UiPath

3. **"No data available"**
   - Ensure variable has content
   - Check variable data format

### Debug Steps

1. **Open browser console** (F12)
2. **Look for debug logs** with timestamps
3. **Use debug panel buttons** to test functionality
4. **Check status indicators** for current state

## Technical Details

- **Separated concerns**: HTML structure, CSS styling, and JavaScript logic in separate files
- **Vanilla JavaScript** - No frameworks required
- **Responsive design** - Works on different screen sizes
- **Error handling** - Graceful fallbacks for all scenarios
- **Retry mechanism** - Handles UiPath timing issues

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari

## UiPath Compatibility

- UiPath Apps v1+
- Custom HTML Control
- Variable access via `App.getVariable()`

## Development

### File Descriptions

- **`index.html`**: Contains the HTML structure and references to external CSS and JS files
- **`styles.css`**: All styling including responsive design and status indicators
- **`script.js`**: All JavaScript logic including UiPath integration, debugging, and retry mechanisms

### Adding Features

To add new features:
1. **HTML**: Add elements to `index.html`
2. **CSS**: Add styles to `styles.css`
3. **JavaScript**: Add logic to `script.js`

---

**Last Updated**: 2024-01-06
**Version**: 1.0.0 