import { useState } from 'react';
import { FileText, Plus, Search, X, Eye, Send, Award, Star, ChevronDown, Clock, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface RFQVendorResponse {
  vendor: string; price: number; deliveryDays: number; notes: string; recommended: boolean;
}
interface RFQItem { description: string; qty: number; unit: string; }
interface RFQ {
  id: string; title: string; category: string; description: string;
  items: RFQItem[]; invitedVendors: string[]; responses: RFQVendorResponse[];
  deadline: string; created: string; createdBy: string;
  status: 'Draft' | 'Open' | 'Evaluating' | 'Awarded' | 'Cancelled'; awardedTo?: string;
}

const CATEGORIES = ['Raw Materials', 'MRO', 'Capital Equipment', 'Safety', 'Services', 'IT & Software'];
const VENDOR_NAMES = ['SteelPro Ltd.', 'Hydraulic Systems Inc.', 'FastenTech Corp.', 'Global Bearings', 'Polymer World', 'Apex Valves Inc.', 'IndoSteel Corp.', 'MetalCo Industries'];

const INITIAL_RFQS: RFQ[] = [
  {
    id: 'RFQ-2201', title: 'Hydraulic Seals Q3 Annual Supply', category: 'MRO', created: 'Jun 1', createdBy: 'David Chen',
    description: 'Annual supply of hydraulic seals, O-rings, and gasket sets for Q3 maintenance schedule',
    items: [
      { description: 'Hydraulic Seal Kit (Type A)', qty: 200, unit: 'sets' },
      { description: 'O-Ring Seal 25mm', qty: 2000, unit: 'pieces' },
      { description: 'Gasket Set 50mm', qty: 500, unit: 'sets' },
    ],
    invitedVendors: ['Hydraulic Systems Inc.', 'Polymer World', 'Apex Valves Inc.', 'Global Bearings'],
    responses: [
      { vendor: 'Hydraulic Systems Inc.', price: 11200, deliveryDays: 7, notes: 'All items in stock', recommended: false },
      { vendor: 'Polymer World', price: 10800, deliveryDays: 10, notes: 'Best bulk pricing', recommended: true },
    ],
    deadline: 'Jun 8', status: 'Evaluating',
  },
  {
    id: 'RFQ-2202', title: 'Steel Rod 30mm — 1000 Unit Supply', category: 'Raw Materials', created: 'Jun 1', createdBy: 'Sarah Mitchell',
    description: 'Emergency supply of 1000 pcs Steel Rod 30mm x 6m for production restocking',
    items: [{ description: 'Steel Rod 30mm x 6m', qty: 1000, unit: 'pieces' }],
    invitedVendors: ['SteelPro Ltd.', 'IndoSteel Corp.', 'MetalCo Industries', 'Global Bearings', 'Apex Valves Inc.', 'FastenTech Corp.'],
    responses: [
      { vendor: 'SteelPro Ltd.', price: 27500, deliveryDays: 5, notes: 'Preferred vendor — quickest delivery', recommended: false },
      { vendor: 'IndoSteel Corp.', price: 25800, deliveryDays: 8, notes: 'Lowest price', recommended: true },
      { vendor: 'MetalCo Industries', price: 26900, deliveryDays: 7, notes: 'Good quality record', recommended: false },
      { vendor: 'Global Bearings', price: 28400, deliveryDays: 4, notes: 'Fastest — highest price', recommended: false },
      { vendor: 'Apex Valves Inc.', price: 27100, deliveryDays: 9, notes: '', recommended: false },
    ],
    deadline: 'Jun 6', status: 'Awarded', awardedTo: 'IndoSteel Corp.',
  },
  {
    id: 'RFQ-2203', title: 'Conveyor Belt Replacement — Full Set', category: 'Capital Equipment', created: 'May 30', createdBy: 'David Chen',
    description: 'Replacement conveyor belt assembly for Production Line B — scheduled Q3 overhaul',
    items: [
      { description: 'Conveyor Belt 3m x 500mm', qty: 2, unit: 'pieces' },
      { description: 'Drive Roller 100mm', qty: 4, unit: 'pieces' },
      { description: 'Belt Cleaner Assembly', qty: 2, unit: 'sets' },
    ],
    invitedVendors: ['Apex Valves Inc.', 'MetalCo Industries', 'FastenTech Corp.'],
    responses: [
      { vendor: 'Apex Valves Inc.', price: 18400, deliveryDays: 14, notes: 'Best warranty — 24 months', recommended: true },
      { vendor: 'MetalCo Industries', price: 17900, deliveryDays: 21, notes: 'Longer lead time', recommended: false },
      { vendor: 'FastenTech Corp.', price: 19200, deliveryDays: 10, notes: 'Fastest but expensive', recommended: false },
    ],
    deadline: 'Jun 4', status: 'Awarded', awardedTo: 'Apex Valves Inc.',
  },
  {
    id: 'RFQ-2204', title: 'Safety Equipment Annual Supply', category: 'Safety', created: 'Jun 2', createdBy: 'Alex Johnson',
    description: 'Annual supply of PPE and safety equipment per ISO 45001 compliance plan',
    items: [
      { description: 'Hard Hat (Type II)', qty: 100, unit: 'pieces' },
      { description: 'Safety Glasses ANSI Z87', qty: 200, unit: 'pieces' },
      { description: 'Hi-Vis Vest (all sizes)', qty: 150, unit: 'pieces' },
    ],
    invitedVendors: ['SteelPro Ltd.', 'FastenTech Corp.', 'Apex Valves Inc.', 'MetalCo Industries', 'Polymer World'],
    responses: [],
    deadline: 'Jun 15', status: 'Open',
  },
];

function RFQDetailModal({ rfq, onClose, onAward, onPublish }: {
  rfq: RFQ; onClose: () => void;
  onAward: (id: string, vendor: string) => void;
  onPublish: (id: string) => void;
}) {
  const [awardVendor, setAwardVendor] = useState(rfq.responses.find(r => r.recommended)?.vendor || rfq.responses[0]?.vendor || '');
  const responseRate = rfq.invitedVendors.length > 0 ? Math.round((rfq.responses.length / rfq.invitedVendors.length) * 100) : 0;
  const bestPrice = rfq.responses.length > 0 ? Math.min(...rfq.responses.map(r => r.price)) : null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{rfq.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{rfq.category}</span>
              <StatusBadge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Evaluating' ? 'warning' : rfq.status === 'Cancelled' ? 'error' : 'default'} size="sm">{rfq.status}</StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{rfq.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Created By', value: rfq.createdBy },
              { label: 'Deadline', value: rfq.deadline },
              { label: 'Response Rate', value: `${responseRate}% (${rfq.responses.length}/${rfq.invitedVendors.length})` },
              { label: 'Best Price', value: bestPrice ? `$${bestPrice.toLocaleString()}` : '—' },
            ].map(m => <div key={m.label}><p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p><p className="text-xs font-semibold text-foreground">{m.value}</p></div>)}
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Description</p>
            <p className="text-xs text-foreground">{rfq.description}</p>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30"><p className="text-xs font-semibold text-foreground">{rfq.items.length} Requested Items</p></div>
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground"><tr>{['Description', 'Qty', 'Unit'].map(h => <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {rfq.items.map((item, i) => <tr key={i}><td className="px-4 py-2.5 font-medium text-foreground">{item.description}</td><td className="px-4 py-2.5 text-muted-foreground">{item.qty}</td><td className="px-4 py-2.5 text-muted-foreground">{item.unit}</td></tr>)}
              </tbody>
            </table>
          </div>

          {rfq.responses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase">Vendor Responses ({rfq.responses.length})</p>
              {rfq.responses.map(r => (
                <div key={r.vendor} className={`p-4 rounded-xl border transition-all ${r.recommended ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-muted/20'} ${rfq.status === 'Awarded' && rfq.awardedTo === r.vendor ? 'ring-2 ring-primary/40' : ''}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground">{r.vendor}</p>
                      {r.recommended && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">★ Recommended</span>}
                      {rfq.awardedTo === r.vendor && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">AWARDED</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-bold text-foreground text-sm">${r.price.toLocaleString()}</span>
                      <span>{r.deliveryDays}d delivery</span>
                    </div>
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground mt-1.5">{r.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {rfq.status === 'Evaluating' && rfq.responses.length > 0 && (
            <div className="bg-card border border-primary/20 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">Award RFQ to Vendor</p>
              <select value={awardVendor} onChange={e => setAwardVendor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none">
                {rfq.responses.map(r => <option key={r.vendor} value={r.vendor}>{r.vendor} — ${r.price.toLocaleString()}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
          {rfq.status === 'Draft' && <button onClick={() => { onPublish(rfq.id); onClose(); }} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 flex items-center gap-1.5"><Send className="h-3.5 w-3.5" /> Publish RFQ</button>}
          {rfq.status === 'Evaluating' && awardVendor && (
            <button onClick={() => { onAward(rfq.id, awardVendor); onClose(); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" /> Award to {awardVendor}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NewRFQModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (rfq: RFQ) => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([VENDOR_NAMES[0], VENDOR_NAMES[1], VENDOR_NAMES[2]]);
  const [items, setItems] = useState<RFQItem[]>([{ description: '', qty: 1, unit: 'pieces' }]);

  const toggleVendor = (v: string) =>
    setSelectedVendors(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const addItem = () => setItems(p => [...p, { description: '', qty: 1, unit: 'pieces' }]);
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof RFQItem, value: string | number) =>
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline.trim()) { toast.error('Title and deadline are required'); return; }
    if (selectedVendors.length === 0) { toast.error('Select at least one vendor to invite'); return; }
    if (items.some(i => !i.description.trim())) { toast.error('All items need a description'); return; }
    const rfq: RFQ = {
      id: `RFQ-${2205 + Math.floor(Math.random() * 100)}`, title, category, description,
      items, invitedVendors: selectedVendors, responses: [],
      deadline, created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdBy: 'David Chen', status: 'Draft',
    };
    onSubmit(rfq);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div><h3 className="font-bold text-foreground">Create RFQ</h3><p className="text-xs text-muted-foreground mt-0.5">Request for Quotation from selected vendors</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">RFQ Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Hydraulic Seals Q3 Supply" required
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Response Deadline *</label>
                <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="e.g. Jun 20" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                placeholder="Provide context for vendors..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-2">Invite Vendors ({selectedVendors.length} selected)</label>
              <div className="flex flex-wrap gap-2">
                {VENDOR_NAMES.map(v => (
                  <button key={v} type="button" onClick={() => toggleVendor(v)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${selectedVendors.includes(v) ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase">Items Required</label>
                <button type="button" onClick={addItem} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add</button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[2fr_60px_70px_28px] gap-2 items-center p-2.5 bg-muted/30 rounded-xl border border-border">
                    <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Item description"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} min="1"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    {items.length > 1 ? <button type="button" onClick={() => removeItem(i)} className="p-1 rounded-lg hover:bg-red-100 text-red-500"><X className="h-3.5 w-3.5" /></button> : <div />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create RFQ</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RFQPage({ user }: { user: User }) {
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RFQ['status']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<RFQ | null>(null);

  const filtered = rfqs.filter(r =>
    (statusFilter === 'All' || r.status === statusFilter) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (rfq: RFQ) => {
    setRfqs(prev => [rfq, ...prev]);
    setShowNew(false);
    toast.success(`${rfq.id} created — ${rfq.invitedVendors.length} vendors will be notified`);
  };

  const handleAward = (id: string, vendor: string) => {
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Awarded' as const, awardedTo: vendor } : r));
    toast.success(`${id} awarded to ${vendor} — PO can now be issued`);
  };

  const handlePublish = (id: string) => {
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Open' as const } : r));
    toast.success(`${id} published — vendor invitations sent`);
  };

  const stats = {
    open: rfqs.filter(r => r.status === 'Open').length,
    evaluating: rfqs.filter(r => r.status === 'Evaluating').length,
    awarded: rfqs.filter(r => r.status === 'Awarded').length,
    avgResponses: rfqs.filter(r => r.responses.length > 0).reduce((s, r) => s + r.responses.length, 0) / Math.max(1, rfqs.filter(r => r.responses.length > 0).length),
  };

  const statusColor: Record<RFQ['status'], string> = {
    Draft: 'bg-muted text-muted-foreground', Open: 'bg-blue-500/10 text-blue-600',
    Evaluating: 'bg-amber-500/10 text-amber-600', Awarded: 'bg-emerald-500/10 text-emerald-600', Cancelled: 'bg-red-500/10 text-red-600',
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> RFQ Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create, send and evaluate vendor quotations competitively</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> Create RFQ
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open RFQs', value: stats.open, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Send },
          { label: 'Under Evaluation', value: stats.evaluating, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
          { label: 'Awarded', value: stats.awarded, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Award },
          { label: 'Avg Responses', value: stats.avgResponses.toFixed(1), color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Star },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}><Icon className={`h-3.5 w-3.5 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search RFQ ID, title, category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Draft', 'Open', 'Evaluating', 'Awarded'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground text-xs">No RFQs found.</div>
        ) : filtered.map(rfq => {
          const bestPrice = rfq.responses.length > 0 ? Math.min(...rfq.responses.map(r => r.price)) : null;
          return (
            <div key={rfq.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-muted-foreground">{rfq.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColor[rfq.status]}`}>{rfq.status}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{rfq.category}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{rfq.title}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{rfq.invitedVendors.length} vendors invited</span>
                    <span>{rfq.responses.length} responses</span>
                    {bestPrice && <span>Best price: <span className="font-semibold text-foreground">${bestPrice.toLocaleString()}</span></span>}
                    <span>Deadline: {rfq.deadline}</span>
                    {rfq.awardedTo && <span className="text-emerald-600 font-semibold">Awarded: {rfq.awardedTo}</span>}
                  </div>
                  {rfq.status === 'Evaluating' && rfq.responses.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {rfq.responses.map(r => (
                        <div key={r.vendor} className={`px-3 py-2 rounded-xl border text-xs whitespace-nowrap flex-shrink-0 ${r.recommended ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold' : 'border-border text-muted-foreground'}`}>
                          {r.vendor} — ${r.price.toLocaleString()} {r.recommended && '⭐'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                  {rfq.status === 'Evaluating' && (
                    <button onClick={() => setSelected(rfq)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                      Award RFQ
                    </button>
                  )}
                  {rfq.status === 'Draft' && (
                    <button onClick={() => handlePublish(rfq.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 flex items-center gap-1 transition-colors">
                      <Send className="h-3 w-3" /> Publish
                    </button>
                  )}
                  <button onClick={() => setSelected(rfq)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors flex items-center gap-1">
                    <Eye className="h-3 w-3" /> View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNew && <NewRFQModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && <RFQDetailModal rfq={selected} onClose={() => setSelected(null)} onAward={handleAward} onPublish={handlePublish} />}
    </div>
  );
}
