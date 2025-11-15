import { 
  SecurityAlert, 
  AIAnalysis, 
  AIInvestigationReport,
  AutomatedAction, 
  SecuritySystem, 
  AlertSeverity, 
  AlertStatus, 
  AlertPriority, 
  ThreatClassification, 
  InvestigationLevel, 
  ActionType, 
  ActionStatus,
  DashboardKPIs 
} from '../types';

// Generate mock alerts
export const generateMockAlerts = (): SecurityAlert[] => {
  const alerts: SecurityAlert[] = [];
  const systems = Object.values(SecuritySystem);
  const severities = Object.values(AlertSeverity);
  const statuses = Object.values(AlertStatus);
  const priorities = Object.values(AlertPriority);
  const classifications = Object.values(ThreatClassification);

  const alertTemplates = [
    {
      title: 'Suspicious PowerShell Execution Detected',
      description: 'Unusual PowerShell command execution pattern detected on multiple endpoints',
      tags: ['powershell', 'malware', 'lateral-movement']
    },
    {
      title: 'Failed Login Attempts from Unknown IP',
      description: 'Multiple failed login attempts detected from suspicious IP address',
      tags: ['brute-force', 'credential-access', 'external-threat']
    },
    {
      title: 'Data Exfiltration Attempt Detected',
      description: 'Large volume of data being transferred to external destination',
      tags: ['data-exfiltration', 'insider-threat', 'data-loss']
    },
    {
      title: 'Malware Signature Match',
      description: 'Known malware signature detected on endpoint',
      tags: ['malware', 'endpoint', 'signature-match']
    },
    {
      title: 'Privilege Escalation Attempt',
      description: 'Attempted privilege escalation detected on server',
      tags: ['privilege-escalation', 'server', 'unauthorized-access']
    },
    {
      title: 'Phishing Email Campaign',
      description: 'Suspicious email campaign targeting organization employees',
      tags: ['phishing', 'email', 'social-engineering']
    },
    {
      title: 'Network Anomaly Detected',
      description: 'Unusual network traffic pattern detected',
      tags: ['network-anomaly', 'traffic-analysis', 'behavioral']
    },
    {
      title: 'Ransomware Activity Detected',
      description: 'Potential ransomware encryption activity detected',
      tags: ['ransomware', 'encryption', 'critical']
    }
  ];

  for (let i = 0; i < 50; i++) {
    const template = alertTemplates[i % alertTemplates.length];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const system = systems[Math.floor(Math.random() * systems.length)];
    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000);

    const alert: SecurityAlert = {
      id: `alert-${i + 1}`,
      title: `${template.title} #${i + 1}`,
      description: template.description,
      sourceSystem: system,
      severity,
      status,
      priority,
      createdAt,
      updatedAt,
      assignedTo: Math.random() > 0.5 ? `analyst-${Math.floor(Math.random() * 5) + 1}` : undefined,
      tags: [...template.tags, `system-${system.toLowerCase()}`],
      escalationLevel: Math.floor(Math.random() * 3) + 1,
      isReviewed: Math.random() > 0.3,
      reviewNotes: Math.random() > 0.7 ? 'Requires manual investigation' : undefined,
      relatedAlerts: [],
      aiAnalysis: Math.random() > 0.2 ? generateMockAIAnalysis(`alert-${i + 1}`, classification) : undefined,
      aiInvestigationReport: Math.random() > 0.4 ? generateMockInvestigationReport(`alert-${i + 1}`, template.title) : undefined,
      aiActionApproved: Math.random() > 0.6
    };

    alerts.push(alert);
  }

  return alerts;
};

const generateMockInvestigationReport = (alertId: string, alertTitle: string): AIInvestigationReport => {
  const investigationTemplates = [
    {
      segmentFocusArea: 'IP Address 212.146.94.118',
      technicalSummary: 'The IP address 212.146.94.118 was flagged in the original alert for its association with the \'PWDump\' hacktool. Subsequent investigations revealed its involvement in multiple activities across Azure, CrowdStrike, Defender EDR, and other logs. The IP is linked to administrative activities, service principal sign-ins, and connections from various devices and processes.',
      behaviorClassification: 'Suspicious',
      evidence: 'The IP is linked to legitimate UiPath infrastructure but is also associated with malicious activities, including credential theft tools and unauthorized access attempts.',
      classification: 'True Positive',
      classificationAction: 'Escalate Alert'
    },
    {
      segmentFocusArea: 'Malware Detection on Endpoint',
      technicalSummary: 'Multiple malicious Python scripts detected on endpoint work-pc including credential dumping tools. Analysis shows lateral movement patterns and potential data exfiltration attempts.',
      behaviorClassification: 'Malicious',
      evidence: 'Detection of getTGT.py, DumpNTLMInfo.py, and Get-GPPPassword.py scripts with confirmed malicious signatures.',
      classification: 'True Positive',
      classificationAction: 'Isolate Host'
    },
    {
      segmentFocusArea: 'Phishing Email Campaign',
      technicalSummary: 'Suspicious email campaign targeting organization employees with malicious attachments. Analysis shows multiple recipients and sophisticated social engineering techniques.',
      behaviorClassification: 'Suspicious',
      evidence: 'Multiple employees received emails with suspicious attachments, matching known phishing campaign patterns.',
      classification: 'True Positive',
      classificationAction: 'Quarantine Emails'
    }
  ];

  const template = investigationTemplates[Math.floor(Math.random() * investigationTemplates.length)];
  
  return {
    investigationId: `investigation-${alertId}`,
    originalAlertReference: alertTitle,
    segmentFocusArea: template.segmentFocusArea,
    timestampRangeCovered: '2025-05-12T11:42:18.1910458Z to 2025-08-07T13:37:17.0837713Z',
    technicalSummary: template.technicalSummary,
    eventTimeline: [
      {
        timestamp: '2025-05-12T11:42:18.1910458Z',
        description: 'First observed service principal sign-in activity'
      },
      {
        timestamp: '2025-07-08T15:31:58.657998Z',
        description: 'IP seen in CrowdStrike logs associated with multiple devices'
      },
      {
        timestamp: '2025-08-05T14:26:44.8644985Z',
        description: 'Original alert triggered for malicious activity'
      },
      {
        timestamp: '2025-08-07T13:37:17.0837713Z',
        description: 'Last observed activity in security logs'
      }
    ],
    artifactInventory: {
      ipAddresses: ['212.146.94.118', '86.127.126.138', '86.127.220.21'],
      users: ['robert.ursu@uipath.com', 'alexandru.dinica@uipath.com', 'maria.matei@uipath.com'],
      devices: ['work-pc', 'uip-pw0gny53', 'desktop-ijc8Inb'],
      processes: ['chrome.exe', 'mstsc.exe', 'msedge.exe', 'firefox.exe'],
      files: ['getTGT.py', 'DumpNTLMInfo.py', 'Get-GPPPassword.py'],
      servicePrincipals: ['mazewalk-local-identity', 'uipath-Activities-b65b0225-ce9b-4a79-9dd9-c00071d40d64'],
      resourcesAccessed: ['Azure Key Vault', 'Microsoft Graph', 'OneDrive', 'SharePoint'],
      ports: ['80', '443', '3389', '48021'],
      urls: ['https://rovpn.uipath.com', 'https://pmx4lluoidywhe4.centralindia.cloudapp.azure.com']
    },
    technicalAssessment: {
      behaviorClassification: template.behaviorClassification,
      evidence: template.evidence,
      comparisonAgainstKnownPatterns: 'Matches TTPs for credential theft and lateral movement',
      confidenceLevel: 'High'
    },
    highlightImpactfulAspects: [
      'Detection and prevention of malicious Python scripts and credential dumping tools',
      'Suspicious activities in Azure and CloudApps logs',
      'Sensitive file downloads from SharePoint and OneDrive',
      'External VPN connections and IPsec tunnel negotiations'
    ],
    artifactsOfInterest: {
      users: ['robert.ursu@uipath.com'],
      devices: ['work-pc', 'wrklpt-robert'],
      processes: ['lsass.exe', 'svchost.exe'],
      files: ['getTGT.py', 'DumpNTLMInfo.py'],
      ipAddresses: ['212.146.94.118', '86.127.126.138'],
      applications: ['Azure Portal', 'GitHub', 'Microsoft 365'],
      urls: ['https://uipath.sharepoint.com/sites/HROps/']
    },
    classification: {
      classification: template.classification,
      classificationAction: template.classificationAction
    },
    sourcesUsed: [
      { source: 'AWS GuardDuty', relevant: false },
      { source: 'AzureActivity logs', relevant: true },
      { source: 'Sentinel alerts', relevant: true },
      { source: 'Intune device logs', relevant: true },
      { source: 'CloudApps logs', relevant: true },
      { source: 'GitHub audit logs', relevant: true },
      { source: 'Firewall logs', relevant: true },
      { source: 'CrowdStrike EDR logs', relevant: false }
    ],
    pastEvents: [
      {
        timestamp: '2025-07-03T09:12:56.2910208Z',
        description: 'LogonSuccess event on \'wrklpt-robert\' initiated by \'lsass.exe\''
      },
      {
        timestamp: '2025-07-08T15:37:21.7048548Z',
        description: 'Host "work-pc" first seen in Firewall logs'
      },
      {
        timestamp: '2025-08-05T14:26:29.559093Z',
        description: 'First activity related to the alert'
      }
    ]
  };
};

const generateMockAIAnalysis = (alertId: string, classification: ThreatClassification): AIAnalysis => {
  const actions: AutomatedAction[] = [
    {
      id: `action-${alertId}-1`,
      type: ActionType.COLLECT_ARTIFACTS,
      description: 'Collecting system artifacts for analysis',
      status: ActionStatus.COMPLETED,
      executedAt: new Date(),
      result: 'Artifacts collected successfully'
    },
    {
      id: `action-${alertId}-2`,
      type: ActionType.NOTIFY_TEAM,
      description: 'Notifying security team of potential threat',
      status: ActionStatus.COMPLETED,
      executedAt: new Date(),
      result: 'Team notification sent'
    }
  ];

  if (classification === ThreatClassification.MALWARE || classification === ThreatClassification.RANSOMWARE) {
    actions.push({
      id: `action-${alertId}-3`,
      type: ActionType.QUARANTINE,
      description: 'Quarantining affected endpoint',
      status: ActionStatus.IN_PROGRESS,
      executedAt: new Date()
    });
  }

  return {
    id: `analysis-${alertId}`,
    alertId,
    classification,
    confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
    recommendations: [
      'Review endpoint logs for additional indicators',
      'Check for lateral movement patterns',
      'Verify if data exfiltration occurred',
      'Update security policies if needed'
    ],
    riskScore: Math.floor(Math.random() * 40) + 60, // 60-100
    investigationLevel: Math.random() > 0.5 ? InvestigationLevel.LEVEL_1 : InvestigationLevel.LEVEL_2,
    automatedActions: actions,
    createdAt: new Date(),
    analystAgent: 'AI-SOC-Analyst-v2.1'
  };
};

export const generateMockKPIs = (alerts: SecurityAlert[]): DashboardKPIs => {
  const alertsBySystem = alerts.reduce((acc, alert) => {
    acc[alert.sourceSystem] = (acc[alert.sourceSystem] || 0) + 1;
    return acc;
  }, {} as Record<SecuritySystem, number>);

  const alertsByStatus = alerts.reduce((acc, alert) => {
    acc[alert.status] = (acc[alert.status] || 0) + 1;
    return acc;
  }, {} as Record<AlertStatus, number>);

  return {
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
    highAlerts: alerts.filter(a => a.severity === AlertSeverity.HIGH).length,
    mediumAlerts: alerts.filter(a => a.severity === AlertSeverity.MEDIUM).length,
    lowAlerts: alerts.filter(a => a.severity === AlertSeverity.LOW).length,
    unresolvedAlerts: alerts.filter(a => a.status !== AlertStatus.RESOLVED && a.status !== AlertStatus.FALSE_POSITIVE).length,
    falsePositives: alerts.filter(a => a.status === AlertStatus.FALSE_POSITIVE).length,
    avgResolutionTime: Math.floor(Math.random() * 24) + 2, // 2-26 hours
    alertsBySystem,
    alertsByStatus
  };
};
