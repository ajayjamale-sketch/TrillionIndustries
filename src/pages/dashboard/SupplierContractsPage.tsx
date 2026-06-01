import { Briefcase } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const CONTRACTS = [
  { id: 'SC-001', buyer: 'Trillion Industries Corp', type: 'Annual Framework', value: '$285K', start: 'Jan 2026', end: 'Dec 2026', status: 'Active' },
  { id: 'SC-002', buyer: 'Precision Parts Co.', type: 'Spot Contract', value: '$48K', start: 'May 2026', end: 'Aug 2026', status: 'Active' },
  { id: 'SC-003', buyer: 'Atlas Industrial', type: 'Annual Framework', value: '$120K', start: 'Mar 2026', end: 'Feb 2027', status: 'Pending Renewal' },
];

export function SupplierContractsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Briefcase className="h-5 w-5" />Contract Management</h1><p className="text-sm text-muted-foreground">Your active supply contracts</p></div>
      <div className="space-y-3">
        {CONTRACTS.map(c => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex items-center gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-muted-foreground">{c.id}</span><span className="text-xs text-muted-foreground">· {c.type}</span></div>
              <p className="text-sm font-bold text-foreground">{c.buyer}</p>
              <p className="text-xs text-muted-foreground">{c.start} – {c.end} · <span className="font-semibold text-foreground">{c.value}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={c.status === 'Active' ? 'success' : 'warning'} size="sm">{c.status}</StatusBadge>
              <button onClick={() => toast.info(`Viewing ${c.id}`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">View</button>
              {c.status === 'Pending Renewal' && <button onClick={() => toast.success(`${c.id} renewal request sent`)} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Request Renewal</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
