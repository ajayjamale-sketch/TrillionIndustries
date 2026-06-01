import { useState } from 'react';
import { ShoppingCart, Plus, Search, Truck, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const ORDERS = [
  { id: 'PO-7821', vendor: 'SteelPro Ltd.', items: 4, value: '$48,200', ordered: 'Jun 1', expected: 'Jun 10', status: 'In Transit' },
  { id: 'PO-7822', vendor: 'Hydraulic Systems Inc.', items: 2, value: '$32,500', ordered: 'Jun 1', expected: 'Jun 12', status: 'Approved' },
  { id: 'PO-7823', vendor: 'FastenTech Corp.', items: 8, value: '$12,750', ordered: 'Jun 2', expected: 'Jun 14', status: 'Draft' },
  { id: 'PO-7824', vendor: 'Global Bearings', items: 3, value: '$67,100', ordered: 'May 28', expected: 'Jun 5', status: 'Delivered' },
  { id: 'PO-7825', vendor: 'Polymer World', items: 6, value: '$24,300', ordered: 'May 30', expected: 'Jun 8', status: 'In Transit' },
];

export function PurchaseOrdersPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const filtered = ORDERS.filter(o => o.vendor.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search.toUpperCase()));
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Purchase Orders</h1><p className="text-sm text-muted-foreground">{ORDERS.filter(o => o.status !== 'Delivered').length} open orders</p></div>
        <button onClick={() => toast.success('New PO form opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Create PO</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[{ label: 'Total Open POs', value: '47' }, { label: 'In Transit', value: '12' }, { label: 'Pending Approval', value: '8' }, { label: 'Delivered (MTD)', value: '31' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">All Purchase Orders</h3>
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search POs..." className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none w-44" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['PO ID', 'Vendor', 'Items', 'Value', 'Order Date', 'Expected', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(po => (
                <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{po.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{po.vendor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.items}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{po.value}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.ordered}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.expected}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={po.status === 'Delivered' ? 'success' : po.status === 'In Transit' ? 'default' : po.status === 'Approved' ? 'success' : 'warning'} size="sm">{po.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    <button onClick={() => toast.info(`Viewing ${po.id}`)} className="text-xs text-primary hover:underline">View</button>
                    {po.status === 'In Transit' && <button onClick={() => toast.success(`${po.id} received`)} className="text-xs text-emerald-600 hover:underline">Mark Received</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
