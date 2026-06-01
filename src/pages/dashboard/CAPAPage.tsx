import { Target, Plus, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const CAPAS = [
  { id: 'CAPA-221', ncr: 'NCR-443', title: 'Supplier material certification process update', owner: 'M. Raj', due: 'Jun 15', completion: 65, status: 'In Progress' },
  { id: 'CAPA-222', ncr: 'NCR-441', title: 'Updated surface inspection SOP for Line A', owner: 'T. Brown', due: 'Jun 10', completion: 40, status: 'In Progress' },
  { id: 'CAPA-223', ncr: 'NCR-444', title: 'Weld parameter calibration and operator re-training', owner: 'S. Lee', due: 'May 31', completion: 100, status: 'Closed' },
];

export function CAPAPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Target className="h-5 w-5" />CAPA Management</h1><p className="text-sm text-muted-foreground">Corrective and Preventive Action tracking</p></div>
        <button onClick={() => toast.success('New CAPA created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New CAPA</button>
      </div>
      <div className="space-y-4">
        {CAPAS.map(capa => (
          <div key={capa.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-muted-foreground">{capa.id}</span><span className="text-xs text-muted-foreground">→ {capa.ncr}</span></div>
                <p className="text-sm font-bold text-foreground">{capa.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Owner: {capa.owner} · Due: {capa.due}</p>
              </div>
              <StatusBadge variant={capa.status === 'Closed' ? 'success' : 'default'} size="sm">{capa.status}</StatusBadge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${capa.completion === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${capa.completion}%` }} />
              </div>
              <span className="text-xs font-bold text-muted-foreground w-10 text-right">{capa.completion}%</span>
              <button onClick={() => toast.info(`Viewing ${capa.id}`)} className="text-xs text-primary hover:underline">Details</button>
              {capa.status !== 'Closed' && <button onClick={() => toast.success(`${capa.id} marked complete`)} className="text-xs text-emerald-600 hover:underline">Complete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
