import { Activity, Server, Globe, Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const uptimeData = [
  { time: '00:00', uptime: 99.99 }, { time: '04:00', uptime: 99.97 }, { time: '08:00', uptime: 100 },
  { time: '12:00', uptime: 99.98 }, { time: '16:00', uptime: 100 }, { time: '20:00', uptime: 99.99 },
];

const SERVICES = [
  { name: 'API Gateway', status: 'Operational', latency: '42ms', uptime: '99.97%' },
  { name: 'Database Cluster', status: 'Operational', latency: '8ms', uptime: '99.99%' },
  { name: 'File Storage', status: 'Operational', latency: '120ms', uptime: '100%' },
  { name: 'Authentication Service', status: 'Operational', latency: '22ms', uptime: '99.99%' },
  { name: 'Email Service', status: 'Degraded', latency: '840ms', uptime: '98.2%' },
  { name: 'AI Processing Engine', status: 'Operational', latency: '280ms', uptime: '99.94%' },
];

export function SystemHealthPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Activity className="h-5 w-5" />System Health</h1><p className="text-sm text-muted-foreground">Real-time platform infrastructure monitoring</p></div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />All Systems Operational</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Platform Uptime (30d)', value: '99.97%', icon: Globe }, { label: 'API Response Time', value: '42ms', icon: Activity }, { label: 'Active Connections', value: '2,847', icon: Database }, { label: 'Error Rate', value: '0.03%', icon: Server }].map(m => {
          const Icon = m.icon;
          return <div key={m.label} className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">{m.label}</p></div><p className="text-2xl font-bold text-foreground">{m.value}</p></div>;
        })}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Uptime — Last 24 Hours</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={uptimeData}><XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis domain={[99, 100.01]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(2)}%`} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} /><Line type="monotone" dataKey="uptime" stroke="#10B981" strokeWidth={2} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-foreground text-sm">Service Status</h3></div>
        <div className="divide-y divide-border">
          {SERVICES.map(s => (
            <div key={s.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="flex-1 text-sm font-medium text-foreground">{s.name}</span>
              <span className="text-xs text-muted-foreground">Latency: {s.latency}</span>
              <span className="text-xs text-muted-foreground">Uptime: {s.uptime}</span>
              <span className={`text-xs font-semibold ${s.status === 'Operational' ? 'text-emerald-500' : 'text-amber-500'}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
