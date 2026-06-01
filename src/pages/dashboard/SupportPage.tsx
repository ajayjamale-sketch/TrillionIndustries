import { useState } from 'react';
import { LifeBuoy, Plus, Search, Clock, CheckCircle2, AlertTriangle, MessageSquare, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const TICKETS = [
  { id: 'TKT-1101', title: 'Unable to generate production report — Excel format error', priority: 'High', category: 'Reports', created: 'Jun 1', status: 'In Progress', agent: 'Support Team' },
  { id: 'TKT-1102', title: 'Inventory sync not reflecting real-time changes', priority: 'Critical', category: 'Inventory', created: 'May 31', status: 'Pending', agent: 'Unassigned' },
  { id: 'TKT-1103', title: 'Request to add new user role: Quality Inspector', priority: 'Medium', category: 'Access Control', created: 'May 29', status: 'Resolved', agent: 'Admin Team' },
  { id: 'TKT-1104', title: 'Dashboard chart not loading on mobile device', priority: 'Low', category: 'UI/UX', created: 'May 28', status: 'Resolved', agent: 'Dev Team' },
];

export function SupportPage({ user }: { user: User }) {
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'General', priority: 'Medium', description: '' });

  const submit = async () => {
    if (!form.title || !form.description) { toast.error('Please fill in all required fields'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setShowNew(false);
    toast.success('Support ticket TKT-1105 created — you will receive an email confirmation');
    setForm({ title: '', category: 'General', priority: 'Medium', description: '' });
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><LifeBuoy className="h-5 w-5" />Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit and track your support requests</p>
        </div>
        <button onClick={() => setShowNew(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />New Ticket
        </button>
      </div>

      {showNew && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">Create Support Ticket</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Brief description of the issue"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">
                {['General', 'Production', 'Inventory', 'Procurement', 'Reports', 'Access Control', 'UI/UX'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : 'Submit Ticket'}
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Your Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Ticket</th>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TICKETS.map(t => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-5 py-3.5 text-xs font-medium text-foreground max-w-xs truncate">{t.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${t.priority === 'Critical' ? 'text-red-500' : t.priority === 'High' ? 'text-amber-500' : t.priority === 'Medium' ? 'text-blue-500' : 'text-muted-foreground'}`}>{t.priority}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.category}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.created}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={t.status === 'Resolved' ? 'success' : t.status === 'In Progress' ? 'default' : 'warning'} size="sm">{t.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toast.info(`Opening ${t.id}`)} className="text-xs text-primary hover:underline">View</button>
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
