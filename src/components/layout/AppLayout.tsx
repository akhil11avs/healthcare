import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppSelector } from '../../app/store';
import { useAuth } from '../../hooks/useAuth';
import './AppLayout.css';

export function AppLayout() {
  const { isAuthenticated, authLoading } = useAuth();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);

  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <span className="app-loading-text">Loading HealthOS...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar />
        <main className="page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
