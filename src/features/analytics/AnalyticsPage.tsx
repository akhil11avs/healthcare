
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { admissionsData, diagnosisData, departmentData } from '../../data/analytics';
import './AnalyticsPage.css';

const RADIAN = Math.PI / 180;

function renderCustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.07) return null;
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

const tooltipStyle = {
  backgroundColor: '#111d35',
  border: '1px solid rgba(59,130,246,0.2)',
  borderRadius: '10px',
  color: '#f0f6ff',
  fontSize: '13px',
};

function StatCard({ label, value, icon, color, sub }: { label: string; value: string; icon: React.ReactNode; color: string; sub: string }) {
  return (
    <div className="analytics-stat-card" id={`stat-${label.toLowerCase().replace(/ /g, '-')}`}>
      <div className="aStat-icon" style={{ color, background: `${color}18`, border: `1px solid ${color}25` }}>{icon}</div>
      <div className="aStat-info">
        <div className="aStat-value">{value}</div>
        <div className="aStat-label">{label}</div>
        <div className="aStat-sub">{sub}</div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {

  const totalAdmissions = admissionsData.reduce((s, d) => s + d.admissions, 0);
  const totalRevenue = admissionsData.reduce((s, d) => s + d.revenue, 0);
  const avgRecovery = 94;

  return (
    <div className="analytics-page animate-fade-in" id="analytics-page">
      <div className="page-header">
        <h2 className="page-title">Analytics Overview</h2>
        <p className="page-subtitle">Clinical performance and operational insights — Last 7 months</p>
      </div>

      {/* Summary stats */}
      <div className="analytics-stats" id="analytics-stat-cards">
        <StatCard label="Total Admissions" value={totalAdmissions.toString()} icon={<Users size={18} />} color="#3b82f6" sub="+8.2% vs prior period" />
        <StatCard label="Total Revenue" value={`$${(totalRevenue / 1000000).toFixed(2)}M`} icon={<DollarSign size={18} />} color="#10b981" sub="+12.4% vs prior period" />
        <StatCard label="Recovery Rate" value={`${avgRecovery}%`} icon={<Activity size={18} />} color="#a855f7" sub="+2.1% improvement" />
        <StatCard label="Bed Utilization" value="80.7%" icon={<TrendingUp size={18} />} color="#f59e0b" sub="Across all departments" />
      </div>

      {/* Charts Row 1 */}
      <div className="analytics-row-1">
        {/* Admissions Line Chart */}
        <div className="chart-card" id="admissions-chart">
          <div className="chart-header">
            <h3 className="chart-title">Patient Admissions & Discharges</h3>
            <span className="chart-period">Jul 2024 – Jan 2025</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={admissionsData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAdm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(59,130,246,0.08)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(59,130,246,0.2)', strokeWidth: 1 }} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: '#94a3b8' }}
                iconType="circle"
              />
              <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradAdm)" dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#10b981" strokeWidth={2.5} fill="url(#gradDis)" dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Diagnosis Pie */}
        <div className="chart-card" id="diagnosis-chart">
          <div className="chart-header">
            <h3 className="chart-title">Department Distribution</h3>
            <span className="chart-period">Current Period</span>
          </div>
          <div className="pie-layout">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomPieLabel}
                >
                  {diagnosisData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {diagnosisData.map((d) => (
                <div key={d.name} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: d.color }} />
                  <span className="pie-legend-name">{d.name}</span>
                  <span className="pie-legend-val">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 — Bar chart */}
      <div className="chart-card" id="department-chart">
        <div className="chart-header">
          <h3 className="chart-title">Department Capacity Utilization</h3>
          <span className="chart-period">Live</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={departmentData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(59,130,246,0.08)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="department" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: any) => [`${v}%`, 'Utilization']}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: '#94a3b8' }} iconType="circle" />
            <Bar dataKey="utilization" name="Utilization %" radius={[6, 6, 0, 0]}>
              {departmentData.map((_, index) => {
                const colors = ['#3b82f6','#10b981','#a855f7','#14b8a6','#f59e0b','#6366f1','#f43f5e','#2dd4bf'];
                return <Cell key={index} fill={colors[index % colors.length]} fillOpacity={0.85} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue line chart */}
      <div className="chart-card" id="revenue-chart">
        <div className="chart-header">
          <h3 className="chart-title">Monthly Revenue Trend</h3>
          <span className="chart-period">Jul 2024 – Jan 2025</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={admissionsData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(59,130,246,0.08)" strokeDasharray="4 4" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${(Number(v) / 1000).toFixed(0)}K`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#a855f7" strokeWidth={2.5} fill="url(#gradRev)" dot={{ r: 3, fill: '#a855f7' }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
