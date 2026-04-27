import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown, X, CheckCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector, markAllRead, markRead } from '../../app/store';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import './Topbar.css';

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patients',
};

export function Topbar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const pathLabel =
    Object.entries(pageLabels).find(([path]) => path === location.pathname)?.[1] ??
    (location.pathname.startsWith('/patients/') ? 'Patient Details' : 'Page');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifTypeIcon: Record<string, string> = {
    critical: '🚨', warning: '⚠️', success: '✅', info: 'ℹ️',
  };

  return (
    <header className="topbar" id="topbar">
      {/* Breadcrumb */}
      <div className="topbar-left">
        <h1 className="topbar-page-title">{pathLabel}</h1>
        <span className="topbar-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <Search size={15} className="topbar-search-icon" />
        <input
          type="search"
          placeholder="Search patients, records..."
          className="topbar-search-input"
          id="topbar-search"
          aria-label="Global search"
        />
      </div>

      {/* Right */}
      <div className="topbar-right">
        {/* Notification Bell */}
        <div className="topbar-notif-wrapper" ref={notifRef}>
          <button
            className="topbar-icon-btn"
            id="notification-bell"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="topbar-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-panel" id="notification-panel">
              <div className="notif-panel-header">
                <span className="notif-panel-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-markall" onClick={() => dispatch(markAllRead())} id="mark-all-read">
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
                <button className="notif-close" onClick={() => setNotifOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                    onClick={() => dispatch(markRead(n.id))}
                  >
                    <span className="notif-icon">{notifTypeIcon[n.type]}</span>
                    <div className="notif-content">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                    {!n.read && <span className="notif-dot" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        {user && (
          <div className="topbar-user">
            <Avatar
              initials={user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              color="#2563eb"
              size="sm"
              name={user.displayName}
            />
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user.displayName}</span>
              <Badge variant="info" size="sm">{user.role}</Badge>
            </div>
            <ChevronDown size={14} className="topbar-user-chevron" />
          </div>
        )}
      </div>
    </header>
  );
}
