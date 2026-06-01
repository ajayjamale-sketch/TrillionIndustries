import { Eye, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { StatusBadge } from '@/components/features/StatusBadge';

const AUDIT_LOG = [
  { id: 'AL-1001', user: 'Alex Johnson', action: 'Budget Amendment Approved', module: 'Finance', amount: '$50,000', date: 'Jun 2, 2026 09:15', status: 'Approved' },
  { id: 'AL-1002', user: 'David Chen', action: 'PO Created', module: 'Procurement', amount: '$32,500', date: 'Jun 2, 2026 08:30', status: 'Pending Review' },
  { id: 'AL-1003', user: 'Robert Kumar', action: 'GST Return Filed', module: 'Finance', amount: '$387,000', date: 'May 31, 2026 17:00', status: 'Completed' },
  { id: 'AL-1004', user: 'System', action: 'Automated Payroll Processing', module: 'HR', amount: '$2.1M', date: 'May 31, 2026 12:00', status: 'Completed' },
  { id: 'AL-1005', user: 'Alex Johnson', action: 'Contract Amendment Approved', module: 'Procurement', amount: '$124,000', date: 'May 30, 2026 14:45', status: 'Approved' },
];

export function AuditCenterPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Eye className="h-5 w-5" />Audit Center</h1><p className="text-sm text-muted-foreground">Complete financial audit trail and transaction logs</p></div>
        <button onClick={() => toast.success('Downloading audit report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Audit ID', 'User', 'Action', 'Module', 'Amount', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {AUDIT_LOG.map(a => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{a.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{a.user}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.action}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.module}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{a.amount}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.date}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={a.status === 'Completed' || a.status === 'Approved' ? 'success' : 'warning'} size="sm">{a.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><button onClick={() => toast.info(`Viewing ${a.id} audit details`)} className="text-xs text-primary hover:underline">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
