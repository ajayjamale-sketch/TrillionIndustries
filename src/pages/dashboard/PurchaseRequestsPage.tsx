import { useState } from 'react';
import { ShoppingCart, Plus, Search, X, ChevronDown, AlertTriangle, CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface PRItem { description: string; qty: number; unit: string; estPrice: number; }
interface PR {
  id: string; title: string; dept: string; category: string; items: PRItem[];
  totalValue: number; raised: string; requiredBy: string; approver: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'; status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Converted to PO';
  justification: string; poRef?: string;
}

const DEPARTMENTS = ['Production', 'Maintenance', 'Warehouse', 'Quality', 'Admin', 'R&D', 'Safety'];
const CATEGORIES = ['Raw Materials', 'MRO', 'Capital Equipment', 'IT & Software', 'Safety', 'Office Supplies', 'Services'];
const APPROVERS = ['David Chen', 'Alex Johnson', 'Patricia Lee', 'Sarah Mitchell', 'Robert Kim'];

const INITIAL_PRS: PR[] = [
  {
    id: 'PR-3301', title: 'Hydraulic Seals Q3 Stock', dept: 'Maintenance', category: 'MRO',
    items: [
      { description: 'Hydraulic Seal Kit (Type A)', qty: 50, unit: 'sets', estPrice: 120 },
      { description: 'O-Ring Seal 25mm', qty: 500, unit: 'pieces', estPrice: 8 },
      { description: 'Gasket Set 50mm', qty: 80, unit: 'sets', estPrice: 45 },
    ],
    totalValue: 13400, raised: 'Jun 2', requiredBy: 'Jun 20', approver: 'David Chen',
    priority: 'High', status: 'Approved', justification: 'Quarterly replenishment — stock below safety threshold', poRef: undefined,
  },
  {
    id: 'PR-3302', title: 'Steel Rod 30mm — Emergency Replenishment', dept: 'Production', category: 'Raw Materials',
    items: [
      { description: 'Steel Rod 30mm x 6m', qty: 500, unit: 'pieces', estPrice: 56 },
    ],
    totalValue: 28000, raised: 'Jun 2', requiredBy: 'Jun 10', approver: 'Alex Johnson',
    priority: 'Urgent', status: 'Pending Approval', justification: 'Production Line A halted — critical stock-out event',
  },
  {
    id: 'PR-3303', title: 'Office Supplies Q3', dept: 'Admin', category: 'Office Supplies',
    items: [
      { description: 'A4 Paper (500-sheet ream)', qty: 100, unit: 'reams', estPrice: 5 },
      { description: 'Ballpoint Pens (box of 50)', qty: 20, unit: 'boxes', estPrice: 12 },
      { description: 'Stapler', qty: 10, unit: 'pieces', estPrice: 8 },
      { description: 'Sticky Notes (pack)', qty: 50, unit: 'packs', estPrice: 3 },
    ],
    totalValue: 1210, raised: 'Jun 1', requiredBy: 'Jun 30', approver: 'Patricia Lee',
    priority: 'Low', status: 'Draft', justification: 'Routine Q3 office replenishment',
  },
  {
    id: 'PR-3304', title: 'Conveyor Belt Replacement Parts', dept: 'Maintenance', category: 'MRO',
    items: [
      { description: 'Conveyor Belt 3m x 500mm', qty: 2, unit: 'pieces', estPrice: 4800 },
      { description: 'Drive Roller 100mm', qty: 4, unit: 'pieces', estPrice: 920 },
      { description: 'Tension Roller 80mm', qty: 6, unit: 'pieces', estPrice: 450 },
      { description: 'Belt Cleaner Assembly', qty: 2, unit: 'sets', estPrice: 1100 },
    ],
    totalValue: 18800, raised: 'May 31', requiredBy: 'Jun 15', approver: 'David Chen',
    priority: 'High', status: 'Converted to PO', justification: 'Scheduled maintenance — belt wear exceeds 80%', poRef: 'PO-7826',
  },
  {
    id: 'PR-3305', title: 'Safety Helmets & PPE Annual Stock', dept: 'Safety', category: 'Safety',
    items: [
      { description: 'Hard Hat (Type II)', qty: 50, unit: 'pieces', estPrice: 28 },
      { description: 'Safety Glasses (ANSI Z87)', qty: 100, unit: 'pieces', estPrice: 14 },
      { description: 'Hi-Vis Vest (XL)', qty: 60, unit: 'pieces', estPrice: 18 },
      { description: 'Ear Plugs (200-pair box)', qty: 20, unit: 'boxes', estPrice: 22 },
    ],
    totalValue: 5400, raised: 'May 28', requiredBy: 'Jun 25', approver: 'Alex Johnson',
    priority: 'Medium', status: 'Rejected', justification: 'Annual PPE replacement programme — ISO 45001 compliance',
  },
];

function PRDetailModal({ pr, onClose, onApprove, onReject, onConvert }: {
  pr: PR; onClose: () => void;
  onApprove: (id: string) => void; onReject: (id: string) => void; onConvert: (id: string) => void;
}) {
  const priorityColor = { Urgent: 'text-red-500 bg-red-500/10', High: 'text-amber-500 bg-amber-500/10', Medium: 'text-blue-500 bg-blue-500/10', Low: 'text-muted-foreground bg-muted' };
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">{pr.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priorityColor[pr.priority]}`}>{pr.priority}</span>
                <StatusBadge variant={pr.status === 'Approved' || pr.status === 'Converted to PO' ? 'success' : pr.status === 'Pending Approval' ? 'warning' : pr.status === 'Rejected' ? 'error' : 'default'} size="sm">{pr.status}</StatusBadge>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">{pr.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Department', value: pr.dept },
              { label: 'Category', value: pr.category },
              { label: 'Approver', value: pr.approver },
              { label: 'Raised', value: pr.raised },
              { label: 'Required By', value: pr.requiredBy },
              { label: 'Total Value', value: `$${pr.totalValue.toLocaleString()}` },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Justification</p>
            <p className="text-xs text-foreground">{pr.justification}</p>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-foreground">{pr.items.length} Line Items</p>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{['Description', 'Qty', 'Unit', 'Est. Unit Price', 'Line Total'].map(h => <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pr.items.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.description}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.qty}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.unit}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">${item.estPrice.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-bold text-foreground">${(item.qty * item.estPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={4} className="px-4 py-2.5 text-xs font-bold text-right text-muted-foreground">Total Estimate</td>
                  <td className="px-4 py-2.5 text-sm font-bold text-foreground">${pr.totalValue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {pr.poRef && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Converted to <span className="font-bold">{pr.poRef}</span></p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between gap-2">
          {pr.status === 'Pending Approval' && (
            <button onClick={() => { onReject(pr.id); onClose(); }}
              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors">
              Reject
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
            {pr.status === 'Pending Approval' && (
              <button onClick={() => { onApprove(pr.id); onClose(); }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                Approve
              </button>
            )}
            {pr.status === 'Approved' && (
              <button onClick={() => { onConvert(pr.id); onClose(); }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center gap-1.5 transition-colors">
                <ArrowRight className="h-3.5 w-3.5" /> Convert to PO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewPRModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (pr: PR) => void }) {
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [approver, setApprover] = useState(APPROVERS[0]);
  const [priority, setPriority] = useState<PR['priority']>('Medium');
  const [requiredBy, setRequiredBy] = useState('');
  const [justification, setJustification] = useState('');
  const [items, setItems] = useState<PRItem[]>([{ description: '', qty: 1, unit: 'pieces', estPrice: 0 }]);

  const addItem = () => setItems(p => [...p, { description: '', qty: 1, unit: 'pieces', estPrice: 0 }]);
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof PRItem, value: string | number) =>
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  const total = items.reduce((s, i) => s + i.qty * i.estPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requiredBy.trim()) { toast.error('Title and required-by date are mandatory'); return; }
    if (items.some(i => !i.description.trim() || i.qty <= 0)) { toast.error('All line items need a description and quantity'); return; }
    const pr: PR = {
      id: `PR-${3306 + Math.floor(Math.random() * 100)}`, title, dept, category, items,
      totalValue: total, raised: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requiredBy, approver, priority, status: 'Pending Approval', justification,
    };
    onSubmit(pr);
  };

  const priorityColors: Record<PR['priority'], string> = {
    Urgent: 'bg-red-500 border-red-500 text-white', High: 'bg-amber-500 border-amber-500 text-white',
    Medium: 'bg-blue-500 border-blue-500 text-white', Low: 'bg-muted border-border text-foreground',
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">New Purchase Request</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Submit a procurement request for approval</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Request Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Hydraulic Seals Q3 Stock Replenishment"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Department *</label>
                <select value={dept} onChange={e => setDept(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Approver *</label>
                <select value={approver} onChange={e => setApprover(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {APPROVERS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Required By *</label>
                <input value={requiredBy} onChange={e => setRequiredBy(e.target.value)} placeholder="e.g. Jun 20"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-2">Priority</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High', 'Urgent'] as const).map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${priority === p ? priorityColors[p] : 'border-border hover:bg-muted'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase">Line Items *</label>
                <button type="button" onClick={addItem} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[2fr_60px_70px_80px_32px] gap-2 items-center p-3 bg-muted/30 rounded-xl border border-border">
                    <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Item description"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} min="1"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" placeholder="Qty" />
                    <input value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} placeholder="unit"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.estPrice} onChange={e => updateItem(i, 'estPrice', Number(e.target.value))} min="0" placeholder="$/unit"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    {items.length > 1 ? (
                      <button type="button" onClick={() => removeItem(i)} className="p-1 rounded-lg hover:bg-red-100 text-red-500"><X className="h-3.5 w-3.5" /></button>
                    ) : <div />}
                  </div>
                ))}
              </div>
              {total > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Estimated Total: <span className="font-bold text-foreground">${total.toLocaleString()}</span></p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Business Justification</label>
              <textarea value={justification} onChange={e => setJustification(e.target.value)} rows={2}
                placeholder="Why is this purchase needed? Reference any critical events, regulations, or thresholds..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PurchaseRequestsPage({ user }: { user: User }) {
  const [prs, setPrs] = useState<PR[]>(INITIAL_PRS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PR['status']>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PR['priority']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<PR | null>(null);

  const filtered = prs.filter(p =>
    (statusFilter === 'All' || p.status === statusFilter) &&
    (priorityFilter === 'All' || p.priority === priorityFilter) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.dept.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (pr: PR) => {
    setPrs(prev => [pr, ...prev]);
    setShowNew(false);
    toast.success(`${pr.id} submitted for approval — ${pr.approver} notified`);
  };

  const handleApprove = (id: string) => {
    setPrs(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' as const } : p));
    toast.success(`${id} approved — ready to convert to PO`);
  };

  const handleReject = (id: string) => {
    setPrs(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' as const } : p));
    toast.error(`${id} rejected`);
  };

  const handleConvert = (id: string) => {
    const poNum = `PO-${7827 + Math.floor(Math.random() * 100)}`;
    setPrs(prev => prev.map(p => p.id === id ? { ...p, status: 'Converted to PO' as const, poRef: poNum } : p));
    toast.success(`${id} converted to ${poNum}`);
  };

  const stats = {
    total: prs.length,
    pending: prs.filter(p => p.status === 'Pending Approval').length,
    approved: prs.filter(p => p.status === 'Approved').length,
    urgent: prs.filter(p => p.priority === 'Urgent' && p.status === 'Pending Approval').length,
  };

  const priorityColor: Record<string, string> = {
    Urgent: 'bg-red-500/10 text-red-500', High: 'bg-amber-500/10 text-amber-500',
    Medium: 'bg-blue-500/10 text-blue-500', Low: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> Purchase Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Raise, track and action procurement requisitions</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      {stats.urgent > 0 && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <span className="font-bold">{stats.urgent} urgent request{stats.urgent > 1 ? 's' : ''}</span> pending approval — immediate action required
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total PRs', value: stats.total, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pending Approval', value: stats.pending, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Est. Value', value: `$${prs.filter(p => p.status === 'Pending Approval').reduce((s, p) => s + p.totalValue, 0).toLocaleString()}`, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, title, department..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Pending Approval', 'Approved', 'Draft', 'Rejected', 'Converted to PO'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Urgent', 'High', 'Medium', 'Low'] as const).map(f => (
            <button key={f} onClick={() => setPriorityFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${priorityFilter === f ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>{['PR ID', 'Title', 'Dept', 'Items', 'Est. Value', 'Raised', 'Required By', 'Approver', 'Priority', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-10 text-muted-foreground text-xs">No purchase requests found.</td></tr>
              ) : filtered.map(pr => (
                <tr key={pr.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{pr.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground max-w-[200px] truncate">{pr.title}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pr.dept}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pr.items.length}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">${pr.totalValue.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pr.raised}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pr.requiredBy}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pr.approver}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priorityColor[pr.priority]}`}>{pr.priority}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={pr.status === 'Approved' || pr.status === 'Converted to PO' ? 'success' : pr.status === 'Pending Approval' ? 'warning' : pr.status === 'Rejected' ? 'error' : 'default'} size="sm">
                      {pr.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {pr.status === 'Pending Approval' && <button onClick={() => handleApprove(pr.id)} className="text-xs text-emerald-600 hover:underline font-bold">Approve</button>}
                      {pr.status === 'Approved' && <button onClick={() => handleConvert(pr.id)} className="text-xs text-primary hover:underline font-bold">Convert to PO</button>}
                      <button onClick={() => setSelected(pr)} className="text-xs text-muted-foreground hover:text-foreground hover:underline font-semibold">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <NewPRModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && <PRDetailModal pr={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} onConvert={handleConvert} />}
    </div>
  );
}
