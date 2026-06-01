import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const COMPLIANCE_ITEMS = [
  { area: 'GST Filing', regulation: 'GST Act 2017', lastReview: 'May 31, 2026', nextDue: 'Jun 30, 2026', status: 'Compliant' },
  { area: 'Income Tax Return', regulation: 'IT Act 1961', lastReview: 'Apr 15, 2026', nextDue: 'Jul 31, 2026', status: 'Compliant' },
  { area: 'Employee PF & ESI', regulation: 'PF Act 1952', lastReview: 'Jun 1, 2026', nextDue: 'Jun 15, 2026', status: 'Due Soon' },
  { area: 'Factory Safety Audit', regulation: 'Factories Act', lastReview: 'Jan 15, 2026', nextDue: 'Jul 15, 2026', status: 'Compliant' },
  { area: 'Environmental Clearance', regulation: 'EPA 1986', lastReview: 'Mar 1, 2026', nextDue: 'Sep 1, 2026', status: 'Compliant' },
  { area: 'ISO 14001 (Environmental)', regulation: 'ISO 14001:2015', lastReview: 'Dec 10, 2025', nextDue: 'Dec 10, 2026', status: 'Expiring Soon' },
];

export function CompliancePage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Compliance Center</h1><p className="text-sm text-muted-foreground">Regulatory and statutory compliance monitoring</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Compliant', value: '4', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }, { label: 'Due Soon', value: '2', color: 'text-amber-500', bg: 'bg-amber-500/10' }, { label: 'Overdue', value: '0', color: 'text-red-500', bg: 'bg-red-500/10' }].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}><p className={`text-3xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Compliance Area', 'Regulation', 'Last Review', 'Next Due', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {COMPLIANCE_ITEMS.map(c => (
                <tr key={c.area} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{c.area}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.regulation}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.lastReview}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.nextDue}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={c.status === 'Compliant' ? 'success' : c.status === 'Due Soon' ? 'warning' : 'error'} size="sm">{c.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><button onClick={() => toast.info(`Opening ${c.area} details`)} className="text-xs text-primary hover:underline">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
