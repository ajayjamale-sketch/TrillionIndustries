import { MapPin, Plus, Truck, Search } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const DISPATCHES = [
  { id: 'DO-881', dest: 'Production Floor — Line A', items: ['Steel Rod 30mm x200', 'Bearing 40mm x100'], driver: 'Carlos M.', scheduled: 'Jun 2 10:00', status: 'Delivered' },
  { id: 'DO-882', dest: 'Customer — Titan Corp', items: ['Finished Shaft Assembly x500'], driver: 'Jake T.', scheduled: 'Jun 3 08:00', status: 'In Transit' },
  { id: 'DO-883', dest: 'Maintenance Store', items: ['Hydraulic Seals x30', 'O-Ring x100'], driver: 'Kim L.', scheduled: 'Jun 3 13:00', status: 'Scheduled' },
];

export function DispatchPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><MapPin className="h-5 w-5" />Dispatch Management</h1><p className="text-sm text-muted-foreground">Manage outbound dispatches and delivery tracking</p></div>
        <button onClick={() => toast.success('New dispatch order created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Dispatch</button>
      </div>
      <div className="space-y-4">
        {DISPATCHES.map(d => (
          <div key={d.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d.status === 'Delivered' ? 'bg-emerald-500/10' : d.status === 'In Transit' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
                  <Truck className={`h-5 w-5 ${d.status === 'Delivered' ? 'text-emerald-500' : d.status === 'In Transit' ? 'text-blue-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs font-bold text-muted-foreground">{d.id}</span></div>
                  <p className="text-sm font-bold text-foreground">{d.dest}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {d.items.map(item => <span key={item} className="text-[11px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">{item}</span>)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Driver: {d.driver} · Scheduled: {d.scheduled}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={d.status === 'Delivered' ? 'success' : d.status === 'In Transit' ? 'default' : 'warning'} size="sm">{d.status}</StatusBadge>
                {d.status === 'In Transit' && <button onClick={() => toast.success(`${d.id} marked as delivered`)} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">Mark Delivered</button>}
                <button onClick={() => toast.info(`Tracking ${d.id}`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">Track</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
