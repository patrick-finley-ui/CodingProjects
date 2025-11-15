import React from 'react';
import { Shield, Activity, Clock, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  totalAlerts?: number;
  criticalAlerts?: number;
  avgResolutionTime?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  totalAlerts = 0, 
  criticalAlerts = 0, 
  avgResolutionTime = 0 
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <Shield className="icon" />
          <h1>SecOps Portal</h1>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-value">{totalAlerts}</div>
            <div className="stat-label">Total Alerts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{criticalAlerts}</div>
            <div className="stat-label">Critical</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{avgResolutionTime}h</div>
            <div className="stat-label">Avg Resolution</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
