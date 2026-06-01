import { CreditCard, TrendingUp, Download } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const PAYMENTS = [
  { id: 'PAY-441', buyer: 'Trillion Industries Corp', order: 'ORD-7818', amount: '$3,200', due: 'Jun 5', paid: 'Jun 4', status: 'Paid' },
  { id: 'PAY-442', buyer: 'Precision Parts Co.', order: 'ORD-7820', amount: '$5,100', due: 'Jun 8', paid: '—', status: 'Pending' },
  { id: 'PAY-443', buyer: 'Atlas Industrial', order: 'ORD-7821', amount: '$57,000', due: 'Jun 20', paid: '—', status: 'Awaiting Invoice' },
];

export function PaymentsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><CreditCard className="h-5 w-5" />Payment History</h1><p className="text-sm text-muted-foreground">Track payments and outstanding invoices</p></div>
        <button onClick={() => toast.success('Downloading payment statement')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Statement</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Received (MTD)', value: '$8,300' }, { label: 'Pending', value: '$62,100' }, { label: 'Overdue', value: '$0' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Pay ID', 'Buyer', 'Order', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {PAYMENTS.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{p.buyer}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-primary">{p.order}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{p.amount}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.due}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.paid}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={p.status === 'Paid' ? 'success' : p.status === 'Pending' ? 'warning' : 'default'} size="sm">{p.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    <button onClick={() => toast.info(`Viewing ${p.id}`)} className="text-xs text-primary hover:underline">Invoice</button>
                    {p.status === 'Awaiting Invoice' && <button onClick={() => toast.success(`Invoice sent for ${p.order}`)} className="text-xs text-emerald-600 hover:underline">Send Invoice</button>}
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
