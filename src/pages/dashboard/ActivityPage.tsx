import { useState } from 'react';
import { History, Filter, Search, User as UserIcon, Settings, FileText, ShieldCheck, Factory, Package } from 'lucide-react';
import { User } from '@/types';

const ACTIVITIES = [
  { id: 1, user: 'Alex Johnson', action: 'Created Work Order', target: 'WO-4426 — Pump Impeller 400 units', module: 'Production', time: '2 min ago', icon: Factory, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 2, user: 'David Chen', action: 'Approved Purchase Order', target: 'PO-7821 — SteelPro Ltd. $48,200', module: 'Procurement', time: '8 min ago', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 3, user: 'Maria Rodriguez', action: 'Completed GRN', target: 'GR-5521 — 500 units Steel Rod 30mm', module: 'Warehouse', time: '22 min ago', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 4, user: 'System', action: 'Auto-generated Report', target: 'Daily Production Summary — Jun 2, 2026', module: 'Analytics', time: '1 hr ago', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 5, user: 'James Williams', action: 'Raised Breakdown Ticket', target: 'Machine CNC-12 — Vibration alert', module: 'Maintenance', time: '1 hr ago', icon: Settings, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 6, user: 'Sarah Mitchell', action: 'Updated Work Order', target: 'WO-4421 — Steel Shaft Assembly 78%→85%', module: 'Production', time: '2 hrs ago', icon: Factory, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 7, user: 'Robert Kumar', action: 'Generated Financial Report', target: 'May 2026 P&L — Revenue $2.68M', module: 'Finance', time: '3 hrs ago', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 8, user: 'Thomas Anderson', action: 'Created CAPA', target: 'CAPA-221 — NCR-443 Material cert. process', module: 'Quality', time: '4 hrs ago', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 9, user: 'System', action: 'Scheduled Maintenance', target: 'PM-3341 — Hydraulic Press Line B', module: 'Maintenance', time: '5 hrs ago', icon: Settings, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 10, user: 'Alex Johnson', action: 'Updated Organization Settings', target: 'Trillion Industries Corp — Added Plant 3', module: 'Admin', time: '6 hrs ago', icon: Settings, color: 'text-gray-500', bg: 'bg-gray-500/10' },
];

const MODULES = ['All', 'Production', 'Procurement', 'Warehouse', 'Maintenance', 'Quality', 'Finance', 'Analytics', 'Admin'];

export function ActivityPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('All');

  const filtered = ACTIVITIES
    .filter(a => module === 'All' || a.module === module)
    .filter(a => a.action.toLowerCase().includes(search.toLowerCase()) || a.target.toLowerCase().includes(search.toLowerCase()) || a.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><History className="h-5 w-5" />Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Complete audit trail of all platform actions</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {MODULES.map(m => (
            <button key={m} onClick={() => setModule(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${module === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="font-medium text-muted-foreground">No activity found</p>
          </div>
        ) : filtered.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${a.bg}`}>
                <Icon className={`h-4 w-4 ${a.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold">{a.user}</span> {a.action}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.target}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.module}</span>
                  <span className="text-[11px] text-muted-foreground/70">{a.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
