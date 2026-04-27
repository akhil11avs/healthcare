import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../app/store';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { mockAppointments } from '../../data/patients';
import { kpiTrends } from '../../data/analytics';
import './DashboardPage.css';

const ITEMS_PER_ROW = 5;

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  accent: string;
  data: number[];
  id: string;
}

function KPICard({ label, value, change, changeLabel, icon, accent, data, id }: KPICardProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const isPos = change >= 0;

  return (
    <div className="kpi-card" id={id}>
      <div className="kpi-header">
        <div className="kpi-icon" style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}>
          {icon}
        </div>
        <div className={`kpi-change ${isPos ? 'kpi-change--pos' : 'kpi-change--neg'}`}>
          {isPos ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-change-label">{changeLabel}</div>
      <div className="kpi-sparkline">
        <ResponsiveContainer width="100%" height={52}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.25} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ display: 'none' }}
              cursor={{ stroke: accent, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={accent}
              strokeWidth={2}
              fill={`url(#grad-${id})`}
              dot={false}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { patients } = useAppSelector(state => state.patients);
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter(p => p.status === 'Active').length,
    critical: patients.filter(p => p.status === 'Critical').length,
    recovery: Math.round((patients.filter(p => p.status === 'Recovering' || p.status === 'Discharged').length / patients.length) * 100),
  }), [patients]);

  const recentPatients = patients.slice(0, ITEMS_PER_ROW * 2);

  return (
    <div className="dashboard animate-fade-in" id="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="gradient-text">{user?.displayName} 👋</span>
          </h2>
          <p className="page-subtitle">Here's what's happening at your facility today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" id="kpi-grid">
        <KPICard
          id="kpi-total-patients"
          label="Total Patients"
          value={stats.total.toString()}
          change={8.2}
          changeLabel="vs last month"
          icon={<Users size={18} />}
          accent="#3b82f6"
          data={kpiTrends.patients}
        />
        <KPICard
          id="kpi-active"
          label="Active Cases"
          value={stats.active.toString()}
          change={3.1}
          changeLabel="vs last month"
          icon={<Activity size={18} />}
          accent="#10b981"
          data={kpiTrends.recoveryRate}
        />
        <KPICard
          id="kpi-critical"
          label="Critical Patients"
          value={stats.critical.toString()}
          change={-12.5}
          changeLabel="vs last month"
          icon={<TrendingUp size={18} />}
          accent="#f43f5e"
          data={kpiTrends.appointments.map(v => 25 - v)}
        />
        <KPICard
          id="kpi-appointments"
          label="Appointments Today"
          value={mockAppointments.length.toString()}
          change={18.3}
          changeLabel="vs yesterday"
          icon={<Calendar size={18} />}
          accent="#a855f7"
          data={kpiTrends.appointments}
        />
      </div>

      <div className="dashboard-grid">
        {/* Recent Patients */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">Recent Patients</h3>
            <button className="section-link" onClick={() => navigate('/patients')} id="view-all-patients-btn">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="recent-patients-list" id="recent-patients-list">
            {recentPatients.map((p) => (
              <div
                key={p.id}
                className="patient-row"
                onClick={() => navigate(`/patients/${p.id}`)}
                id={`patient-row-${p.id}`}
              >
                <Avatar initials={p.avatarInitials} color={p.avatarColor} size="sm" name={p.name} />
                <div className="patient-row-info">
                  <div className="patient-row-name">{p.name}</div>
                  <div className="patient-row-meta">{p.id} · {p.department}</div>
                </div>
                <div className="patient-row-condition truncate">{p.condition}</div>
                <Badge dot>{p.status}</Badge>
                <ChevronRight size={14} className="patient-row-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="dashboard-aside">
          <div className="section-header">
            <h3 className="section-title">Today's Schedule</h3>
            <span className="section-count">{mockAppointments.length} apts</span>
          </div>
          <div className="appointments-list" id="appointments-list">
            {mockAppointments.map((apt) => (
              <div key={apt.id} className="apt-card" id={`apt-${apt.id}`}>
                <div className="apt-time">{apt.time}</div>
                <div className="apt-info">
                  <div className="apt-patient">{apt.patientName}</div>
                  <div className="apt-type">{apt.type} · {apt.doctor}</div>
                </div>
                <Badge>{apt.status}</Badge>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="section-header" style={{ marginTop: '24px' }}>
            <h3 className="section-title">Department Load</h3>
          </div>
          <div className="dept-stats" id="dept-stats">
            {[
              { dept: 'Cardiology', pct: 84, color: '#3b82f6' },
              { dept: 'Oncology', pct: 80, color: '#a855f7' },
              { dept: 'Pulmonology', pct: 83, color: '#14b8a6' },
              { dept: 'Orthopedics', pct: 78, color: '#10b981' },
            ].map((d) => (
              <div key={d.dept} className="dept-stat-row">
                <div className="dept-stat-label">
                  <span>{d.dept}</span>
                  <span style={{ color: d.color }}>{d.pct}%</span>
                </div>
                <div className="dept-stat-bar">
                  <div
                    className="dept-stat-fill"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
