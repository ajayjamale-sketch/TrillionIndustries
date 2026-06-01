import { useState } from 'react';
import { Layers, Plus, Search, Eye, Download } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const BATCHES = [
  { id: 'BT-4421', workOrder: 'WO-4421', product: 'Steel Shaft Assembly', qty: 500, produced: 390, started: 'Jun 1 08:00', inspector: 'Alice K.', defects: 8, status: 'In Progress' },
  { id: 'BT-4422', workOrder: 'WO-4422', product: 'Hydraulic Cylinder', qty: 200, produced: 90, started: 'Jun 1 10:00', inspector: 'Tom B.', defects: 2, status: 'In Progress' },
  { id: 'BT-4423', workOrder: 'WO-4423', product: 'Bearing Housing', qty: 750, produced: 750, started: 'May 31 06:00', inspector: 'Mark R.', defects: 2, status: 'Completed' },
  { id: 'BT-4424', workOrder: 'WO-4424', product: 'Pump Impeller', qty: 300, produced: 36, started: 'Jun 2 07:00', inspector: 'Sara L.', defects: 0, status: 'Started' },
];

export function BatchesPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const filtered = BATCHES.filter(b => b.id.includes(search.toUpperCase()) || b.product.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Batch Management</h1><p className="text-sm text-muted-foreground mt-0.5">Track production batches and quality</p></div>
        <div className="flex gap-2">
          <button onClick={() => toast.success('New batch created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Batch</button>
          <button onClick={() => toast.info('Downloading batch report')} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"><Download className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>
      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search batches..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full" /></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BATCHES.map(b => (
          <div key={b.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
              <StatusBadge variant={b.status === 'Completed' ? 'success' : b.status === 'In Progress' ? 'default' : 'warning'} size="sm">{b.status}</StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mb-1">{b.product}</p>
            <p className="text-xs text-muted-foreground mb-3">{b.workOrder} · Inspector: {b.inspector}</p>
            <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
              <div className="flex justify-between"><span>Produced</span><span className="font-semibold text-foreground">{b.produced}/{b.qty}</span></div>
              <div className="flex justify-between"><span>Defects</span><span className={`font-semibold ${b.defects > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{b.defects}</span></div>
              <div className="flex justify-between"><span>Started</span><span>{b.started}</span></div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3"><div className={`h-full rounded-full ${b.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${(b.produced / b.qty) * 100}%` }} /></div>
            <button onClick={() => toast.info(`Viewing ${b.id} details`)} className="w-full py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1"><Eye className="h-3 w-3" />View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
