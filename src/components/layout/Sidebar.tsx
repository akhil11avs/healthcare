import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Users, ChevronLeft, ChevronRight,
  LogOut, Stethoscope
} from 'lucide-react';
import { useAppDispatch, useAppSelector, toggleSidebar } from '../../app/store';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', id: 'nav-dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', id: 'nav-analytics' },
  { to: '/patients', icon: Users, label: 'Patients', id: 'nav-patients' },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`} id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Stethoscope size={20} />
        </div>
        {!sidebarCollapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-brand">HealthOS</span>
            <span className="sidebar-brand-sub">Enterprise</span>
          </div>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          id="sidebar-collapse-btn"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-group">
          {navItems.map(({ to, icon: Icon, label, id }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              id={id}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon size={18} className="sidebar-nav-icon" />
              {!sidebarCollapsed && <span className="sidebar-nav-text">{label}</span>}
              {sidebarCollapsed && <span className="sr-only">{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom items */}
      <div className="sidebar-bottom">
        <button
          onClick={handleSignOut}
          id="sidebar-signout-btn"
          className="sidebar-nav-item sidebar-signout"
          title={sidebarCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={18} className="sidebar-nav-icon" />
          {!sidebarCollapsed && <span className="sidebar-nav-text">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
