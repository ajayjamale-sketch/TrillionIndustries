import { useState } from 'react';
import { Truck, Plus, Search, CheckCircle2, Clock, X, AlertTriangle, Package, FileText, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface GRNItem {
  sku: string;
  description: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
}

interface GRN {
  id: string;
  po: string;
  vendor: string;
  deliveryNote: string;
  items: GRNItem[];
  received: string;
  inspector: string;
  status: 'Accepted' | 'Partial' | 'Rejected' | 'Pending';
  notes: string;
}

const INITIAL_GRNS: GRN[] = [
  {
    id: 'GRN-5521', po: 'PO-7824', vendor: 'Global Bearings Ltd', deliveryNote: 'DN-4421',
    items: [
      { sku: 'BRG-4401', description: 'Ball Bearing 40mm', orderedQty: 500, receivedQty: 500, unit: 'pieces' },
      { sku: 'BRG-6601', description: 'Roller Bearing 60mm', orderedQty: 200, receivedQty: 200, unit: 'pieces' },
      { sku: 'BRG-2201', description: 'Thrust Bearing 22mm', orderedQty: 150, receivedQty: 150, unit: 'pieces' },
    ],
    received: 'Jun 2, 09:15', inspector: 'Maria R.', status: 'Accepted', notes: 'All items inspected and accepted.'
  },
  {
    id: 'GRN-5522', po: 'PO-7821', vendor: 'SteelPro Ltd.', deliveryNote: 'DN-4418',
    items: [
      { sku: 'STL-3012', description: 'Steel Rod 30mm', orderedQty: 500, receivedQty: 500, unit: 'pieces' },
      { sku: 'STL-5012', description: 'Steel Rod 50mm', orderedQty: 300, receivedQty: 300, unit: 'pieces' },
      { sku: 'STL-PLT', description: 'Steel Plate 4mm', orderedQty: 100, receivedQty: 100, unit: 'sheets' },
      { sku: 'STL-ANG', description: 'Angle Iron 40x40', orderedQty: 50, receivedQty: 50, unit: 'lengths' },
    ],
    received: 'Jun 1, 14:30', inspector: 'Tom B.', status: 'Accepted', notes: ''
  },
  {
    id: 'GRN-5523', po: 'PO-7818', vendor: 'Polymer World', deliveryNote: 'DN-4410',
    items: [
      { sku: 'SEL-2201', description: 'O-Ring Seal 25mm', orderedQty: 500, receivedQty: 300, unit: 'pieces' },
      { sku: 'HYD-8821', description: 'Hydraulic Seal Kit', orderedQty: 100, receivedQty: 100, unit: 'sets' },
      { sku: 'GAS-1122', description: 'Gasket Set 50mm', orderedQty: 200, receivedQty: 200, unit: 'sets' },
      { sku: 'BUSH-012', description: 'Nylon Bush 12mm', orderedQty: 1000, receivedQty: 800, unit: 'pieces' },
      { sku: 'ORNG-041', description: 'O-Ring 41mm', orderedQty: 500, receivedQty: 400, unit: 'pieces' },
      { sku: 'CORD-010', description: 'Cord Seal 10mm/m', orderedQty: 100, receivedQty: 100, unit: 'meters' },
    ],
    received: 'May 31, 11:00', inspector: 'Sara L.', status: 'Partial', notes: 'O-Ring 25mm and Nylon Bush short-shipped. Awaiting balance.'
  },
  {
    id: 'GRN-5524', po: 'PO-7815', vendor: 'FastenTech Corp.', deliveryNote: 'DN-4404',
    items: [
      { sku: 'FST-1122', description: 'M12 Hex Bolt (100pk)', orderedQty: 50, receivedQty: 50, unit: 'packs' },
      { sku: 'FST-0810', description: 'M8 Socket Bolt (50pk)', orderedQty: 100, receivedQty: 100, unit: 'packs' },
      { sku: 'NUT-M12', description: 'M12 Hex Nut (100pk)', orderedQty: 50, receivedQty: 50, unit: 'packs' },
      { sku: 'WSH-PLN', description: 'Plain Washer M12 (200pk)', orderedQty: 30, receivedQty: 30, unit: 'packs' },
      { sku: 'STUD-M10', description: 'Stud Bolt M10x80', orderedQty: 200, receivedQty: 50, unit: 'pieces' },
      { sku: 'LOCK-M8', description: 'Locking Nut M8 (100pk)', orderedQty: 50, receivedQty: 0, unit: 'packs' },
      { sku: 'SREW-ST', description: 'Self-Tap Screw (200pk)', orderedQty: 20, receivedQty: 20, unit: 'packs' },
      { sku: 'ANC-CHM', description: 'Chemical Anchor M12', orderedQty: 50, receivedQty: 50, unit: 'cartridges' },
    ],
    received: 'May 30, 10:45', inspector: 'Mark R.', status: 'Rejected', notes: 'STUD-M10 quantity severely short, LOCK-M8 missing entirely. Supplier notified.'
  },
];

const VENDORS = ['Global Bearings Ltd', 'SteelPro Ltd.', 'Polymer World', 'FastenTech Corp.', 'HydraForce Logistics', 'Apex Valves Inc'];
const INSPECTORS = ['Maria R.', 'Tom B.', 'Sara L.', 'Mark R.', 'Alice K.'];

function GRNDetailModal({ grn, onClose, onMoveToStock }: { grn: GRN; onClose: () => void; onMoveToStock: (id: string) => void }) {
  const totalOrdered = grn.items.reduce((s, i) => s + i.orderedQty, 0);
  const totalReceived = grn.items.reduce((s, i) => s + i.receivedQty, 0);
  const fulfillmentPct = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">{grn.id}</span>
              <StatusBadge variant={grn.status === 'Accepted' ? 'success' : grn.status === 'Partial' ? 'warning' : grn.status === 'Pending' ? 'default' : 'error'} size="sm">{grn.status}</StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mt-1">{grn.vendor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'PO Reference', value: grn.po },
              { label: 'Delivery Note', value: grn.deliveryNote },
              { label: 'Inspector', value: grn.inspector },
              { label: 'Received', value: grn.received },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Fulfillment bar */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Fulfillment Rate</span>
              <span className={`text-xs font-bold ${fulfillmentPct === 100 ? 'text-emerald-500' : fulfillmentPct >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{fulfillmentPct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${fulfillmentPct === 100 ? 'bg-emerald-500' : fulfillmentPct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${fulfillmentPct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{totalReceived.toLocaleString()} of {totalOrdered.toLocaleString()} units received</p>
          </div>

          {/* Items table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-foreground">{grn.items.length} Line Items</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    {['SKU', 'Description', 'Ordered', 'Received', 'Unit', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {grn.items.map(item => {
                    const pct = item.orderedQty > 0 ? item.receivedQty / item.orderedQty : 0;
                    const itemStatus = pct === 0 ? 'Missing' : pct < 1 ? 'Short' : 'Complete';
                    return (
                      <tr key={item.sku} className="hover:bg-muted/20">
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.sku}</td>
                        <td className="px-4 py-2.5 font-medium text-foreground">{item.description}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{item.orderedQty}</td>
                        <td className={`px-4 py-2.5 font-bold ${pct === 0 ? 'text-red-500' : pct < 1 ? 'text-amber-500' : 'text-emerald-500'}`}>{item.receivedQty}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{item.unit}</td>
                        <td className="px-4 py-2.5">
                          <StatusBadge variant={itemStatus === 'Complete' ? 'success' : itemStatus === 'Short' ? 'warning' : 'error'} size="sm">{itemStatus}</StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {grn.notes && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Inspector Notes</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">{grn.notes}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
          {(grn.status === 'Accepted' || grn.status === 'Partial') && (
            <button onClick={() => { onMoveToStock(grn.id); onClose(); }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
              Move to Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NewGRNModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (grn: GRN) => void }) {
  const [po, setPo] = useState('');
  const [vendor, setVendor] = useState(VENDORS[0]);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [inspector, setInspector] = useState(INSPECTORS[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<GRNItem[]>([
    { sku: '', description: '', orderedQty: 0, receivedQty: 0, unit: 'pieces' }
  ]);

  const addItem = () => setItems(prev => [...prev, { sku: '', description: '', orderedQty: 0, receivedQty: 0, unit: 'pieces' }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof GRNItem, value: string | number) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!po.trim() || !deliveryNote.trim()) { toast.error('PO reference and delivery note are required'); return; }
    if (items.some(i => !i.sku.trim() || !i.description.trim())) { toast.error('All items need SKU and description'); return; }

    const totalOrdered = items.reduce((s, i) => s + i.orderedQty, 0);
    const totalReceived = items.reduce((s, i) => s + i.receivedQty, 0);
    let status: GRN['status'] = 'Accepted';
    if (totalReceived === 0) status = 'Rejected';
    else if (totalReceived < totalOrdered) status = 'Partial';

    const newGRN: GRN = {
      id: `GRN-${5525 + Math.floor(Math.random() * 100)}`,
      po: po.toUpperCase(),
      vendor,
      deliveryNote: deliveryNote.toUpperCase(),
      items,
      received: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      inspector,
      status,
      notes,
    };
    onSubmit(newGRN);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Create Goods Receipt Note</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Record incoming materials from supplier</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Purchase Order Ref *</label>
                <input value={po} onChange={e => setPo(e.target.value)} placeholder="PO-XXXX"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Delivery Note No. *</label>
                <input value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} placeholder="DN-XXXX"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Vendor / Supplier *</label>
                <select value={vendor} onChange={e => setVendor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary">
                  {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Inspector *</label>
                <select value={inspector} onChange={e => setInspector(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary">
                  {INSPECTORS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase">Line Items *</label>
                <button type="button" onClick={addItem}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr_80px_80px_70px_32px] gap-2 items-center p-3 bg-muted/30 rounded-xl border border-border">
                    <input value={item.sku} onChange={e => updateItem(i, 'sku', e.target.value)} placeholder="SKU"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.orderedQty} onChange={e => updateItem(i, 'orderedQty', Number(e.target.value))} placeholder="Ordered" min="0"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.receivedQty} onChange={e => updateItem(i, 'receivedQty', Number(e.target.value))} placeholder="Received" min="0"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} placeholder="Unit"
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    {items.length > 1 ? (
                      <button type="button" onClick={() => removeItem(i)} className="p-1 rounded-lg hover:bg-red-100 text-red-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : <div />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Inspector Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="Any discrepancies, quality issues, or remarks..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create GRN</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GRNPage({ user }: { user: User }) {
  const [grns, setGrns] = useState<GRN[]>(INITIAL_GRNS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | GRN['status']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(null);

  const filtered = grns.filter(g =>
    (statusFilter === 'All' || g.status === statusFilter) &&
    (g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.vendor.toLowerCase().includes(search.toLowerCase()) ||
      g.po.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (grn: GRN) => {
    setGrns(prev => [grn, ...prev]);
    setShowNew(false);
    toast.success(`${grn.id} created — ${grn.items.length} line items recorded`);
  };

  const handleMoveToStock = (id: string) => {
    setGrns(prev => prev.map(g => g.id === id ? { ...g, status: 'Accepted' as const } : g));
    toast.success(`${id} items moved to inventory stock`);
  };

  const stats = {
    total: grns.length,
    accepted: grns.filter(g => g.status === 'Accepted').length,
    partial: grns.filter(g => g.status === 'Partial').length,
    rejected: grns.filter(g => g.status === 'Rejected').length,
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" /> Goods Receiving (GRN)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Material receipt verification, inspection and stock processing</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> New GRN
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total GRNs', value: stats.total, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Accepted', value: stats.accepted, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Partial', value: stats.partial, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search GRN ID, vendor, PO..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Accepted', 'Partial', 'Rejected', 'Pending'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['GRN ID', 'PO Reference', 'Vendor / Supplier', 'Items', 'Received', 'Inspector', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No GRNs found.</td></tr>
              ) : filtered.map(g => (
                <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{g.id}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{g.po}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{g.vendor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{g.items.length} lines</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{g.received}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{g.inspector}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={g.status === 'Accepted' ? 'success' : g.status === 'Partial' ? 'warning' : g.status === 'Pending' ? 'default' : 'error'} size="sm">
                      {g.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedGRN(g)} className="text-xs text-primary hover:underline font-semibold">View</button>
                      {(g.status === 'Accepted' || g.status === 'Partial') && (
                        <button onClick={() => handleMoveToStock(g.id)} className="text-xs text-emerald-600 hover:underline font-semibold">Move to Stock</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <NewGRNModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selectedGRN && <GRNDetailModal grn={selectedGRN} onClose={() => setSelectedGRN(null)} onMoveToStock={handleMoveToStock} />}
    </div>
  );
}
