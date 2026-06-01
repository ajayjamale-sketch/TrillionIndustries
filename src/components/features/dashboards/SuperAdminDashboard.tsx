import { useState, useCallback, useMemo } from 'react';
import {
  Users, Building2, Shield, Activity, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Download, Search, Settings,
  Server, Globe, Lock, Eye, Plus, RefreshCw, ArrowRight,
  X, FileText, Terminal, Key, FileBarChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

// Initial static data
const INITIAL_ORGANIZATIONS = [
  { id: 'ORG-001', name: 'Titan Manufacturing Inc.', plan: 'Enterprise', users: 284, status: 'Active', mrr: '$12,400' },
  { id: 'ORG-002', name: 'Precision Parts Co.', plan: 'Professional', users: 42, status: 'Active', mrr: '$2,800' },
  { id: 'ORG-003', name: 'Global Fabricators Ltd.', plan: 'Enterprise', users: 156, status: 'Active', mrr: '$8,200' },
  { id: 'ORG-004', name: 'NovaMech Systems', plan: 'Starter', users: 8, status: 'Trial', mrr: '$0' },
  { id: 'ORG-005', name: 'Atlas Industrial Corp.', plan: 'Professional', users: 67, status: 'Suspended', mrr: '$0' },
];

const INITIAL_SYSTEM_LOGS = [
  { id: 1, level: 'error', message: 'Database query timeout on org ORG-003', time: '3 min ago', service: 'Database' },
  { id: 2, level: 'warning', message: 'High API rate — ORG-001 approaching limit', time: '12 min ago', service: 'API Gateway' },
  { id: 3, level: 'info', message: 'New organization ORG-005 registered', time: '28 min ago', service: 'Auth' },
  { id: 4, level: 'success', message: 'Backup completed successfully — 99.8% integrity', time: '1 hr ago', service: 'Storage' },
];

const platformData = [
  { month: 'Jan', users: 1200, orgs: 180, revenue: 420000 },
  { month: 'Feb', orgs: 195, users: 1400, revenue: 480000 },
  { month: 'Mar', orgs: 212, users: 1650, revenue: 520000 },
  { month: 'Apr', orgs: 240, users: 1920, revenue: 610000 },
  { month: 'May', orgs: 265, users: 2180, revenue: 680000 },
  { month: 'Jun', orgs: 290, users: 2450, revenue: 760000 },
];

// Helper: Convert MRR string to number
const mrrToNumber = (mrr: string) => parseInt(mrr.replace(/[^0-9]/g, ''), 10) || 0;

// Helper: Generate CSV
const downloadCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Modal Component for Logs/Analytics
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">{children}</div>
      </div>
    </div>
  );
}

export function SuperAdminDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<'orgs' | 'logs' | 'security'>('orgs');
  const [search, setSearch] = useState('');
  const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS);
  const [systemLogs, setSystemLogs] = useState(INITIAL_SYSTEM_LOGS);
  const [securityScore, setSecurityScore] = useState(98);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [impersonatingOrg, setImpersonatingOrg] = useState<string | null>(null);

  // Compute KPIs dynamically from organizations
  const kpis = useMemo(() => {
    const totalOrgs = organizations.length;
    const activeUsers = organizations
      .filter(org => org.status === 'Active')
      .reduce((sum, org) => sum + org.users, 0);
    const monthlyRevenue = organizations
      .filter(org => org.status !== 'Suspended')
      .reduce((sum, org) => sum + mrrToNumber(org.mrr), 0);
    const supportTickets = systemLogs.filter(log => log.level === 'error' || log.level === 'warning').length;
    return { totalOrgs, activeUsers, monthlyRevenue, supportTickets };
  }, [organizations, systemLogs]);

  const filteredOrgs = organizations.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
  );

  // --- Action Handlers ---
  const handleExportReport = () => {
    const exportData = organizations.map(org => ({
      'Org ID': org.id,
      'Organization': org.name,
      'Plan': org.plan,
      'Users': org.users,
      'MRR': org.mrr,
      'Status': org.status
    }));
    downloadCSV(exportData, `platform_report_${new Date().toISOString().slice(0,19)}.csv`);
    toast.success('Platform report exported successfully');
  };

  const handleRefresh = () => {
    setOrganizations(INITIAL_ORGANIZATIONS);
    setSystemLogs(INITIAL_SYSTEM_LOGS);
    setSecurityScore(98);
    setImpersonatingOrg(null);
    toast.success('Dashboard refreshed with latest data');
  };

  const handleImpersonate = (orgName: string) => {
    setImpersonatingOrg(orgName);
    toast.info(`Impersonating ${orgName} — Admin session active`, { duration: 5000 });
    // In a real app, this would set auth tokens or redirect
  };

  const handleSuspend = (orgId: string) => {
    setOrganizations(prev => prev.map(org =>
      org.id === orgId && org.status !== 'Suspended'
        ? { ...org, status: 'Suspended', mrr: '$0' }
        : org
    ));
    toast.warning(`Organization ${orgId} has been suspended`);
    // Add system log
    setSystemLogs(prev => [{
      id: Date.now(),
      level: 'warning',
      message: `Organization ${orgId} suspended by super admin`,
      time: 'Just now',
      service: 'Admin'
    }, ...prev]);
  };

  const handleReactivate = (orgId: string) => {
    const original = INITIAL_ORGANIZATIONS.find(o => o.id === orgId);
    if (original) {
      setOrganizations(prev => prev.map(org =>
        org.id === orgId ? { ...org, status: 'Active', mrr: original.mrr } : org
      ));
      toast.success(`Organization ${orgId} reactivated`);
      setSystemLogs(prev => [{
        id: Date.now(),
        level: 'success',
        message: `Organization ${orgId} reactivated by super admin`,
        time: 'Just now',
        service: 'Admin'
      }, ...prev]);
    }
  };

  const handleRunSecurityAudit = () => {
    const newScore = Math.min(100, securityScore + 1);
    setSecurityScore(newScore);
    setSystemLogs(prev => [{
      id: Date.now(),
      level: 'success',
      message: `Security audit completed — Score improved to ${newScore}/100`,
      time: 'Just now',
      service: 'Security'
    }, ...prev]);
    toast.success(`Security audit completed. New score: ${newScore}/100`);
  };

  const handleFullAnalytics = () => {
    setShowAnalyticsModal(true);
  };

  const handleViewAllLogs = () => {
    setShowLogsModal(true);
  };

  // Security tab actions
  const handleViewAttempts = () => {
    toast.info('Failed login attempts (24h): 127 attempts from 38 unique IPs. Top: 203.0.113.42 (23 attempts)');
  };
  const handleManageSessions = () => {
    toast.info('Active sessions: 1,842 total. 23 admin sessions, 1,819 user sessions. Force logout available in session manager.');
  };
  const handleViewKeys = () => {
    toast.info('API Keys: 284 active keys, 12 revoked last month. Most active: ORG-001 (32 keys)');
  };
  const handleViewReports = () => {
    toast.success('Compliance reports: SOC2 Type II (valid), ISO27001:2022 certified. Last audit: June 2026');
  };

  const handleKPIClick = (label: string, value: string | number) => {
    toast.info(`${label} Details: Current value ${value}. Trend analysis available in analytics.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Modals */}
      {showLogsModal && (
        <Modal title="System Logs (Full History)" onClose={() => setShowLogsModal(false)}>
          <div className="space-y-3">
            {systemLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                  log.level === 'error' ? 'bg-red-500/10' : log.level === 'warning' ? 'bg-amber-500/10' :
                  log.level === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                }`}>
                  {log.level === 'success' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> :
                    log.level === 'error' ? <AlertTriangle className="h-3 w-3 text-red-500" /> :
                    log.level === 'warning' ? <AlertTriangle className="h-3 w-3 text-amber-500" /> :
                    <Activity className="h-3 w-3 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{log.service}</span>
                    <span className="text-[10px] text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="text-sm text-foreground mt-1">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showAnalyticsModal && (
        <Modal title="Detailed Platform Analytics" onClose={() => setShowAnalyticsModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">CAGR (Users)</p>
                <p className="text-xl font-bold text-foreground">+15.3%</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">Avg Revenue/Org</p>
                <p className="text-xl font-bold text-foreground">$2,620</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={platformData}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1E40AF" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground">Revenue growth accelerated in Q2 2026, driven by Enterprise plan adoption.</p>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">Super Admin Control Center</h1>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-[11px] font-semibold">SUPER ADMIN</span>
            {impersonatingOrg && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[11px] font-semibold">
                Impersonating: {impersonatingOrg}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {user.name} · {user.company} · Platform Operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Download className="h-4 w-4" />Export Report
          </button>
          <button onClick={handleRefresh}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
          <Server className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Platform Status</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
          <Globe className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">API Uptime (30d)</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">99.97%</p>
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
          <Lock className="h-5 w-5 text-purple-500 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Security Score</p>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{securityScore} / 100</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Organizations', value: kpis.totalOrgs, change: '+25 this month', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Users', value: kpis.activeUsers.toLocaleString(), change: '+270 this month', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Monthly Revenue', value: `$${(kpis.monthlyRevenue / 1000).toFixed(0)}K`, change: '+11.8% vs May', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Support Tickets', value: kpis.supportTickets, change: `${systemLogs.filter(l => l.level === 'error').length} critical`, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => handleKPIClick(m.label, m.value)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Platform Growth Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Platform Growth — Organizations & Users</h3>
          <button onClick={handleFullAnalytics} className="text-xs text-primary hover:underline flex items-center gap-1">
            Full Analytics <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={platformData}>
            <defs>
              <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="orgsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="users" stroke="#1E40AF" fill="url(#usersGrad)" strokeWidth={2} name="Users" />
            <Area type="monotone" dataKey="orgs" stroke="#F97316" fill="url(#orgsGrad)" strokeWidth={2} name="Organizations" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Main Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex gap-2">
            {[['orgs', 'Organizations'], ['logs', 'System Logs'], ['security', 'Security']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
          {tab === 'orgs' && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search organizations..." className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-48" />
            </div>
          )}
        </div>

        {tab === 'orgs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Org ID</th>
                  <th className="text-left px-5 py-3 font-medium">Organization</th>
                  <th className="text-left px-5 py-3 font-medium">Plan</th>
                  <th className="text-left px-5 py-3 font-medium">Users</th>
                  <th className="text-left px-5 py-3 font-medium">MRR</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrgs.map(org => (
                  <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{org.id}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{org.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${org.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : org.plan === 'Professional' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{org.users}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{org.mrr}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={org.status === 'Active' ? 'success' : org.status === 'Trial' ? 'warning' : 'error'} size="sm">{org.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => handleImpersonate(org.name)} className="text-xs text-primary hover:underline">Impersonate</button>
                        {org.status === 'Suspended' ? (
                          <button onClick={() => handleReactivate(org.id)} className="text-xs text-emerald-600 hover:underline">Reactivate</button>
                        ) : (
                          <button onClick={() => handleSuspend(org.id)} className="text-xs text-red-500 hover:underline">Suspend</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'logs' && (
          <div className="divide-y divide-border">
            {systemLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  log.level === 'error' ? 'bg-red-500/10' : log.level === 'warning' ? 'bg-amber-500/10' : log.level === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                }`}>
                  {log.level === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> :
                    log.level === 'error' ? <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> :
                    log.level === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> :
                    <Activity className="h-3.5 w-3.5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      log.level === 'error' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                      log.level === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      log.level === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}>{log.level}</span>
                    <span className="text-[11px] text-muted-foreground">{log.service}</span>
                  </div>
                  <p className="text-xs text-foreground mt-1">{log.message}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{log.time}</span>
              </div>
            ))}
            <div className="px-5 py-3 border-t border-border bg-muted/20">
              <button onClick={handleViewAllLogs} className="text-xs text-primary hover:underline">View all logs →</button>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Failed Login Attempts (24h)', value: '127', status: 'Normal', action: handleViewAttempts, actionLabel: 'View attempts' },
                { label: 'Active Sessions', value: '1,842', status: 'Normal', action: handleManageSessions, actionLabel: 'Manage sessions' },
                { label: 'API Keys Issued', value: '284', status: 'Normal', action: handleViewKeys, actionLabel: 'View keys' },
                { label: 'Compliance Status', value: 'SOC2 · ISO27001', status: 'Compliant', action: handleViewReports, actionLabel: 'View reports' },
              ].map(item => (
                <div key={item.label} className="p-4 border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <StatusBadge variant={item.status === 'Compliant' || item.status === 'Normal' ? 'success' : 'warning'} size="sm">{item.status}</StatusBadge>
                  </div>
                  <p className="text-lg font-bold text-foreground mb-2">{item.value}</p>
                  <button onClick={item.action} className="text-xs text-primary hover:underline">{item.actionLabel} →</button>
                </div>
              ))}
            </div>
            <button onClick={handleRunSecurityAudit}
              className="w-full py-2.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Shield className="h-3.5 w-3.5" />Run Security Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}