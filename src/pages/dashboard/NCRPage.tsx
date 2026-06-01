import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertOctagon, Plus, Search, X, ShieldAlert, UserPlus, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface NCR {
  id: string;
  title: string;
  severity: string;
  raised: string;
  status: string;
  assigned: string;
  product: string;
  batch: string;
  description: string;
}

const INITIAL_NCRS: NCR[] = [
  { id: 'NCR-441', title: 'Surface finish defect — Steel Shaft', severity: 'Major', raised: '2026-06-01', status: 'Open', assigned: 'T. Brown', product: 'Steel Shaft Assembly', batch: 'BT-4421', description: 'Rough surface tooling marks detected outside acceptable threshold specifications.' },
  { id: 'NCR-442', title: 'Dimensional non-conformance — Bearing', severity: 'Minor', raised: '2026-05-30', status: 'Under Review', assigned: 'A. Kim', product: 'Bearing Housing', batch: 'BT-4422', description: 'Outer diameter exceeds specifications by 0.05mm on random inspections.' },
  { id: 'NCR-443', title: 'Material certification missing', severity: 'Critical', raised: '2026-05-28', status: 'CAPA Raised', assigned: 'M. Raj', product: 'Raw Steel Barstock', batch: 'BT-2210', description: 'Mill test certificates (MTC) missing from Supplier SteelPro shipment.' },
  { id: 'NCR-444', title: 'Weld porosity in valve body', severity: 'Major', raised: '2026-05-25', status: 'Closed', assigned: 'S. Lee', product: 'Hydraulic Cylinder', batch: 'BT-4424', description: 'Porosity detected in root welds via radiographic testing.' },
];

export function NCRPage({ user }: { user: User }) {
  const [ncrs, setNcrs] = useState<NCR[]>(INITIAL_NCRS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [selectedNcr, setSelectedNcr] = useState<NCR | null>(null);

  // New NCR Form State
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('Major');
  const [assigned, setAssigned] = useState('');
  const [product, setProduct] = useState('');
  const [batch, setBatch] = useState('');
  const [description, setDescription] = useState('');

  // Edit/Detail states
  const [detailAssigned, setDetailAssigned] = useState('');
  const [detailStatus, setDetailStatus] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigned.trim() || !product.trim() || !batch.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newNcr: NCR = {
      id: `NCR-${440 + ncrs.length + 1}`,
      title,
      severity,
      raised: new Date().toISOString().slice(0, 10),
      status: 'Open',
      assigned,
      product,
      batch,
      description
    };

    setNcrs([newNcr, ...ncrs]);
    setShowNew(false);
    toast.success(`NCR ${newNcr.id} raised successfully`);

    // Reset Form
    setTitle('');
    setSeverity('Major');
    setAssigned('');
    setProduct('');
    setBatch('');
    setDescription('');
  };

  const handleSaveDetails = () => {
    if (!selectedNcr) return;

    setNcrs(prev => prev.map(n => {
      if (n.id === selectedNcr.id) {
        const updated = {
          ...n,
          assigned: detailAssigned,
          status: detailStatus
        };
        setSelectedNcr(updated);
        return updated;
      }
      return n;
    }));

    toast.success(`NCR ${selectedNcr.id} updated`);
  };

  const handleRaiseCAPA = (ncrId: string) => {
    setNcrs(prev => prev.map(n => {
      if (n.id === ncrId) {
        const updated = { ...n, status: 'CAPA Raised' };
        if (selectedNcr && selectedNcr.id === ncrId) {
          setSelectedNcr(updated);
        }
        return updated;
      }
      return n;
    }));
    toast.success(`CAPA task raised for ${ncrId}. Action recorded in CAPA registry.`);
  };

  const filtered = ncrs.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.id.toLowerCase().includes(search.toLowerCase()) ||
    n.assigned.toLowerCase().includes(search.toLowerCase()) ||
    n.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Non-Conformance Reports (NCR)</h1>
          <p className="text-sm text-muted-foreground">
            {ncrs.filter(n => n.status !== 'Closed').length} active quality issues requiring resolution
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Raise NCR
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search NCRs by ID, title, product or owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* NCR Cards Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center bg-card border border-border p-8 rounded-xl text-muted-foreground">
            No Non-Conformance Reports match your query.
          </div>
        ) : (
          filtered.map(ncr => (
            <div
              key={ncr.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-4 flex-wrap"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                ncr.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                ncr.severity === 'Major' ? 'bg-amber-500/10 text-amber-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-muted-foreground">{ncr.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    ncr.severity === 'Critical' ? 'bg-red-500/10 text-red-600' :
                    ncr.severity === 'Major' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-blue-500/10 text-blue-600'
                  }`}>
                    {ncr.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">· Batch: {ncr.batch}</span>
                </div>
                <p className="text-sm font-bold text-foreground leading-snug">{ncr.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Product: {ncr.product} · Assigned: {ncr.assigned} · Raised: {ncr.raised}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <StatusBadge
                  variant={
                    ncr.status === 'Closed' ? 'success' :
                    ncr.status === 'CAPA Raised' ? 'warning' :
                    'error'
                  }
                  size="sm"
                >
                  {ncr.status}
                </StatusBadge>
                {ncr.status === 'Open' && (
                  <button
                    onClick={() => handleRaiseCAPA(ncr.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                  >
                    Raise CAPA
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedNcr(ncr);
                    setDetailAssigned(ncr.assigned);
                    setDetailStatus(ncr.status);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors text-foreground"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New NCR Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" /> Raise Non-Conformance Report
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">NCR Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Short description of non-conformance"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Affected Product *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bearing Housing"
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Batch Reference *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BT-4422"
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Assignee / Owner *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M. Raj"
                    value={assigned}
                    onChange={e => setAssigned(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Detailed Findings / Description</label>
                  <textarea
                    placeholder="Specify the dimensional deviations, defect types, testing methods, or visual deviations observed..."
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Raise NCR
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Details/Edit Modal */}
      {selectedNcr && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                  {selectedNcr.id}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  selectedNcr.severity === 'Critical' ? 'bg-red-500/10 text-red-600' :
                  selectedNcr.severity === 'Major' ? 'bg-amber-500/10 text-amber-600' :
                  'bg-blue-500/10 text-blue-600'
                }`}>
                  {selectedNcr.severity}
                </span>
              </div>
              <button onClick={() => setSelectedNcr(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">NCR Title</h4>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedNcr.title}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Target Specs & Batch</h4>
                <p className="text-xs text-foreground mt-0.5">{selectedNcr.product} (Batch: {selectedNcr.batch})</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Description / Evidence</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border">
                  {selectedNcr.description || 'No additional details provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Assignee</label>
                  <input
                    type="text"
                    value={detailAssigned}
                    onChange={e => setDetailAssigned(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Status</label>
                  <select
                    value={detailStatus}
                    onChange={e => setDetailStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="CAPA Raised">CAPA Raised</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {selectedNcr.status === 'Open' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">Resolve with a CAPA task</span>
                  </div>
                  <button
                    onClick={() => handleRaiseCAPA(selectedNcr.id)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Raise CAPA Now
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
              <button
                onClick={() => setSelectedNcr(null)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
