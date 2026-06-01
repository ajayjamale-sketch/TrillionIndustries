import { useState } from 'react';
import { List, Search, Plus, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface BatchLog {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  receivedDate: string;
  expiryDate: string;
  status: 'In Stock' | 'Quarantined' | 'Expired';
}

const INITIAL_BATCHES: BatchLog[] = [
  { id: 'BT-3321', sku: 'STL-3012', name: 'Steel Rod 30mm', supplier: 'SteelPro Industries', receivedDate: '2026-05-12', expiryDate: '2029-05-12', status: 'In Stock' },
  { id: 'BT-3322', sku: 'HYD-8821', name: 'Hydraulic Seal Kit', supplier: 'HydraForce Logistics', receivedDate: '2026-05-20', expiryDate: '2027-05-20', status: 'In Stock' },
  { id: 'BT-3323', sku: 'VLV-0091', name: 'Check Valve 1/2"', supplier: 'Apex Valves Inc', receivedDate: '2026-05-18', expiryDate: '2026-06-18', status: 'Quarantined' },
  { id: 'BT-3210', sku: 'SEL-2201', name: 'O-Ring Seal 25mm', supplier: 'SealTech Corp', receivedDate: '2024-03-01', expiryDate: '2025-03-01', status: 'Expired' },
];

export function BatchTrackingPage({ user }: { user: User }) {
  const [batches, setBatches] = useState<BatchLog[]>(INITIAL_BATCHES);
  const [search, setSearch] = useState('');

  const handleQuarantine = (id: string) => {
    setBatches(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Quarantined' ? 'In Stock' : 'Quarantined';
        toast.info(`Batch ${id} status updated to ${nextStatus}`);
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const filtered = batches.filter(b =>
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />Batch & Lot Tracking
        </h1>
        <p className="text-sm text-muted-foreground">Trace production batches, expiration metrics and supplier origin details</p>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Batch ID, Item name or supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['Batch ID', 'Item Description', 'SKU', 'Supplier Source', 'Received Date', 'Expiry Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted-foreground">No batch logs found.</td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground font-semibold">{b.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{b.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{b.sku}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{b.supplier}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{b.receivedDate}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{b.expiryDate}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={b.status === 'In Stock' ? 'success' : b.status === 'Quarantined' ? 'warning' : 'error'} size="sm">
                        {b.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <button
                        onClick={() => handleQuarantine(b.id)}
                        className={`font-semibold hover:underline ${b.status === 'Quarantined' ? 'text-emerald-600' : 'text-amber-500'}`}
                      >
                        {b.status === 'Quarantined' ? 'Release' : 'Quarantine'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
