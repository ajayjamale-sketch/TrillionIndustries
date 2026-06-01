import { useState } from 'react';
import { FileText, Plus, Search, Eye, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const RFQS = [
  { id: 'RFQ-2201', title: 'Hydraulic Seals Q3 Supply', category: 'MRO', vendors: 4, responses: 2, bestPrice: '$11,200', deadline: 'Jun 8', status: 'Open' },
  { id: 'RFQ-2202', title: 'Steel Rod 30mm 1000 units', category: 'Raw Material', vendors: 6, responses: 5, bestPrice: '$26,500', deadline: 'Jun 6', status: 'Evaluating' },
  { id: 'RFQ-2203', title: 'Conveyor Belt Replacement', category: 'Capital', vendors: 3, responses: 3, bestPrice: '$18,400', deadline: 'Jun 4', status: 'Awarded' },
  { id: 'RFQ-2204', title: 'Safety Equipment Annual Supply', category: 'Safety', vendors: 5, responses: 0, bestPrice: '—', deadline: 'Jun 15', status: 'Draft' },
];

export function RFQPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">RFQ Management</h1><p className="text-sm text-muted-foreground">Create, send, and evaluate vendor quotations</p></div>
        <button onClick={() => toast.success('New RFQ wizard opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Create RFQ</button>
      </div>
      <div className="space-y-3">
        {RFQS.map(rfq => (
          <div key={rfq.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-muted-foreground">{rfq.id}</span><span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{rfq.category}</span></div>
                <p className="text-sm font-bold text-foreground">{rfq.title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{rfq.vendors} vendors invited</span>
                  <span>{rfq.responses} responses received</span>
                  <span>Best price: <span className="font-semibold text-foreground">{rfq.bestPrice}</span></span>
                  <span>Deadline: {rfq.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Evaluating' ? 'warning' : rfq.status === 'Open' ? 'default' : 'error'} size="sm">{rfq.status}</StatusBadge>
                {rfq.status === 'Evaluating' && <button onClick={() => toast.success(`${rfq.id} awarded to best vendor`)} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Award</button>}
                <button onClick={() => toast.info(`Opening ${rfq.id} details`)} className="p-1.5 rounded-xl border border-border hover:bg-muted transition-colors"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
              </div>
            </div>
            {rfq.status === 'Evaluating' && rfq.responses > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Vendor comparison:</p>
                <div className="flex gap-2 overflow-x-auto">
                  {['SteelPro Ltd. — $26,500', 'MetalCo — $27,200', 'IndoSteel — $25,800 ⭐', 'RawMat Plus — $28,400', 'PrimeMetal — $26,900'].slice(0, rfq.responses).map(v => (
                    <div key={v} className={`px-3 py-2 rounded-xl border text-xs whitespace-nowrap ${v.includes('⭐') ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold' : 'border-border text-muted-foreground'}`}>{v}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
