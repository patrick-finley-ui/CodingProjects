# E&C Representative Count Task Form

A modern, responsive web application for E&C (Engineering & Construction) representatives to verify inventory discrepancies in Navy ERP/DLA WMS systems.

## 🎯 Overview

This application provides a user-friendly interface for E&C representatives to:
- Review prefilled inventory information from Navy ERP and DLA WMS systems
- Perform physical counts and verify item conditions
- Upload photo evidence
- Report discrepancies or mark items as verified
- Track task status in real-time

## ✨ Features

### Modern UX Design
- **Rounded Cards**: Beautiful glassmorphism design with rounded corners
- **Gradient Backgrounds**: Eye-catching gradients and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in effects and hover interactions

### Form Functionality
- **Physical Count Input**: Number input with validation
- **Notes/Discrepancy Explanation**: Rich text area for detailed notes
- **Photo Evidence Upload**: Drag-and-drop file upload with preview
- **File Validation**: Supports JPG, PNG, GIF up to 10MB each
- **Real-time Validation**: Form validation with visual feedback

### Interactive Elements
- **Confirmation Modals**: Clear action confirmation before submission
- **Status Indicators**: Real-time status updates with icons
- **Notifications**: Toast notifications for user feedback
- **Loading States**: Visual feedback during form submission

### Prefilled Information Display
- **Read-only Fields**: Clearly marked prefilled data from automation
- **Grid Layout**: Organized display of inventory information
- **Condition Badges**: Color-coded condition indicators

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Download all files to a local directory
2. Open `index.html` in your web browser
3. The application will load immediately

### File Structure
```
E&C-rep count task/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 📋 Usage Guide

### 1. Review Task Information
- The header displays the task name and assignee
- Task description explains the verification requirements
- Prefilled information shows data from Navy ERP and DLA WMS

### 2. Complete Physical Count
- Enter the actual quantity found during physical inspection
- The field is required and validated in real-time

### 3. Add Notes (Optional but Recommended)
- Document any discrepancies found
- Explain the condition of items
- Note any special circumstances

### 4. Upload Photo Evidence
- Click the upload area or drag-and-drop files
- Supported formats: JPG, PNG, GIF
- Maximum file size: 10MB per file
- Preview uploaded images with file details
- Remove files by clicking the X button

### 5. Submit Verification
- **Mark as Verified**: Use when physical count matches expected and condition is correct
- **Report Discrepancy**: Use when discrepancies are found
- Both actions show confirmation modals
- Status updates in real-time

## 🎨 Design Features

### Color Scheme
- **Primary Blue**: #4299e1 (buttons, icons, accents)
- **Success Green**: #48bb78 (verification actions)
- **Warning Orange**: #f6ad55 (pending status)
- **Error Red**: #e53e3e (discrepancy actions)
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Animations
- **Fade-in Effects**: Cards animate in sequence
- **Hover Effects**: Subtle lift and shadow changes
- **Loading Spinners**: Visual feedback during processing
- **Slide Notifications**: Toast messages slide in/out

## 🔧 Technical Details

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- **Lightweight**: No external dependencies except Font Awesome icons
- **Fast Loading**: Optimized CSS and JavaScript
- **Responsive**: CSS Grid and Flexbox for layout
- **Accessible**: Proper ARIA labels and keyboard navigation

### Security Features
- **Client-side Validation**: File type and size validation
- **XSS Prevention**: Safe DOM manipulation
- **No External Requests**: All functionality is self-contained

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with side-by-side layout
- **Tablet**: Adjusted spacing and touch-friendly buttons
- **Mobile**: Stacked layout with optimized touch targets

## 🎯 Use Cases

### Navy Inventory Management
- **FRC North Island**: G-Condition warehouse verification
- **APSR Integration**: Navy ERP system data display
- **DLA WMS Integration**: Warehouse management system data
- **Condition Codes**: G-Condition (Not Ready, Awaiting Repair)

### E&C Representative Workflow
1. Receive task notification
2. Review prefilled information
3. Perform physical inspection
4. Document findings
5. Submit verification or report discrepancy
6. Track task completion

## 🔄 Future Enhancements

Potential improvements for future versions:
- **Backend Integration**: Connect to actual Navy ERP/DLA WMS APIs
- **User Authentication**: Secure login system
- **Task History**: View previous verifications
- **Bulk Operations**: Handle multiple items simultaneously
- **Advanced Reporting**: Generate detailed discrepancy reports
- **Offline Support**: Work without internet connection

## 📞 Support

For technical support or feature requests, please contact your system administrator or development team.

---

**Built with ❤️ for Navy E&C Representatives** 