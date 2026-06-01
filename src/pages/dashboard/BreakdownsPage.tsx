import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertOctagon, Plus, Search, X, ShieldAlert, UserCheck } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface BreakdownTicket {
  id: string;
  asset: string;
  issue: string;
  reported: string;
  severity: string;
  assigned: string;
  eta: string;
  status: 'In Progress' | 'Resolved' | 'Logged';
}

const INITIAL_BREAKDOWNS: BreakdownTicket[] = [
  { id: 'BRK-441', asset: 'CNC Milling Center #12', issue: 'Excessive vibration — spindle bearing fault suspected', reported: '2026-06-02 07:45', severity: 'Critical', assigned: 'James Williams', eta: '4h', status: 'In Progress' },
  { id: 'BRK-440', asset: 'Conveyor Belt Main', issue: 'Belt slippage — drive gear tension adjustment needed', reported: '2026-06-01 14:20', severity: 'Major', assigned: 'Tom Bradley', eta: 'Completed', status: 'Resolved' },
  { id: 'BRK-439', asset: 'Hydraulic Press HP-200', issue: 'Oil leakage at main cylinder seal ring', reported: '2026-05-31 09:00', severity: 'Major', assigned: 'Mark Rahman', eta: 'Completed', status: 'Resolved' },
];

export function BreakdownsPage({ user }: { user: User }) {
  const [breakdowns, setBreakdowns] = useState<BreakdownTicket[]>(INITIAL_BREAKDOWNS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [asset, setAsset] = useState('');
  const [issue, setIssue] = useState('');
  const [severity, setSeverity] = useState('Major');
  const [assigned, setAssigned] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim() || !issue.trim() || !assigned.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newTicket: BreakdownTicket = {
      id: `BRK-${440 + breakdowns.length + 2}`,
      asset,
      issue,
      reported: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      severity,
      assigned,
      eta: '12h',
      status: 'Logged'
    };

    setBreakdowns([newTicket, ...breakdowns]);
    setShowNew(false);
    toast.error(`Emergency ticket raised! Dispatching ${assigned}.`);

    // Reset Form
    setAsset('');
    setIssue('');
    setAssigned('');
  };

  const handleResolve = (id: string) => {
    setBreakdowns(prev => prev.map(item => {
      if (item.id === id) {
        toast.success(`Breakdown ${id} resolved`);
        return { ...item, status: 'Resolved', eta: 'Completed' };
      }
      return item;
    }));
  };

  const filtered = breakdowns.filter(b =>
    b.asset.toLowerCase().includes(search.toLowerCase()) ||
    b.issue.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-500" />Breakdown Tickets
          </h1>
          <p className="text-sm text-muted-foreground">
            {breakdowns.filter(b => b.status !== 'Resolved').length} active machine breakdowns requiring response
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Raise Emergency Ticket
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search breakdowns by ID, asset or issue..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Breakdown Tickets List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center bg-card border border-border p-8 rounded-xl text-muted-foreground">
            No active breakdown tickets found.
          </div>
        ) : (
          filtered.map(b => (
            <div
              key={b.id}
              className={`bg-card border rounded-xl p-5 transition-all ${
                b.status !== 'Resolved' ? 'border-red-500/30 hover:shadow-sm' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    b.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <AlertOctagon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{b.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        b.severity === 'Critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {b.severity}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground leading-snug">{b.asset} — {b.issue}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reported: {b.reported} · Assigned Tech: {b.assigned} · Response ETA: {b.eta}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <StatusBadge variant={b.status === 'Resolved' ? 'success' : b.status === 'In Progress' ? 'warning' : 'error'} size="sm">
                    {b.status}
                  </StatusBadge>
                  {b.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(b.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency ticket modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" /> Log Emergency Breakdown Ticket
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Target Machinery *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Lathe #2"
                    value={asset}
                    onChange={e => setAsset(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none font-semibold"
                  >
                    <option value="Minor">Minor Fault</option>
                    <option value="Major">Major Down</option>
                    <option value="Critical">Critical Line Halt</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Issue Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Drive motor slippage or coolant leak details..."
                    value={issue}
                    onChange={e => setIssue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Assigned Maintenance Tech *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James Williams"
                    value={assigned}
                    onChange={e => setAssigned(e.target.value)}
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
                  Submit Emergency Ticket
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
