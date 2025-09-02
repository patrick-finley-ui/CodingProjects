# Depot/Logistician NRV Review Application

A modern, business-oriented web application for Depot/Logistician review of inventory valuation discrepancies in DoD Financial Management Systems.

## Overview

This application enables Depot/Logistician personnel to review and approve/reject Net Realizable Value (NRV) adjustments for inventory items that have been flagged for potential write-downs. The system addresses the critical role that Depot/Logistician personnel play in:

- **Condition Data Ownership**: Confirming the accuracy of condition codes for inventory items
- **Salvage Reality Verification**: Validating scrap/disposal averages for specific item classes
- **Policy Compliance**: Ensuring DoD FMR requirements for EOU inventory adjustments to NRV

## Features

### 🏷️ Item Information Display
- **NSN (National Stock Number)**: Unique identifier for the item
- **Description**: Clear item identification
- **Organization**: Owning entity (e.g., USA)
- **Quantity on Hand**: Current inventory levels
- **Carrying Method**: Standard inventory method
- **Current Carrying Unit Cost**: Existing valuation

### 📊 NRV Analysis
- **Scrap Proceeds**: Average scrap value per unit
- **Disposal Costs**: Average disposal cost per unit
- **Proposed NRV**: Calculated net realizable value
- **Write-Down Impact**: Financial impact of the adjustment
- **Applied Rule**: Reference to the specific NRV rule (e.g., EOU-NRV-02)

### 🔍 Condition Code Review
- **Suggested Condition Code**: System-recommended condition
- **Condition Code Selection**: Dropdown with all available condition codes
- **Real-time Updates**: Dynamic description updates based on selection

### ✏️ Manual Adjustments
- **Scrap Proceeds Adjustment**: Override default scrap values
- **Disposal Cost Adjustment**: Override default disposal costs
- **Real-time Calculation**: Automatic NRV recalculation
- **Validation**: Input validation and error handling

### 📁 Documentation Upload
- **Drag & Drop**: Intuitive file upload interface
- **Multiple File Types**: Support for PDF, Word, Excel, and image files
- **File Management**: View, remove, and organize uploaded files
- **Size Validation**: 10MB maximum file size limit

### 💬 Review Process
- **Comments Section**: Detailed review justification
- **Decision Buttons**: Approve, Reject, or Place on Hold
- **Confirmation Modals**: Prevent accidental submissions
- **Status Tracking**: Real-time status updates

## Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Modern JavaScript with modular architecture
- **Font Awesome**: Professional icon library
- **Google Fonts**: Inter font family for optimal readability

### Design Principles
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Modern UI/UX**: Clean, professional interface suitable for government use
- **Performance**: Optimized animations and efficient DOM manipulation

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Installation & Usage

### Prerequisites
- Modern web browser with JavaScript enabled
- Local web server (for development)

### Quick Start
1. Clone or download the application files
2. Open `index.html` in a web browser
3. Or serve the files using a local web server

### Development Setup
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

## Data Structure

### Input Data Format
```json
{
  "item": {
    "nsn": "1630-01-222-3333",
    "description": "Landing Gear Wheel",
    "org": "USA",
    "qtyOnHand": 7,
    "carryingMethod": "STD",
    "carryingUnitCost": 8400
  },
  "nrv": {
    "avgScrapProceedsPerUnit": 2425,
    "avgDisposalCostPerUnit": 312.5,
    "proposedNRVUnit": 2112.5
  },
  "conditionCodeSuggested": "G",
  "appliedRuleId": "EOU-NRV-02"
}
```

### Review Decision Output
```json
{
  "action": "approve|reject|hold",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "reviewer": "Depot/Logistician",
  "conditionCode": "G",
  "scrapAdjustment": 2425.00,
  "disposalAdjustment": 312.50,
  "calculatedNRV": 2112.50,
  "comments": "Review comments...",
  "uploadedFiles": [...],
  "originalData": {...}
}
```

## Business Rules

### Condition Code Categories
- **A-C**: Serviceable items (New, Good, Fair)
- **D-Z**: Unserviceable items (Repairable)

### Validation Requirements
- Condition code selection is mandatory
- Review comments must be at least 10 characters
- File uploads are optional but recommended
- All financial calculations are validated

### Decision Workflow
1. **Review**: Analyze item information and NRV calculations
2. **Validate**: Confirm condition codes and adjust if necessary
3. **Document**: Upload supporting evidence and provide comments
4. **Decide**: Approve, reject, or place on hold
5. **Process**: System processes the decision and updates status

## Security Considerations

### File Upload Security
- File type validation
- File size limits
- Client-side validation
- Secure file handling

### Data Protection
- No sensitive data stored in browser
- Secure transmission protocols
- Input sanitization
- XSS prevention

## Integration Points

### Backend Systems
- **Financial Management System**: NRV rule engine
- **Inventory Management**: Item condition updates
- **Document Management**: File storage and retrieval
- **Workflow Engine**: Process orchestration

### APIs
- **Authentication**: User identity and permissions
- **Data Retrieval**: Item and NRV information
- **Decision Submission**: Review outcomes
- **File Management**: Document upload/download

## Customization

### Styling
- CSS variables for easy color scheme changes
- Modular CSS architecture
- Responsive breakpoint customization
- Theme switching capability

### Functionality
- Configurable validation rules
- Customizable condition codes
- Extensible file type support
- Plugin architecture for additional features

## Troubleshooting

### Common Issues
- **File Upload Fails**: Check file size and type
- **Calculations Not Updating**: Ensure all inputs have valid numbers
- **Modal Not Displaying**: Check JavaScript console for errors
- **Responsive Issues**: Verify viewport meta tag

### Debug Mode
Enable console logging for development:
```javascript
// Add to script.js
const DEBUG = true;
if (DEBUG) console.log('Debug information:', data);
```

## Support & Maintenance

### Documentation
- Code comments and JSDoc
- Inline help tooltips
- User manual and training materials
- API documentation

### Updates
- Regular security patches
- Feature enhancements
- Performance optimizations
- Browser compatibility updates

## License

This application is developed for DoD Financial Management Systems and follows government security and accessibility standards.

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Contact**: DoD Financial Management Support Team
