# Audit Findings Dashboard

A static website built with HTML, CSS, and JavaScript for displaying and managing audit issues found with specific documents.

## Features

- **Editable Table**: View and edit audit findings in a responsive table format
- **Search & Filter**: Search by transaction ID or description, filter by severity, issue type, and resolution
- **Modal Details**: Click "View" to see detailed information about each audit finding
- **Notes System**: Add and save notes for each audit finding
- **Resolution Management**: Update resolution status directly from the table or modal
- **Responsive Design**: Works on desktop and mobile devices
- **Color-coded Badges**: Visual indicators for severity and resolution status

## File Structure

```
audit-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

1. **Open the Website**: Simply open `index.html` in any modern web browser
2. **View Audit Findings**: The table displays all audit findings with their details
3. **Search**: Use the search box to find specific issues by ID or description
4. **Filter**: Use the dropdown filters to narrow down results by severity, issue type, or resolution
5. **Edit Resolution**: Change the resolution status directly in the table or in the modal
6. **View Details**: Click the "View" button to open a detailed modal with all information
7. **Add Notes**: In the modal, you can add notes that will be saved with the audit finding

## Data Structure

Each audit finding contains:
- **Transaction ID**: Unique identifier for the audit finding
- **Issue Type**: Category of the issue (Missing Link, Anomaly, etc.)
- **Severity**: Level of severity (Critical, High, Medium)
- **Description**: Detailed description of the issue
- **Recommended Action**: Suggested steps to resolve the issue
- **Resolution**: Current status (Resolved, Not Resolved, In Progress)
- **Notes**: Additional notes added by users

## Customization

### Adding New Audit Findings

Edit the `initialAuditData` array in `script.js`:

```javascript
const initialAuditData = [
    {
        id: "YOUR-ID",
        issueType: "Your Issue Type",
        severity: "Critical|High|Medium",
        description: "Your description",
        recommendedAction: "Your recommended action",
        resolution: "Resolved|Not Resolved|In Progress",
        notes: ""
    }
    // ... more entries
];
```

### Styling

Modify `styles.css` to customize:
- Colors and themes
- Layout and spacing
- Typography
- Responsive breakpoints

### Features

Add new features by modifying `script.js`:
- Export functionality (already included)
- Import functionality (already included)
- Additional filters
- Data persistence (localStorage)

## Browser Compatibility

This website works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Deployment

Since this is a static website, you can deploy it to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

Simply upload the files to your hosting provider and the website will work immediately.

## Local Development

To run locally:
1. Download all files to a folder
2. Open `index.html` in your browser
3. No build process or server required!

## Data Export/Import

The website includes optional export/import functionality:
- **Export**: Saves current audit data as JSON file
- **Import**: Loads audit data from a JSON file

To use these features, you can add buttons to the HTML and call the `exportData()` and `importData()` functions. 