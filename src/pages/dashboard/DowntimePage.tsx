import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const downtimeData = [
  { cause: 'Breakdown', hours: 12.4, color: '#EF4444' },
  { cause: 'Setup', hours: 8.2, color: '#F59E0B' },
  { cause: 'Changeover', hours: 6.8, color: '#8B5CF6' },
  { cause: 'Maintenance', hours: 5.1, color: '#3B82F6' },
  { cause: 'Material', hours: 3.4, color: '#10B981' },
];

const EVENTS = [
  { id: 'DT-221', machine: 'CNC-12', cause: 'Bearing Alert', duration: '2h 15m', loss: '142 units', date: 'Jun 2', resolved: false },
  { id: 'DT-222', machine: 'HYD-01', cause: 'Scheduled PM', duration: '4h 00m', loss: '240 units', date: 'Jun 1', resolved: true },
  { id: 'DT-223', machine: 'CONV-01', cause: 'Belt Replacement', duration: '1h 30m', loss: '80 units', date: 'Jun 1', resolved: true },
  { id: 'DT-224', machine: 'WLD-01', cause: 'Material Shortage', duration: '1h 00m', loss: '60 units', date: 'May 31', resolved: true },
];

export function DowntimePage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div><h1 className="text-xl font-bold text-foreground">Downtime Analysis</h1><p className="text-sm text-muted-foreground mt-0.5">Root cause analysis and downtime impact tracking</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Downtime (Week)', value: '35.9 hrs', icon: Clock }, { label: 'Production Loss', value: '2,154 units', icon: TrendingDown }, { label: 'Unplanned Events', value: '4', icon: AlertTriangle }].map(m => {
          const Icon = m.icon;
          return <div key={m.label} className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">{m.label}</p></div><p className="text-2xl font-bold text-foreground">{m.value}</p></div>;
        })}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Downtime by Cause (Hours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={downtimeData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cause" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="hours" fill="#EF4444" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border"><p className="font-semibold text-foreground text-sm">Downtime Events</p></div>
          <div className="divide-y divide-border">
            {EVENTS.map(e => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className={`w-2 h-8 rounded-full ${e.resolved ? 'bg-emerald-500' : 'bg-red-500'} shrink-0`} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{e.machine} — {e.cause}</p>
                  <p className="text-[11px] text-muted-foreground">{e.id} · {e.duration} · Loss: {e.loss} · {e.date}</p>
                </div>
                <span className={`text-xs font-semibold ${e.resolved ? 'text-emerald-500' : 'text-red-500'}`}>{e.resolved ? 'Resolved' : 'Active'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
