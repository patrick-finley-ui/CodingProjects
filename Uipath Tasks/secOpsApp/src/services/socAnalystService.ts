import { UiPath } from '@uipath/uipath-typescript';
import { SecurityAlert, AIAnalysis, AIInvestigationReport, SOCAnalystTask, UiPathConfig } from '../types';

export class SOCAnalystService {
  private sdk: UiPath | null = null;
  private config: UiPathConfig;

  constructor(config: UiPathConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      this.sdk = new UiPath({
        baseUrl: this.config.baseUrl,
        orgName: this.config.orgName,
        tenantName: this.config.tenantName,
        secret: this.config.secret,
        clientId: this.config.clientId,
        redirectUri: this.config.redirectUri,
        scope: this.config.scope
      });

      // Initialize if using OAuth
      if (this.config.clientId) {
        await this.sdk.initialize();
      }

      console.log('SOC Analyst Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SOC Analyst Service:', error);
      throw error;
    }
  }

  async analyzeAlert(alert: SecurityAlert): Promise<AIAnalysis> {
    if (!this.sdk) {
      throw new Error('SOC Analyst Service not initialized');
    }

    try {
      // Create a task for the AI SOC Analyst Agent
      const task = await this.sdk.tasks.create({
        title: `Analyze Security Alert: ${alert.title}`,
        priority: this.mapPriorityToTaskPriority(alert.priority),
        data: {
          alertId: alert.id,
          alertTitle: alert.title,
          alertDescription: alert.description,
          sourceSystem: alert.sourceSystem,
          severity: alert.severity,
          tags: alert.tags,
          createdAt: alert.createdAt.toISOString()
        }
      });

      // Simulate AI analysis (in real implementation, this would be handled by UiPath processes)
      const analysis = await this.simulateAIAnalysis(alert, task.id);

      return analysis;
    } catch (error) {
      console.error('Failed to analyze alert:', error);
      throw error;
    }
  }

  async investigateAlertViaMaestro(alert: SecurityAlert, folderId: string): Promise<AIInvestigationReport> {
    if (!this.sdk) {
      throw new Error('SOC Analyst Service not initialized');
    }

    try {
      // Start Maestro process for comprehensive investigation
      const processInstance = await this.sdk.maestro.processes.instances.start({
        processKey: 'SOC Analyst Alert Investigation',
        input: {
          alertId: alert.id,
          alertTitle: alert.title,
          alertDescription: alert.description,
          sourceSystem: alert.sourceSystem,
          severity: alert.severity,
          priority: alert.priority,
          tags: alert.tags,
          createdAt: alert.createdAt.toISOString(),
          investigationType: 'COMPREHENSIVE_SECURITY_INVESTIGATION'
        }
      }, folderId);

      // Wait for process completion and get detailed investigation report
      const investigationReport = await this.waitForMaestroInvestigationCompletion(processInstance.id);
      
      return investigationReport;
    } catch (error) {
      console.error('Failed to investigate alert via Maestro:', error);
      throw error;
    }
  }

  async escalateAlert(alert: SecurityAlert, reason: string): Promise<void> {
    if (!this.sdk) {
      throw new Error('SOC Analyst Service not initialized');
    }

    try {
      // Create escalation task
      await this.sdk.tasks.create({
        title: `Escalate Alert: ${alert.title}`,
        priority: 'High',
        data: {
          alertId: alert.id,
          escalationReason: reason,
          currentLevel: alert.escalationLevel,
          targetLevel: alert.escalationLevel + 1
        }
      });

      console.log(`Alert ${alert.id} escalated successfully`);
    } catch (error) {
      console.error('Failed to escalate alert:', error);
      throw error;
    }
  }

  async getAnalystTasks(): Promise<SOCAnalystTask[]> {
    if (!this.sdk) {
      throw new Error('SOC Analyst Service not initialized');
    }

    try {
      const tasks = await this.sdk.tasks.getAll({
        filter: "title contains 'Security Alert' or title contains 'Escalate'"
      });

      return tasks.map(task => ({
        id: task.id,
        alertId: task.data?.alertId || '',
        taskType: this.determineTaskType(task.title),
        status: this.mapTaskStatus(task.status),
        priority: this.mapTaskPriority(task.priority),
        assignedAgent: 'AI-SOC-Analyst-v2.1',
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        result: task.data,
        error: task.error
      }));
    } catch (error) {
      console.error('Failed to get analyst tasks:', error);
      throw error;
    }
  }

  private async simulateAIAnalysis(alert: SecurityAlert, taskId: string): Promise<AIAnalysis> {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const classifications = [
      'Malware', 'Phishing', 'Data Exfiltration', 'Privilege Escalation',
      'Lateral Movement', 'Persistence', 'Defense Evasion', 'Credential Access',
      'Discovery', 'Collection', 'Command and Control', 'Exfiltration', 'Impact'
    ];

    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    const riskScore = Math.floor(Math.random() * 40) + 60; // 60-100

    return {
      id: `analysis-${alert.id}`,
      alertId: alert.id,
      classification: classification as any,
      confidence,
      recommendations: [
        'Review endpoint logs for additional indicators',
        'Check for lateral movement patterns',
        'Verify if data exfiltration occurred',
        'Update security policies if needed'
      ],
      riskScore,
      investigationLevel: confidence > 80 ? 'Level 1 - Automated' : 'Level 2 - Semi-Automated',
      automatedActions: [
        {
          id: `action-${alert.id}-1`,
          type: 'Collect Artifacts',
          description: 'Collecting system artifacts for analysis',
          status: 'Completed',
          executedAt: new Date(),
          result: 'Artifacts collected successfully'
        },
        {
          id: `action-${alert.id}-2`,
          type: 'Notify Team',
          description: 'Notifying security team of potential threat',
          status: 'Completed',
          executedAt: new Date(),
          result: 'Team notification sent'
        }
      ],
      createdAt: new Date(),
      analystAgent: 'AI-SOC-Analyst-v2.1'
    };
  }

  private mapPriorityToTaskPriority(priority: string): string {
    if (priority.includes('P0')) return 'High';
    if (priority.includes('P1')) return 'High';
    if (priority.includes('P2')) return 'Medium';
    if (priority.includes('P3')) return 'Low';
    return 'Medium';
  }

  private mapTaskStatus(status: string): 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' {
    switch (status.toLowerCase()) {
      case 'pending': return 'PENDING';
      case 'inprogress': return 'IN_PROGRESS';
      case 'completed': return 'COMPLETED';
      case 'failed': return 'FAILED';
      default: return 'PENDING';
    }
  }

  private mapTaskPriority(priority: string): 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low' | 'P4 - Info' {
    switch (priority.toLowerCase()) {
      case 'high': return 'P1 - High';
      case 'medium': return 'P2 - Medium';
      case 'low': return 'P3 - Low';
      default: return 'P2 - Medium';
    }
  }

  private determineTaskType(title: string): 'CLASSIFICATION' | 'INVESTIGATION' | 'ESCALATION' | 'RESOLUTION' {
    if (title.includes('Analyze')) return 'CLASSIFICATION';
    if (title.includes('Escalate')) return 'ESCALATION';
    if (title.includes('Investigate')) return 'INVESTIGATION';
    return 'RESOLUTION';
  }

  private async waitForMaestroInvestigationCompletion(processInstanceId: string): Promise<AIInvestigationReport> {
    // Poll for Maestro process completion
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max wait for investigation

    while (attempts < maxAttempts) {
      const processInstance = await this.sdk!.maestro.processes.instances.getById(processInstanceId);
      
      if (processInstance.status === 'Completed') {
        return this.mapMaestroOutputToInvestigationReport(processInstance.output, processInstanceId);
      }
      
      if (processInstance.status === 'Failed') {
        throw new Error(`Maestro investigation ${processInstanceId} failed: ${processInstance.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    }

    throw new Error(`Maestro investigation ${processInstanceId} did not complete within timeout period`);
  }

  private mapMaestroOutputToInvestigationReport(maestroOutput: any, processInstanceId: string): AIInvestigationReport {
    // Map Maestro process output to investigation report structure
    return {
      investigationId: `investigation-${processInstanceId}`,
      originalAlertReference: maestroOutput.originalAlertReference || 'Unknown Alert',
      segmentFocusArea: maestroOutput.segmentFocusArea || 'General Investigation',
      timestampRangeCovered: maestroOutput.timestampRangeCovered || 'Unknown Range',
      technicalSummary: maestroOutput.technicalSummary || 'Investigation completed by AI SOC Analyst Agent',
      eventTimeline: maestroOutput.eventTimeline || [],
      artifactInventory: maestroOutput.artifactInventory || {
        ipAddresses: [],
        users: [],
        devices: [],
        processes: [],
        files: [],
        servicePrincipals: [],
        resourcesAccessed: [],
        ports: [],
        urls: []
      },
      technicalAssessment: maestroOutput.technicalAssessment || {
        behaviorClassification: 'Unknown',
        evidence: 'Investigation in progress',
        comparisonAgainstKnownPatterns: 'Analysis pending',
        confidenceLevel: 'Medium'
      },
      highlightImpactfulAspects: maestroOutput.highlightImpactfulAspects || [],
      artifactsOfInterest: maestroOutput.artifactsOfInterest || {
        users: [],
        devices: [],
        processes: [],
        files: [],
        ipAddresses: [],
        applications: [],
        urls: []
      },
      classification: maestroOutput.classification || {
        classification: 'Under Investigation',
        classificationAction: 'Review Required'
      },
      sourcesUsed: maestroOutput.sourcesUsed || [],
      pastEvents: maestroOutput.pastEvents || []
    };
  }
}

// Mock implementation for development
export class MockSOCAnalystService extends SOCAnalystService {
  constructor() {
    super({
      baseUrl: 'https://cloud.uipath.com',
      orgName: 'mock-org',
      tenantName: 'mock-tenant',
      secret: 'mock-secret'
    });
  }

  async initialize(): Promise<void> {
    console.log('Mock SOC Analyst Service initialized');
  }

  async analyzeAlert(alert: SecurityAlert): Promise<AIAnalysis> {
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const classifications = [
      'Malware', 'Phishing', 'Data Exfiltration', 'Privilege Escalation',
      'Lateral Movement', 'Persistence', 'Defense Evasion', 'Credential Access',
      'Discovery', 'Collection', 'Command and Control', 'Exfiltration', 'Impact'
    ];

    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    const confidence = Math.floor(Math.random() * 40) + 60;

    return {
      id: `analysis-${alert.id}`,
      alertId: alert.id,
      classification: classification as any,
      confidence,
      recommendations: [
        'Review endpoint logs for additional indicators',
        'Check for lateral movement patterns',
        'Verify if data exfiltration occurred',
        'Update security policies if needed'
      ],
      riskScore: Math.floor(Math.random() * 40) + 60,
      investigationLevel: confidence > 80 ? 'Level 1 - Automated' : 'Level 2 - Semi-Automated',
      automatedActions: [
        {
          id: `action-${alert.id}-1`,
          type: 'Collect Artifacts',
          description: 'Collecting system artifacts for analysis',
          status: 'Completed',
          executedAt: new Date(),
          result: 'Artifacts collected successfully'
        }
      ],
      createdAt: new Date(),
      analystAgent: 'AI-SOC-Analyst-v2.1'
    };
  }

  async escalateAlert(alert: SecurityAlert, reason: string): Promise<void> {
    console.log(`Mock escalation for alert ${alert.id}: ${reason}`);
  }

  async getAnalystTasks(): Promise<SOCAnalystTask[]> {
    return [];
  }
}
