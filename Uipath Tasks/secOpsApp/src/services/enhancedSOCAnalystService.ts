import { UiPath } from '@uipath/uipath-typescript';
import { SecurityAlert, AIAnalysis, SOCAnalystTask, UiPathConfig } from '../types';

export interface MaestroProcessConfig {
  processKey: string;
  folderId: string;
  inputSchema: any;
  outputSchema: any;
}

export interface DataEntityConfig {
  entityName: string;
  schema: any;
}

export class EnhancedSOCAnalystService {
  private sdk: UiPath | null = null;
  private config: UiPathConfig;
  private maestroConfig?: MaestroProcessConfig;
  private dataEntityConfig?: DataEntityConfig;

  constructor(
    config: UiPathConfig, 
    maestroConfig?: MaestroProcessConfig,
    dataEntityConfig?: DataEntityConfig
  ) {
    this.config = config;
    this.maestroConfig = maestroConfig;
    this.dataEntityConfig = dataEntityConfig;
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

      if (this.config.clientId) {
        await this.sdk.initialize();
      }

      console.log('Enhanced SOC Analyst Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Enhanced SOC Analyst Service:', error);
      throw error;
    }
  }

  // Method 1: Using UiPath Tasks (Current Implementation)
  async analyzeAlertViaTasks(alert: SecurityAlert): Promise<AIAnalysis> {
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
          createdAt: alert.createdAt.toISOString(),
          analysisType: 'SECURITY_ALERT_ANALYSIS'
        }
      });

      // Wait for task completion and get results
      const analysis = await this.waitForTaskCompletion(task.id);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze alert via tasks:', error);
      throw error;
    }
  }

  // Method 2: Using Maestro Processes
  async analyzeAlertViaMaestro(alert: SecurityAlert): Promise<AIAnalysis> {
    if (!this.sdk || !this.maestroConfig) {
      throw new Error('SOC Analyst Service or Maestro config not initialized');
    }

    try {
      // Start a Maestro process for AI analysis
      const processInstance = await this.sdk.maestro.processes.instances.start({
        processKey: this.maestroConfig.processKey,
        input: {
          alertId: alert.id,
          alertTitle: alert.title,
          alertDescription: alert.description,
          sourceSystem: alert.sourceSystem,
          severity: alert.severity,
          tags: alert.tags,
          createdAt: alert.createdAt.toISOString(),
          analysisType: 'SECURITY_ALERT_ANALYSIS'
        }
      }, this.maestroConfig.folderId);

      // Wait for process completion
      const result = await this.waitForMaestroProcessCompletion(processInstance.id);
      
      return this.mapMaestroResultToAnalysis(result, alert.id);
    } catch (error) {
      console.error('Failed to analyze alert via Maestro:', error);
      throw error;
    }
  }

  // Method 3: Using Data Entities (for storing/retrieving analysis results)
  async storeAnalysisInDataEntity(analysis: AIAnalysis): Promise<void> {
    if (!this.sdk || !this.dataEntityConfig) {
      throw new Error('SOC Analyst Service or Data Entity config not initialized');
    }

    try {
      // Store analysis results in Data Fabric
      await this.sdk.entities.create({
        entityName: this.dataEntityConfig.entityName,
        data: {
          analysisId: analysis.id,
          alertId: analysis.alertId,
          classification: analysis.classification,
          confidence: analysis.confidence,
          riskScore: analysis.riskScore,
          investigationLevel: analysis.investigationLevel,
          recommendations: analysis.recommendations,
          automatedActions: analysis.automatedActions,
          analystAgent: analysis.analystAgent,
          createdAt: analysis.createdAt.toISOString()
        }
      });

      console.log(`Analysis ${analysis.id} stored in Data Entity`);
    } catch (error) {
      console.error('Failed to store analysis in Data Entity:', error);
      throw error;
    }
  }

  async getAnalysisFromDataEntity(alertId: string): Promise<AIAnalysis | null> {
    if (!this.sdk || !this.dataEntityConfig) {
      throw new Error('SOC Analyst Service or Data Entity config not initialized');
    }

    try {
      // Query Data Fabric for existing analysis
      const entities = await this.sdk.entities.getAll({
        filter: `alertId eq '${alertId}'`,
        entityName: this.dataEntityConfig.entityName
      });

      if (entities.length > 0) {
        const entity = entities[0];
        return this.mapEntityToAnalysis(entity);
      }

      return null;
    } catch (error) {
      console.error('Failed to get analysis from Data Entity:', error);
      throw error;
    }
  }

  // Method 4: Hybrid Approach - Use Maestro for processing, Data Entities for storage
  async analyzeAlertHybrid(alert: SecurityAlert): Promise<AIAnalysis> {
    if (!this.sdk || !this.maestroConfig || !this.dataEntityConfig) {
      throw new Error('SOC Analyst Service, Maestro, or Data Entity config not initialized');
    }

    try {
      // First, check if analysis already exists in Data Entity
      const existingAnalysis = await this.getAnalysisFromDataEntity(alert.id);
      if (existingAnalysis) {
        console.log(`Using cached analysis for alert ${alert.id}`);
        return existingAnalysis;
      }

      // Start Maestro process for AI analysis
      const processInstance = await this.sdk.maestro.processes.instances.start({
        processKey: this.maestroConfig.processKey,
        input: {
          alertId: alert.id,
          alertTitle: alert.title,
          alertDescription: alert.description,
          sourceSystem: alert.sourceSystem,
          severity: alert.severity,
          tags: alert.tags,
          createdAt: alert.createdAt.toISOString(),
          analysisType: 'SECURITY_ALERT_ANALYSIS'
        }
      }, this.maestroConfig.folderId);

      // Wait for process completion
      const result = await this.waitForMaestroProcessCompletion(processInstance.id);
      const analysis = this.mapMaestroResultToAnalysis(result, alert.id);

      // Store the analysis in Data Entity for future reference
      await this.storeAnalysisInDataEntity(analysis);

      return analysis;
    } catch (error) {
      console.error('Failed to analyze alert via hybrid approach:', error);
      throw error;
    }
  }

  // Method 5: Get all analyses from Data Entity (for dashboard/reporting)
  async getAllAnalysesFromDataEntity(): Promise<AIAnalysis[]> {
    if (!this.sdk || !this.dataEntityConfig) {
      throw new Error('SOC Analyst Service or Data Entity config not initialized');
    }

    try {
      const entities = await this.sdk.entities.getAll({
        entityName: this.dataEntityConfig.entityName,
        orderBy: 'createdAt desc'
      });

      return entities.map(entity => this.mapEntityToAnalysis(entity));
    } catch (error) {
      console.error('Failed to get all analyses from Data Entity:', error);
      throw error;
    }
  }

  // Helper methods
  private async waitForTaskCompletion(taskId: string): Promise<AIAnalysis> {
    // Poll for task completion
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max wait

    while (attempts < maxAttempts) {
      const task = await this.sdk!.tasks.getById(taskId);
      
      if (task.status === 'Completed') {
        return this.mapTaskResultToAnalysis(task.data, taskId);
      }
      
      if (task.status === 'Failed') {
        throw new Error(`Task ${taskId} failed: ${task.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    }

    throw new Error(`Task ${taskId} did not complete within timeout period`);
  }

  private async waitForMaestroProcessCompletion(processInstanceId: string): Promise<any> {
    // Poll for Maestro process completion
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max wait

    while (attempts < maxAttempts) {
      const processInstance = await this.sdk!.maestro.processes.instances.getById(processInstanceId);
      
      if (processInstance.status === 'Completed') {
        return processInstance.output;
      }
      
      if (processInstance.status === 'Failed') {
        throw new Error(`Maestro process ${processInstanceId} failed: ${processInstance.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    }

    throw new Error(`Maestro process ${processInstanceId} did not complete within timeout period`);
  }

  private mapTaskResultToAnalysis(taskData: any, taskId: string): AIAnalysis {
    return {
      id: `analysis-${taskId}`,
      alertId: taskData.alertId,
      classification: taskData.classification || 'Unknown',
      confidence: taskData.confidence || 0,
      recommendations: taskData.recommendations || [],
      riskScore: taskData.riskScore || 0,
      investigationLevel: taskData.investigationLevel || 'Level 2 - Semi-Automated',
      automatedActions: taskData.automatedActions || [],
      createdAt: new Date(),
      analystAgent: 'AI-SOC-Analyst-v2.1'
    };
  }

  private mapMaestroResultToAnalysis(maestroOutput: any, alertId: string): AIAnalysis {
    return {
      id: `analysis-${alertId}`,
      alertId: alertId,
      classification: maestroOutput.classification || 'Unknown',
      confidence: maestroOutput.confidence || 0,
      recommendations: maestroOutput.recommendations || [],
      riskScore: maestroOutput.riskScore || 0,
      investigationLevel: maestroOutput.investigationLevel || 'Level 2 - Semi-Automated',
      automatedActions: maestroOutput.automatedActions || [],
      createdAt: new Date(),
      analystAgent: 'AI-SOC-Analyst-v2.1'
    };
  }

  private mapEntityToAnalysis(entity: any): AIAnalysis {
    return {
      id: entity.data.analysisId,
      alertId: entity.data.alertId,
      classification: entity.data.classification,
      confidence: entity.data.confidence,
      recommendations: entity.data.recommendations,
      riskScore: entity.data.riskScore,
      investigationLevel: entity.data.investigationLevel,
      automatedActions: entity.data.automatedActions,
      createdAt: new Date(entity.data.createdAt),
      analystAgent: entity.data.analystAgent
    };
  }

  private mapPriorityToTaskPriority(priority: string): string {
    if (priority.includes('P0')) return 'High';
    if (priority.includes('P1')) return 'High';
    if (priority.includes('P2')) return 'Medium';
    if (priority.includes('P3')) return 'Low';
    return 'Medium';
  }
}

// Configuration examples
export const createSOCAnalystService = (config: UiPathConfig) => {
  // Example configurations for different integration patterns
  
  // Maestro Process Configuration
  const maestroConfig: MaestroProcessConfig = {
    processKey: 'SOC-Analyst-AI-Process',
    folderId: 'your-folder-id',
    inputSchema: {
      alertId: 'string',
      alertTitle: 'string',
      alertDescription: 'string',
      sourceSystem: 'string',
      severity: 'string',
      tags: 'array',
      createdAt: 'string',
      analysisType: 'string'
    },
    outputSchema: {
      classification: 'string',
      confidence: 'number',
      riskScore: 'number',
      investigationLevel: 'string',
      recommendations: 'array',
      automatedActions: 'array'
    }
  };

  // Data Entity Configuration
  const dataEntityConfig: DataEntityConfig = {
    entityName: 'SecurityAlertAnalysis',
    schema: {
      analysisId: 'string',
      alertId: 'string',
      classification: 'string',
      confidence: 'number',
      riskScore: 'number',
      investigationLevel: 'string',
      recommendations: 'array',
      automatedActions: 'array',
      analystAgent: 'string',
      createdAt: 'datetime'
    }
  };

  return new EnhancedSOCAnalystService(config, maestroConfig, dataEntityConfig);
};
