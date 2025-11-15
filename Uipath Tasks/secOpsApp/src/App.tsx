import React, { useState, useEffect } from 'react';
import { SecurityAlert, DashboardKPIs, AlertFilter } from './types';
import { generateMockAlerts, generateMockKPIs } from './data/mockData';
import Dashboard from './components/Dashboard';
import AlertTable from './components/AlertTable';
import Header from './components/Header';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<SecurityAlert[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [filter, setFilter] = useState<AlertFilter>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAlerts = generateMockAlerts();
      const mockKPIs = generateMockKPIs(mockAlerts);
      
      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts);
      setKpis(mockKPIs);
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = alerts;

    if (filter.severity && filter.severity.length > 0) {
      filtered = filtered.filter(alert => filter.severity!.includes(alert.severity));
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(alert => filter.status!.includes(alert.status));
    }

    if (filter.sourceSystem && filter.sourceSystem.length > 0) {
      filtered = filtered.filter(alert => filter.sourceSystem!.includes(alert.sourceSystem));
    }

    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(alert => filter.priority!.includes(alert.priority));
    }

    if (filter.isReviewed !== undefined) {
      filtered = filtered.filter(alert => alert.isReviewed === filter.isReviewed);
    }

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filter.dateRange) {
      filtered = filtered.filter(alert => 
        alert.createdAt >= filter.dateRange!.start && 
        alert.createdAt <= filter.dateRange!.end
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filter]);

  const handleFilterChange = (newFilter: Partial<AlertFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handleAlertUpdate = (alertId: string, updates: Partial<SecurityAlert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, ...updates, updatedAt: new Date() } : alert
    ));
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading SecOps Portal...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        totalAlerts={kpis?.totalAlerts}
        criticalAlerts={kpis?.criticalAlerts}
        avgResolutionTime={kpis?.avgResolutionTime}
      />
      <main className="app-main">
        <Dashboard kpis={kpis!} />
        <AlertTable 
          alerts={filteredAlerts}
          filter={filter}
          onFilterChange={handleFilterChange}
          onAlertUpdate={handleAlertUpdate}
        />
      </main>
    </div>
  );
}

export default App;
