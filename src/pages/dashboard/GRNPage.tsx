import { useState } from 'react';
import { Truck, Plus, Search, CheckCircle2, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const GRNS = [
  { id: 'GRN-5521', po: 'PO-7824', vendor: 'Global Bearings', items: 3, received: 'Jun 2 09:15', inspector: 'Maria R.', status: 'Accepted' },
  { id: 'GRN-5522', po: 'PO-7821', vendor: 'SteelPro Ltd.', items: 4, received: 'Jun 1 14:30', inspector: 'Tom B.', status: 'Accepted' },
  { id: 'GRN-5523', po: 'PO-7818', vendor: 'Polymer World', items: 6, received: 'May 31 11:00', inspector: 'Sara L.', status: 'Partial' },
  { id: 'GRN-5524', po: 'PO-7815', vendor: 'FastenTech Corp.', items: 8, received: 'May 30 10:45', inspector: 'Mark R.', status: 'Rejected' },
];

export function GRNPage({ user }: { user: User }) {
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Goods Receiving (GRN)</h1><p className="text-sm text-muted-foreground">Material receipt verification and processing</p></div>
        <button onClick={() => setShowNew(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New GRN</button>
      </div>

      {showNew && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">Create Goods Receipt Note</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Purchase Order Reference</label><input placeholder="PO-XXXX" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Vendor / Supplier</label><input placeholder="Select vendor" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Delivery Note Number</label><input placeholder="DN-XXXX" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Inspector</label><input placeholder="Inspector name" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
          </div>
          <div className="flex gap-2"><button onClick={() => { toast.success('GRN-5525 created — items moved to receiving bay'); setShowNew(false); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Create GRN</button><button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button></div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['GRN ID', 'PO Ref', 'Vendor', 'Items', 'Received', 'Inspector', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {GRNS.map(g => (
                <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{g.id}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-primary">{g.po}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{g.vendor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{g.items} items</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{g.received}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{g.inspector}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={g.status === 'Accepted' ? 'success' : g.status === 'Partial' ? 'warning' : 'error'} size="sm">{g.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2"><button onClick={() => toast.info(`Viewing ${g.id}`)} className="text-xs text-primary hover:underline">View</button><button onClick={() => toast.success(`${g.id} items moved to stock`)} className="text-xs text-emerald-600 hover:underline">Move to Stock</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
