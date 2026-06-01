import { Activity, Cpu, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const MACHINES = [
  { id: 'CNC-01', name: 'CNC Milling Center #1', line: 'Line A', status: 'Running', oee: 94, temp: 68, vibration: 3.2, speed: 98, parts: 342 },
  { id: 'CNC-02', name: 'CNC Lathe #2', line: 'Line A', status: 'Running', oee: 91, temp: 72, vibration: 2.8, speed: 95, parts: 180 },
  { id: 'HYD-01', name: 'Hydraulic Press Line B', line: 'Line B', status: 'Running', oee: 88, temp: 75, vibration: 4.1, speed: 88, parts: 90 },
  { id: 'WLD-01', name: 'Robotic Welder Line C', line: 'Line C', status: 'Idle', oee: 0, temp: 24, vibration: 0, speed: 0, parts: 0 },
  { id: 'CNC-12', name: 'CNC Milling Center #12', line: 'Line A', status: 'Alert', oee: 72, temp: 89, vibration: 8.4, speed: 72, parts: 124 },
  { id: 'CONV-01', name: 'Conveyor Belt Main', line: 'Line D', status: 'Maintenance', oee: 0, temp: 28, vibration: 0, speed: 0, parts: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  Running: 'bg-emerald-500',
  Idle: 'bg-amber-500',
  Alert: 'bg-red-500 animate-pulse',
  Maintenance: 'bg-gray-400',
};

export function ShopFloorPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Shop Floor Monitoring</h1><p className="text-sm text-muted-foreground mt-0.5">Real-time machine and production line status</p></div>
        <button onClick={() => toast.info('Refreshing sensor data')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><RefreshCw className="h-4 w-4" />Refresh</button>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {[['Running', 'bg-emerald-500'], ['Idle', 'bg-amber-500'], ['Alert', 'bg-red-500'], ['Maintenance', 'bg-gray-400']].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${color}`} />{label}</div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MACHINES.map(m => (
          <div key={m.id} onClick={() => toast.info(`Opening ${m.name} details`)}
            className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${m.status === 'Alert' ? 'border-red-500/40 bg-red-500/5' : 'border-border hover:border-primary/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[m.status]}`} />
                <span className="font-mono text-xs font-bold text-muted-foreground">{m.id}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === 'Running' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : m.status === 'Alert' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-muted text-muted-foreground'}`}>{m.status}</span>
            </div>
            <p className="text-sm font-bold text-foreground mb-1">{m.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{m.line}</p>
            {m.status === 'Running' || m.status === 'Alert' ? (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'OEE', value: `${m.oee}%`, alert: m.oee < 85 },
                  { label: 'Parts/Shift', value: m.parts.toString(), alert: false },
                  { label: 'Temp', value: `${m.temp}°C`, alert: m.temp > 85 },
                  { label: 'Vibration', value: `${m.vibration}mm/s`, alert: m.vibration > 7 },
                ].map(stat => (
                  <div key={stat.label} className={`rounded-lg p-2 ${stat.alert ? 'bg-red-500/10' : 'bg-muted'}`}>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    <p className={`text-xs font-bold mt-0.5 ${stat.alert ? 'text-red-500' : 'text-foreground'}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{m.status === 'Idle' ? 'Awaiting work order assignment' : 'Scheduled maintenance in progress'}</p>
            )}
            {m.status === 'Alert' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" /><span className="font-semibold">High vibration — inspection required</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
