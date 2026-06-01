import { useState } from 'react';
import {
  Wrench, AlertTriangle, CheckCircle2, Clock, Plus, Download,
  Activity, TrendingUp, Calendar, Zap, ArrowRight, Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const healthData = [
  { time: '00:00', vibration: 2.1, temperature: 68, pressure: 4.2 },
  { time: '04:00', vibration: 2.3, temperature: 70, pressure: 4.1 },
  { time: '08:00', vibration: 4.8, temperature: 82, pressure: 4.5 },
  { time: '12:00', vibration: 3.2, temperature: 78, pressure: 4.3 },
  { time: '16:00', vibration: 2.8, temperature: 74, pressure: 4.2 },
  { time: '20:00', vibration: 2.4, temperature: 71, pressure: 4.0 },
];

const EQUIPMENT = [
  { id: 'M-A204', name: 'Hydraulic Press A', type: 'Press', health: 62, status: 'Warning', lastPM: 'May 15', nextPM: 'Jun 15' },
  { id: 'M-B101', name: 'CNC Lathe B1', type: 'CNC', health: 94, status: 'Good', lastPM: 'May 28', nextPM: 'Jul 1' },
  { id: 'M-C301', name: 'Conveyor Line C', type: 'Conveyor', health: 88, status: 'Good', lastPM: 'Jun 1', nextPM: 'Jul 10' },
  { id: 'M-D008', name: 'Injection Molder D', type: 'Molder', health: 45, status: 'Critical', lastPM: 'Apr 20', nextPM: 'Overdue' },
  { id: 'M-E220', name: 'Air Compressor E2', type: 'Compressor', health: 79, status: 'Fair', lastPM: 'May 10', nextPM: 'Jun 20' },
];

const WORK_ORDERS = [
  { id: 'MW-221', machine: 'Hydraulic Press A', type: 'Corrective', priority: 'High', tech: 'James W.', due: 'Jun 3', status: 'In Progress' },
  { id: 'MW-222', machine: 'Injection Molder D', type: 'Emergency', priority: 'Critical', tech: 'Bob L.', due: 'Jun 2', status: 'Assigned' },
  { id: 'MW-223', machine: 'CNC Lathe B1', type: 'Preventive', priority: 'Normal', tech: 'Alice K.', due: 'Jul 1', status: 'Scheduled' },
  { id: 'MW-224', machine: 'Air Compressor E2', type: 'Inspection', priority: 'Normal', tech: 'Tom B.', due: 'Jun 20', status: 'Scheduled' },
];

export function MaintenanceDashboard({ user }: { user: User }) {
  const [selectedEquip, setSelectedEquip] = useState(EQUIPMENT[0]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Maintenance & Asset Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('New maintenance work order created')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />New Work Order
          </button>
          <button onClick={() => toast.info('Opening maintenance calendar')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors">
            <Calendar className="h-4 w-4" />Schedule
          </button>
        </div>
      </div>

      {/* Critical Alert */}
      {EQUIPMENT.filter(e => e.status === 'Critical').length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <span className="font-semibold">Critical:</span> {EQUIPMENT.find(e => e.status === 'Critical')?.name} requires immediate attention — health score {EQUIPMENT.find(e => e.status === 'Critical')?.health}%
          </p>
          <button onClick={() => toast.success('Emergency work order dispatched')}
            className="ml-auto shrink-0 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
            Dispatch Team
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Equipment Availability', value: '94.2%', change: '+0.8% this week', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'MTBF', value: '1,240h', change: 'Mean time between failures', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Open Work Orders', value: '18', change: '3 critical, 5 high', icon: Wrench, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'PM Compliance', value: '87%', change: '4 overdue PMs', icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => toast.info(`Viewing ${m.label}`)}>
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

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Equipment Health Monitor */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Equipment Health Registry</h3>
          <div className="space-y-2.5">
            {EQUIPMENT.map(eq => (
              <button key={eq.id} onClick={() => { setSelectedEquip(eq); toast.info(`Viewing ${eq.name} sensors`); }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${selectedEquip.id === eq.id ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20'}`}>
                <div>
                  <p className="text-xs font-semibold text-foreground">{eq.name}</p>
                  <p className="text-[11px] text-muted-foreground">{eq.id} · Next PM: {eq.nextPM}</p>
                </div>
                <div className="text-right ml-2">
                  <p className={`text-sm font-bold ${eq.health >= 80 ? 'text-emerald-500' : eq.health >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{eq.health}%</p>
                  <StatusBadge variant={eq.status === 'Good' ? 'success' : eq.status === 'Warning' || eq.status === 'Fair' ? 'warning' : 'error'} size="sm">{eq.status}</StatusBadge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sensor Data Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">{selectedEquip.name} — Live Sensor Data</h3>
              <p className="text-xs text-muted-foreground">24-hour telemetry · Health: {selectedEquip.health}%</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthData}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="vibration" stroke="#F97316" strokeWidth={2} dot={false} name="Vibration (mm/s)" />
              <Line type="monotone" dataKey="temperature" stroke="#1E40AF" strokeWidth={2} dot={false} name="Temp (°C)" />
              <Line type="monotone" dataKey="pressure" stroke="#10B981" strokeWidth={2} dot={false} name="Pressure (bar)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 inline-block" />Vibration</div>
            <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600 inline-block" />Temperature</div>
            <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" />Pressure</div>
          </div>
        </div>
      </div>

      {/* Maintenance Work Orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Maintenance Work Orders</h3>
          <button onClick={() => toast.info('Viewing all maintenance work orders')}
            className="flex items-center gap-1 text-xs text-primary hover:underline">
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">WO ID</th>
                <th className="text-left px-5 py-3 font-medium">Machine</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="text-left px-5 py-3 font-medium">Technician</th>
                <th className="text-left px-5 py-3 font-medium">Due</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {WORK_ORDERS.map(wo => (
                <tr key={wo.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{wo.id}</td>
                  <td className="px-5 py-3.5 text-xs font-medium text-foreground">{wo.machine}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.type}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={wo.priority === 'Critical' ? 'error' : wo.priority === 'High' ? 'warning' : 'default'} size="sm">{wo.priority}</StatusBadge>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.tech}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.due}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={wo.status === 'In Progress' ? 'default' : wo.status === 'Assigned' ? 'warning' : 'success'} size="sm">{wo.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => toast.success(`${wo.id} marked complete`)} className="text-xs text-emerald-600 hover:underline">Complete</button>
                      <button onClick={() => toast.info(`Viewing ${wo.id}`)} className="text-xs text-primary hover:underline">View</button>
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
