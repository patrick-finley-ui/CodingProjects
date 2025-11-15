# Invoice Match Review - Static HTML Control for UiPath

This is a static HTML/CSS/JavaScript version of the Invoice Match Review application, designed to work as a custom HTML control within UiPath Apps.

## Overview

This application displays invoice validation results with the following features:

- **Key Details Summary**: Contract and invoice information with verification status
- **Check Summary**: Statistics on validation checks performed, passed, and failed
- **Validation Checks**: Detailed grid of all validation evaluations with filtering
- **Contract Line Items (CLINs)**: Expandable table showing line item details
- **Recommendations**: Action items based on validation results

## Files

- `index.html` - Main HTML structure
- `styles.css` - Complete styling matching the original design system
- `app.js` - All application logic and UiPath integration

## UiPath HTML Control Integration

### Receiving Data from UiPath

The application supports multiple methods to receive data from UiPath:

#### Method 1: window.uipath.getData() (Recommended)

If your UiPath HTML control provides a `window.uipath.getData()` method, the app will automatically call it on initialization:

```javascript
// UiPath sets this in your workflow
window.uipath = {
    getData: function() {
        return {
            summaryData: { /* ... */ },
            matchEvaluations: [ /* ... */ ],
            clinsData: [ /* ... */ ],
            keyDetails: { /* ... */ }
        };
    }
};
```

#### Method 2: PostMessage Events

The app listens for `message` events from the UiPath parent context:

```javascript
// In your UiPath workflow, send data like this:
window.postMessage({
    type: 'uipath-data',
    payload: {
        summaryData: { /* ... */ },
        matchEvaluations: [ /* ... */ ],
        clinsData: [ /* ... */ ],
        keyDetails: { /* ... */ }
    }
}, '*');
```

#### Method 3: Direct Data Injection

You can also directly set the data in JavaScript before the app initializes:

```html
<script>
    // Set data before app.js loads
    window.invoiceData = {
        summaryData: { /* ... */ },
        matchEvaluations: [ /* ... */ ],
        clinsData: [ /* ... */ ],
        keyDetails: { /* ... */ }
    };
</script>
<script src="app.js"></script>
```

### Sending Data to UiPath

The application can send data back to UiPath using:

#### Method 1: window.uipath.postMessage()

When users click "Export Report", the app attempts to send data back:

```javascript
// The app calls this automatically
window.uipath.postMessage({
    action: 'export',
    data: {
        summaryData: { /* ... */ },
        matchEvaluations: [ /* ... */ },
        clinsData: [ /* ... */ ],
        keyDetails: { /* ... */ }
    }
});
```

You should set up `window.uipath.postMessage` in your UiPath workflow to handle this.

#### Method 2: Custom Events

You can listen for custom events:

```javascript
window.addEventListener('invoice-export', function(event) {
    console.log('Export data:', event.detail);
    // Send to UiPath workflow
});
```

## Data Structure

### summaryData

```javascript
{
    ContractNumber: "FA4801-25-P-0047",
    InvoiceNumber: "INV-1025",
    OverallStatus: "PartiallyMatched",
    ChecksPerformed: "18",
    ChecksPassed: "12",
    ChecksFailed_High: "2",
    ChecksFailed_Medium: "2",
    ChecksFailed_Low: "2",
    Status: "Partially compliant with significant findings",
    ValidationScope: ["Header", "CLIN", "Acceptance", "Financial", "Data Integrity", "Logical"],
    Warnings: "2",
    Timestamp: "2025-10-29T00:00:00",
    Recommendations: [
        "Correct vendor name discrepancies across documents.",
        // ... more recommendations
    ]
}
```

### matchEvaluations

Array of validation check objects:

```javascript
[
    {
        MismatchType: "QuantityMismatch",
        Status: "Not Passed",
        Severity: "Medium",
        Reason: "Quantity accepted in goods receipt (31) does not match quantity invoiced (32) for line item 003.",
        Justification: "1 unit was rejected due to a cracked screen.",
        LinkedDocuments: ["Invoice", "Goods Receipt"],
        SourceFields: ["quantity_invoice", "quantity_accepted_goods_receipt"]
    },
    // ... more evaluations
]
```

### clinsData

Array of contract line item objects:

```javascript
[
    {
        line_item: "001",
        po_shipment_number: "SHP-001",
        po_delivery_estimate_date: "03/26/2025 00:00:00",
        shipment_number_goods_receipt: "SHP-001",
        delivery_date_goods_receipt: "2025-03-26",
        line_item_po: "Rugged Laptop AR-12 (i7, 16 GB, 1TB) - Initial Delivery",
        line_item_invoice: "Rugged Laptop AR‑12",
        line_item_goods_receipt: "Rugged Laptop AR-12",
        quantity_po: "48",
        quantity_invoice: "48",
        quantity_shipped_goods_receipt: "48",
        quantity_accepted_goods_receipt: "48",
        quantity_rejected_goods_receipt: "0",
        unit_price_po: "9850.00 USD",
        unit_price_invoice: "9850",
        unit_price_goods_receipt: "9850",
        amount_po: "$472,800.00",
        amount_invoice: "472800",
        amount_goods_receipt: "472800",
        acceptance_condition_goods_receipt: "Accepted",
        acceptance_remarks_goods_receipt: "",
        funding_code_po: "",
        match_status: "",
        notes: ""
    },
    // ... more CLINs
]
```

### keyDetails

```javascript
{
    contract_number_purchase_order: "FA4801-25-P-0047",
    contract_number_invoice: "FA4801-25-P-0047",
    contract_number_goods_receipt: "FA4801-25-P-0047",
    invoice_number_invoice: "INV-1025",
    invoice_number_goods_receipt: "INV-1025",
    vendor_invoice: "Apex Rugged Systems",
    vendor_goods_receipt: "Apex Rugged Systems, Inc. (CAGE 6Y7A2)",
    vendor_purchase_order: "Apex Rugged Systems, Inc.",
    shipment_reference: "SHP-001",
    delivery_point: "DESTINATION",
    total_amount_invoice: "797600",
    verification_summary: "Partially compliant with significant findings. Contract number formatting inconsistencies detected. Quantity mismatch in line item 003 due to rejection."
}
```

## Usage in UiPath

### Step 1: Add HTML Control

1. In UiPath Studio/Apps, add an HTML Control component
2. Set the HTML source to point to your `index.html` file
3. Ensure `styles.css` and `app.js` are accessible (same directory or adjust paths)

### Step 2: Pass Data from Workflow

In your UiPath workflow, use the "Invoke JavaScript" activity or similar to inject data:

```vb
' Example in UiPath (adjust syntax for your activity)
Dim htmlControl As HtmlControl = page.FindControl("HtmlControl1")
Dim data As New Dictionary(Of String, Object)

' Build your data structure
data("summaryData") = summaryDataDict
data("matchEvaluations") = evaluationsList
data("clinsData") = clinsList
data("keyDetails") = keyDetailsDict

' Inject data into the HTML control
htmlControl.ExecuteJavaScript(
    "window.invoiceData = " & JsonConvert.SerializeObject(data) & ";" &
    "if (typeof renderAll === 'function') renderAll();"
)
```

### Step 3: Receive Data from HTML Control

To receive data when the user clicks "Export Report":

```vb
' In your UiPath workflow
AddHandler htmlControl.ScriptNotify, Sub(sender, e)
    ' e.Value contains the message data
    Dim message As String = e.Value
    ' Parse JSON and process
End Sub
```

Or use the ExecuteJavaScript callback:

```vb
htmlControl.ExecuteJavaScriptWithResult(
    "JSON.stringify(window.appData);",
    Function(result)
        ' result contains the JSON string
        ' Parse and process
        Return True
    End Function
)
```

## Features

### Interactive Elements

- **Collapsible Sections**: Click section headers to expand/collapse
- **Filter Validation Checks**: Use tabs to filter by All, Failed, Flagged, or Passed
- **Expandable CLIN Rows**: Click a row to see detailed document comparison
- **Document Viewer Modal**: Click "View" to see full document details
- **Export Report**: Button to send data back to UiPath

### Responsive Design

The application is responsive and works on:
- Desktop screens
- Tablets
- Mobile devices (with some layout adjustments)

## Styling

The CSS uses CSS variables for easy theming. Modify `:root` variables in `styles.css` to customize colors:

```css
:root {
    --primary: hsl(215, 85%, 45%);
    --success: hsl(145, 65%, 45%);
    --warning: hsl(38, 92%, 50%);
    --destructive: hsl(0, 72%, 51%);
    /* ... */
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- IE11 (with polyfills)

## Troubleshooting

### Data Not Appearing

1. Check browser console for JavaScript errors
2. Verify data structure matches expected format
3. Ensure `app.js` is loading correctly
4. Check that `window.uipath` or message events are properly set up

### Styling Issues

1. Ensure `styles.css` is loaded
2. Check file paths are correct
3. Verify CSS variables are supported (use fallbacks if needed)

### UiPath Integration Not Working

1. Verify `window.uipath` object exists
2. Check postMessage targets are correct
3. Ensure cross-origin policies allow communication
4. Use browser DevTools to inspect messages

## Support

For issues or questions, refer to:
- UiPath HTML Control documentation
- Browser DevTools for debugging
- Console logs for error messages

