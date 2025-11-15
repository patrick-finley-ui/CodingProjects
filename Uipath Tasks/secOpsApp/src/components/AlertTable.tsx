import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Clock,
  User,
  Tag,
  Bot,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { 
  SecurityAlert, 
  AlertFilter, 
  SecuritySystem, 
  AlertSeverity, 
  AlertStatus, 
  AlertPriority 
} from '../types';
import { format } from 'date-fns';
import InvestigationReport from './InvestigationReport';

interface AlertTableProps {
  alerts: SecurityAlert[];
  filter: AlertFilter;
  onFilterChange: (filter: Partial<AlertFilter>) => void;
  onAlertUpdate: (alertId: string, updates: Partial<SecurityAlert>) => void;
}

const AlertTable: React.FC<AlertTableProps> = ({ 
  alerts, 
  filter, 
  onFilterChange, 
  onAlertUpdate 
}) => {
  const [sortField, setSortField] = useState<keyof SecurityAlert>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const handleSort = (field: keyof SecurityAlert) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSeverityClass = (severity: AlertSeverity) => {
    return `severity-${severity.toLowerCase()}`;
  };

  const getStatusClass = (status: AlertStatus) => {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  };

  const getPriorityClass = (priority: AlertPriority) => {
    const priorityNum = priority.split(' - ')[0];
    return `priority-${priorityNum.toLowerCase()}`;
  };

  const handleMarkAsReviewed = (alertId: string) => {
    onAlertUpdate(alertId, { 
      isReviewed: true, 
      reviewNotes: 'Marked as reviewed by analyst' 
    });
  };

  const handleMarkAsFalsePositive = (alertId: string) => {
    onAlertUpdate(alertId, { 
      status: AlertStatus.FALSE_POSITIVE,
      isReviewed: true,
      reviewNotes: 'Marked as false positive'
    });
  };

  const handleEscalate = (alertId: string) => {
    onAlertUpdate(alertId, { 
      status: AlertStatus.ESCALATED,
      escalationLevel: 3
    });
  };

  const toggleAlertExpansion = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const handleApproveAction = (alertId: string) => {
    onAlertUpdate(alertId, { 
      aiActionApproved: true,
      reviewNotes: 'AI recommendation approved by analyst'
    });
  };

  const handleRejectAction = (alertId: string) => {
    onAlertUpdate(alertId, { 
      aiActionApproved: false,
      reviewNotes: 'AI recommendation rejected by analyst'
    });
  };

  return (
    <div className="alert-table-container">
      <div className="alert-table-header">
        <h2 className="alert-table-title">Security Alerts</h2>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#888'
              }} />
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Search alerts..."
                value={filter.searchTerm || ''}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Severity</label>
            <select
              className="filter-select"
              value={filter.severity?.[0] || ''}
              onChange={(e) => onFilterChange({ 
                severity: e.target.value ? [e.target.value as AlertSeverity] : undefined 
              })}
            >
              <option value="">All Severities</option>
              {Object.values(AlertSeverity).map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={filter.status?.[0] || ''}
              onChange={(e) => onFilterChange({ 
                status: e.target.value ? [e.target.value as AlertStatus] : undefined 
              })}
            >
              <option value="">All Statuses</option>
              {Object.values(AlertStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">System</label>
            <select
              className="filter-select"
              value={filter.sourceSystem?.[0] || ''}
              onChange={(e) => onFilterChange({ 
                sourceSystem: e.target.value ? [e.target.value as SecuritySystem] : undefined 
              })}
            >
              <option value="">All Systems</option>
              {Object.values(SecuritySystem).map(system => (
                <option key={system} value={system}>{system}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Reviewed</label>
            <select
              className="filter-select"
              value={filter.isReviewed === undefined ? '' : filter.isReviewed.toString()}
              onChange={(e) => onFilterChange({ 
                isReviewed: e.target.value === '' ? undefined : e.target.value === 'true'
              })}
            >
              <option value="">All</option>
              <option value="false">Not Reviewed</option>
              <option value="true">Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="alert-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                Alert Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('severity')} style={{ cursor: 'pointer' }}>
                Severity {sortField === 'severity' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('sourceSystem')} style={{ cursor: 'pointer' }}>
                Source {sortField === 'sourceSystem' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>AI Analysis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlerts.map((alert) => (
              <React.Fragment key={alert.id}>
                <tr>
                  <td>
                    <div className="alert-title-cell">
                      <div className="title-row">
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {alert.title}
                        </div>
                        {alert.aiInvestigationReport && (
                          <button
                            className="expand-btn"
                            onClick={() => toggleAlertExpansion(alert.id)}
                            title={expandedAlerts.has(alert.id) ? 'Collapse Investigation' : 'Expand Investigation'}
                          >
                            {expandedAlerts.has(alert.id) ? (
                              <ChevronDown width="16" height="16" />
                            ) : (
                              <ChevronRight width="16" height="16" />
                            )}
                            <FileText width="14" height="14" />
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                        {alert.description.substring(0, 100)}...
                      </div>
                      <div className="tags">
                        {alert.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                        {alert.tags.length > 3 && (
                          <span className="tag">+{alert.tags.length - 3}</span>
                        )}
                      </div>
                      {!alert.isReviewed && (
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          marginTop: '4px',
                          color: '#ff8800',
                          fontSize: '0.7rem'
                        }}>
                          <EyeOff width="12" height="12" />
                          Not Reviewed
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`severity-badge ${getSeverityClass(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(alert.priority)}`}>
                      {alert.priority}
                    </span>
                  </td>
                  <td>
                    <span className="system-badge">
                      {alert.sourceSystem}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>{format(alert.createdAt, 'MMM dd, yyyy')}</div>
                      <div style={{ color: '#888' }}>
                        {format(alert.createdAt, 'HH:mm')}
                      </div>
                    </div>
                  </td>
                  <td>
                    {alert.aiAnalysis ? (
                      <div className="ai-analysis">
                        <div className="ai-analysis-title">
                          <Bot width="12" height="12" style={{ marginRight: '4px' }} />
                          AI Analysis
                        </div>
                        <div className="ai-confidence">
                          Confidence: {alert.aiAnalysis.confidence}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#00ff88', marginTop: '2px' }}>
                          {alert.aiAnalysis.classification}
                        </div>
                        {alert.aiAnalysis.recommendations.length > 0 && (
                          <div className="ai-recommendations">
                            {alert.aiAnalysis.recommendations.slice(0, 2).map((rec, idx) => (
                              <div key={idx} className="ai-recommendation">
                                • {rec}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#888', fontSize: '0.8rem' }}>
                        No AI Analysis
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {!alert.isReviewed && (
                        <button
                          className="action-btn primary"
                          onClick={() => handleMarkAsReviewed(alert.id)}
                          title="Mark as Reviewed"
                        >
                          <Eye width="12" height="12" />
                        </button>
                      )}
                      <button
                        className="action-btn"
                        onClick={() => handleMarkAsFalsePositive(alert.id)}
                        title="Mark as False Positive"
                      >
                        <XCircle width="12" height="12" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleEscalate(alert.id)}
                        title="Escalate Alert"
                      >
                        <AlertCircle width="12" height="12" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Investigation Report Row */}
                {expandedAlerts.has(alert.id) && alert.aiInvestigationReport && (
                  <tr>
                    <td colSpan={8} style={{ padding: 0, border: 'none' }}>
                      <InvestigationReport
                        report={alert.aiInvestigationReport}
                        isExpanded={true}
                        onToggle={() => toggleAlertExpansion(alert.id)}
                        onApproveAction={() => handleApproveAction(alert.id)}
                        onRejectAction={() => handleRejectAction(alert.id)}
                        isActionApproved={alert.aiActionApproved}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertTable;
