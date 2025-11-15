import React from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  XCircle, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { DashboardKPIs } from '../types';

interface DashboardProps {
  kpis: DashboardKPIs;
}

const Dashboard: React.FC<DashboardProps> = ({ kpis }) => {
  const kpiCards = [
    {
      title: 'Total Alerts',
      value: kpis.totalAlerts,
      icon: AlertTriangle,
      className: '',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Critical Alerts',
      value: kpis.criticalAlerts,
      icon: Shield,
      className: 'critical',
      change: '+3',
      changeType: 'negative'
    },
    {
      title: 'High Priority',
      value: kpis.highAlerts,
      icon: TrendingUp,
      className: 'high',
      change: '+8',
      changeType: 'negative'
    },
    {
      title: 'Medium Priority',
      value: kpis.mediumAlerts,
      icon: Activity,
      className: 'medium',
      change: '-2',
      changeType: 'positive'
    },
    {
      title: 'Low Priority',
      value: kpis.lowAlerts,
      icon: Zap,
      className: 'low',
      change: '+5',
      changeType: 'negative'
    },
    {
      title: 'Unresolved',
      value: kpis.unresolvedAlerts,
      icon: Clock,
      className: '',
      change: '-15%',
      changeType: 'positive'
    },
    {
      title: 'False Positives',
      value: kpis.falsePositives,
      icon: XCircle,
      className: '',
      change: '+2',
      changeType: 'negative'
    },
    {
      title: 'Avg Resolution Time',
      value: `${kpis.avgResolutionTime}h`,
      icon: Clock,
      className: '',
      change: '-2h',
      changeType: 'positive'
    }
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Security Operations Dashboard</h2>
      
      <div className="kpi-grid">
        {kpiCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`kpi-card ${card.className}`}>
              <div className="kpi-value">{card.value}</div>
              <div className="kpi-label">{card.title}</div>
              <div className={`kpi-change ${card.changeType}`}>
                {card.change}
              </div>
              <IconComponent 
                style={{ 
                  position: 'absolute', 
                  top: '15px', 
                  right: '15px', 
                  opacity: 0.3,
                  width: '24px',
                  height: '24px'
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* System Distribution */}
      <div className="system-distribution">
        <h3 style={{ color: '#e0e0e0', marginBottom: '15px', fontSize: '1.1rem' }}>
          Alerts by Source System
        </h3>
        <div className="system-grid">
          {Object.entries(kpis.alertsBySystem).map(([system, count]) => (
            <div key={system} className="system-item">
              <div className="system-name">{system}</div>
              <div className="system-count">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
