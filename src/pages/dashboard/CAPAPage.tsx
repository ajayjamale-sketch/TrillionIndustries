import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Target, Plus, CheckCircle2, X, Search, Slider, CheckSquare } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface CAPA {
  id: string;
  ncr: string;
  title: string;
  owner: string;
  due: string;
  completion: number;
  status: string;
  description: string;
}

const INITIAL_CAPAS: CAPA[] = [
  { id: 'CAPA-221', ncr: 'NCR-443', title: 'Supplier material certification process update', owner: 'M. Raj', due: '2026-06-15', completion: 65, status: 'In Progress', description: 'Integrate automated certification checks into supplier onboarding portal and restrict steel bar stock purchasing without authenticated MTC certificates.' },
  { id: 'CAPA-222', ncr: 'NCR-441', title: 'Updated surface inspection SOP for Line A', owner: 'T. Brown', due: '2026-06-10', completion: 40, status: 'In Progress', description: 'Train inspectors on digital laser surface profilometers. Revise Standard Operating Procedures (SOP) documentation.' },
  { id: 'CAPA-223', ncr: 'NCR-444', title: 'Weld parameter calibration and operator re-training', owner: 'S. Lee', due: '2026-05-31', completion: 100, status: 'Closed', description: 'Perform full recalibration on gas flow regulators and weld current controls. Completed welder certifications updates.' },
];

export function CAPAPage({ user }: { user: User }) {
  const [capas, setCapas] = useState<CAPA[]>(INITIAL_CAPAS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [selectedCapa, setSelectedCapa] = useState<CAPA | null>(null);

  // New CAPA Form State
  const [ncrRef, setNcrRef] = useState('');
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [due, setDue] = useState('');
  const [description, setDescription] = useState('');

  // Details Edit States
  const [detailCompletion, setDetailCompletion] = useState(0);
  const [detailStatus, setDetailStatus] = useState('In Progress');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !owner.trim() || !due) {
      toast.error('Please enter all required fields');
      return;
    }

    const newCapa: CAPA = {
      id: `CAPA-${220 + capas.length + 1}`,
      ncr: ncrRef || 'N/A',
      title,
      owner,
      due,
      completion: 0,
      status: 'In Progress',
      description
    };

    setCapas([...capas, newCapa]);
    setShowNew(false);
    toast.success(`CAPA task ${newCapa.id} generated`);

    // Reset Form
    setNcrRef('');
    setTitle('');
    setOwner('');
    setDue('');
    setDescription('');
  };

  const handleComplete = (capaId: string) => {
    setCapas(prev => prev.map(c => {
      if (c.id === capaId) {
        toast.success(`CAPA ${c.id} marked as Closed`);
        return { ...c, completion: 100, status: 'Closed' };
      }
      return c;
    }));
  };

  const handleSaveDetails = () => {
    if (!selectedCapa) return;

    setCapas(prev => prev.map(c => {
      if (c.id === selectedCapa.id) {
        const isClosed = detailCompletion === 100 || detailStatus === 'Closed';
        const updated = {
          ...c,
          completion: isClosed ? 100 : detailCompletion,
          status: isClosed ? 'Closed' : 'In Progress'
        };
        setSelectedCapa(updated);
        return updated;
      }
      return c;
    }));

    toast.success(`CAPA ${selectedCapa.id} progress updated`);
  };

  const filtered = capas.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.ncr.toLowerCase().includes(search.toLowerCase()) ||
    c.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />CAPA Management
          </h1>
          <p className="text-sm text-muted-foreground">Corrective and Preventive Action tracking</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />New CAPA
        </button>
      </div>

      {/* Search / Filter bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search CAPAs by ID, Title, NCR, Owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center bg-card border border-border p-8 rounded-xl text-muted-foreground">
            No CAPA tasks found matching your search.
          </div>
        ) : (
          filtered.map(capa => (
            <div
              key={capa.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{capa.id}</span>
                    <span className="text-xs text-muted-foreground font-semibold">→ {capa.ncr}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{capa.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Owner: {capa.owner} · Due: {capa.due}</p>
                </div>
                <StatusBadge variant={capa.status === 'Closed' ? 'success' : 'default'} size="sm">
                  {capa.status}
                </StatusBadge>
              </div>

              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-[150px] h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      capa.completion === 100 ? 'bg-emerald-500' : 'bg-primary'
                    }`}
                    style={{ width: `${capa.completion}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-muted-foreground w-10 text-right">{capa.completion}%</span>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setSelectedCapa(capa);
                      setDetailCompletion(capa.completion);
                      setDetailStatus(capa.status);
                    }}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Details
                  </button>
                  {capa.status !== 'Closed' && (
                    <button
                      onClick={() => handleComplete(capa.id)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New CAPA Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" /> Create Corrective / Preventive Action
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">CAPA Action Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement dual check valves calibration SOP"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">NCR Reference ID</label>
                  <input
                    type="text"
                    placeholder="e.g. NCR-441 (Optional)"
                    value={ncrRef}
                    onChange={e => setNcrRef(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={due}
                    onChange={e => setDue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Owner / Assigned *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alice Kim"
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Detailed Description of Preventative Actions</label>
                  <textarea
                    placeholder="Enter containment actions, root cause investigations steps, or preventative procedures changes..."
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
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Generate CAPA
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Details Modal */}
      {selectedCapa && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                {selectedCapa.id}
              </span>
              <button onClick={() => setSelectedCapa(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">CAPA Task Title</h4>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedCapa.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Owner / Assignee</h4>
                  <p className="text-xs text-foreground mt-0.5">{selectedCapa.owner}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">NCR Link</h4>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{selectedCapa.ncr}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Corrective Roadmap</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed bg-muted/40 p-3 rounded-lg border border-border">
                  {selectedCapa.description || 'No roadmap/description specified.'}
                </p>
              </div>

              {/* Interactive Completion Slider */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground uppercase">Update Progress Completion</label>
                  <span className="text-xs font-mono font-bold text-primary">{detailCompletion}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={detailCompletion}
                  onChange={e => setDetailCompletion(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  disabled={selectedCapa.status === 'Closed'}
                />
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-xs text-muted-foreground font-semibold">Target date: {selectedCapa.due}</span>
                <StatusBadge variant={selectedCapa.status === 'Closed' ? 'success' : 'default'}>
                  {selectedCapa.status}
                </StatusBadge>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCapa(null)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
              {selectedCapa.status !== 'Closed' && (
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Save Progress
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
