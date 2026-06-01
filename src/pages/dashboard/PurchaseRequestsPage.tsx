import { useState } from 'react';
import { ShoppingCart, Plus, Search, FileText, CheckCircle2, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const REQUESTS = [
  { id: 'PR-3301', title: 'Hydraulic Seals Q3 Stock', dept: 'Maintenance', items: 3, value: '$12,400', raised: 'Jun 2', approver: 'David Chen', status: 'Approved' },
  { id: 'PR-3302', title: 'Steel Rod 30mm — Emergency', dept: 'Production', items: 1, value: '$28,000', raised: 'Jun 2', approver: 'Alex Johnson', status: 'Pending Approval' },
  { id: 'PR-3303', title: 'Office Supplies Q3', dept: 'Admin', items: 8, value: '$1,200', raised: 'Jun 1', approver: 'Patricia Lee', status: 'Draft' },
  { id: 'PR-3304', title: 'Conveyor Belt Replacement Parts', dept: 'Maintenance', items: 4, value: '$18,500', raised: 'May 31', approver: 'David Chen', status: 'Converted to PO' },
];

export function PurchaseRequestsPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', dept: 'Production', priority: 'Medium', description: '' });

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Purchase Requests</h1><p className="text-sm text-muted-foreground">Raise and track procurement requests</p></div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Request</button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">New Purchase Request</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="text-xs font-medium text-foreground block mb-1.5">Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What do you need to purchase?" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Department</label><select value={form.dept} onChange={e => setForm(p => ({ ...p, dept: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">{['Production', 'Maintenance', 'Warehouse', 'Quality', 'Admin'].map(d => <option key={d}>{d}</option>)}</select></div>
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Priority</label><select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">{['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}</select></div>
            <div className="sm:col-span-2"><label className="text-xs font-medium text-foreground block mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none resize-none" placeholder="Item details, quantities, justification..." /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { toast.success('Purchase request PR-3305 submitted for approval'); setShowForm(false); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Submit Request</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full" /></div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['PR ID', 'Title', 'Department', 'Items', 'Est. Value', 'Raised', 'Approver', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {REQUESTS.filter(r => r.title.toLowerCase().includes(search.toLowerCase())).map(req => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{req.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{req.title}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{req.dept}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{req.items}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{req.value}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{req.raised}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{req.approver}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={req.status === 'Approved' || req.status === 'Converted to PO' ? 'success' : req.status === 'Pending Approval' ? 'warning' : 'default'} size="sm">{req.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    {req.status === 'Approved' && <button onClick={() => toast.success(`${req.id} converted to PO`)} className="text-xs text-emerald-600 hover:underline">Convert to PO</button>}
                    {req.status === 'Pending Approval' && <button onClick={() => toast.success(`${req.id} approved`)} className="text-xs text-primary hover:underline">Approve</button>}
                    <button onClick={() => toast.info(`Viewing ${req.id}`)} className="text-xs text-muted-foreground hover:underline">View</button>
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
