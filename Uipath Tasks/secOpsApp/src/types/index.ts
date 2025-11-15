// Security Alert Types
export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  sourceSystem: SecuritySystem;
  severity: AlertSeverity;
  status: AlertStatus;
  priority: AlertPriority;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags: string[];
  aiAnalysis?: AIAnalysis;
  aiInvestigationReport?: AIInvestigationReport;
  aiActionApproved: boolean;
  escalationLevel: number;
  isReviewed: boolean;
  reviewNotes?: string;
  relatedAlerts: string[];
}

export interface AIAnalysis {
  id: string;
  alertId: string;
  classification: ThreatClassification;
  confidence: number;
  recommendations: string[];
  riskScore: number;
  investigationLevel: InvestigationLevel;
  automatedActions: AutomatedAction[];
  createdAt: Date;
  analystAgent: string;
}

export interface AutomatedAction {
  id: string;
  type: ActionType;
  description: string;
  status: ActionStatus;
  executedAt?: Date;
  result?: string;
}

export interface AIInvestigationReport {
  investigationId: string;
  originalAlertReference: string;
  segmentFocusArea: string;
  timestampRangeCovered: string;
  technicalSummary: string;
  eventTimeline: EventTimelineEntry[];
  artifactInventory: ArtifactInventory;
  technicalAssessment: TechnicalAssessment;
  highlightImpactfulAspects: string[];
  artifactsOfInterest: ArtifactsOfInterest;
  classification: InvestigationClassification;
  sourcesUsed: SourceUsage[];
  pastEvents: PastEvent[];
}

export interface EventTimelineEntry {
  timestamp: string;
  description: string;
}

export interface ArtifactInventory {
  ipAddresses: string[];
  users: string[];
  devices: string[];
  processes: string[];
  files: string[];
  servicePrincipals: string[];
  resourcesAccessed: string[];
  ports: string[];
  urls: string[];
}

export interface TechnicalAssessment {
  behaviorClassification: string;
  evidence: string;
  comparisonAgainstKnownPatterns: string;
  confidenceLevel: string;
}

export interface ArtifactsOfInterest {
  users: string[];
  devices: string[];
  processes: string[];
  files: string[];
  ipAddresses: string[];
  applications: string[];
  urls: string[];
}

export interface InvestigationClassification {
  classification: string;
  classificationAction: string;
}

export interface SourceUsage {
  source: string;
  relevant: boolean;
}

export interface PastEvent {
  timestamp: string;
  description: string;
}

// Enums
export enum SecuritySystem {
  CROWDSTRIKE = 'CrowdStrike',
  SENTINEL = 'Microsoft Sentinel',
  SPLUNK = 'Splunk',
  QRADAR = 'IBM QRadar',
  PALO_ALTO = 'Palo Alto',
  CISCO = 'Cisco',
  FORTINET = 'Fortinet'
}

export enum AlertSeverity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export enum AlertStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  ESCALATED = 'Escalated',
  RESOLVED = 'Resolved',
  FALSE_POSITIVE = 'False Positive',
  INVESTIGATING = 'Investigating'
}

export enum AlertPriority {
  P0 = 'P0 - Critical',
  P1 = 'P1 - High',
  P2 = 'P2 - Medium',
  P3 = 'P3 - Low',
  P4 = 'P4 - Info'
}

export enum ThreatClassification {
  MALWARE = 'Malware',
  PHISHING = 'Phishing',
  DATA_EXFILTRATION = 'Data Exfiltration',
  PRIVILEGE_ESCALATION = 'Privilege Escalation',
  LATERAL_MOVEMENT = 'Lateral Movement',
  PERSISTENCE = 'Persistence',
  DEFENSE_EVASION = 'Defense Evasion',
  CREDENTIAL_ACCESS = 'Credential Access',
  DISCOVERY = 'Discovery',
  COLLECTION = 'Collection',
  COMMAND_AND_CONTROL = 'Command and Control',
  EXFILTRATION = 'Exfiltration',
  IMPACT = 'Impact',
  FALSE_POSITIVE = 'False Positive',
  UNKNOWN = 'Unknown'
}

export enum InvestigationLevel {
  LEVEL_1 = 'Level 1 - Automated',
  LEVEL_2 = 'Level 2 - Semi-Automated',
  LEVEL_3 = 'Level 3 - Manual Investigation Required'
}

export enum ActionType {
  QUARANTINE = 'Quarantine',
  BLOCK_IP = 'Block IP',
  DISABLE_USER = 'Disable User',
  COLLECT_ARTIFACTS = 'Collect Artifacts',
  NOTIFY_TEAM = 'Notify Team',
  ESCALATE = 'Escalate',
  AUTO_RESOLVE = 'Auto Resolve'
}

export enum ActionStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled'
}

// Dashboard Types
export interface DashboardKPIs {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
  unresolvedAlerts: number;
  falsePositives: number;
  avgResolutionTime: number;
  alertsBySystem: Record<SecuritySystem, number>;
  alertsByStatus: Record<AlertStatus, number>;
}

export interface AlertFilter {
  severity?: AlertSeverity[];
  status?: AlertStatus[];
  sourceSystem?: SecuritySystem[];
  priority?: AlertPriority[];
  isReviewed?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// UiPath Integration Types
export interface UiPathConfig {
  baseUrl: string;
  orgName: string;
  tenantName: string;
  secret?: string;
  clientId?: string;
  redirectUri?: string;
  scope?: string;
}

export interface SOCAnalystTask {
  id: string;
  alertId: string;
  taskType: 'CLASSIFICATION' | 'INVESTIGATION' | 'ESCALATION' | 'RESOLUTION';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  priority: AlertPriority;
  assignedAgent: string;
  createdAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}
