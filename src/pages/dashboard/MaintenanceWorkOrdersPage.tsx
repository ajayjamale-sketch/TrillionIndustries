import { ClipboardList, Plus, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const TASKS = [
  { id: 'MT-881', asset: 'CNC-12', task: 'Bearing inspection and replacement', assigned: 'J. Williams', est: '4h', due: 'Jun 3', status: 'Assigned' },
  { id: 'MT-882', asset: 'HYD-01', task: 'Hydraulic oil change and filter replacement', assigned: 'M. Lopez', est: '2h', due: 'Jun 4', status: 'In Progress' },
  { id: 'MT-883', asset: 'Conveyor', task: 'Belt tension adjustment', assigned: 'T. Park', est: '1h', due: 'Jun 2', status: 'Completed' },
  { id: 'MT-884', asset: 'CNC-01', task: 'Spindle lubrication — quarterly PM', assigned: 'J. Williams', est: '1h', due: 'Jun 5', status: 'Planned' },
];

export function MaintenanceWorkOrdersPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><ClipboardList className="h-5 w-5" />Maintenance Work Orders</h1><p className="text-sm text-muted-foreground">Engineer task assignments and tracking</p></div>
        <button onClick={() => toast.success('New maintenance task created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Task</button>
      </div>
      <div className="space-y-3">
        {TASKS.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all flex items-center gap-4 flex-wrap">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.status === 'Completed' ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
              <ClipboardList className={`h-5 w-5 ${t.status === 'Completed' ? 'text-emerald-500' : 'text-primary'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5"><span className="font-mono text-xs text-muted-foreground">{t.id}</span></div>
              <p className="text-sm font-bold text-foreground">{t.asset} — {t.task}</p>
              <p className="text-xs text-muted-foreground">Assigned: {t.assigned} · Est: {t.est} · Due: {t.due}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'default' : 'warning'} size="sm">{t.status}</StatusBadge>
              {t.status !== 'Completed' && <button onClick={() => toast.success(`${t.id} completed`)} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Complete</button>}
              <button onClick={() => toast.info(`Viewing ${t.id}`)} className="px-3 py-1.5 rounded-xl border border-border text-xs hover:bg-muted transition-colors">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
