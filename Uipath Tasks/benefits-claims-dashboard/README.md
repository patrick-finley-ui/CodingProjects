# Benefits Claims Dashboard

A comprehensive SNAP (Supplemental Nutrition Assistance Program) eligibility claims management system built with React, TypeScript, and the UiPath TypeScript SDK.

## Features

### Dashboard Metrics
- **Total Claims This Month**: Track all applications received in the current month
- **Approved This Month**: Monitor successfully approved applications
- **Awaiting Approval**: View pending applications requiring review
- **High Priority Cases**: Identify urgent cases needing immediate attention
- **Average Processing Time**: Track efficiency metrics
- **Denied This Month**: Monitor rejected applications

### Claims Management
- **Comprehensive Application Grid**: View all SNAP eligibility applications with sortable columns
- **Advanced Filtering**: Filter by status and search by name, claim ID, or applicant ID
- **Detailed Application View**: Expand any application to see:
  - Financial information (monthly income, estimated benefit)
  - Timeline (submission date, last update)
  - Required documents with status tracking
  - Caseworker notes
  - Household size and composition

### Document Tracking
Each application tracks four key documents:
- Proof of Income
- ID Verification
- Residency Proof
- Household Composition

Document statuses: Submitted, Missing, Under Review

### Priority Management
Applications are categorized by priority:
- **High**: Expedited cases requiring immediate attention
- **Medium**: Standard processing priority
- **Low**: Non-urgent cases

### Status Tracking
Six application statuses:
- Pending Review
- Under Review
- Approved
- Denied
- Additional Info Required
- In Processing

## Technology Stack

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **UiPath TypeScript SDK**: Integration with UiPath automation platform

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- UiPath Cloud account with appropriate credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your UiPath credentials:
- `VITE_UIPATH_CLIENT_ID`: Your UiPath client ID
- `VITE_UIPATH_ORG_NAME`: Your organization name
- `VITE_UIPATH_TENANT_NAME`: Your tenant name
- `VITE_UIPATH_REDIRECT_URI`: Redirect URI (default: http://localhost:5173)
- `VITE_UIPATH_SCOPE`: OAuth scope (default: offline_access)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Mock Data

The application includes comprehensive mock data for 12 SNAP applications with:
- Diverse household sizes (1-6 people)
- Various income levels
- Multiple statuses and priorities
- Complete document tracking
- Realistic processing timelines
- Caseworker assignments

## Caseworker Features

The dashboard includes helpful features for caseworkers:
- Quick metrics overview for daily workflow
- Sortable columns for efficient case management
- Search and filter capabilities
- Priority highlighting for urgent cases
- Document status at a glance
- Processing time tracking
- Expandable details for comprehensive case review

## Project Structure

```
benefits-claims-dashboard/
├── src/
│   ├── components/
│   │   ├── ClaimsGrid.tsx       # Main applications grid
│   │   ├── Dashboard.tsx        # Dashboard with metrics
│   │   ├── Header.tsx           # App header
│   │   ├── LoginScreen.tsx      # Login interface
│   │   └── Navigation.tsx       # Navigation tabs
│   ├── hooks/
│   │   └── useAuth.tsx          # Authentication hook
│   ├── types/
│   │   └── claims.ts            # TypeScript types
│   ├── utils/
│   │   ├── formatters.ts        # Formatting utilities
│   │   └── mockData.ts          # Mock data and metrics
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Development

- **Linting**: `npm run lint`
- **Type Checking**: TypeScript compiler runs during build
- **Hot Module Replacement**: Enabled in development mode

## License

This is a sample application for demonstration purposes.
