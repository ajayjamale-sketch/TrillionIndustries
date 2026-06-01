import { useState } from 'react';
import { Briefcase, Plus, Search, X, Calendar, Download, AlertTriangle, CheckCircle2, Clock, RefreshCw, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface ContractMilestone { date: string; description: string; done: boolean; }
interface Contract {
  id: string; vendor: string; category: string; type: 'Annual Supply' | 'Framework' | 'Spot Contract' | 'Service Level Agreement' | 'Master Purchase Agreement';
  value: number; startDate: string; endDate: string; renewalDue: string;
  signatories: string[]; description: string;
  status: 'Draft' | 'Active' | 'Renewal Due' | 'Expired' | 'Terminated';
  milestones: ContractMilestone[]; notes: string;
}

const VENDORS_LIST = ['SteelPro Ltd.', 'Hydraulic Systems Inc.', 'Global Bearings', 'FastenTech Corp.', 'Polymer World', 'Apex Valves Inc.'];
const CONTRACT_TYPES = ['Annual Supply', 'Framework', 'Spot Contract', 'Service Level Agreement', 'Master Purchase Agreement'] as const;

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'CON-441', vendor: 'SteelPro Ltd.', category: 'Raw Materials', type: 'Annual Supply',
    value: 1200000, startDate: 'Jan 1, 2026', endDate: 'Dec 31, 2026', renewalDue: 'Nov 30, 2026',
    signatories: ['David Chen (Procurement)', 'Mike Donovan (SteelPro)'],
    description: 'Annual supply agreement for all steel raw materials including rods, plates, angles and structural steel. Includes volume-based pricing tiers and guaranteed monthly allocation.',
    status: 'Active',
    milestones: [
      { date: 'Jan 1', description: 'Contract signed and activated', done: true },
      { date: 'Apr 1', description: 'Q1 performance review', done: true },
      { date: 'Jul 1', description: 'Q2 performance review', done: false },
      { date: 'Nov 30', description: 'Renewal decision deadline', done: false },
    ],
    notes: 'Vendor performance score 94/100. Consider extending with expanded SKU scope for renewal.',
  },
  {
    id: 'CON-442', vendor: 'Hydraulic Systems Inc.', category: 'MRO', type: 'Framework',
    value: 840000, startDate: 'Mar 1, 2026', endDate: 'Feb 28, 2027', renewalDue: 'Jan 31, 2027',
    signatories: ['David Chen (Procurement)', 'Jane Cooper (Hydraulic Systems)'],
    description: 'Framework agreement for MRO supply covering hydraulic seals, valves, and maintenance consumables. Call-off orders issued monthly against agreed rate card.',
    status: 'Active',
    milestones: [
      { date: 'Mar 1', description: 'Framework activated', done: true },
      { date: 'Jun 1', description: 'First quarterly review', done: true },
      { date: 'Sep 1', description: 'Second quarterly review', done: false },
      { date: 'Jan 31', description: 'Renewal decision', done: false },
    ],
    notes: 'Response time target 4hrs — currently averaging 2.1hrs. Excellent SLA adherence.',
  },
  {
    id: 'CON-443', vendor: 'Global Bearings', category: 'Components', type: 'Spot Contract',
    value: 120000, startDate: 'Jun 1, 2026', endDate: 'Aug 31, 2026', renewalDue: 'Jul 31, 2026',
    signatories: ['Sarah Mitchell (Operations)', 'Peter Lau (Global Bearings)'],
    description: 'Spot contract for Q3 bearing supply — covering ball bearings, roller bearings and thrust bearings for planned maintenance programme.',
    status: 'Active',
    milestones: [
      { date: 'Jun 1', description: 'Contract signed', done: true },
      { date: 'Jul 31', description: 'Extension / termination decision', done: false },
    ],
    notes: 'Covers Q3 PM programme. Consider converting to annual framework if volumes continue.',
  },
  {
    id: 'CON-444', vendor: 'FastenTech Corp.', category: 'Hardware', type: 'Annual Supply',
    value: 410000, startDate: 'Jan 1, 2026', endDate: 'Dec 31, 2026', renewalDue: 'Nov 30, 2026',
    signatories: ['David Chen (Procurement)', 'Amy Singh (FastenTech)'],
    description: 'Annual hardware supply — fasteners, bolts, nuts, anchors and self-tapping screws. Covers all plant requirements across all product lines.',
    status: 'Renewal Due',
    milestones: [
      { date: 'Jan 1', description: 'Contract activated', done: true },
      { date: 'Apr 1', description: 'Q1 review', done: true },
      { date: 'Jul 1', description: 'Q2 review — performance issues noted', done: true },
      { date: 'Nov 30', description: 'Renewal decision (URGENT)', done: false },
    ],
    notes: 'UNDER REVIEW: On-time delivery dropped to 82% (target 95%). Renewal conditional on SLA improvement plan submission.',
  },
  {
    id: 'CON-445', vendor: 'Polymer World', category: 'Raw Materials', type: 'Master Purchase Agreement',
    value: 580000, startDate: 'Jan 1, 2025', endDate: 'Dec 31, 2025', renewalDue: 'Nov 30, 2025',
    signatories: ['Patricia Lee (CFO)', 'Carlos Ruiz (Polymer World)'],
    description: 'Master purchase agreement for polymer seals and gaskets — 2025 supply. Expired on schedule.',
    status: 'Expired',
    milestones: [
      { date: 'Jan 2025', description: 'Agreement activated', done: true },
      { date: 'Dec 2025', description: 'Agreement expired — replaced by spot purchases', done: true },
    ],
    notes: 'Replaced by spot purchasing for 2026. Review for 2027 framework based on Q4 performance.',
  },
];

function ContractDetailModal({ contract, onClose, onUpdateStatus }: {
  contract: Contract; onClose: () => void;
  onUpdateStatus: (id: string, status: Contract['status']) => void;
}) {
  const statusVariant = contract.status === 'Active' ? 'success' : contract.status === 'Renewal Due' ? 'warning' : contract.status === 'Expired' || contract.status === 'Terminated' ? 'error' : 'default';
  const daysToRenewal = Math.ceil((new Date(contract.renewalDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(contract, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.id}_contract_export.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${contract.id} exported`);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{contract.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{contract.type}</span>
              <StatusBadge variant={statusVariant} size="sm">{contract.status}</StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{contract.vendor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Category', value: contract.category },
              { label: 'Contract Value', value: `$${(contract.value / 1000).toFixed(0)}K` },
              { label: 'Start Date', value: contract.startDate },
              { label: 'End Date', value: contract.endDate },
              { label: 'Renewal Due', value: contract.renewalDue },
              { label: 'Days to Renewal', value: daysToRenewal > 0 ? `${daysToRenewal} days` : 'Overdue' },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Scope & Description</p>
            <p className="text-xs text-foreground leading-relaxed">{contract.description}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Signatories</p>
            <div className="flex flex-wrap gap-2">
              {contract.signatories.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground">{s}</span>
              ))}
            </div>
          </div>

          {/* Milestone timeline */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-3">Contract Milestones</p>
            <div className="space-y-2">
              {contract.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${m.done ? 'bg-primary border-primary' : 'border-border bg-muted'}`}>
                    {m.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${m.done ? 'text-foreground' : 'text-muted-foreground'}`}>{m.description}</p>
                    <p className="text-[10px] text-muted-foreground">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {contract.notes && (
            <div className={`rounded-xl p-4 border ${contract.status === 'Renewal Due' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-muted/30 border-border'}`}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Notes</p>
              <p className="text-xs text-foreground">{contract.notes}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
          <button onClick={handleExport} className="px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted flex items-center gap-1.5 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
            {contract.status === 'Renewal Due' && (
              <button onClick={() => { onUpdateStatus(contract.id, 'Active'); onClose(); }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center gap-1.5 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Renew Contract
              </button>
            )}
            {contract.status === 'Draft' && (
              <button onClick={() => { onUpdateStatus(contract.id, 'Active'); onClose(); }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewContractModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (c: Contract) => void }) {
  const [vendor, setVendor] = useState(VENDORS_LIST[0]);
  const [type, setType] = useState<Contract['type']>('Annual Supply');
  const [category, setCategory] = useState('Raw Materials');
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [renewalDue, setRenewalDue] = useState('');
  const [description, setDescription] = useState('');
  const [signatory1, setSignatory1] = useState('David Chen (Procurement)');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !startDate || !endDate) { toast.error('Value, start and end dates are required'); return; }
    const c: Contract = {
      id: `CON-${446 + Math.floor(Math.random() * 100)}`, vendor, category, type,
      value: parseFloat(value.replace(/[^0-9.]/g, '')),
      startDate, endDate, renewalDue: renewalDue || endDate,
      signatories: [signatory1, `${vendor} Representative`],
      description, status: 'Draft',
      milestones: [{ date: startDate, description: 'Contract activation', done: false }],
      notes,
    };
    onSubmit(c);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div><h3 className="font-bold text-foreground">New Contract</h3><p className="text-xs text-muted-foreground mt-0.5">Create a vendor contract or agreement</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Vendor *</label>
                <select value={vendor} onChange={e => setVendor(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {VENDORS_LIST.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Contract Type</label>
                <select value={type} onChange={e => setType(e.target.value as Contract['type'])} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {['Raw Materials', 'MRO', 'Components', 'Hardware', 'Safety', 'Services'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Total Contract Value ($) *</label>
                <input value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. 1200000" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Start Date *</label>
                <input value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="e.g. Jan 1, 2027" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">End Date *</label>
                <input value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="e.g. Dec 31, 2027" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Renewal Decision By</label>
                <input value={renewalDue} onChange={e => setRenewalDue(e.target.value)} placeholder="e.g. Nov 30, 2027"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Internal Signatory</label>
                <input value={signatory1} onChange={e => setSignatory1(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Scope Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                placeholder="Describe the scope, key terms, pricing structure..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="Special conditions, renewal preferences..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create Contract</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ContractsPage({ user }: { user: User }) {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Contract['status']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Contract | null>(null);

  const filtered = contracts.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    (c.vendor.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (c: Contract) => {
    setContracts(prev => [c, ...prev]);
    setShowNew(false);
    toast.success(`${c.id} created as Draft — activate once signed`);
  };

  const handleUpdateStatus = (id: string, status: Contract['status']) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Contract status updated to ${status}`);
  };

  const renewalDue = contracts.filter(c => c.status === 'Renewal Due').length;
  const totalValue = contracts.filter(c => c.status === 'Active').reduce((s, c) => s + c.value, 0);
  const stats = {
    active: contracts.filter(c => c.status === 'Active').length,
    renewalDue,
    expired: contracts.filter(c => c.status === 'Expired').length,
    totalValue,
  };

  const statusBadge = (s: Contract['status']) =>
    s === 'Active' ? 'success' : s === 'Renewal Due' ? 'warning' : s === 'Expired' || s === 'Terminated' ? 'error' : 'default';

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> Contract Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Vendor contracts, agreements and renewal tracking</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> New Contract
        </button>
      </div>

      {renewalDue > 0 && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <span className="font-bold">{renewalDue} contract{renewalDue > 1 ? 's' : ''}</span> due for renewal — action required before expiry
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Contracts', value: stats.active, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Renewal Due', value: stats.renewalDue, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Expired', value: stats.expired, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Active Value', value: `$${(stats.totalValue / 1000000).toFixed(1)}M`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor, contract ID, type..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Active', 'Renewal Due', 'Draft', 'Expired', 'Terminated'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>{['Contract ID', 'Vendor', 'Type', 'Category', 'Value', 'Start', 'End', 'Renewal Due', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-10 text-muted-foreground text-xs">No contracts found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{c.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{c.vendor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.type}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.category}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">${(c.value / 1000).toFixed(0)}K</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.startDate}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.endDate}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.renewalDue}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={statusBadge(c.status)} size="sm">{c.status}</StatusBadge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {c.status === 'Renewal Due' && (
                        <button onClick={() => { handleUpdateStatus(c.id, 'Active'); }} className="text-xs text-emerald-600 font-bold hover:underline">Renew</button>
                      )}
                      {c.status === 'Draft' && (
                        <button onClick={() => { handleUpdateStatus(c.id, 'Active'); }} className="text-xs text-primary font-bold hover:underline">Activate</button>
                      )}
                      <button onClick={() => setSelected(c)} className="text-xs text-muted-foreground hover:text-foreground hover:underline font-semibold">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <NewContractModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && <ContractDetailModal contract={selected} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} />}
    </div>
  );
}
