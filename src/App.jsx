import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { EquipmentProvider } from './context/EquipmentContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StaffDashboard } from './components/dashboard/StaffDashboard';
import { FacultyDashboard } from './components/dashboard/FacultyDashboard';
import { EquipmentList } from './components/equipment/EquipmentList';
import { ScheduleList } from './components/maintenance/ScheduleList';
import { IssueList } from './components/issues/IssueList';
import { DowntimeAnalytics } from './components/downtime/DowntimeAnalytics';
import { ReportIssueModal } from './components/issues/ReportIssueModal';

const AppContent = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Render Login page if user is not logged in (FR-01)
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'admin') return <AdminDashboard setActiveTab={setActiveTab} />;
        if (currentUser.role === 'staff') return <StaffDashboard setActiveTab={setActiveTab} />;
        return <FacultyDashboard setActiveTab={setActiveTab} onOpenReportModal={() => setIsReportModalOpen(true)} />;

      case 'equipment':
      case 'equipment-lookup':
        return <EquipmentList />;

      case 'schedule':
      case 'assigned-tasks':
        return <ScheduleList />;

      case 'issues':
      case 'assigned-issues':
      case 'my-issues':
        return <IssueList />;

      case 'report-issue':
        return (
          <div className="space-y-4">
            <IssueList />
          </div>
        );

      case 'downtime':
        return <DowntimeAnalytics />;

      default:
        return <AdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderTabContent()}
        </main>
      </div>

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <EquipmentProvider>
          <AppContent />
        </EquipmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
