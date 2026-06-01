import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, Download, X, Eye, FileText, Send, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Payment {
  id: string;
  buyer: string;
  order: string;
  amount: string;
  due: string;
  paid: string;
  status: 'Paid' | 'Pending' | 'Awaiting Invoice';
}

const INITIAL_PAYMENTS: Payment[] = [
  { id: 'PAY-441', buyer: 'Trillion Industries Corp', order: 'ORD-7818', amount: '$3,200', due: 'Jun 5', paid: 'Jun 4', status: 'Paid' },
  { id: 'PAY-442', buyer: 'Precision Parts Co.', order: 'ORD-7820', amount: '$5,100', due: 'Jun 8', paid: '—', status: 'Pending' },
  { id: 'PAY-443', buyer: 'Atlas Industrial', order: 'ORD-7821', amount: '$57,000', due: 'Jun 20', paid: '—', status: 'Awaiting Invoice' },
];

export function PaymentsPage({ user }: { user: User }) {
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleSendInvoice = (id: string) => {
    setPayments(prev => 
      prev.map(p => p.id === id ? { ...p, status: 'Pending' } : p)
    );
    toast.success(`Invoice dispatched successfully for ${id}. Status changed to Pending.`);
  };

  const handleDownloadStatement = () => {
    toast.success('Downloading detailed statements report (CSV).');
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track outgoing client invoices, collections, and collections status.</p>
        </div>
        <button 
          onClick={handleDownloadStatement}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted text-foreground transition-colors"
        >
          <Download className="h-4 w-4" /> Download Statement
        </button>
      </div>

      {/* KPI metric splits */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Received (MTD)', value: '$3,200', color: 'text-emerald-500' },
          { label: 'Pending Collections', value: '$62,100', color: 'text-amber-500' },
          { label: 'Overdue Collections', value: '$0', color: 'text-red-500' },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['Pay ID', 'Buyer', 'Order ID', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{p.buyer}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-primary">{p.order}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{p.amount}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.due}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.paid}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={p.status === 'Paid' ? 'success' : p.status === 'Pending' ? 'warning' : 'default'} size="sm">
                      {p.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedPayment(p)}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Preview Invoice
                      </button>
                      {p.status === 'Awaiting Invoice' && (
                        <button 
                          onClick={() => handleSendInvoice(p.id)}
                          className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <Send className="h-3 w-3" /> Send
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedPayment && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedPayment(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Invoice Ledger Preview</h2>
            
            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex justify-between"><span>Payment ID</span><span className="font-semibold text-foreground font-mono">{selectedPayment.id}</span></div>
                <div className="flex justify-between"><span>Reference Order</span><span className="font-semibold text-foreground font-mono">{selectedPayment.order}</span></div>
                <div className="flex justify-between"><span>Billing Target</span><span className="font-semibold text-foreground">{selectedPayment.buyer}</span></div>
                <div className="flex justify-between"><span>Net Total</span><span className="font-semibold text-foreground font-bold">{selectedPayment.amount}</span></div>
              </div>

              <div className="text-xs space-y-2">
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Payment Schedule</h4>
                <div className="p-2.5 bg-card border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-muted-foreground" /> <span>Due Date</span></div>
                  <span className="font-semibold text-foreground">{selectedPayment.due}</span>
                </div>
                {selectedPayment.status === 'Paid' && (
                  <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Received Date</span>
                    <span className="font-bold">{selectedPayment.paid}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button 
                onClick={() => { toast.success(`Invoice ${selectedPayment.id} PDF downloaded.`); setSelectedPayment(null); }}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-brand"
              >
                Download PDF
              </button>
              {selectedPayment.status === 'Awaiting Invoice' && (
                <button 
                  onClick={() => { handleSendInvoice(selectedPayment.id); setSelectedPayment(null); }}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-all"
                >
                  Dispatch Invoice
                </button>
              )}
              <button onClick={() => setSelectedPayment(null)} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
