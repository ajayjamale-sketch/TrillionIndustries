import { FileText, Download, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const GST_RECORDS = [
  { period: 'May 2026', sales: '$2,680,000', purchases: '$530,000', outputGST: '$482,400', inputGST: '$95,400', netPayable: '$387,000', status: 'Filed' },
  { period: 'Apr 2026', sales: '$2,520,000', purchases: '$490,000', outputGST: '$453,600', inputGST: '$88,200', netPayable: '$365,400', status: 'Filed' },
  { period: 'Mar 2026', sales: '$1,980,000', purchases: '$510,000', outputGST: '$356,400', inputGST: '$91,800', netPayable: '$264,600', status: 'Filed' },
  { period: 'Jun 2026', sales: 'In Progress', purchases: 'In Progress', outputGST: '—', inputGST: '—', netPayable: '—', status: 'Pending' },
];

export function GSTPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><FileText className="h-5 w-5" />
        </h1><p className="text-sm text-muted-foreground">Manage GST returns and tax compliance</p></div>
        <button onClick={() => toast.success('New GST return initiated')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />File Return</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'YTD Output GST', value: '$1.29M' }, { label: 'YTD Input GST', value: '$275K' }, { label: 'Net GST Paid', value: '$1.02M' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Period', 'Sales', 'Purchases', 'Output GST', 'Input GST', 'Net Payable', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {GST_RECORDS.map(r => (
                <tr key={r.period} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{r.period}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.sales}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.purchases}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{r.outputGST}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{r.inputGST}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-primary">{r.netPayable}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={r.status === 'Filed' ? 'success' : 'warning'} size="sm">{r.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    {r.status === 'Filed' && <button onClick={() => toast.info(`Downloading ${r.period} return`)} className="text-xs text-primary hover:underline">Download</button>}
                    {r.status === 'Pending' && <button onClick={() => toast.success(`${r.period} return filed`)} className="text-xs text-emerald-600 hover:underline">File Now</button>}
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
