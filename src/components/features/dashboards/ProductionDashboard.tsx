import { useState } from 'react';
import {
  Factory, TrendingUp, TrendingDown, Plus, Download, RefreshCw,
  CheckCircle2, AlertTriangle, Clock, ArrowRight, Play, Pause,
  BarChart3, Target, Layers, Zap
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const weeklyData = [
  { day: 'Mon', actual: 920, target: 900, efficiency: 102 },
  { day: 'Tue', actual: 880, target: 900, efficiency: 97 },
  { day: 'Wed', actual: 945, target: 900, efficiency: 105 },
  { day: 'Thu', actual: 930, target: 950, efficiency: 97 },
  { day: 'Fri', actual: 970, target: 950, efficiency: 102 },
  { day: 'Sat', actual: 850, target: 800, efficiency: 106 },
];

const WORK_ORDERS = [
  { id: 'WO-4421', product: 'Steel Shaft Assembly', line: 'Line A', progress: 78, qty: 500, due: 'Jun 3', operator: 'Tom B.', status: 'In Progress' },
  { id: 'WO-4422', product: 'Hydraulic Cylinder', line: 'Line B', progress: 45, qty: 200, due: 'Jun 4', operator: 'Alice K.', status: 'In Progress' },
  { id: 'WO-4423', product: 'Bearing Housing', line: 'Line C', progress: 100, qty: 750, due: 'Jun 2', operator: 'Mark R.', status: 'Completed' },
  { id: 'WO-4424', product: 'Pump Impeller', line: 'Line A', progress: 12, qty: 300, due: 'Jun 6', operator: 'Sara L.', status: 'Started' },
  { id: 'WO-4425', product: 'Valve Assembly', line: 'Line D', progress: 62, qty: 400, due: 'Jun 5', operator: 'Chris M.', status: 'In Progress' },
];

const PRODUCTION_LINES = [
  { name: 'Line A', status: 'Running', oee: 94, output: 342, target: 360, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Line B', status: 'Running', oee: 88, output: 178, target: 200, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Line C', status: 'Idle', oee: 0, output: 0, target: 250, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Line D', status: 'Maintenance', oee: 0, output: 0, target: 200, color: 'text-red-500', bg: 'bg-red-500/10' },
];

export function ProductionDashboard({ user }: { user: User }) {
  const [filter, setFilter] = useState('All');

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Production Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('New Work Order created')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />New Work Order
          </button>
          <button onClick={() => toast.info('Downloading production report')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors">
            <Download className="h-4 w-4" />Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Daily Output', value: '2,847', change: '+4.2%', trend: 'up', icon: Factory, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'OEE Score', value: '87.3%', change: '+1.8%', trend: 'up', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active WOs', value: '24', change: '+3', trend: 'up', icon: Layers, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Scrap Rate', value: '1.2%', change: '-0.3%', trend: 'up', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => toast.info(`Viewing ${m.label} details`)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">{m.change} vs yesterday</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Weekly Production Output vs Target</h3>
            <button onClick={() => toast.info('Viewing full production analytics')}
              className="text-xs text-primary hover:underline flex items-center gap-1">
              Full Analytics <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={weeklyData} barGap={4}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="target" fill="hsl(var(--muted))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill="#1E40AF" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Production Lines */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Production Lines Status</h3>
          <div className="space-y-3">
            {PRODUCTION_LINES.map(line => (
              <div key={line.name} className="p-3 rounded-lg border border-border hover:border-primary/20 transition-colors cursor-pointer"
                onClick={() => toast.info(`Opening ${line.name} details`)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{line.name}</span>
                  <StatusBadge variant={line.status === 'Running' ? 'success' : line.status === 'Idle' ? 'warning' : 'error'} size="sm">
                    {line.status}
                  </StatusBadge>
                </div>
                {line.status === 'Running' && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>OEE: {line.oee}%</span>
                      <span>{line.output}/{line.target} units</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(line.output / line.target) * 100}%` }} />
                    </div>
                  </>
                )}
                {line.status !== 'Running' && (
                  <p className="text-xs text-muted-foreground">
                    {line.status === 'Idle' ? 'Awaiting work order assignment' : 'Scheduled maintenance in progress'}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => toast.info('Opening shop floor view')}
            className="w-full mt-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
            View Shop Floor Map
          </button>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Work Orders</h3>
          <div className="flex items-center gap-2">
            {['All', 'In Progress', 'Completed', 'Started'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Work Order</th>
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Line</th>
                <th className="text-left px-5 py-3 font-medium">Operator</th>
                <th className="text-left px-5 py-3 font-medium">Progress</th>
                <th className="text-left px-5 py-3 font-medium">Due</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {WORK_ORDERS.filter(w => filter === 'All' || w.status === filter).map(wo => (
                <tr key={wo.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{wo.id}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground text-xs">{wo.product}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.line}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.operator}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${wo.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${wo.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{wo.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.due}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={wo.status === 'Completed' ? 'success' : wo.status === 'In Progress' ? 'default' : 'warning'} size="sm">
                      {wo.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toast.success(`${wo.id} updated`)}
                        className="text-xs text-primary hover:underline">Edit</button>
                      {wo.status !== 'Completed' && (
                        <button onClick={() => toast.success(`${wo.id} marked complete`)}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
