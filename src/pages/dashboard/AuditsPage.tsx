import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Plus, Calendar, X, Search, FileText, Download, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Audit {
  id: string;
  type: string;
  auditor: string;
  scheduled: string;
  duration: string;
  status: string;
  notes: string;
}

const INITIAL_AUDITS: Audit[] = [
  { id: 'AUD-221', type: 'ISO 9001:2015 Surveillance', auditor: 'External — Bureau Veritas', scheduled: '2026-06-15', duration: '2 days', status: 'Scheduled', notes: 'External review of manufacturing facility Line A/B standard conformance. Focus on document controls and CAPA response times.' },
  { id: 'AUD-222', type: 'Internal Quality Audit — Line A', auditor: 'Thomas Anderson', scheduled: '2026-06-08', duration: '1 day', status: 'Planned', notes: 'Verification of updated surface finish inspection SOP compliance and Profilometer recalibration validation.' },
  { id: 'AUD-223', type: 'Supplier QC Audit — SteelPro', auditor: 'Alice Kim', scheduled: '2026-05-28', duration: '1 day', status: 'Completed', notes: 'On-site audit of SteelPro casting line. Confirmed automated mill certification integration. 2 minor issues resolved.' },
  { id: 'AUD-224', type: 'Process Compliance Review', auditor: 'M. Raj', scheduled: '2026-05-20', duration: '4 hrs', status: 'Completed', notes: 'Random audit of batch trace sheets. 100% compliance recorded.' },
];

export function AuditsPage({ user }: { user: User }) {
  const [audits, setAudits] = useState<Audit[]>(INITIAL_AUDITS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  // New Audit Form State
  const [type, setType] = useState('');
  const [auditor, setAuditor] = useState('');
  const [scheduled, setScheduled] = useState('');
  const [duration, setDuration] = useState('1 day');
  const [status, setStatus] = useState('Scheduled');
  const [notes, setNotes] = useState('');

  // Details States
  const [detailStatus, setDetailStatus] = useState('');
  const [detailNotes, setDetailNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim() || !auditor.trim() || !scheduled) {
      toast.error('Please enter all required fields');
      return;
    }

    const newAudit: Audit = {
      id: `AUD-${220 + audits.length + 1}`,
      type,
      auditor,
      scheduled,
      duration,
      status,
      notes
    };

    setAudits([newAudit, ...audits]);
    setShowNew(false);
    toast.success(`Audit ${newAudit.id} scheduled successfully`);

    // Reset Form
    setType('');
    setAuditor('');
    setScheduled('');
    setDuration('1 day');
    setStatus('Scheduled');
    setNotes('');
  };

  const handleCompleteAudit = (auditId: string) => {
    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        toast.success(`Audit ${a.id} marked as Completed`);
        const updated = { ...a, status: 'Completed' };
        if (selectedAudit && selectedAudit.id === auditId) {
          setSelectedAudit(updated);
        }
        return updated;
      }
      return a;
    }));
  };

  const handleSaveDetails = () => {
    if (!selectedAudit) return;

    setAudits(prev => prev.map(a => {
      if (a.id === selectedAudit.id) {
        const updated = {
          ...a,
          status: detailStatus,
          notes: detailNotes
        };
        setSelectedAudit(updated);
        return updated;
      }
      return a;
    }));

    toast.success(`Audit ${selectedAudit.id} details saved`);
  };

  const handleDownloadReport = (audit: Audit) => {
    const reportContent = `
========================================
AUDIT COMPLIANCE REPORT: ${audit.id}
========================================
Audit Type: ${audit.type}
Auditor: ${audit.auditor}
Date Executed: ${audit.scheduled}
Duration: ${audit.duration}
Status: ${audit.status}

Auditor Summary Notes:
${audit.notes || 'No notes compiled.'}

----------------------------------------
This confirms that the subject processes were audited for standard operational controls and certified compliance.
    `;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Report_${audit.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Report file downloaded for ${audit.id}`);
  };

  const filtered = audits.filter(a =>
    a.type.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase()) ||
    a.auditor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />Compliance Audits
          </h1>
          <p className="text-sm text-muted-foreground">Schedule and track quality system audits</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Schedule Audit
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audits by ID, type or auditor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['Audit ID', 'Type', 'Auditor', 'Scheduled', 'Duration', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">No audits listed.</td>
                </tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{a.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{a.type}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.auditor}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.scheduled}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.duration}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={a.status === 'Completed' ? 'success' : a.status === 'Scheduled' ? 'default' : 'warning'} size="sm">
                        {a.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => {
                            setSelectedAudit(a);
                            setDetailStatus(a.status);
                            setDetailNotes(a.notes);
                          }}
                          className="text-primary hover:underline font-semibold"
                        >
                          View
                        </button>
                        {a.status === 'Completed' && (
                          <button
                            onClick={() => handleDownloadReport(a)}
                            className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Download className="h-3 w-3" /> Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Audit Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Schedule Compliance Audit
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Audit Type / Standard *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISO 9001:2015 Surveillance Audit"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Auditing Body / Inspector *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. External - Bureau Veritas"
                    value={auditor}
                    onChange={e => setAuditor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduled}
                    onChange={e => setScheduled(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Audit Scope / Notes</label>
                  <textarea
                    placeholder="Describe audit parameters, files to request, plant machinery sectors to check..."
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View/Details Modal */}
      {selectedAudit && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                {selectedAudit.id}
              </span>
              <button onClick={() => setSelectedAudit(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Audit Conformance / Scope</h4>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedAudit.type}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Auditor Group</h4>
                  <p className="text-xs text-foreground mt-0.5">{selectedAudit.auditor}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Timeline Date</h4>
                  <p className="text-xs text-foreground mt-0.5">{selectedAudit.scheduled} ({selectedAudit.duration})</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Auditor Field Log</h4>
                <textarea
                  value={detailNotes}
                  onChange={e => setDetailNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border bg-background rounded-xl text-xs focus:outline-none"
                  placeholder="Record conformance logs, observations, and feedback here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Status</label>
                  <select
                    value={detailStatus}
                    onChange={e => setDetailStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {detailStatus !== 'Completed' && (
                  <button
                    onClick={() => handleCompleteAudit(selectedAudit.id)}
                    className="w-full mt-5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Complete Audit
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <div>
                {detailStatus === 'Completed' && (
                  <button
                    onClick={() => handleDownloadReport({ ...selectedAudit, status: detailStatus, notes: detailNotes })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Report
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Save Logs
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
