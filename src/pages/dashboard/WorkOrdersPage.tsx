import { useState } from 'react';
import { FileText, Plus, Search, Edit, CheckCircle2, Play, Pause } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const WORK_ORDERS = [
  { id: 'WO-4421', product: 'Steel Shaft Assembly', line: 'Line A', progress: 78, qty: 500, produced: 390, due: 'Jun 3', operator: 'Tom B.', status: 'In Progress', priority: 'High' },
  { id: 'WO-4422', product: 'Hydraulic Cylinder', line: 'Line B', progress: 45, qty: 200, produced: 90, due: 'Jun 4', operator: 'Alice K.', status: 'In Progress', priority: 'Medium' },
  { id: 'WO-4423', product: 'Bearing Housing', line: 'Line C', progress: 100, qty: 750, produced: 750, due: 'Jun 2', operator: 'Mark R.', status: 'Completed', priority: 'Low' },
  { id: 'WO-4424', product: 'Pump Impeller', line: 'Line A', progress: 12, qty: 300, produced: 36, due: 'Jun 6', operator: 'Sara L.', status: 'Started', priority: 'High' },
  { id: 'WO-4425', product: 'Valve Assembly', line: 'Line D', progress: 62, qty: 400, produced: 248, due: 'Jun 5', operator: 'Chris M.', status: 'In Progress', priority: 'Medium' },
  { id: 'WO-4426', product: 'Gear Housing', line: 'Line C', progress: 0, qty: 250, produced: 0, due: 'Jun 7', operator: 'Priya N.', status: 'Planned', priority: 'Low' },
];

const FILTERS = ['All', 'Planned', 'Started', 'In Progress', 'Completed'];

export function WorkOrdersPage({ user }: { user: User }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filtered = WORK_ORDERS.filter(w => (filter === 'All' || w.status === filter) && (w.id.includes(search.toUpperCase()) || w.product.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Work Orders</h1><p className="text-sm text-muted-foreground mt-0.5">{WORK_ORDERS.filter(w => w.status !== 'Completed').length} active work orders</p></div>
        <button onClick={() => toast.success('New work order form opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Work Order</button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search work orders..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-52" /></div>
        <div className="flex gap-1.5">{FILTERS.map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{f}</button>)}</div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Work Order', 'Product', 'Line', 'Operator', 'Progress', 'Qty', 'Due', 'Priority', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(wo => (
                <tr key={wo.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{wo.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{wo.product}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.line}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.operator}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${wo.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${wo.progress}%` }} /></div>
                      <span className="text-xs text-muted-foreground">{wo.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.produced}/{wo.qty}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{wo.due}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold ${wo.priority === 'High' ? 'text-red-500' : wo.priority === 'Medium' ? 'text-amber-500' : 'text-muted-foreground'}`}>{wo.priority}</span></td>
                  <td className="px-5 py-3.5"><StatusBadge variant={wo.status === 'Completed' ? 'success' : wo.status === 'In Progress' || wo.status === 'Started' ? 'default' : 'warning'} size="sm">{wo.status}</StatusBadge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => toast.info(`Editing ${wo.id}`)} className="text-xs text-primary hover:underline">Edit</button>
                      {wo.status !== 'Completed' && <button onClick={() => toast.success(`${wo.id} marked complete`)} className="text-xs text-emerald-600 hover:underline">Complete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
