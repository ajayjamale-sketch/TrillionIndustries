import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Plus, Search, X, FileText, CheckCircle2, ListFilter } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RCALog {
  id: string;
  asset: string;
  failureMode: string;
  rootCause: string;
  correctiveAction: string;
  date: string;
  riskPriorityNumber: number; // RPN Score (1 - 1000)
}

const INITIAL_RCA_LOGS: RCALog[] = [
  { id: 'RCA-501', asset: 'CNC Milling Center #12', failureMode: 'Spindle Bearing Failure', rootCause: 'Lubrication pump nozzle clogged causing dry friction wear.', correctiveAction: 'Added pressure gauges in coolant lines; grease checks schedule updated to weekly.', date: '2026-05-28', riskPriorityNumber: 360 },
  { id: 'RCA-502', asset: 'Hydraulic Press', failureMode: 'Main Seal Leakage', rootCause: 'Excessive hydraulic pressure peaks over target 200 Bar threshold.', correctiveAction: 'Recalibrated safety pressure valves and replaced seal rings.', date: '2026-05-15', riskPriorityNumber: 240 },
  { id: 'RCA-503', asset: 'Conveyor Belt Main', failureMode: 'Belt Slippage / Drive Lockup', rootCause: 'Accumulation of metal chips in drive gears sprocket.', checked: true, correctiveAction: 'Installed protective steel shielding filters over conveyor motors.', date: '2026-04-12', riskPriorityNumber: 120 } as any
];

const failureCauseChart = [
  { cause: 'Bearing Failure', count: 5 },
  { cause: 'Seal Leakage', count: 3 },
  { cause: 'Belt Slip', count: 2 },
  { cause: 'Coolant Clogs', count: 2 },
];

export function FailureAnalysisPage({ user }: { user: User }) {
  const [logs, setLogs] = useState<RCALog[]>(INITIAL_RCA_LOGS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [asset, setAsset] = useState('');
  const [failureMode, setFailureMode] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [rpn, setRpn] = useState(120);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim() || !failureMode.trim() || !rootCause.trim() || !correctiveAction.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newLog: RCALog = {
      id: `RCA-${500 + logs.length + 1}`,
      asset,
      failureMode,
      rootCause,
      correctiveAction,
      date: new Date().toISOString().slice(0, 10),
      riskPriorityNumber: rpn
    };

    setLogs([newLog, ...logs]);
    setShowNew(false);
    toast.success(`Root Cause Analysis ${newLog.id} filed successfully`);

    // Reset Form
    setAsset('');
    setFailureMode('');
    setRootCause('');
    setCorrectiveAction('');
  };

  const filtered = logs.filter(log =>
    log.asset.toLowerCase().includes(search.toLowerCase()) ||
    log.failureMode.toLowerCase().includes(search.toLowerCase()) ||
    log.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />Failure Analysis (RCA/FMEA)
          </h1>
          <p className="text-sm text-muted-foreground">Perform Root Cause Analysis (RCA) and document Risk Priority Numbers (RPN)</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Log RCA Analysis
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* RCA Log List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Root Cause Records
            </h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search RCA logs..."
                className="pl-8 pr-3 py-1 rounded-lg bg-muted border border-border text-xs focus:outline-none w-36 focus:w-44 transition-all"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No RCA logs match filters.
              </div>
            ) : (
              filtered.map(log => (
                <div key={log.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground font-semibold bg-muted border border-border px-1.5 py-0.25 rounded">{log.id}</span>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{log.asset} — {log.failureMode}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] block text-muted-foreground uppercase font-semibold">RPN Criticality</span>
                      <span className={`text-xs font-bold ${log.riskPriorityNumber >= 300 ? 'text-red-500' : 'text-amber-500'}`}>
                        RPN {log.riskPriorityNumber}
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs bg-muted/30 border border-border p-3 rounded-lg leading-relaxed">
                    <div>
                      <span className="font-bold text-foreground block mb-0.5">Root Cause:</span>
                      <span className="text-muted-foreground">{log.rootCause}</span>
                    </div>
                    <div>
                      <span className="font-bold text-foreground block mb-0.5">Corrective Action Taken:</span>
                      <span className="text-muted-foreground">{log.correctiveAction}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Failure cause Pareto/Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">Top Defect Mode Causes</h2>
            <p className="text-xs text-muted-foreground font-semibold">Distribution of machine failure causes YTD</p>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureCauseChart}>
                <XAxis dataKey="cause" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="count" fill="#EF4444" radius={[3, 3, 0, 0]} name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Log RCA Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" /> Log Root Cause Analysis (RCA)
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Target Machine *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hydraulic Press"
                    value={asset}
                    onChange={e => setAsset(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Observed Failure Mode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chuck slippage / seal leak"
                    value={failureMode}
                    onChange={e => setFailureMode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Root Cause Findings *</label>
                  <textarea
                    required
                    placeholder="Explain the technical root cause (e.g. clogged coolant nozzle, dry friction)..."
                    rows={2}
                    value={rootCause}
                    onChange={e => setRootCause(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Corrective Action Taken *</label>
                  <textarea
                    required
                    placeholder="Describe specific modifications, replacement parts, or checks checklist updates made..."
                    rows={2}
                    value={correctiveAction}
                    onChange={e => setCorrectiveAction(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Calculated RPN Score (1 - 1000)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={rpn}
                    onChange={e => setRpn(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
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
                  File RCA Report
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
