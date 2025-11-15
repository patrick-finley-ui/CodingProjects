import { useState, useEffect } from 'react';
import type { DashboardMetrics } from '../types/claims';
import { getDashboardMetrics } from '../utils/mockData';
import { ClaimsGrid } from './ClaimsGrid';
import { DebugBox } from './DebugBox';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    // Simulate loading metrics
    const loadMetrics = () => {
      const data = getDashboardMetrics();
      setMetrics(data);
    };

    loadMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Claims This Month',
      value: metrics.totalClaimsThisMonth,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Applications received in current month'
    },
    {
      title: 'Approved This Month',
      value: metrics.approvedThisMonth,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Successfully approved applications'
    },
    {
      title: 'Awaiting Approval',
      value: metrics.awaitingApproval,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Applications pending review'
    },
    {
      title: 'High Priority Cases',
      value: metrics.highPriorityClaims,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Urgent cases requiring attention'
    },
    {
      title: 'Avg. Processing Time',
      value: `${metrics.averageProcessingTime} days`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Average time to decision'
    },
    {
      title: 'Denied This Month',
      value: metrics.deniedThisMonth,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Applications not approved'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Debug Box */}
      <DebugBox />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Benefits Claims Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor and manage SNAP eligibility applications</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${card.textColor} mb-1`}>{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
              <div className={card.textColor}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner for Caseworkers */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Caseworker Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>High priority cases require response within 24 hours</li>
                <li>Click "View Details" to see full application information and documents</li>
                <li>Processing time target is 30 days per federal guidelines</li>
                <li>Check for missing documents regularly to avoid delays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">SNAP Eligibility Applications</h3>
        <ClaimsGrid />
      </div>
    </div>
  );
};
