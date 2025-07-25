import React from 'react';
import { EmergencyProvider } from '../contexts/EmergencyContext';
import EmergencyDashboard from '../components/EmergencyDashboard';

const EmergencyDashboardPage = () => {
  return (
    <div className="min-h-screen">
      <EmergencyDashboard />
    </div>
  );
};

export default EmergencyDashboardPage;
