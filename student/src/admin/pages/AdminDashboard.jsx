import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardPage } from './DashboardPage';
import { BatchesPage } from './BatchesPage';
import { StudentsPage } from './StudentsPage';
import { CoursesPage } from './CoursesPage';

export function AdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage />;
      case 'batches':
        return <BatchesPage />;
      case 'students':
        return <StudentsPage />;
      case 'courses':
        return <CoursesPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      onLogout={onLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
}
