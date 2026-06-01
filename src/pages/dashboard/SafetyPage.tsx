import { Shield, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const RECORDS = [
  { id: 'SAF-441', type: 'Safety Induction', employee: 'Chris Okafor', dept: 'Production', completed: 'Mar 15, 2026', expires: 'Mar 15, 2027', status: 'Valid' },
  { id: 'SAF-442', type: 'Fire Safety Training', employee: 'Tom Bradley', dept: 'Production', completed: 'Jan 20, 2026', expires: 'Jan 20, 2027', status: 'Valid' },
  { id: 'SAF-443', type: 'Forklift Certification', employee: 'Sara Liu', dept: 'Warehouse', completed: 'Jun 5, 2025', expires: 'Jun 5, 2026', status: 'Expiring Soon' },
  { id: 'SAF-444', type: 'Electrical Safety', employee: 'James Williams', dept: 'Maintenance', completed: 'Sep 12, 2024', expires: 'Sep 12, 2025', status: 'Expired' },
];

export function SafetyPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Shield className="h-5 w-5" />Safety Compliance</h1><p className="text-sm text-muted-foreground">Safety training records and certification management</p></div>
        <button onClick={() => toast.success('New safety record created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Record</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Valid', value: '1,762', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }, { label: 'Expiring Soon', value: '48', color: 'text-amber-500', bg: 'bg-amber-500/10' }, { label: 'Expired', value: '12', color: 'text-red-500', bg: 'bg-red-500/10' }].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}><p className={`text-3xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['ID', 'Training Type', 'Employee', 'Department', 'Completed', 'Expires', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {RECORDS.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{r.type}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.employee}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.dept}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.completed}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.expires}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={r.status === 'Valid' ? 'success' : r.status === 'Expiring Soon' ? 'warning' : 'error'} size="sm">{r.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    {r.status !== 'Valid' && <button onClick={() => toast.success(`Renewal scheduled for ${r.employee}`)} className="text-xs text-primary hover:underline">Renew</button>}
                    <button onClick={() => toast.info(`Viewing ${r.id}`)} className="text-xs text-muted-foreground hover:underline">View</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
