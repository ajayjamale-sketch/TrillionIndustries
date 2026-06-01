import { Inbox, CheckCircle2, Truck } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const ORDERS = [
  { id: 'ORD-7821', buyer: 'Trillion Industries Corp', items: ['Hydraulic Cylinder 50mm x200'], value: '$57,000', ordered: 'Jun 1', delivery: 'Jun 10', status: 'Processing' },
  { id: 'ORD-7822', buyer: 'Precision Parts Co.', items: ['Seal Kit 30mm x500'], value: '$9,000', ordered: 'Jun 1', delivery: 'Jun 8', status: 'Ready to Ship' },
  { id: 'ORD-7820', buyer: 'Atlas Industrial Corp', items: ['Bearing Housing Type A x100', 'Seal Kit x50'], value: '$5,100', ordered: 'May 29', delivery: 'Jun 5', status: 'Shipped' },
  { id: 'ORD-7818', buyer: 'Titan Manufacturing', items: ['Pump Shaft 60mm x25'], value: '$3,200', ordered: 'May 25', delivery: 'Jun 2', status: 'Delivered' },
];

export function SupplierOrdersPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Inbox className="h-5 w-5" />Order Management</h1><p className="text-sm text-muted-foreground">{ORDERS.filter(o => o.status !== 'Delivered').length} active orders</p></div>
      <div className="grid grid-cols-4 gap-4">
        {[{ label: 'Total Orders (MTD)', value: '24' }, { label: 'Revenue (MTD)', value: '$142K' }, { label: 'Pending Shipment', value: '3' }, { label: 'On-Time Delivery', value: '96%' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="space-y-4">
        {ORDERS.map(o => (
          <div key={o.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs font-bold text-muted-foreground">{o.id}</span></div>
                <p className="text-sm font-bold text-foreground">{o.buyer}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">{o.items.map(item => <span key={item} className="text-[11px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">{item}</span>)}</div>
                <p className="text-xs text-muted-foreground mt-1.5">Order: {o.ordered} · Delivery: {o.delivery} · <span className="font-semibold text-foreground">{o.value}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'default' : 'warning'} size="sm">{o.status}</StatusBadge>
                {o.status === 'Ready to Ship' && <button onClick={() => toast.success(`${o.id} marked as shipped`)} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Ship Now</button>}
                {o.status === 'Processing' && <button onClick={() => toast.info(`Preparing ${o.id}`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">Prepare</button>}
                <button onClick={() => toast.info(`Viewing ${o.id} details`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
