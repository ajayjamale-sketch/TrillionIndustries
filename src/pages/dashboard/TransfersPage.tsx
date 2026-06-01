import { useState } from 'react';
import { ArrowUpRight, Plus, Truck, Search, X, CheckCircle2, Clock, Package } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface TransferItem {
  sku: string;
  name: string;
  qty: number;
  unit: string;
}

interface Transfer {
  id: string;
  from: string;
  to: string;
  items: TransferItem[];
  initiated: string;
  handler: string;
  priority: 'Normal' | 'Urgent';
  status: 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';
  notes: string;
}

const LOCATIONS = ['Warehouse A', 'Warehouse B', 'Receiving Dock', 'Production Floor', 'Quality Lab', 'Maintenance Store', 'Dispatch Bay'];
const HANDLERS = ['Sara L.', 'Mark R.', 'Tom B.', 'Alice K.', 'Carlos M.', 'Jake T.'];

const INITIAL_TRANSFERS: Transfer[] = [
  {
    id: 'ST-441', from: 'Warehouse A', to: 'Production Floor',
    items: [
      { sku: 'STL-3012', name: 'Steel Rod 30mm', qty: 200, unit: 'pieces' },
      { sku: 'BRG-4401', name: 'Ball Bearing 40mm', qty: 100, unit: 'pieces' },
      { sku: 'FST-1122', name: 'M12 Hex Bolt', qty: 10, unit: 'packs' },
    ],
    initiated: 'Jun 2', handler: 'Sara L.', priority: 'Urgent', status: 'In Transit',
    notes: 'Urgent — Production Line A material shortage'
  },
  {
    id: 'ST-442', from: 'Receiving Dock', to: 'Warehouse B',
    items: [
      { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', qty: 50, unit: 'sets' },
      { sku: 'SEL-2201', name: 'O-Ring Seal 25mm', qty: 200, unit: 'pieces' },
      { sku: 'GAS-1122', name: 'Gasket Set 50mm', qty: 80, unit: 'sets' },
      { sku: 'VLV-0091', name: 'Check Valve 1/2"', qty: 20, unit: 'pieces' },
      { sku: 'ORNG-041', name: 'O-Ring 41mm', qty: 300, unit: 'pieces' },
      { sku: 'CORD-010', name: 'Cord Seal 10mm', qty: 50, unit: 'meters' },
      { sku: 'BUSH-012', name: 'Nylon Bush 12mm', qty: 500, unit: 'pieces' },
      { sku: 'PLG-012', name: 'Hex Plug 1/2"', qty: 100, unit: 'pieces' },
    ],
    initiated: 'Jun 2', handler: 'Mark R.', priority: 'Normal', status: 'Pending',
    notes: 'Goods from GRN-5521 being putaway to B store'
  },
  {
    id: 'ST-443', from: 'Warehouse B', to: 'Quality Lab',
    items: [
      { sku: 'BRG-6601', name: 'Roller Bearing 60mm', qty: 25, unit: 'pieces' },
    ],
    initiated: 'Jun 1', handler: 'Alice K.', priority: 'Normal', status: 'Completed',
    notes: 'Random inspection sample — QA batch verification'
  },
  {
    id: 'ST-444', from: 'Warehouse A', to: 'Maintenance Store',
    items: [
      { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', qty: 10, unit: 'sets' },
      { sku: 'BRG-4401', name: 'Ball Bearing 40mm', qty: 50, unit: 'pieces' },
      { sku: 'VLV-0091', name: 'Check Valve 1/2"', qty: 5, unit: 'pieces' },
      { sku: 'GAS-1122', name: 'Gasket Set 50mm', qty: 15, unit: 'sets' },
    ],
    initiated: 'May 31', handler: 'Tom B.', priority: 'Normal', status: 'Completed',
    notes: ''
  },
  {
    id: 'ST-445', from: 'Warehouse B', to: 'Dispatch Bay',
    items: [
      { sku: 'STL-3012', name: 'Steel Rod 30mm', qty: 500, unit: 'pieces' },
      { sku: 'STL-5012', name: 'Steel Rod 50mm', qty: 300, unit: 'pieces' },
    ],
    initiated: 'May 30', handler: 'Jake T.', priority: 'Urgent', status: 'Completed',
    notes: 'Customer order dispatch preparation'
  },
];

function TransferDetailModal({ transfer, onClose, onConfirmReceipt, onCancel }: {
  transfer: Transfer;
  onClose: () => void;
  onConfirmReceipt: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const totalQty = transfer.items.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${transfer.status === 'Completed' ? 'bg-emerald-500/10' : transfer.status === 'In Transit' ? 'bg-blue-500/10' : transfer.status === 'Cancelled' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
              <Truck className={`h-4.5 w-4.5 ${transfer.status === 'Completed' ? 'text-emerald-500' : transfer.status === 'In Transit' ? 'text-blue-500' : transfer.status === 'Cancelled' ? 'text-red-500' : 'text-amber-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">{transfer.id}</span>
                <StatusBadge variant={transfer.status === 'Completed' ? 'success' : transfer.status === 'In Transit' ? 'default' : transfer.status === 'Cancelled' ? 'error' : 'warning'} size="sm">{transfer.status}</StatusBadge>
                {transfer.priority === 'Urgent' && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 font-bold">URGENT</span>}
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">{transfer.from} → {transfer.to}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Handler', value: transfer.handler },
              { label: 'Initiated', value: transfer.initiated },
              { label: 'Total Qty', value: `${totalQty.toLocaleString()} units` },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-foreground">{transfer.items.length} Item Types</p>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {['SKU', 'Item Name', 'Qty', 'Unit'].map(h => <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transfer.items.map(item => (
                  <tr key={item.sku} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-2.5 font-bold text-foreground">{item.qty.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transfer.notes && (
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Notes</p>
              <p className="text-xs text-foreground">{transfer.notes}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between">
          {transfer.status === 'Pending' && (
            <button onClick={() => { onCancel(transfer.id); onClose(); }}
              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors">
              Cancel Transfer
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
            {transfer.status === 'In Transit' && (
              <button onClick={() => { onConfirmReceipt(transfer.id); onClose(); }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                Confirm Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTransferModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (t: Transfer) => void }) {
  const [from, setFrom] = useState(LOCATIONS[0]);
  const [to, setTo] = useState(LOCATIONS[3]);
  const [handler, setHandler] = useState(HANDLERS[0]);
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItem[]>([{ sku: '', name: '', qty: 1, unit: 'pieces' }]);

  const addItem = () => setItems(prev => [...prev, { sku: '', name: '', qty: 1, unit: 'pieces' }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof TransferItem, value: string | number) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from === to) { toast.error('Source and destination cannot be the same'); return; }
    if (items.some(i => !i.sku.trim() || !i.name.trim() || i.qty <= 0)) {
      toast.error('All items need SKU, name, and a valid quantity'); return;
    }
    const newT: Transfer = {
      id: `ST-${446 + Math.floor(Math.random() * 100)}`,
      from, to, items, handler, priority,
      initiated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'Pending',
      notes,
    };
    onSubmit(newT);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">New Stock Transfer</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Create inter-location material movement request</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">From Location *</label>
                <select value={from} onChange={e => setFrom(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">To Location *</label>
                <select value={to} onChange={e => setTo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Handler *</label>
                <select value={handler} onChange={e => setHandler(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {HANDLERS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(['Normal', 'Urgent'] as const).map(p => (
                    <button key={p} type="button" onClick={() => setPriority(p)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${priority === p ? (p === 'Urgent' ? 'bg-red-500 border-red-500 text-white' : 'bg-primary border-primary text-primary-foreground') : 'border-border hover:bg-muted'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase">Items to Transfer *</label>
                <button type="button" onClick={addItem} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[80px_1fr_70px_70px_32px] gap-2 items-center p-2.5 bg-muted/30 rounded-xl border border-border">
                    <input value={item.sku} onChange={e => updateItem(i, 'sku', e.target.value)} placeholder="SKU"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="Item name"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} min="1"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} placeholder="unit"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    {items.length > 1 ? (
                      <button type="button" onClick={() => removeItem(i)} className="p-1 rounded-lg hover:bg-red-100 text-red-500"><X className="h-3.5 w-3.5" /></button>
                    ) : <div />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Reason for transfer or special instructions..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create Transfer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TransfersPage({ user }: { user: User }) {
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Transfer['status']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Transfer | null>(null);

  const filtered = transfers.filter(t =>
    (statusFilter === 'All' || t.status === statusFilter) &&
    (t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.to.toLowerCase().includes(search.toLowerCase()) ||
      t.handler.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (t: Transfer) => {
    setTransfers(prev => [t, ...prev]);
    setShowNew(false);
    toast.success(`Transfer ${t.id} created — ${t.items.length} item types scheduled`);
  };

  const handleConfirmReceipt = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' as const } : t));
    toast.success(`Transfer ${id} confirmed as received`);
  };

  const handleCancel = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Cancelled' as const } : t));
    toast.info(`Transfer ${id} cancelled`);
  };

  const handleDispatch = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'In Transit' as const } : t));
    toast.success(`Transfer ${id} marked as In Transit`);
  };

  const stats = {
    pending: transfers.filter(t => t.status === 'Pending').length,
    inTransit: transfers.filter(t => t.status === 'In Transit').length,
    completed: transfers.filter(t => t.status === 'Completed').length,
    urgent: transfers.filter(t => t.priority === 'Urgent' && t.status !== 'Completed' && t.status !== 'Cancelled').length,
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" /> Stock Transfers
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage inter-location material movements</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> New Transfer
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats.pending, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
          { label: 'In Transit', value: stats.inTransit, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Truck },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
          { label: 'Urgent Active', value: stats.urgent, color: 'text-red-500', bg: 'bg-red-500/10', icon: Package },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, location, handler..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Pending', 'In Transit', 'Completed', 'Cancelled'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transfer Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">No transfers found.</div>
        ) : filtered.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.status === 'Completed' ? 'bg-emerald-500/10' : t.status === 'In Transit' ? 'bg-blue-500/10' : t.status === 'Cancelled' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                  <Truck className={`h-5 w-5 ${t.status === 'Completed' ? 'text-emerald-500' : t.status === 'In Transit' ? 'text-blue-500' : t.status === 'Cancelled' ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-muted-foreground">{t.id}</span>
                    {t.priority === 'Urgent' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 font-bold">URGENT</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-foreground">{t.from} → {t.to}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {t.items.slice(0, 3).map(item => (
                      <span key={item.sku} className="text-[11px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                        {item.name} ×{item.qty}
                      </span>
                    ))}
                    {t.items.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-semibold">
                        +{t.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Handler: {t.handler} · {t.initiated} · {t.items.length} item type(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge variant={t.status === 'Completed' ? 'success' : t.status === 'In Transit' ? 'default' : t.status === 'Cancelled' ? 'error' : 'warning'} size="sm">
                  {t.status}
                </StatusBadge>
                {t.status === 'Pending' && (
                  <button onClick={() => handleDispatch(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors">
                    Dispatch
                  </button>
                )}
                {t.status === 'In Transit' && (
                  <button onClick={() => handleConfirmReceipt(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                    Confirm Receipt
                  </button>
                )}
                <button onClick={() => setSelected(t)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNew && <NewTransferModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && (
        <TransferDetailModal
          transfer={selected}
          onClose={() => setSelected(null)}
          onConfirmReceipt={handleConfirmReceipt}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
