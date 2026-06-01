import { Briefcase, Plus, Eye, Calendar, Download } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const CONTRACTS = [
  { id: 'CON-441', vendor: 'SteelPro Ltd.', type: 'Annual Supply', value: '$1.2M', start: 'Jan 1, 2026', end: 'Dec 31, 2026', renewal: 'Nov 30', status: 'Active' },
  { id: 'CON-442', vendor: 'Hydraulic Systems Inc.', type: 'Framework', value: '$840K', start: 'Mar 1, 2026', end: 'Feb 28, 2027', renewal: 'Jan 31', status: 'Active' },
  { id: 'CON-443', vendor: 'Global Bearings', type: 'Spot Contract', value: '$120K', start: 'Jun 1, 2026', end: 'Aug 31, 2026', renewal: 'Jul 31', status: 'Active' },
  { id: 'CON-444', vendor: 'FastenTech Corp.', type: 'Annual Supply', value: '$410K', start: 'Jan 1, 2026', end: 'Dec 31, 2026', renewal: 'Nov 30', status: 'Renewal Due' },
];

export function ContractsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Briefcase className="h-5 w-5" />Contract Management</h1><p className="text-sm text-muted-foreground">Vendor contracts and agreement tracking</p></div>
        <button onClick={() => toast.success('New contract form opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Contract</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Active Contracts', value: '18' }, { label: 'Total Value', value: '$4.2M' }, { label: 'Renewals Due (30d)', value: '3' }, { label: 'Expired', value: '2' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Contract ID', 'Vendor', 'Type', 'Value', 'Start', 'End', 'Renewal Due', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {CONTRACTS.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{c.vendor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.type}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{c.value}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.start}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.end}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.renewal}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={c.status === 'Active' ? 'success' : 'warning'} size="sm">{c.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    <button onClick={() => toast.info(`Viewing ${c.id}`)} className="text-xs text-primary hover:underline">View</button>
                    {c.status === 'Renewal Due' && <button onClick={() => toast.success(`${c.id} renewal initiated`)} className="text-xs text-emerald-600 hover:underline">Renew</button>}
                    <button onClick={() => toast.info(`Downloading ${c.id}`)} className="text-xs text-muted-foreground hover:underline">Export</button>
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
