import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GiAk47, GiBullets } from 'react-icons/gi';
import { HiOutlineSwitchHorizontal, HiOutlineCog, HiOutlineExclamation, HiOutlineUsers, HiOutlineGlobe } from 'react-icons/hi';

const COLORS = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc', '#fb923c', '#2dd4bf'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!stats) return <p className="text-military-400">Failed to load dashboard data.</p>;

  const barData = stats.weaponsByType ? Object.entries(stats.weaponsByType).map(([name, count]) => ({ name, count })) : [];
  const pieData = stats.weaponsByStatus ? Object.entries(stats.weaponsByStatus).map(([name, value]) => ({ name, value })) : [];

  const summaryCards = [
    { label: 'Total Weapons', value: stats.totalWeapons, icon: GiAk47, color: 'from-green-500 to-emerald-600', textColor: 'text-green-400' },
    { label: 'Active Assignments', value: stats.activeAssignments, icon: HiOutlineSwitchHorizontal, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-400' },
    { label: 'Pending Maintenance', value: stats.pendingMaintenance, icon: HiOutlineCog, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-400' },
    { label: 'Low Stock Ammo', value: stats.lowStockAmmo, icon: HiOutlineExclamation, color: 'from-red-500 to-rose-600', textColor: 'text-red-400' },
    { label: 'Active Missions', value: stats.activeMissions, icon: HiOutlineGlobe, color: 'from-purple-500 to-violet-600', textColor: 'text-purple-400' },
    { label: 'Total Users', value: stats.totalUsers, icon: HiOutlineUsers, color: 'from-cyan-500 to-teal-600', textColor: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">
        <span className="gradient-text">Command Dashboard</span>
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="stat-card group animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-2xl font-black ${card.textColor}`}>{card.value}</p>
            <p className="text-xs text-military-400 mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Weapons by Type */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Weapons by Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" />
              <XAxis dataKey="name" tick={{ fill: '#94b894', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#94b894', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#162016', border: '1px solid #1e3a1e', borderRadius: '8px', color: '#e8f5e8' }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Weapons by Status */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Weapons by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#162016', border: '1px solid #1e3a1e', borderRadius: '8px', color: '#e8f5e8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row - Ammo Alerts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ammo Alerts */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <HiOutlineExclamation className="w-5 h-5 text-red-400" /> Low Stock Alerts
          </h3>
          {stats.ammoAlerts?.length > 0 ? (
            <div className="space-y-2">
              {stats.ammoAlerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div>
                    <p className="text-sm font-medium text-white">{a.name}</p>
                    <p className="text-xs text-military-400">{a.caliber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">{a.quantity}</p>
                    <p className="text-xs text-military-500">/ {a.reorderThreshold} min</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-military-500 text-sm">All ammunition stocks are healthy.</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          {stats.recentActivity?.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentActivity.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-military-800/40 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    log.action === 'CREATE' ? 'bg-green-400' : log.action === 'UPDATE' ? 'bg-blue-400' : 'bg-red-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-military-200">
                      <span className="font-semibold text-white">{log.performedBy}</span>{' '}
                      <span className={log.action === 'CREATE' ? 'text-green-400' : log.action === 'UPDATE' ? 'text-blue-400' : 'text-red-400'}>{log.action}</span>{' '}
                      {log.entityType} #{log.entityId}
                    </p>
                    <p className="text-xs text-military-500">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-military-500 text-sm">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
