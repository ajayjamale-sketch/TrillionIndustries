import { useState } from 'react';
import { AlertOctagon, Plus, Search, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const BREAKDOWNS = [
  { id: 'BRK-441', asset: 'CNC-12', issue: 'Excessive vibration — bearing fault suspected', reported: 'Jun 2 07:45', severity: 'Critical', assigned: 'J. Williams', eta: '4h', status: 'In Progress' },
  { id: 'BRK-440', asset: 'Conveyor Belt', issue: 'Belt slippage — tension adjustment needed', reported: 'Jun 1 14:20', severity: 'Major', assigned: 'M. Lopez', eta: 'Completed', status: 'Resolved' },
  { id: 'BRK-439', asset: 'HYD-01', issue: 'Oil leakage at cylinder seal', reported: 'May 31 09:00', severity: 'Major', assigned: 'T. Park', eta: 'Completed', status: 'Resolved' },
];

export function BreakdownsPage({ user }: { user: User }) {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ asset: '', issue: '', severity: 'Major', location: '' });

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><AlertOctagon className="h-5 w-5 text-red-500" />Breakdown Management</h1><p className="text-sm text-muted-foreground">{BREAKDOWNS.filter(b => b.status !== 'Resolved').length} active breakdown(s)</p></div>
        <button onClick={() => setShowNew(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"><Plus className="h-4 w-4" />Raise Ticket</button>
      </div>

      {showNew && (
        <div className="bg-card border border-red-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground text-red-600 dark:text-red-400 flex items-center gap-2"><AlertOctagon className="h-4 w-4" />New Breakdown Ticket</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Asset / Machine *</label><input value={form.asset} onChange={e => setForm(p => ({ ...p, asset: e.target.value }))} placeholder="Machine ID or name" className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            <div><label className="text-xs font-medium text-foreground block mb-1.5">Severity</label><select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none">{['Minor', 'Major', 'Critical'].map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="sm:col-span-2"><label className="text-xs font-medium text-foreground block mb-1.5">Issue Description *</label><textarea value={form.issue} onChange={e => setForm(p => ({ ...p, issue: e.target.value }))} rows={3} placeholder="Describe the breakdown, symptoms, and location..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none resize-none" /></div>
          </div>
          <div className="flex gap-2"><button onClick={() => { toast.error(`Breakdown ticket raised — maintenance team notified`); setShowNew(false); }} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Submit Emergency Ticket</button><button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button></div>
        </div>
      )}

      <div className="space-y-3">
        {BREAKDOWNS.map(b => (
          <div key={b.id} className={`bg-card border rounded-xl p-5 transition-all ${b.status !== 'Resolved' ? 'border-red-500/30' : 'border-border'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.severity === 'Critical' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                  <AlertOctagon className={`h-5 w-5 ${b.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5"><span className="font-mono text-xs font-bold text-muted-foreground">{b.id}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${b.severity === 'Critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>{b.severity}</span></div>
                  <p className="text-sm font-bold text-foreground">{b.asset} — {b.issue}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Reported: {b.reported} · Assigned: {b.assigned} · ETA: {b.eta}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={b.status === 'Resolved' ? 'success' : 'error'} size="sm">{b.status}</StatusBadge>
                {b.status !== 'Resolved' && <button onClick={() => toast.success(`${b.id} marked as resolved`)} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">Resolve</button>}
                <button onClick={() => toast.info(`Viewing ${b.id} details`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
