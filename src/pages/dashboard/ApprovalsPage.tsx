import { useState } from 'react';
import { CheckSquare, Check, X, Clock, AlertTriangle, Eye, MessageSquare, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface ApprovalItem {
  id: string; type: 'Purchase Order' | 'Purchase Request' | 'Contract Amendment' | 'RFQ Award' | 'Vendor Registration';
  ref: string; value: number; requester: string; dept: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'; date: string;
  description: string; notes: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Delegated';
  rejectionReason?: string;
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'APR-881', type: 'Purchase Order', ref: 'PO-7822', value: 31500,
    requester: 'Sarah Mitchell', dept: 'Production', priority: 'High', date: 'Jun 2',
    description: 'Hydraulic Seal Kit and Check Valves — 50 sets + 30 pieces from Hydraulic Systems Inc.',
    notes: 'Value exceeds $30K threshold — CFO approval required per procurement policy §3.2', status: 'Pending',
  },
  {
    id: 'APR-882', type: 'Purchase Request', ref: 'PR-3302', value: 28000,
    requester: 'James Williams', dept: 'Maintenance', priority: 'Urgent', date: 'Jun 2',
    description: 'Emergency: 500 pcs Steel Rod 30mm for Production Line A restart — line is currently halted',
    notes: 'Production stoppage — revenue impact $4,200/hour. Requires expedited approval.', status: 'Pending',
  },
  {
    id: 'APR-883', type: 'Contract Amendment', ref: 'CON-441', value: 124000,
    requester: 'David Chen', dept: 'Procurement', priority: 'Medium', date: 'Jun 1',
    description: 'SteelPro Ltd. annual supply contract renewal — extending 3 months to include Q4 with 5% volume discount',
    notes: 'Vendor performance score 94/100. Amendment includes updated delivery SLAs.', status: 'Pending',
  },
  {
    id: 'APR-884', type: 'Purchase Order', ref: 'PO-7820', value: 18400,
    requester: 'Maria Rodriguez', dept: 'Warehouse', priority: 'Low', date: 'May 31',
    description: 'Conveyor belt replacement parts from Apex Valves Inc. — per RFQ-2203 award',
    notes: 'Lowest cost tender — 24 month warranty included.', status: 'Approved',
  },
  {
    id: 'APR-885', type: 'RFQ Award', ref: 'RFQ-2203', value: 18400,
    requester: 'David Chen', dept: 'Procurement', priority: 'Medium', date: 'May 31',
    description: 'Award Conveyor Belt Replacement RFQ to Apex Valves Inc. — best value bid with longest warranty',
    notes: 'Saving $800 vs next bid (MetalCo) with superior warranty terms.', status: 'Approved',
  },
  {
    id: 'APR-886', type: 'Vendor Registration', ref: 'VEN-006', value: 0,
    requester: 'David Chen', dept: 'Procurement', priority: 'Low', date: 'May 30',
    description: 'New vendor registration: IndoSteel Corp. — Raw materials supplier from Mumbai',
    notes: 'Background check completed. MSME certified. ISO 9001:2015.', status: 'Approved',
  },
  {
    id: 'APR-887', type: 'Purchase Request', ref: 'PR-3305', value: 5400,
    requester: 'Alex Johnson', dept: 'Safety', priority: 'Medium', date: 'May 28',
    description: 'Annual PPE stock: Hard Hats, Safety Glasses, Hi-Vis Vests, Ear Plugs — ISO 45001 compliance',
    notes: 'Annual compliance programme. Must be restocked before Q3 safety audit.', status: 'Rejected',
    rejectionReason: 'Budget freeze — defer to Q4 unless safety audit mandates earlier.',
  },
];

function ApprovalDetailModal({ item, onClose, onApprove, onReject }: {
  item: ApprovalItem; onClose: () => void;
  onApprove: (id: string) => void; onReject: (id: string, reason: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const typeIcon = { 'Purchase Order': '🛒', 'Purchase Request': '📋', 'Contract Amendment': '📝', 'RFQ Award': '🏆', 'Vendor Registration': '🏢' };
  const priorityColor = { Urgent: 'text-red-500 bg-red-500/10', High: 'text-amber-500 bg-amber-500/10', Medium: 'text-blue-500 bg-blue-500/10', Low: 'text-muted-foreground bg-muted' };

  const handleReject = () => {
    if (!rejectReason.trim()) { toast.error('Please provide a rejection reason'); return; }
    onReject(item.id, rejectReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg">{typeIcon[item.type]}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">{item.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priorityColor[item.priority]}`}>{item.priority}</span>
                <StatusBadge variant={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'error' : item.status === 'Delegated' ? 'default' : 'warning'} size="sm">{item.status}</StatusBadge>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">{item.type} — {item.ref}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Requester', value: item.requester },
              { label: 'Department', value: item.dept },
              { label: 'Date Submitted', value: item.date },
              { label: 'Approval Value', value: item.value > 0 ? `$${item.value.toLocaleString()}` : 'N/A' },
            ].map(m => <div key={m.label}><p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p><p className="text-xs font-semibold text-foreground">{m.value}</p></div>)}
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Request Description</p>
            <p className="text-xs text-foreground">{item.description}</p>
          </div>

          {item.notes && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">Supporting Notes</p>
              <p className="text-xs text-foreground">{item.notes}</p>
            </div>
          )}

          {item.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-red-600 uppercase mb-1">Rejection Reason</p>
              <p className="text-xs text-red-700 dark:text-red-400">{item.rejectionReason}</p>
            </div>
          )}

          {showRejectBox && (
            <div className="bg-card border border-red-500/20 rounded-xl p-4 space-y-3">
              <label className="text-xs font-semibold text-foreground uppercase block">Rejection Reason *</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2}
                placeholder="Provide reason for rejection..." autoFocus
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
              <div className="flex gap-2">
                <button onClick={handleReject} className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">Confirm Rejection</button>
                <button onClick={() => setShowRejectBox(false)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted">Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between">
          {item.status === 'Pending' && !showRejectBox && (
            <button onClick={() => setShowRejectBox(true)}
              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5">
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
            {item.status === 'Pending' && !showRejectBox && (
              <button onClick={() => { onApprove(item.id); onClose(); }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center gap-1.5 transition-colors">
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApprovalsPage({ user }: { user: User }) {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [filter, setFilter] = useState<'All' | ApprovalItem['status']>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | ApprovalItem['type']>('All');
  const [selected, setSelected] = useState<ApprovalItem | null>(null);

  const pending = approvals.filter(a => a.status === 'Pending');
  const pendingValue = pending.reduce((s, a) => s + a.value, 0);
  const urgentCount = pending.filter(a => a.priority === 'Urgent').length;

  const filtered = approvals.filter(a =>
    (filter === 'All' || a.status === filter) &&
    (typeFilter === 'All' || a.type === typeFilter)
  );

  const approve = (id: string) => {
    setApprovals(p => p.map(a => a.id === id ? { ...a, status: 'Approved' as const } : a));
    toast.success(`${id} approved`);
  };

  const reject = (id: string, reason: string) => {
    setApprovals(p => p.map(a => a.id === id ? { ...a, status: 'Rejected' as const, rejectionReason: reason } : a));
    toast.error(`${id} rejected`);
  };

  const approveBulk = () => {
    const nonUrgent = pending.filter(a => a.priority !== 'Urgent' && a.value < 20000);
    setApprovals(p => p.map(a => nonUrgent.find(n => n.id === a.id) ? { ...a, status: 'Approved' as const } : a));
    toast.success(`${nonUrgent.length} routine approvals processed in bulk`);
  };

  const priorityColor: Record<string, string> = {
    Urgent: 'text-red-500 bg-red-500/10', High: 'text-amber-500 bg-amber-500/10',
    Medium: 'text-blue-500 bg-blue-500/10', Low: 'text-muted-foreground bg-muted',
  };
  const typeColors: Record<string, string> = {
    'Purchase Order': 'bg-blue-500/10 text-blue-600', 'Purchase Request': 'bg-purple-500/10 text-purple-600',
    'Contract Amendment': 'bg-amber-500/10 text-amber-600', 'RFQ Award': 'bg-emerald-500/10 text-emerald-600',
    'Vendor Registration': 'bg-cyan-500/10 text-cyan-600',
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" /> Approval Workflow
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review and action procurement approval requests</p>
        </div>
        {pending.filter(a => a.priority !== 'Urgent' && a.value < 20000).length > 0 && (
          <button onClick={approveBulk}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-colors">
            <Check className="h-4 w-4" /> Bulk Approve Routine
          </button>
        )}
      </div>

      {pending.length > 0 && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${urgentCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
          <AlertTriangle className={`h-4 w-4 shrink-0 ${urgentCount > 0 ? 'text-red-500' : 'text-amber-500'}`} />
          <p className={`text-sm ${urgentCount > 0 ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
            <span className="font-bold">{pending.length} items</span> pending approval{urgentCount > 0 && ` — ${urgentCount} urgent`}. Total value: <span className="font-bold">${pendingValue.toLocaleString()}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: approvals.filter(a => a.status === 'Pending').length, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Approved', value: approvals.filter(a => a.status === 'Approved').length, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Rejected', value: approvals.filter(a => a.status === 'Rejected').length, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Pending Value', value: `$${(pendingValue / 1000).toFixed(0)}K`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {f} {f === 'Pending' && pending.length > 0 && `(${pending.length})`}
          </button>
        ))}
        <div className="h-4 w-px bg-border mx-1" />
        {(['All', 'Purchase Order', 'Purchase Request', 'Contract Amendment', 'RFQ Award'] as const).map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === f ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {f === 'All' ? 'All Types' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground text-xs">No approvals found.</div>
        ) : filtered.map(a => (
          <div key={a.id} className={`bg-card border rounded-xl p-5 transition-all ${a.status === 'Pending' ? (a.priority === 'Urgent' ? 'border-red-500/30' : 'border-amber-500/30') : 'border-border'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-muted-foreground">{a.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${priorityColor[a.priority]}`}>{a.priority}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeColors[a.type]}`}>{a.type}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{a.ref} — {a.description.slice(0, 90)}{a.description.length > 90 ? '...' : ''}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span>Requested by <span className="font-semibold text-foreground">{a.requester}</span></span>
                  <span>{a.dept}</span>
                  {a.value > 0 && <span className="font-bold text-foreground">${a.value.toLocaleString()}</span>}
                  <span>{a.date}</span>
                </div>
                {a.rejectionReason && (
                  <p className="text-xs text-red-500 mt-1.5 italic">Rejected: "{a.rejectionReason}"</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                <StatusBadge variant={a.status === 'Approved' ? 'success' : a.status === 'Rejected' ? 'error' : 'warning'} size="sm">{a.status}</StatusBadge>
                {a.status === 'Pending' && (
                  <>
                    <button onClick={() => approve(a.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button onClick={() => { setSelected(a); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors">
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => setSelected(a)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && <ApprovalDetailModal item={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />}
    </div>
  );
}
