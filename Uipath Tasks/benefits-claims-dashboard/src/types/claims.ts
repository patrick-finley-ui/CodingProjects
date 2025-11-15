export type ClaimStatus =
  | 'Pending Review'
  | 'Under Review'
  | 'Approved'
  | 'Denied'
  | 'Additional Info Required'
  | 'In Processing';

export type Priority = 'High' | 'Medium' | 'Low';

export interface SnapClaim {
  id: string;
  applicantName: string;
  applicantId: string;
  dateSubmitted: Date;
  status: ClaimStatus;
  priority: Priority;
  householdSize: number;
  monthlyIncome: number;
  estimatedBenefit: number;
  assignedCaseworker: string;
  lastUpdated: Date;
  daysInReview: number;
  requiredDocuments: {
    name: string;
    status: 'Submitted' | 'Missing' | 'Under Review';
  }[];
  notes?: string;
}

export interface DashboardMetrics {
  totalClaimsThisMonth: number;
  approvedThisMonth: number;
  awaitingApproval: number;
  deniedThisMonth: number;
  averageProcessingTime: number;
  highPriorityClaims: number;
}
