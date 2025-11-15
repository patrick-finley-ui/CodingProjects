import React, { useState } from 'react';
import { Settings, Database, Workflow, Tasks, Zap } from 'lucide-react';

interface IntegrationConfigProps {
  onConfigChange: (config: any) => void;
}

const IntegrationConfig: React.FC<IntegrationConfigProps> = ({ onConfigChange }) => {
  const [integrationType, setIntegrationType] = useState<'tasks' | 'maestro' | 'dataEntity' | 'hybrid'>('tasks');
  const [config, setConfig] = useState({
    // UiPath Configuration
    baseUrl: 'https://cloud.uipath.com',
    orgName: '',
    tenantName: '',
    secret: '',
    
    // Maestro Configuration
    maestroProcessKey: 'SOC-Analyst-AI-Process',
    maestroFolderId: '',
    
    // Data Entity Configuration
    dataEntityName: 'SecurityAlertAnalysis',
    
    // Task Configuration
    taskQueueName: 'SOC-Analyst-Queue'
  });

  const handleConfigChange = (field: string, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onConfigChange({ integrationType, config: newConfig });
  };

  const integrationOptions = [
    {
      id: 'tasks',
      name: 'UiPath Tasks',
      description: 'Create tasks for AI SOC Analyst Agent to process',
      icon: Tasks,
      pros: ['Simple setup', 'Built-in task management', 'Easy to monitor'],
      cons: ['Limited scalability', 'Manual task assignment']
    },
    {
      id: 'maestro',
      name: 'Maestro Processes',
      description: 'Use Maestro processes for AI analysis workflows',
      icon: Workflow,
      pros: ['Advanced workflows', 'Better scalability', 'Process orchestration'],
      cons: ['More complex setup', 'Requires Maestro knowledge']
    },
    {
      id: 'dataEntity',
      name: 'Data Entities',
      description: 'Store and retrieve analysis results from Data Fabric',
      icon: Database,
      pros: ['Persistent storage', 'Query capabilities', 'Data analytics'],
      cons: ['Read-only for analysis', 'Requires separate processing']
    },
    {
      id: 'hybrid',
      name: 'Hybrid Approach',
      description: 'Maestro for processing + Data Entities for storage',
      icon: Zap,
      pros: ['Best of both worlds', 'Scalable processing', 'Persistent results'],
      cons: ['Most complex setup', 'Multiple components']
    }
  ];

  return (
    <div className="integration-config">
      <div className="config-header">
        <Settings className="config-icon" />
        <h2>UiPath Integration Configuration</h2>
      </div>

      <div className="integration-types">
        <h3>Choose Integration Method</h3>
        <div className="integration-grid">
          {integrationOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div 
                key={option.id}
                className={`integration-option ${integrationType === option.id ? 'selected' : ''}`}
                onClick={() => setIntegrationType(option.id as any)}
              >
                <div className="option-header">
                  <IconComponent className="option-icon" />
                  <h4>{option.name}</h4>
                </div>
                <p className="option-description">{option.description}</p>
                <div className="option-pros-cons">
                  <div className="pros">
                    <strong>Pros:</strong>
                    <ul>
                      {option.pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cons">
                    <strong>Cons:</strong>
                    <ul>
                      {option.cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="config-form">
        <h3>Configuration Settings</h3>
        
        {/* UiPath Base Configuration */}
        <div className="config-section">
          <h4>UiPath Cloud Configuration</h4>
          <div className="form-group">
            <label>Base URL</label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
              placeholder="https://cloud.uipath.com"
            />
          </div>
          <div className="form-group">
            <label>Organization Name</label>
            <input
              type="text"
              value={config.orgName}
              onChange={(e) => handleConfigChange('orgName', e.target.value)}
              placeholder="your-organization"
            />
          </div>
          <div className="form-group">
            <label>Tenant Name</label>
            <input
              type="text"
              value={config.tenantName}
              onChange={(e) => handleConfigChange('tenantName', e.target.value)}
              placeholder="your-tenant"
            />
          </div>
          <div className="form-group">
            <label>Personal Access Token</label>
            <input
              type="password"
              value={config.secret}
              onChange={(e) => handleConfigChange('secret', e.target.value)}
              placeholder="your-pat-token"
            />
          </div>
        </div>

        {/* Maestro Configuration */}
        {(integrationType === 'maestro' || integrationType === 'hybrid') && (
          <div className="config-section">
            <h4>Maestro Process Configuration</h4>
            <div className="form-group">
              <label>Process Key</label>
              <input
                type="text"
                value={config.maestroProcessKey}
                onChange={(e) => handleConfigChange('maestroProcessKey', e.target.value)}
                placeholder="SOC-Analyst-AI-Process"
              />
            </div>
            <div className="form-group">
              <label>Folder ID</label>
              <input
                type="text"
                value={config.maestroFolderId}
                onChange={(e) => handleConfigChange('maestroFolderId', e.target.value)}
                placeholder="your-folder-id"
              />
            </div>
          </div>
        )}

        {/* Data Entity Configuration */}
        {(integrationType === 'dataEntity' || integrationType === 'hybrid') && (
          <div className="config-section">
            <h4>Data Entity Configuration</h4>
            <div className="form-group">
              <label>Entity Name</label>
              <input
                type="text"
                value={config.dataEntityName}
                onChange={(e) => handleConfigChange('dataEntityName', e.target.value)}
                placeholder="SecurityAlertAnalysis"
              />
            </div>
          </div>
        )}

        {/* Task Configuration */}
        {integrationType === 'tasks' && (
          <div className="config-section">
            <h4>Task Queue Configuration</h4>
            <div className="form-group">
              <label>Queue Name</label>
              <input
                type="text"
                value={config.taskQueueName}
                onChange={(e) => handleConfigChange('taskQueueName', e.target.value)}
                placeholder="SOC-Analyst-Queue"
              />
            </div>
          </div>
        )}
      </div>

      <div className="config-summary">
        <h3>Integration Summary</h3>
        <div className="summary-content">
          <p><strong>Method:</strong> {integrationOptions.find(opt => opt.id === integrationType)?.name}</p>
          <p><strong>Description:</strong> {integrationOptions.find(opt => opt.id === integrationType)?.description}</p>
          
          {integrationType === 'tasks' && (
            <div className="code-example">
              <h4>Usage Example:</h4>
              <pre>{`const socService = new SOCAnalystService({
  baseUrl: '${config.baseUrl}',
  orgName: '${config.orgName}',
  tenantName: '${config.tenantName}',
  secret: '${config.secret}'
});

await socService.initialize();
const analysis = await socService.analyzeAlert(alert);`}</pre>
            </div>
          )}

          {integrationType === 'maestro' && (
            <div className="code-example">
              <h4>Usage Example:</h4>
              <pre>{`const socService = new EnhancedSOCAnalystService(
  { baseUrl: '${config.baseUrl}', orgName: '${config.orgName}', tenantName: '${config.tenantName}', secret: '${config.secret}' },
  { processKey: '${config.maestroProcessKey}', folderId: '${config.maestroFolderId}' }
);

await socService.initialize();
const analysis = await socService.analyzeAlertViaMaestro(alert);`}</pre>
            </div>
          )}

          {integrationType === 'hybrid' && (
            <div className="code-example">
              <h4>Usage Example:</h4>
              <pre>{`const socService = new EnhancedSOCAnalystService(
  { baseUrl: '${config.baseUrl}', orgName: '${config.orgName}', tenantName: '${config.tenantName}', secret: '${config.secret}' },
  { processKey: '${config.maestroProcessKey}', folderId: '${config.maestroFolderId}' },
  { entityName: '${config.dataEntityName}' }
);

await socService.initialize();
const analysis = await socService.analyzeAlertHybrid(alert);`}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationConfig;



