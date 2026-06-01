import { Shield, Plus, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const AUDITS = [
  { id: 'AUD-221', type: 'ISO 9001:2015 Surveillance', auditor: 'External — Bureau Veritas', scheduled: 'Jun 15', duration: '2 days', status: 'Scheduled' },
  { id: 'AUD-222', type: 'Internal Quality Audit — Line A', auditor: 'Thomas Anderson', scheduled: 'Jun 8', duration: '1 day', status: 'Planned' },
  { id: 'AUD-223', type: 'Supplier QC Audit — SteelPro', auditor: 'Alice Kim', scheduled: 'May 28', duration: '1 day', status: 'Completed' },
  { id: 'AUD-224', type: 'Process Compliance Review', auditor: 'M. Raj', scheduled: 'May 20', duration: '4 hrs', status: 'Completed' },
];

export function AuditsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Shield className="h-5 w-5" />Compliance Audits</h1><p className="text-sm text-muted-foreground">Schedule and track quality system audits</p></div>
        <button onClick={() => toast.success('New audit scheduled')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Schedule Audit</button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Audit ID', 'Type', 'Auditor', 'Scheduled', 'Duration', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {AUDITS.map(a => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{a.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{a.type}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.auditor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.scheduled}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.duration}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={a.status === 'Completed' ? 'success' : a.status === 'Scheduled' ? 'default' : 'warning'} size="sm">{a.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2"><button onClick={() => toast.info(`Viewing ${a.id}`)} className="text-xs text-primary hover:underline">View</button>{a.status === 'Completed' && <button onClick={() => toast.info(`Downloading ${a.id} report`)} className="text-xs text-muted-foreground hover:underline">Report</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
