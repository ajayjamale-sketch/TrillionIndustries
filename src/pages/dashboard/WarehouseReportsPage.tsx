import { useState } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, Package, Truck, AlertTriangle, CheckCircle2, RefreshCw, Eye } from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const movementData = [
  { week: 'W1 May', in: 840, out: 720 },
  { week: 'W2 May', in: 620, out: 680 },
  { week: 'W3 May', in: 920, out: 800 },
  { week: 'W4 May', in: 740, out: 760 },
  { week: 'W1 Jun', in: 980, out: 850 },
  { week: 'W2 Jun', in: 710, out: 690 },
];

const turnoverData = [
  { month: 'Jan', turnover: 7.2 },
  { month: 'Feb', turnover: 7.8 },
  { month: 'Mar', turnover: 8.1 },
  { month: 'Apr', turnover: 7.6 },
  { month: 'May', turnover: 8.4 },
  { month: 'Jun', turnover: 8.9 },
];

const categoryValueData = [
  { name: 'Raw Materials', value: 35, color: '#1E40AF' },
  { name: 'WIP', value: 20, color: '#F97316' },
  { name: 'Finished Goods', value: 30, color: '#10B981' },
  { name: 'Consumables', value: 10, color: '#8B5CF6' },
  { name: 'Maintenance', value: 5, color: '#06B6D4' },
];

const stockAgeData = [
  { range: '0–30 days', count: 842, pct: 42 },
  { range: '31–60 days', count: 621, pct: 31 },
  { range: '61–90 days', count: 321, pct: 16 },
  { range: '91–180 days', count: 156, pct: 8 },
  { range: '180+ days', count: 60, pct: 3 },
];

const topMoversData = [
  { sku: 'STL-3012', name: 'Steel Rod 30mm', movement: 2400, trend: 'up', pct: '+18%' },
  { sku: 'FST-1122', name: 'M12 Hex Bolt', movement: 1800, trend: 'up', pct: '+12%' },
  { sku: 'BRG-4401', name: 'Ball Bearing 40mm', movement: 1200, trend: 'down', pct: '-5%' },
  { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', movement: 960, trend: 'up', pct: '+8%' },
  { sku: 'SEL-2201', name: 'O-Ring Seal 25mm', movement: 840, trend: 'down', pct: '-3%' },
];

const auditLogData = [
  { ref: 'AUD-2201', type: 'Cycle Count', zone: 'Zone A', items: 124, discrepancies: 3, status: 'Completed', date: 'Jun 1, 2026' },
  { ref: 'AUD-2200', type: 'Stock Reconciliation', zone: 'All Zones', items: 4821, discrepancies: 12, status: 'Completed', date: 'May 15, 2026' },
  { ref: 'AUD-2199', type: 'Spot Check', zone: 'Zone B', items: 48, discrepancies: 0, status: 'Completed', date: 'May 10, 2026' },
  { ref: 'AUD-2198', type: 'Annual Audit', zone: 'All Zones', items: 4780, discrepancies: 31, status: 'Completed', date: 'Jan 1, 2026' },
  { ref: 'AUD-2202', type: 'Cycle Count', zone: 'Zone C', items: 210, discrepancies: 0, status: 'In Progress', date: 'Jun 2, 2026' },
];

const REPORT_TABS = ['Inventory Reports', 'Audit Reports'] as const;
type ReportTab = typeof REPORT_TABS[number];

const KPI_CARDS = [
  { label: 'Total SKUs', value: '4,821', change: '+14 this month', trend: 'up', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Inventory Value', value: '$2.1M', change: '-$84K vs last month', trend: 'down', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Turnover Rate', value: '8.4x', change: '+0.8x vs last month', trend: 'up', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Stockout Events (MTD)', value: '2', change: '-3 vs last month', trend: 'up', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'GRNs Processed', value: '48', change: 'This month', trend: 'up', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Fulfilment Rate', value: '98.2%', change: '+1.4% vs last month', trend: 'up', icon: CheckCircle2, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

export function WarehouseReportsPage({ user }: { user: User }) {
  const [tab, setTab] = useState<ReportTab>('Inventory Reports');
  const [timeRange, setTimeRange] = useState('6W');

  const handleExport = (type: string) => {
    toast.success(`Generating ${type} export — file will download shortly`);
    setTimeout(() => {
      const data = type === 'Inventory' ? KPI_CARDS.map(k => ({ metric: k.label, value: k.value, trend: k.change })) : auditLogData;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `warehouse_${type.toLowerCase().replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {tab === 'Inventory Reports' ? 'Inventory Reports' : 'Audit Reports'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tab === 'Inventory Reports'
              ? 'Stock analytics, turnover trends and material movement overview'
              : 'Stock audit history, discrepancy tracking and reconciliation reports'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info('Refreshing report data...')}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
          <button onClick={() => handleExport(tab === 'Inventory Reports' ? 'Inventory' : 'Audit')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-1.5 p-1 bg-muted rounded-xl w-fit">
        {REPORT_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Inventory Reports' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {KPI_CARDS.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => toast.info(`Viewing ${m.label} detail`)}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                      <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">{m.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {m.trend === 'up' ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-red-400" />}
                    <span className={`text-[10px] ${m.trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Movement chart */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Goods In vs Out — Weekly</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Material movement volume comparison</p>
                </div>
                <div className="flex gap-1">
                  {['4W', '6W', '3M'].map(r => (
                    <button key={r} onClick={() => { setTimeRange(r); toast.info(`Showing ${r} data`); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${timeRange === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={movementData} barGap={4}>
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="in" fill="#1E40AF" radius={[3, 3, 0, 0]} name="Goods In" />
                  <Bar dataKey="out" fill="#F97316" radius={[3, 3, 0, 0]} name="Goods Out" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#1E40AF] inline-block" />Goods In</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#F97316] inline-block" />Goods Out</div>
              </div>
            </div>

            {/* Inventory Value by Category */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-1">Value by Category</h3>
              <p className="text-xs text-muted-foreground mb-4">$2.1M total inventory value</p>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={categoryValueData} dataKey="value" cx="50%" cy="50%" outerRadius={52} innerRadius={30} paddingAngle={3}>
                    {categoryValueData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryValueData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                      <span className="text-muted-foreground truncate">{d.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Turnover trend */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-1">Inventory Turnover Rate</h3>
              <p className="text-xs text-muted-foreground mb-4">Monthly — times per year</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[6, 10]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="turnover" stroke="#1E40AF" strokeWidth={2.5} dot={{ r: 4, fill: '#1E40AF' }} name="Turnover Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Age */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-1">Stock Age Analysis</h3>
              <p className="text-xs text-muted-foreground mb-4">Days in warehouse — total 2,000 SKU instances</p>
              <div className="space-y-3">
                {stockAgeData.map(d => (
                  <div key={d.range}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{d.range}</span>
                      <span className="text-xs font-semibold text-foreground">{d.count} SKUs ({d.pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${d.pct > 30 ? 'bg-primary' : d.pct > 10 ? 'bg-amber-500' : 'bg-red-400'}`}
                        style={{ width: `${d.pct * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Movers */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">Top Moving SKUs — MTD</h3>
              <button onClick={() => toast.info('Viewing full movement report')} className="text-xs text-primary hover:underline font-semibold">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    {['SKU', 'Item Name', 'Units Moved (MTD)', 'Trend'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topMoversData.map((item, idx) => (
                    <tr key={item.sku} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground flex items-center justify-center">{idx + 1}</span>
                          <span className="font-mono text-xs text-muted-foreground">{item.sku}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{item.name}</td>
                      <td className="px-5 py-3.5 text-xs font-bold text-foreground">{item.movement.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          {item.trend === 'up' ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
                          <span className={`text-xs font-semibold ${item.trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>{item.pct}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'Audit Reports' && (
        <>
          {/* Audit KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Audits (YTD)', value: '5', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Items Audited', value: '9,983', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Total Discrepancies', value: '46', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Accuracy Rate', value: '99.5%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                      <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* Discrepancy trend chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-1">Discrepancy Rate Over Time</h3>
            <p className="text-xs text-muted-foreground mb-4">Items audited vs discrepancies found</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={[
                { audit: 'Jan Audit', items: 4780, disc: 31 },
                { audit: 'May Spot', items: 48, disc: 0 },
                { audit: 'May Recon', items: 4821, disc: 12 },
                { audit: 'Jun Cycle', items: 124, disc: 3 },
                { audit: 'Jun Zone C', items: 210, disc: 0 },
              ]} barGap={4}>
                <XAxis dataKey="audit" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="items" fill="hsl(var(--muted))" radius={[3, 3, 0, 0]} name="Items Audited" />
                <Bar dataKey="disc" fill="#F97316" radius={[3, 3, 0, 0]} name="Discrepancies" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Audit Log Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm">Audit Log</h3>
              <button onClick={() => toast.success('Starting new cycle count...')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                <Eye className="h-3.5 w-3.5" /> Start New Audit
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    {['Audit Ref', 'Type', 'Zone / Scope', 'Items Audited', 'Discrepancies', 'Accuracy', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogData.map(a => {
                    const accuracy = a.items > 0 ? (((a.items - a.discrepancies) / a.items) * 100).toFixed(1) : '100.0';
                    return (
                      <tr key={a.ref} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{a.ref}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{a.type}</td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.zone}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{a.items.toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold ${a.discrepancies === 0 ? 'text-emerald-500' : a.discrepancies < 10 ? 'text-amber-500' : 'text-red-500'}`}>
                            {a.discrepancies}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold ${Number(accuracy) >= 99.5 ? 'text-emerald-500' : Number(accuracy) >= 99 ? 'text-amber-500' : 'text-red-500'}`}>
                            {accuracy}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.date}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge variant={a.status === 'Completed' ? 'success' : 'default'} size="sm">{a.status}</StatusBadge>
                        </td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => toast.info(`Viewing ${a.ref} audit report`)}
                            className="text-xs text-primary hover:underline font-semibold">View Report</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
