import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Clock, 
  Users, 
  Monitor, 
  HardDrive, 
  Globe, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AIInvestigationReport } from '../types';

interface InvestigationReportProps {
  report: AIInvestigationReport;
  isExpanded: boolean;
  onToggle: () => void;
  onApproveAction: () => void;
  onRejectAction: () => void;
  isActionApproved?: boolean;
}

const InvestigationReport: React.FC<InvestigationReportProps> = ({
  report,
  isExpanded,
  onToggle,
  onApproveAction,
  onRejectAction,
  isActionApproved = false
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderArtifactList = (artifacts: string[], icon: React.ReactNode) => {
    if (artifacts.length === 0) return <span className="no-data">No data available</span>;
    
    return (
      <div className="artifact-list">
        {artifacts.map((artifact, index) => (
          <div key={index} className="artifact-item">
            {icon}
            <span>{artifact}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="investigation-report">
      <div className="report-header" onClick={onToggle}>
        <div className="header-left">
          {isExpanded ? <ChevronDown className="chevron" /> : <ChevronRight className="chevron" />}
          <FileText className="report-icon" />
          <div className="header-info">
            <h3>AI Investigation Report</h3>
            <p className="investigation-id">ID: {report.investigationId}</p>
          </div>
        </div>
        <div className="header-right">
          <div className={`classification-badge ${report.classification.classification.toLowerCase().replace(' ', '-')}`}>
            {report.classification.classification}
          </div>
          <div className="confidence-level">
            Confidence: {report.technicalAssessment.confidenceLevel}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="report-content">
          {/* Investigation Overview */}
          <div className="report-section">
            <h4>Investigation Overview</h4>
            <div className="overview-grid">
              <div className="overview-item">
                <strong>Original Alert:</strong>
                <span>{report.originalAlertReference}</span>
              </div>
              <div className="overview-item">
                <strong>Focus Area:</strong>
                <span>{report.segmentFocusArea}</span>
              </div>
              <div className="overview-item">
                <strong>Time Range:</strong>
                <span>{report.timestampRangeCovered}</span>
              </div>
            </div>
          </div>

          {/* Technical Summary */}
          <div className="report-section">
            <h4>Technical Summary</h4>
            <p className="technical-summary">{report.technicalSummary}</p>
          </div>

          {/* Event Timeline */}
          <div className="report-section">
            <div className="section-header" onClick={() => toggleSection('timeline')}>
              <Clock className="section-icon" />
              <h4>Event Timeline</h4>
              {activeSection === 'timeline' ? <ChevronDown /> : <ChevronRight />}
            </div>
            {activeSection === 'timeline' && (
              <div className="timeline">
                {report.eventTimeline.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-timestamp">
                      {formatTimestamp(event.timestamp)}
                    </div>
                    <div className="timeline-description">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Artifact Inventory */}
          <div className="report-section">
            <div className="section-header" onClick={() => toggleSection('artifacts')}>
              <HardDrive className="section-icon" />
              <h4>Artifact Inventory</h4>
              {activeSection === 'artifacts' ? <ChevronDown /> : <ChevronRight />}
            </div>
            {activeSection === 'artifacts' && (
              <div className="artifact-inventory">
                <div className="artifact-category">
                  <h5><Globe className="category-icon" /> IP Addresses</h5>
                  {renderArtifactList(report.artifactInventory.ipAddresses, <Globe className="artifact-icon" />)}
                </div>
                <div className="artifact-category">
                  <h5><Users className="category-icon" /> Users</h5>
                  {renderArtifactList(report.artifactInventory.users, <Users className="artifact-icon" />)}
                </div>
                <div className="artifact-category">
                  <h5><Monitor className="category-icon" /> Devices</h5>
                  {renderArtifactList(report.artifactInventory.devices, <Monitor className="artifact-icon" />)}
                </div>
                <div className="artifact-category">
                  <h5><HardDrive className="category-icon" /> Processes</h5>
                  {renderArtifactList(report.artifactInventory.processes, <HardDrive className="artifact-icon" />)}
                </div>
                <div className="artifact-category">
                  <h5><FileText className="category-icon" /> Files</h5>
                  {renderArtifactList(report.artifactInventory.files, <FileText className="artifact-icon" />)}
                </div>
              </div>
            )}
          </div>

          {/* Technical Assessment */}
          <div className="report-section">
            <h4>Technical Assessment</h4>
            <div className="assessment-grid">
              <div className="assessment-item">
                <strong>Behavior Classification:</strong>
                <span className={`classification ${report.technicalAssessment.behaviorClassification.toLowerCase()}`}>
                  {report.technicalAssessment.behaviorClassification}
                </span>
              </div>
              <div className="assessment-item">
                <strong>Evidence:</strong>
                <span>{report.technicalAssessment.evidence}</span>
              </div>
              <div className="assessment-item">
                <strong>Pattern Comparison:</strong>
                <span>{report.technicalAssessment.comparisonAgainstKnownPatterns}</span>
              </div>
            </div>
          </div>

          {/* Impactful Aspects */}
          <div className="report-section">
            <h4>Highlight Impactful Aspects</h4>
            <ul className="impact-list">
              {report.highlightImpactfulAspects.map((aspect, index) => (
                <li key={index}>{aspect}</li>
              ))}
            </ul>
          </div>

          {/* Sources Used */}
          <div className="report-section">
            <h4>Sources Used</h4>
            <div className="sources-grid">
              {report.sourcesUsed.map((source, index) => (
                <div key={index} className={`source-item ${source.relevant ? 'relevant' : 'not-relevant'}`}>
                  <div className="source-name">{source.source}</div>
                  <div className="source-status">
                    {source.relevant ? (
                      <CheckCircle className="status-icon relevant" />
                    ) : (
                      <XCircle className="status-icon not-relevant" />
                    )}
                    {source.relevant ? 'Relevant' : 'Not Relevant'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="report-section recommendation-section">
            <h4>AI Recommendation</h4>
            <div className="recommendation">
              <div className="recommendation-content">
                <AlertTriangle className="recommendation-icon" />
                <div>
                  <strong>Classification:</strong> {report.classification.classification}
                </div>
                <div>
                  <strong>Recommended Action:</strong> {report.classification.classificationAction}
                </div>
              </div>
              
              {!isActionApproved && (
                <div className="approval-actions">
                  <button 
                    className="approve-btn"
                    onClick={onApproveAction}
                    title="Approve AI Recommendation"
                  >
                    <CheckCircle className="action-icon" />
                    Approve Action
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={onRejectAction}
                    title="Reject AI Recommendation"
                  >
                    <XCircle className="action-icon" />
                    Reject Action
                  </button>
                </div>
              )}
              
              {isActionApproved && (
                <div className="approved-status">
                  <CheckCircle className="approved-icon" />
                  <span>Action Approved by Analyst</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestigationReport;



