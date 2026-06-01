import { ArrowUpRight, Plus, Truck } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const TRANSFERS = [
  { id: 'ST-441', from: 'Warehouse A', to: 'Production Floor', items: 3, initiated: 'Jun 2', handler: 'Sara L.', status: 'In Transit' },
  { id: 'ST-442', from: 'Receiving Dock', to: 'Warehouse B', items: 8, initiated: 'Jun 2', handler: 'Mark R.', status: 'Pending' },
  { id: 'ST-443', from: 'Warehouse B', to: 'Quality Lab', items: 1, initiated: 'Jun 1', handler: 'Alice K.', status: 'Completed' },
  { id: 'ST-444', from: 'Warehouse A', to: 'Maintenance Store', items: 4, initiated: 'May 31', handler: 'Tom B.', status: 'Completed' },
];

export function TransfersPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><ArrowUpRight className="h-5 w-5" />Stock Transfers</h1><p className="text-sm text-muted-foreground">Track inter-location material movements</p></div>
        <button onClick={() => toast.success('New transfer request created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Transfer</button>
      </div>
      <div className="space-y-3">
        {TRANSFERS.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Truck className="h-5 w-5 text-primary" /></div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5"><span className="font-mono text-xs font-bold text-muted-foreground">{t.id}</span></div>
                  <p className="text-sm font-bold text-foreground">{t.from} → {t.to}</p>
                  <p className="text-xs text-muted-foreground">{t.items} item type(s) · Handler: {t.handler} · {t.initiated}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={t.status === 'Completed' ? 'success' : t.status === 'In Transit' ? 'default' : 'warning'} size="sm">{t.status}</StatusBadge>
                {t.status === 'In Transit' && <button onClick={() => toast.success(`${t.id} marked as delivered`)} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">Confirm Receipt</button>}
                <button onClick={() => toast.info(`Viewing ${t.id}`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
