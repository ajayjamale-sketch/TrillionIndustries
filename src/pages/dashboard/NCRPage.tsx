import { AlertOctagon, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const NCRS = [
  { id: 'NCR-441', title: 'Surface finish defect — Steel Shaft', severity: 'Major', raised: 'Jun 1', status: 'Open', assigned: 'T. Brown' },
  { id: 'NCR-442', title: 'Dimensional non-conformance — Bearing', severity: 'Minor', raised: 'May 30', status: 'Under Review', assigned: 'A. Kim' },
  { id: 'NCR-443', title: 'Material certification missing', severity: 'Critical', raised: 'May 28', status: 'CAPA Raised', assigned: 'M. Raj' },
  { id: 'NCR-444', title: 'Weld porosity in valve body', severity: 'Major', raised: 'May 25', status: 'Closed', assigned: 'S. Lee' },
];

export function NCRPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Non-Conformance (NCR) Tracker</h1><p className="text-sm text-muted-foreground">{NCRS.filter(n => n.status !== 'Closed').length} open non-conformances</p></div>
        <button onClick={() => toast.success('New NCR raised')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Raise NCR</button>
      </div>
      <div className="space-y-3">
        {NCRS.map(ncr => (
          <div key={ncr.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex items-center gap-4 flex-wrap">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ncr.severity === 'Critical' ? 'bg-red-500/10' : ncr.severity === 'Major' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
              <AlertOctagon className={`h-5 w-5 ${ncr.severity === 'Critical' ? 'text-red-500' : ncr.severity === 'Major' ? 'text-amber-500' : 'text-blue-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5"><span className="font-mono text-xs text-muted-foreground">{ncr.id}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ncr.severity === 'Critical' ? 'bg-red-500/10 text-red-600' : ncr.severity === 'Major' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>{ncr.severity}</span></div>
              <p className="text-sm font-bold text-foreground">{ncr.title}</p>
              <p className="text-xs text-muted-foreground">Assigned: {ncr.assigned} · {ncr.raised}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={ncr.status === 'Closed' ? 'success' : ncr.status === 'CAPA Raised' ? 'warning' : 'error'} size="sm">{ncr.status}</StatusBadge>
              {ncr.status === 'Open' && <button onClick={() => toast.success(`CAPA raised for ${ncr.id}`)} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Raise CAPA</button>}
              <button onClick={() => toast.info(`Viewing ${ncr.id}`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
