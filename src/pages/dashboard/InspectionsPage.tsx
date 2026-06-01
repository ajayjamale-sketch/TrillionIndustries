import { useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const INSPECTIONS = [
  { id: 'INS-1201', product: 'Steel Shaft Assembly', batch: 'BT-4421', date: 'Jun 2', inspector: 'Alice K.', pass: 472, fail: 28, status: 'Completed' },
  { id: 'INS-1202', product: 'Hydraulic Cylinder', batch: 'BT-4422', date: 'Jun 3', inspector: 'Tom B.', pass: 0, fail: 0, status: 'In Progress' },
  { id: 'INS-1203', product: 'Bearing Housing', batch: 'BT-4423', date: 'Jun 4', inspector: 'Mark R.', pass: 748, fail: 2, status: 'Completed' },
  { id: 'INS-1204', product: 'Pump Impeller', batch: 'BT-4424', date: 'Jun 5', inspector: 'Sara L.', pass: 0, fail: 0, status: 'Scheduled' },
];

export function InspectionsPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Quality Inspections</h1><p className="text-sm text-muted-foreground">Manage and track quality inspection records</p></div>
        <button onClick={() => setShowNew(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Create Inspection</button>
      </div>
      {showNew && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">New Quality Inspection</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium block mb-1.5">Product / Batch</label><input placeholder="Enter product and batch number" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium block mb-1.5">Inspector Name</label><input placeholder="Inspector name" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium block mb-1.5">Inspection Date</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium block mb-1.5">Inspection Type</label><select className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">{['In-Process', 'Final Inspection', 'Incoming QC', 'First Article'].map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
          <div className="flex gap-2"><button onClick={() => { toast.success('Inspection INS-1205 created'); setShowNew(false); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Create Inspection</button><button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button></div>
        </div>
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['ID', 'Product', 'Batch', 'Inspector', 'Pass/Fail', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {INSPECTIONS.map(ins => (
                <tr key={ins.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{ins.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{ins.product}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.batch}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.inspector}</td>
                  <td className="px-5 py-3.5 text-xs">{ins.status === 'Completed' ? <><span className="text-emerald-600 font-semibold">{ins.pass}</span> / <span className="text-red-500 font-semibold">{ins.fail}</span></> : '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.date}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={ins.status === 'Completed' ? 'success' : ins.status === 'In Progress' ? 'default' : 'warning'} size="sm">{ins.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><button onClick={() => toast.info(`Viewing ${ins.id}`)} className="text-xs text-primary hover:underline">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
