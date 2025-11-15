# SecOps Portal

A comprehensive Security Operations Center (SOC) portal for reviewing alerts from multiple security systems including CrowdStrike, Microsoft Sentinel, Splunk, IBM QRadar, and more. The portal integrates with UiPath's AI SOC Analyst Agent for automated threat analysis and response.

## Features

### 🚨 Alert Management
- **Multi-Source Integration**: Supports alerts from CrowdStrike, Sentinel, Splunk, QRadar, Palo Alto, Cisco, and Fortinet
- **Real-time Dashboard**: High-level KPIs showing critical, high, medium, and low priority incidents
- **Advanced Filtering**: Filter alerts by severity, status, source system, priority, and review status
- **Smart Search**: Full-text search across alert titles, descriptions, and tags

### 🤖 AI SOC Analyst Integration
- **Automated Analysis**: AI agents classify alerts and provide threat detection insights
- **Confidence Scoring**: AI analysis includes confidence levels and risk scores
- **Investigation Levels**: Automatic classification into Level 1 (Automated), Level 2 (Semi-Automated), or Level 3 (Manual)
- **Recommendations**: AI-generated recommendations for next steps
- **Automated Actions**: Track automated responses like quarantine, IP blocking, and notifications

### 📊 Dashboard & Analytics
- **KPI Cards**: Total alerts, critical alerts, resolution times, false positives
- **System Distribution**: Visual breakdown of alerts by source system
- **Status Tracking**: Real-time status updates (New, In Progress, Escalated, Resolved, False Positive)
- **Priority Management**: P0-P4 priority classification with visual indicators

### 🎯 Security Operations Features
- **Review Workflow**: Mark alerts as reviewed with analyst notes
- **Escalation Management**: Escalate alerts to higher investigation levels
- **False Positive Handling**: Mark and track false positive alerts
- **Related Alerts**: Track relationships between security incidents
- **Audit Trail**: Complete history of alert status changes and analyst actions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Lucide React icons
- **Styling**: Custom CSS with modern security-focused design
- **Date Handling**: date-fns
- **UiPath Integration**: @uipath/uipath-typescript SDK

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- UiPath Cloud account (for AI SOC Analyst integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secOpsApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure UiPath Integration** (Optional)
   
   Create a `.env` file in the root directory:
   ```env
   UIPATH_BASE_URL=https://cloud.uipath.com
   UIPATH_ORG_NAME=your-organization
   UIPATH_TENANT_NAME=your-tenant
   UIPATH_SECRET=your-pat-token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to view the SecOps Portal.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Dashboard Overview
The main dashboard provides:
- **KPI Cards**: Key metrics at a glance
- **System Distribution**: Alert counts by source system
- **Trend Indicators**: Changes in alert volumes and resolution times

### Alert Management
1. **View Alerts**: All alerts are displayed in a sortable, filterable table
2. **Filter Alerts**: Use the filter controls to narrow down alerts by various criteria
3. **Search Alerts**: Use the search box to find specific alerts by title, description, or tags
4. **Review Alerts**: Click the eye icon to mark alerts as reviewed
5. **Escalate Alerts**: Use the escalation button for alerts requiring higher-level investigation
6. **Mark False Positives**: Use the X button to mark alerts as false positives

### AI Analysis Integration
- **Automatic Analysis**: AI agents automatically analyze incoming alerts
- **Confidence Levels**: View AI confidence scores and risk assessments
- **Recommendations**: Follow AI-generated recommendations for investigation steps
- **Automated Actions**: Track automated responses executed by the AI system

## Configuration

### UiPath Integration
The portal integrates with UiPath's AI SOC Analyst Agent through the TypeScript SDK:

```typescript
import { SOCAnalystService } from './services/socAnalystService';

const socService = new SOCAnalystService({
  baseUrl: 'https://cloud.uipath.com',
  orgName: 'your-org',
  tenantName: 'your-tenant',
  secret: 'your-pat-token'
});

await socService.initialize();
```

### Mock Data
For development and testing, the portal includes comprehensive mock data:
- 50+ realistic security alerts
- Multiple source systems (CrowdStrike, Sentinel, etc.)
- Various severity levels and statuses
- AI analysis results with confidence scores

## Security Features

### Alert Classification
- **Threat Types**: Malware, Phishing, Data Exfiltration, Privilege Escalation, etc.
- **MITRE ATT&CK Mapping**: Alerts mapped to MITRE ATT&CK framework
- **Risk Scoring**: Numerical risk scores for prioritization

### Investigation Levels
- **Level 1**: Fully automated analysis and response
- **Level 2**: Semi-automated with human oversight
- **Level 3**: Manual investigation required

### Automated Actions
- **Quarantine**: Isolate affected endpoints
- **IP Blocking**: Block malicious IP addresses
- **User Disabling**: Disable compromised user accounts
- **Artifact Collection**: Gather forensic evidence
- **Team Notifications**: Alert security teams

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the UiPath documentation for SDK-related questions

## Roadmap

### Upcoming Features
- [ ] Real-time alert streaming
- [ ] Advanced analytics and reporting
- [ ] Custom dashboard widgets
- [ ] Integration with additional security tools
- [ ] Mobile-responsive design improvements
- [ ] Advanced AI model training integration
- [ ] Compliance reporting features
- [ ] Multi-tenant support

### Integration Roadmap
- [ ] Splunk Enterprise Security
- [ ] IBM QRadar SIEM
- [ ] Palo Alto Networks Cortex XDR
- [ ] Cisco SecureX
- [ ] Fortinet FortiSIEM
- [ ] Additional EDR/XDR platforms
