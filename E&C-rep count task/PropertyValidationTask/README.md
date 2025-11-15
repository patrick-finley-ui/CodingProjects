# Property Agent Findings - UiPath Custom HTML Component

## Overview
This UiPath Custom HTML component displays AI agent findings for property record analysis, including Key Supporting Documents (KSD) and property data from iNFADS. The component follows UiPath compatibility guidelines and provides a clean, professional interface for reviewing agent analysis results.

## Features
- **AI Agent Summary**: Displays validation notes and matching logic
- **Property Information**: Shows key property data (ID, description, project ID, cost delta, change data)
- **Primary DD1354 Record**: Displays the main property record with confidence details
- **Key Supporting Documents**: Lists and explains KSD matches
- **Action Buttons**: Accept/Reject functionality with UiPath variable communication
- **Custom Alerts**: UiPath-compatible notification system
- **Responsive Design**: Works on desktop and mobile devices

## UiPath Variables

### Input Variables
- `propertyData` (Object): Property information from iNFADS
  ```javascript
  {
    propertyId: "FAC NO: 10012, RPUID: 385337",
    description: "CAPITAL IMPROVEMENT",
    projectId: "3027",
    costDelta: "$2,550,012.80 (within ±1 of $2,550,013)",
    changeData: "Quantity correction identified"
  }
  ```

- `agentFindings` (Object): AI agent analysis results
  ```javascript
  {
    summary: "One 1354 document matched all input criteria...",
    primaryRecord: "Sample 22 P-3027_Interim_DD1354_Signed.pdf",
    dd1354Confidence: "Matched on FAC NO = 10012...",
    ksd1: "Sample 22P-3027_Due_Diligence_10012_quantity_correction.pdf",
    ksd2: "Sample 22 P-3027_Due_Diligence_for_Timeliness.pdf",
    ksdConfidence: "Sample 22P-3027_Due_Diligence_10012..."
  }
  ```

- `status` (String): Current processing status
  - "Processing..."
  - "Ready"
  - "Accepted"
  - "Rejected"

### Output Variables
- `userAction` (String): User's decision
  - "accept" - When Accept button is clicked
  - "reject" - When Reject button is clicked

## Usage in UiPath

### 1. Add Custom HTML Activity
1. Drag "Custom HTML" activity into your workflow
2. Upload the `property-agent-findings.html` file
3. Ensure file size is under 1MB

### 2. Set Variables
```vb
' Set property data
propertyData = New Dictionary(Of String, Object)
propertyData("propertyId") = "FAC NO: 10012, RPUID: 385337"
propertyData("description") = "CAPITAL IMPROVEMENT"
propertyData("projectId") = "3027"
propertyData("costDelta") = "$2,550,012.80 (within ±1 of $2,550,013)"
propertyData("changeData") = "Quantity correction identified"

' Set agent findings
agentFindings = New Dictionary(Of String, Object)
agentFindings("summary") = "One 1354 document matched all input criteria..."
agentFindings("primaryRecord") = "Sample 22 P-3027_Interim_DD1354_Signed.pdf"
' ... etc
```

### 3. Read User Action
```vb
' After user interaction
Dim userAction As String = CustomHTML_Activity.GetVariable("userAction")
If userAction = "accept" Then
    ' Handle acceptance
ElseIf userAction = "reject" Then
    ' Handle rejection
End If
```

## Technical Specifications

### UiPath Compatibility
- ✅ No browser APIs (`window.alert`, `window.confirm`, etc.)
- ✅ Safe DOM element access with existence checks
- ✅ File size under 1MB limit
- ✅ Proper z-index for modals (10000)
- ✅ Touch targets minimum 44px
- ✅ UiPath App API communication
- ✅ Error handling with try-catch blocks

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Print-friendly styles

### Performance
- Lightweight HTML/CSS/JavaScript
- No external dependencies
- Efficient DOM manipulation
- Memory leak prevention with cleanup functions

## File Structure
```
property-agent-findings.html
├── HTML Structure
│   ├── Header with status indicator
│   ├── AI Agent Summary section
│   ├── Property Information grid
│   ├── Primary DD1354 Record section
│   ├── Key Supporting Documents section
│   └── Action buttons
├── CSS Styles
│   ├── Responsive grid layouts
│   ├── Professional color scheme
│   ├── Modal and alert styling
│   └── Accessibility features
└── JavaScript Logic
    ├── UiPath communication
    ├── Safe DOM manipulation
    ├── Event handling
    └── Demo data for testing
```

## Testing

### Outside UiPath
The component includes demo data that loads automatically when running outside UiPath environment. This allows for testing and development without UiPath Studio.

### In UiPath
1. Test with various property data scenarios
2. Verify variable communication works correctly
3. Check responsive behavior on different screen sizes
4. Validate error handling with invalid data

## Troubleshooting

### Common Issues
1. **Variables not updating**: Check variable names match exactly
2. **Buttons not working**: Verify UiPath App API is available
3. **Styling issues**: Check z-index values and CSS conflicts
4. **File upload fails**: Ensure file size is under 1MB

### Debug Mode
Open browser console (F12) and look for:
- Initialization messages
- Variable change notifications
- Error messages
- UiPath environment detection

## Customization

### Styling
Modify CSS variables in the `<style>` section:
- Colors: Update color values throughout
- Layout: Adjust grid templates and spacing
- Typography: Change font families and sizes

### Functionality
Extend JavaScript functions:
- Add new property fields
- Implement additional validation
- Create custom alert types
- Add data export features

## Security Considerations
- No external API calls
- No file uploads beyond UiPath limits
- Input validation for all user data
- XSS prevention with proper text handling

## Version History
- v1.0: Initial release with core functionality
- Compatible with UiPath 2023.4+
- Tested with UiPath Studio and Orchestrator
