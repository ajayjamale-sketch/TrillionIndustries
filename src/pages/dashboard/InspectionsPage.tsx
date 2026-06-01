import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, BarChart2, Download, Award, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Inspection {
  id: string;
  product: string;
  batch: string;
  date: string;
  inspector: string;
  type: string;
  pass: number;
  fail: number;
  status: string;
}

const INITIAL_INSPECTIONS: Inspection[] = [
  { id: 'INS-1201', product: 'Steel Shaft Assembly', batch: 'BT-4421', date: '2026-06-02', inspector: 'Alice K.', type: 'In-Process', pass: 472, fail: 28, status: 'Completed' },
  { id: 'INS-1202', product: 'Hydraulic Cylinder', batch: 'BT-4422', date: '2026-06-03', inspector: 'Tom B.', type: 'Final Inspection', pass: 0, fail: 0, status: 'In Progress' },
  { id: 'INS-1203', product: 'Bearing Housing', batch: 'BT-4423', date: '2026-06-04', inspector: 'Mark R.', type: 'Incoming QC', pass: 748, fail: 2, status: 'Completed' },
  { id: 'INS-1204', product: 'Pump Impeller', batch: 'BT-4424', date: '2026-06-05', inspector: 'Sara L.', type: 'First Article', pass: 0, fail: 0, status: 'Scheduled' },
];

export function InspectionsPage({ user }: { user: User }) {
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [search, setSearch] = useState('');
  const [selectedInsp, setSelectedInsp] = useState<Inspection | null>(null);

  // Edit/Detail states
  const [detailPass, setDetailPass] = useState(0);
  const [detailFail, setDetailFail] = useState(0);
  const [detailStatus, setDetailStatus] = useState('');

  const handleSaveDetails = () => {
    if (!selectedInsp) return;

    setInspections(prev => prev.map(ins => {
      if (ins.id === selectedInsp.id) {
        const updated = {
          ...ins,
          pass: detailStatus === 'Completed' ? detailPass : ins.pass,
          fail: detailStatus === 'Completed' ? detailFail : ins.fail,
          status: detailStatus
        };
        setSelectedInsp(updated);
        return updated;
      }
      return ins;
    }));

    toast.success(`Inspection ${selectedInsp.id} details updated`);
  };

  const handleDownloadCertificate = (ins: Inspection) => {
    const certText = `
==================================================
        QUALITY CONFORMANCE CERTIFICATE
==================================================
Certificate Ref ID: CERT-${ins.id}
Product Name:       ${ins.product}
Batch Reference:    ${ins.batch}
Inspection Date:    ${ins.date}
Inspector Officer:  ${ins.inspector}
Evaluation Type:   ${ins.type}

RESULTS OVERVIEW:
- Total Passed Count: ${ins.pass} units
- Total Failed Count: ${ins.fail} units
- Net Pass Ratio:     ${Math.round((ins.pass / (ins.pass + ins.fail)) * 100)}%

STATUS: CONFORMITY VERIFIED
--------------------------------------------------
Approved by Trillion Quality Compliance Operations.
    `;
    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Quality_Certificate_${ins.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Quality Certificate downloaded for ${ins.id}`);
  };

  const filtered = inspections.filter(ins =>
    ins.product.toLowerCase().includes(search.toLowerCase()) ||
    ins.batch.toLowerCase().includes(search.toLowerCase()) ||
    ins.inspector.toLowerCase().includes(search.toLowerCase()) ||
    ins.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Inspection Results</h1>
          <p className="text-sm text-muted-foreground">Historical records, pass/fail counts, and QA certifications</p>
        </div>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(inspections, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inspections_results_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success('Inspection results spreadsheet exported');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Download className="h-4 w-4" /> Export Results
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, product, batch or inspector..."
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
                {['ID', 'Product', 'Batch', 'Inspection Type', 'Inspector', 'Pass/Fail', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">No inspection results listed.</td>
                </tr>
              ) : (
                filtered.map(ins => (
                  <tr key={ins.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{ins.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{ins.product}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.batch}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.type}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.inspector}</td>
                    <td className="px-5 py-3.5 text-xs">
                      {ins.status === 'Completed' ? (
                        <>
                          <span className="text-emerald-600 font-semibold">{ins.pass}</span>
                          <span className="text-muted-foreground mx-1">/</span>
                          <span className="text-red-500 font-semibold">{ins.fail}</span>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.date}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={ins.status === 'Completed' ? 'success' : ins.status === 'In Progress' ? 'default' : 'warning'} size="sm">
                        {ins.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => {
                            setSelectedInsp(ins);
                            setDetailPass(ins.pass);
                            setDetailFail(ins.fail);
                            setDetailStatus(ins.status);
                          }}
                          className="text-xs text-primary hover:underline font-semibold"
                        >
                          View
                        </button>
                        {ins.status === 'Completed' && (ins.pass > 0) && (
                          <button
                            onClick={() => handleDownloadCertificate(ins)}
                            className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <ShieldCheck className="h-3 w-3" /> Cert
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

      {/* Detail / Update Sheet Modal */}
      {selectedInsp && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                {selectedInsp.id}
              </span>
              <button onClick={() => setSelectedInsp(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Product & Batch</h4>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedInsp.product} ({selectedInsp.batch})</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Inspector</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{selectedInsp.inspector}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Evaluation Type</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{selectedInsp.type}</p>
                </div>
              </div>

              {/* Status Update Fields */}
              <div className="border-t border-border pt-4 space-y-3">
                <label className="block text-xs font-semibold text-foreground uppercase">Modify Log Status</label>
                <select
                  value={detailStatus}
                  onChange={e => setDetailStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {detailStatus === 'Completed' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-600 uppercase mb-1">Pass Count</label>
                    <input
                      type="number"
                      min="0"
                      value={detailPass}
                      onChange={e => setDetailPass(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-red-500 uppercase mb-1">Fail Count</label>
                    <input
                      type="number"
                      min="0"
                      value={detailFail}
                      onChange={e => setDetailFail(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                    />
                  </div>
                </div>
              )}

              {detailStatus === 'Completed' && (detailPass + detailFail > 0) && (
                <div className="bg-muted/40 p-4 rounded-xl border border-border flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Quality Pass Ratio</p>
                    <p className="text-sm font-bold text-foreground">
                      {Math.round((detailPass / (detailPass + detailFail)) * 100)}% Pass Rating ({detailPass} of {detailPass + detailFail} parts)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <div>
                {detailStatus === 'Completed' && (detailPass > 0) && (
                  <button
                    onClick={() => handleDownloadCertificate({ ...selectedInsp, pass: detailPass, fail: detailFail, status: detailStatus })}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Award className="h-3.5 w-3.5" /> Conformance Cert
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInsp(null)}
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
