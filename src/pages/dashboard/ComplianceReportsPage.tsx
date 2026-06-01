import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, Plus, Download, Search, X, FileText, CheckSquare } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface ComplianceReport {
  id: string;
  title: string;
  category: string;
  filedDate: string;
  inspector: string;
  status: string; // Open | Closed | In Progress
  details: string;
}

const INITIAL_REPORTS: ComplianceReport[] = [
  { id: 'REP-771', title: 'OSHA 1910 Machine Guarding Audit', category: 'Audit', filedDate: '2026-05-18', inspector: 'M. Vance', status: 'Closed', details: 'Full inspection of protective barriers on CNC machines. All lines met standards. Zero citations.' },
  { id: 'REP-772', title: 'Oil leakage near hydraulic press Line B', category: 'Hazard Log', filedDate: '2026-05-29', inspector: 'Chris Okafor', status: 'In Progress', details: 'Slight oil accumulation on walkway. Maintenance dispatched. Absorbent sand laid out.' },
  { id: 'REP-773', title: 'PPE Violation - Welding Section', category: 'Incident', filedDate: '2026-05-24', inspector: 'T. Bradley', status: 'Closed', details: 'Operator observed working without welder mask. Reprimanded. Conducted refresher safety brief.' },
];

export function ComplianceReportsPage({ user }: { user: User }) {
  const [reports, setReports] = useState<ComplianceReport[]>(INITIAL_REPORTS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hazard Log');
  const [inspector, setInspector] = useState('');
  const [details, setDetails] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !inspector.trim() || !details.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newRep: ComplianceReport = {
      id: `REP-${770 + reports.length + 1}`,
      title,
      category,
      filedDate: new Date().toISOString().slice(0, 10),
      inspector,
      status: 'Open',
      details
    };

    setReports([newRep, ...reports]);
    setShowNew(false);
    toast.success(`Compliance report filed: ${newRep.id}`);

    // Reset Form
    setTitle('');
    setInspector('');
    setDetails('');
  };

  const handleCloseReport = (id: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === id) {
        toast.success(`Report ${id} closed and filed`);
        return { ...rep, status: 'Closed' };
      }
      return rep;
    }));
  };

  const filtered = reports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />Compliance Reports
          </h1>
          <p className="text-sm text-muted-foreground">Log safety hazards, document incident logs and archive OSHA compliance audits</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />File Safety Report
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports by ID, title or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Reports Checklist */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground border border-border bg-card rounded-xl">
            No compliance logs match your query.
          </div>
        ) : (
          filtered.map(rep => (
            <div key={rep.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground font-semibold">{rep.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.category === 'Incident' ? 'bg-red-500/10 text-red-600' :
                      rep.category === 'Hazard Log' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-blue-500/10 text-blue-600'
                    }`}>
                      {rep.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{rep.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Filed by: {rep.inspector} · Date: {rep.filedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <StatusBadge variant={rep.status === 'Closed' ? 'success' : rep.status === 'In Progress' ? 'warning' : 'error'}>
                    {rep.status}
                  </StatusBadge>
                  {rep.status !== 'Closed' && (
                    <button
                      onClick={() => handleCloseReport(rep.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Resolve & Close
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-lg border border-border">
                {rep.details}
              </div>
            </div>
          ))
        )}
      </div>

      {/* File safety report modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" /> File Safety Compliance Report
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Report Title / Event Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="Short description of incident or hazard observed"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Log Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Hazard Log">Hazard Log</option>
                    <option value="Incident">Incident Report</option>
                    <option value="Audit">Safety Audit</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Reporter / Inspector *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chris Okafor"
                    value={inspector}
                    onChange={e => setInspector(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Detailed Findings & Containment Action</label>
                  <textarea
                    required
                    placeholder="Specify location, machine reference, operators involved, hazard details, and immediate actions taken..."
                    rows={3}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
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
                  File Report
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
