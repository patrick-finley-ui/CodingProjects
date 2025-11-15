import type { SnapClaim, DashboardMetrics } from '../types/claims';

// Helper to generate dates in current month
const getRandomDateThisMonth = (): Date => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = now;
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to calculate days between dates
const getDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Mock SNAP claims data
export const mockClaims: SnapClaim[] = [
  {
    id: 'SNAP-2025-001',
    applicantName: 'Maria Rodriguez',
    applicantId: 'APP-45892',
    dateSubmitted: new Date('2025-10-01'),
    status: 'Pending Review',
    priority: 'High',
    householdSize: 4,
    monthlyIncome: 1850,
    estimatedBenefit: 835,
    assignedCaseworker: 'John Smith',
    lastUpdated: getRandomDateThisMonth(),
    daysInReview: getDaysBetween(new Date('2025-10-01'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Under Review' },
      { name: 'Household Composition', status: 'Submitted' }
    ],
    notes: 'Expedited case - family experiencing food insecurity'
  },
  {
    id: 'SNAP-2025-002',
    applicantName: 'James Wilson',
    applicantId: 'APP-45893',
    dateSubmitted: new Date('2025-10-03'),
    status: 'Approved',
    priority: 'Medium',
    householdSize: 1,
    monthlyIncome: 1200,
    estimatedBenefit: 291,
    assignedCaseworker: 'Sarah Johnson',
    lastUpdated: new Date('2025-10-15'),
    daysInReview: getDaysBetween(new Date('2025-10-03'), new Date('2025-10-15')),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ]
  },
  {
    id: 'SNAP-2025-003',
    applicantName: 'Aisha Patel',
    applicantId: 'APP-45894',
    dateSubmitted: new Date('2025-10-05'),
    status: 'Under Review',
    priority: 'Medium',
    householdSize: 3,
    monthlyIncome: 2100,
    estimatedBenefit: 740,
    assignedCaseworker: 'Michael Brown',
    lastUpdated: new Date('2025-10-29'),
    daysInReview: getDaysBetween(new Date('2025-10-05'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Under Review' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ]
  },
  {
    id: 'SNAP-2025-004',
    applicantName: 'Robert Chen',
    applicantId: 'APP-45895',
    dateSubmitted: new Date('2025-10-07'),
    status: 'Additional Info Required',
    priority: 'High',
    householdSize: 5,
    monthlyIncome: 2400,
    estimatedBenefit: 973,
    assignedCaseworker: 'John Smith',
    lastUpdated: new Date('2025-10-25'),
    daysInReview: getDaysBetween(new Date('2025-10-07'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Missing' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Missing' }
    ],
    notes: 'Missing ID for 2 household members - contacted applicant 10/25'
  },
  {
    id: 'SNAP-2025-005',
    applicantName: 'Linda Martinez',
    applicantId: 'APP-45896',
    dateSubmitted: new Date('2025-10-10'),
    status: 'Approved',
    priority: 'Low',
    householdSize: 2,
    monthlyIncome: 1600,
    estimatedBenefit: 535,
    assignedCaseworker: 'Sarah Johnson',
    lastUpdated: new Date('2025-10-20'),
    daysInReview: getDaysBetween(new Date('2025-10-10'), new Date('2025-10-20')),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ]
  },
  {
    id: 'SNAP-2025-006',
    applicantName: 'David Thompson',
    applicantId: 'APP-45897',
    dateSubmitted: new Date('2025-10-12'),
    status: 'Denied',
    priority: 'Low',
    householdSize: 1,
    monthlyIncome: 3500,
    estimatedBenefit: 0,
    assignedCaseworker: 'Michael Brown',
    lastUpdated: new Date('2025-10-22'),
    daysInReview: getDaysBetween(new Date('2025-10-12'), new Date('2025-10-22')),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ],
    notes: 'Income exceeds 130% of federal poverty level'
  },
  {
    id: 'SNAP-2025-007',
    applicantName: 'Emily Foster',
    applicantId: 'APP-45898',
    dateSubmitted: new Date('2025-10-14'),
    status: 'In Processing',
    priority: 'Medium',
    householdSize: 3,
    monthlyIncome: 1900,
    estimatedBenefit: 768,
    assignedCaseworker: 'John Smith',
    lastUpdated: new Date('2025-10-30'),
    daysInReview: getDaysBetween(new Date('2025-10-14'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Under Review' }
    ]
  },
  {
    id: 'SNAP-2025-008',
    applicantName: 'Carlos Gomez',
    applicantId: 'APP-45899',
    dateSubmitted: new Date('2025-10-16'),
    status: 'Approved',
    priority: 'High',
    householdSize: 6,
    monthlyIncome: 2800,
    estimatedBenefit: 1164,
    assignedCaseworker: 'Sarah Johnson',
    lastUpdated: new Date('2025-10-27'),
    daysInReview: getDaysBetween(new Date('2025-10-16'), new Date('2025-10-27')),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ],
    notes: 'Large household with children - expedited processing'
  },
  {
    id: 'SNAP-2025-009',
    applicantName: 'Jennifer Lee',
    applicantId: 'APP-45900',
    dateSubmitted: new Date('2025-10-18'),
    status: 'Pending Review',
    priority: 'Low',
    householdSize: 2,
    monthlyIncome: 1700,
    estimatedBenefit: 516,
    assignedCaseworker: 'Michael Brown',
    lastUpdated: new Date('2025-10-29'),
    daysInReview: getDaysBetween(new Date('2025-10-18'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ]
  },
  {
    id: 'SNAP-2025-010',
    applicantName: 'Ahmed Hassan',
    applicantId: 'APP-45901',
    dateSubmitted: new Date('2025-10-20'),
    status: 'Under Review',
    priority: 'High',
    householdSize: 4,
    monthlyIncome: 2200,
    estimatedBenefit: 782,
    assignedCaseworker: 'John Smith',
    lastUpdated: new Date('2025-10-30'),
    daysInReview: getDaysBetween(new Date('2025-10-20'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Under Review' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ],
    notes: 'Language assistance provided - translator assigned'
  },
  {
    id: 'SNAP-2025-011',
    applicantName: 'Susan Anderson',
    applicantId: 'APP-45902',
    dateSubmitted: new Date('2025-10-22'),
    status: 'Approved',
    priority: 'Medium',
    householdSize: 1,
    monthlyIncome: 950,
    estimatedBenefit: 291,
    assignedCaseworker: 'Sarah Johnson',
    lastUpdated: new Date('2025-10-29'),
    daysInReview: getDaysBetween(new Date('2025-10-22'), new Date('2025-10-29')),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Submitted' },
      { name: 'Household Composition', status: 'Submitted' }
    ]
  },
  {
    id: 'SNAP-2025-012',
    applicantName: 'Michael O\'Brien',
    applicantId: 'APP-45903',
    dateSubmitted: new Date('2025-10-24'),
    status: 'In Processing',
    priority: 'Medium',
    householdSize: 3,
    monthlyIncome: 2000,
    estimatedBenefit: 740,
    assignedCaseworker: 'Michael Brown',
    lastUpdated: new Date('2025-10-30'),
    daysInReview: getDaysBetween(new Date('2025-10-24'), new Date()),
    requiredDocuments: [
      { name: 'Proof of Income', status: 'Submitted' },
      { name: 'ID Verification', status: 'Submitted' },
      { name: 'Residency Proof', status: 'Under Review' },
      { name: 'Household Composition', status: 'Submitted' }
    ]
  }
];

// Calculate dashboard metrics from mock data
export const getDashboardMetrics = (): DashboardMetrics => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const claimsThisMonth = mockClaims.filter(
    claim => claim.dateSubmitted >= startOfMonth
  );

  const approvedThisMonth = claimsThisMonth.filter(
    claim => claim.status === 'Approved'
  ).length;

  const awaitingApproval = mockClaims.filter(
    claim => claim.status === 'Pending Review' ||
            claim.status === 'Under Review' ||
            claim.status === 'In Processing'
  ).length;

  const deniedThisMonth = claimsThisMonth.filter(
    claim => claim.status === 'Denied'
  ).length;

  const completedClaims = mockClaims.filter(
    claim => claim.status === 'Approved' || claim.status === 'Denied'
  );

  const averageProcessingTime = completedClaims.length > 0
    ? Math.round(
        completedClaims.reduce((sum, claim) => sum + claim.daysInReview, 0) / completedClaims.length
      )
    : 0;

  const highPriorityClaims = mockClaims.filter(
    claim => claim.priority === 'High' &&
            (claim.status === 'Pending Review' ||
             claim.status === 'Under Review' ||
             claim.status === 'In Processing')
  ).length;

  return {
    totalClaimsThisMonth: claimsThisMonth.length,
    approvedThisMonth,
    awaitingApproval,
    deniedThisMonth,
    averageProcessingTime,
    highPriorityClaims
  };
};
