import { useState } from 'react';
import { CheckSquare, Clock, AlertTriangle, Check, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const APPROVALS = [
  { id: 'APR-881', type: 'Purchase Order', ref: 'PO-7822', value: '$32,500', requester: 'Sarah Mitchell', dept: 'Production', priority: 'High', date: 'Jun 2', status: 'Pending' },
  { id: 'APR-882', type: 'Purchase Request', ref: 'PR-3302', value: '$28,000', requester: 'James Williams', dept: 'Maintenance', priority: 'Urgent', date: 'Jun 2', status: 'Pending' },
  { id: 'APR-883', type: 'Contract Amendment', ref: 'CON-441', value: '$124,000', requester: 'David Chen', dept: 'Procurement', priority: 'Medium', date: 'Jun 1', status: 'Pending' },
  { id: 'APR-884', type: 'Purchase Order', ref: 'PO-7820', value: '$18,400', requester: 'Maria Rodriguez', dept: 'Warehouse', priority: 'Low', date: 'May 31', status: 'Approved' },
  { id: 'APR-885', type: 'RFQ Award', ref: 'RFQ-2203', value: '$18,400', requester: 'David Chen', dept: 'Procurement', priority: 'Medium', date: 'May 31', status: 'Approved' },
];

export function ApprovalsPage({ user }: { user: User }) {
  const [approvals, setApprovals] = useState(APPROVALS);
  const pending = approvals.filter(a => a.status === 'Pending');

  const approve = (id: string) => {
    setApprovals(p => p.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    toast.success(`${id} approved successfully`);
  };

  const reject = (id: string) => {
    setApprovals(p => p.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    toast.warning(`${id} rejected`);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><CheckSquare className="h-5 w-5" />Approval Workflow</h1>
          <p className="text-sm text-muted-foreground">{pending.length} items pending your approval</p>
        </div>
      </div>
      {pending.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400"><span className="font-semibold">{pending.length} items</span> are waiting for your approval. Total value: <span className="font-semibold">${pending.reduce((acc, a) => acc + parseInt(a.value.replace(/[$,]/g, '')), 0).toLocaleString()}</span></p>
        </div>
      )}
      <div className="space-y-3">
        {approvals.map(a => (
          <div key={a.id} className={`bg-card border rounded-xl p-5 transition-all ${a.status === 'Pending' ? 'border-amber-500/30' : 'border-border'}`}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground">{a.id}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${a.priority === 'Urgent' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : a.priority === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>{a.priority}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{a.type} — {a.ref}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>Requested by <span className="font-medium text-foreground">{a.requester}</span></span>
                  <span>{a.dept}</span>
                  <span className="font-bold text-foreground">{a.value}</span>
                  <span>{a.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={a.status === 'Approved' ? 'success' : a.status === 'Rejected' ? 'error' : 'warning'} size="sm">{a.status}</StatusBadge>
                {a.status === 'Pending' && (
                  <>
                    <button onClick={() => approve(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"><Check className="h-3.5 w-3.5" />Approve</button>
                    <button onClick={() => reject(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"><X className="h-3.5 w-3.5" />Reject</button>
                  </>
                )}
                <button onClick={() => toast.info(`Viewing ${a.ref} details`)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
