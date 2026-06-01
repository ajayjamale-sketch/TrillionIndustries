import { useState } from 'react';
import { ShoppingCart, Plus, Search, X, Truck, CheckCircle2, Clock, Package, FileText, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface POItem { sku: string; description: string; qty: number; unit: string; unitPrice: number; }
interface PO {
  id: string; vendor: string; category: string; prRef?: string;
  items: POItem[]; totalValue: number;
  ordered: string; expectedDelivery: string; deliveryAddress: string;
  contactPerson: string; paymentTerms: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent to Vendor' | 'In Transit' | 'Delivered' | 'Cancelled';
  notes: string; invoiceRef?: string;
}

const VENDORS_LIST = ['SteelPro Ltd.', 'Hydraulic Systems Inc.', 'FastenTech Corp.', 'Global Bearings', 'Polymer World', 'Apex Valves Inc.'];
const PAYMENT_TERMS = ['Net 30', 'Net 60', 'Net 90', '2/10 Net 30', 'COD', 'Advance Payment'];

const INITIAL_POS: PO[] = [
  {
    id: 'PO-7821', vendor: 'SteelPro Ltd.', category: 'Raw Materials', prRef: undefined,
    items: [
      { sku: 'STL-3012', description: 'Steel Rod 30mm x 6m', qty: 500, unit: 'pieces', unitPrice: 56 },
      { sku: 'STL-5012', description: 'Steel Rod 50mm x 6m', qty: 300, unit: 'pieces', unitPrice: 72 },
      { sku: 'STL-PLT', description: 'Steel Plate 4mm 1200x2400', qty: 100, unit: 'sheets', unitPrice: 145 },
      { sku: 'STL-ANG', description: 'Angle Iron 40x40x6m', qty: 50, unit: 'lengths', unitPrice: 48 },
    ],
    totalValue: 48200, ordered: 'Jun 1', expectedDelivery: 'Jun 10',
    deliveryAddress: 'Warehouse A — Receiving Dock, Industrial Zone, Plot 14',
    contactPerson: 'Mike Donovan +91-98001-12345', paymentTerms: 'Net 30',
    status: 'In Transit', notes: 'Priority delivery — reference emergency PR-3302',
  },
  {
    id: 'PO-7822', vendor: 'Hydraulic Systems Inc.', category: 'MRO', prRef: 'PR-3301',
    items: [
      { sku: 'HYD-8821', description: 'Hydraulic Seal Kit (Type A)', qty: 50, unit: 'sets', unitPrice: 120 },
      { sku: 'VLV-0091', description: 'Check Valve 1/2" BSP', qty: 30, unit: 'pieces', unitPrice: 850 },
    ],
    totalValue: 31500, ordered: 'Jun 1', expectedDelivery: 'Jun 12',
    deliveryAddress: 'Maintenance Store — Warehouse B',
    contactPerson: 'Jane Cooper +1-800-555-0091', paymentTerms: 'Net 60',
    status: 'Pending Approval', notes: 'Awaiting CFO approval due to value >$30K',
  },
  {
    id: 'PO-7823', vendor: 'FastenTech Corp.', category: 'Hardware', prRef: undefined,
    items: [
      { sku: 'FST-1122', description: 'M12 Hex Bolt 75mm (100pk)', qty: 50, unit: 'packs', unitPrice: 92 },
      { sku: 'FST-0810', description: 'M8 Socket Bolt 30mm (50pk)', qty: 100, unit: 'packs', unitPrice: 54 },
      { sku: 'NUT-M12', description: 'M12 Hex Nut (100pk)', qty: 50, unit: 'packs', unitPrice: 38 },
      { sku: 'WSH-PLN', description: 'Plain Washer M12 (200pk)', qty: 30, unit: 'packs', unitPrice: 24 },
      { sku: 'LOCK-M8', description: 'Locking Nut M8 (100pk)', qty: 50, unit: 'packs', unitPrice: 42 },
      { sku: 'STUD-M10', description: 'Stud Bolt M10x80mm', qty: 200, unit: 'pieces', unitPrice: 8 },
      { sku: 'SREW-ST', description: 'Self-Tap Screw (200pk)', qty: 20, unit: 'packs', unitPrice: 18 },
      { sku: 'ANC-CHM', description: 'Chemical Anchor M12', qty: 50, unit: 'cartridges', unitPrice: 22 },
    ],
    totalValue: 12750, ordered: 'Jun 2', expectedDelivery: 'Jun 14',
    deliveryAddress: 'Warehouse A — Bay 4',
    contactPerson: 'Amy Singh +91-98765-43210', paymentTerms: 'Net 30',
    status: 'Draft', notes: '',
  },
  {
    id: 'PO-7824', vendor: 'Global Bearings', category: 'Components', prRef: undefined,
    items: [
      { sku: 'BRG-4401', description: 'Ball Bearing 40mm Grade P5', qty: 500, unit: 'pieces', unitPrice: 68 },
      { sku: 'BRG-6601', description: 'Roller Bearing 60mm', qty: 200, unit: 'pieces', unitPrice: 124 },
      { sku: 'BRG-2201', description: 'Thrust Bearing 22mm', qty: 150, unit: 'pieces', unitPrice: 88 },
    ],
    totalValue: 67100, ordered: 'May 28', expectedDelivery: 'Jun 5',
    deliveryAddress: 'Warehouse A — Receiving Dock',
    contactPerson: 'Peter Lau +65-6321-7890', paymentTerms: '2/10 Net 30',
    status: 'Delivered', notes: 'All items received and GRN-5521 issued', invoiceRef: 'INV-GB-4421',
  },
  {
    id: 'PO-7825', vendor: 'Polymer World', category: 'Raw Materials', prRef: undefined,
    items: [
      { sku: 'SEL-2201', description: 'O-Ring Seal 25mm (bag/50)', qty: 500, unit: 'pieces', unitPrice: 8 },
      { sku: 'HYD-8821', description: 'Hydraulic Seal Kit', qty: 100, unit: 'sets', unitPrice: 115 },
      { sku: 'GAS-1122', description: 'Gasket Set 50mm', qty: 200, unit: 'sets', unitPrice: 42 },
      { sku: 'BUSH-012', description: 'Nylon Bush 12mm', qty: 1000, unit: 'pieces', unitPrice: 2.8 },
      { sku: 'ORNG-041', description: 'O-Ring 41mm', qty: 500, unit: 'pieces', unitPrice: 6 },
      { sku: 'CORD-010', description: 'Cord Seal 10mm/m', qty: 100, unit: 'meters', unitPrice: 14 },
    ],
    totalValue: 24300, ordered: 'May 30', expectedDelivery: 'Jun 8',
    deliveryAddress: 'Warehouse B — Receiving Dock',
    contactPerson: 'Carlos Ruiz +52-555-0192', paymentTerms: 'Net 30',
    status: 'In Transit', notes: 'GRN-5523 — partial delivery noted, balance expected Jun 15',
  },
];

function PODetailModal({ po, onClose, onUpdateStatus }: {
  po: PO; onClose: () => void; onUpdateStatus: (id: string, status: PO['status']) => void;
}) {
  const stages: PO['status'][] = ['Draft', 'Pending Approval', 'Approved', 'Sent to Vendor', 'In Transit', 'Delivered'];
  const currentIdx = stages.indexOf(po.status === 'Cancelled' ? 'Draft' : po.status);
  const fulfillmentValue = po.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{po.id}</span>
              {po.prRef && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">ref: {po.prRef}</span>}
              <StatusBadge variant={po.status === 'Delivered' || po.status === 'Approved' ? 'success' : po.status === 'In Transit' || po.status === 'Sent to Vendor' ? 'default' : po.status === 'Cancelled' ? 'error' : 'warning'} size="sm">{po.status}</StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{po.vendor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Category', value: po.category },
              { label: 'Order Date', value: po.ordered },
              { label: 'Expected Delivery', value: po.expectedDelivery },
              { label: 'Contact', value: po.contactPerson },
              { label: 'Payment Terms', value: po.paymentTerms },
              { label: 'Total Value', value: `$${po.totalValue.toLocaleString()}` },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">Delivery Address</p>
            <p className="text-xs text-foreground">{po.deliveryAddress}</p>
          </div>

          {/* Status pipeline */}
          <div className="flex items-center">
            {stages.map((s, i) => {
              const active = i <= currentIdx && po.status !== 'Cancelled';
              const isCurrent = i === currentIdx && po.status !== 'Cancelled';
              return (
                <div key={s} className="flex items-center flex-1 min-w-0">
                  <div className={`flex flex-col items-center flex-1 ${i > 0 ? '' : ''}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary' : 'border-border bg-muted'} ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <p className={`text-[8px] font-semibold mt-1 text-center leading-tight ${active ? 'text-primary' : 'text-muted-foreground'}`}>{s}</p>
                  </div>
                  {i < stages.length - 1 && <div className={`h-0.5 flex-1 mx-0.5 mb-4 rounded ${i < currentIdx && po.status !== 'Cancelled' ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-foreground">{po.items.length} Line Items</p>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{['SKU', 'Description', 'Qty', 'Unit', 'Unit Price', 'Line Total'].map(h => <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {po.items.map(item => (
                  <tr key={item.sku} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.description}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.qty}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{item.unit}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">${item.unitPrice.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-bold text-foreground">${(item.qty * item.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={5} className="px-4 py-2.5 text-xs font-bold text-right text-muted-foreground">Order Total</td>
                  <td className="px-4 py-2.5 text-sm font-bold text-foreground">${po.totalValue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {po.notes && <div className="bg-muted/30 border border-border rounded-xl p-4"><p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Notes</p><p className="text-xs text-foreground">{po.notes}</p></div>}
          {po.invoiceRef && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-400">Invoice: <span className="font-bold">{po.invoiceRef}</span></div>}
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between">
          {po.status !== 'Cancelled' && po.status !== 'Delivered' && (
            <button onClick={() => { onUpdateStatus(po.id, 'Cancelled'); onClose(); }}
              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors">
              Cancel PO
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
            {po.status === 'Draft' && <button onClick={() => { onUpdateStatus(po.id, 'Pending Approval'); onClose(); }} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors">Submit for Approval</button>}
            {po.status === 'Pending Approval' && <button onClick={() => { onUpdateStatus(po.id, 'Approved'); onClose(); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">Approve</button>}
            {po.status === 'Approved' && <button onClick={() => { onUpdateStatus(po.id, 'Sent to Vendor'); onClose(); }} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">Send to Vendor</button>}
            {po.status === 'Sent to Vendor' && <button onClick={() => { onUpdateStatus(po.id, 'In Transit'); onClose(); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Mark In Transit</button>}
            {po.status === 'In Transit' && <button onClick={() => { onUpdateStatus(po.id, 'Delivered'); onClose(); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">Mark Delivered</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewPOModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (po: PO) => void }) {
  const [vendor, setVendor] = useState(VENDORS_LIST[0]);
  const [category, setCategory] = useState('Raw Materials');
  const [prRef, setPrRef] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Warehouse A — Receiving Dock');
  const [contactPerson, setContactPerson] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<POItem[]>([{ sku: '', description: '', qty: 1, unit: 'pieces', unitPrice: 0 }]);

  const addItem = () => setItems(p => [...p, { sku: '', description: '', qty: 1, unit: 'pieces', unitPrice: 0 }]);
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof POItem, value: string | number) =>
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expectedDelivery.trim() || !contactPerson.trim()) { toast.error('Expected delivery and contact person are required'); return; }
    if (items.some(i => !i.description.trim() || i.qty <= 0)) { toast.error('All line items need description and quantity'); return; }
    const po: PO = {
      id: `PO-${7826 + Math.floor(Math.random() * 100)}`, vendor, category, prRef: prRef || undefined,
      items, totalValue: total,
      ordered: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      expectedDelivery, deliveryAddress, contactPerson, paymentTerms,
      status: 'Draft', notes,
    };
    onSubmit(po);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div><h3 className="font-bold text-foreground">Create Purchase Order</h3><p className="text-xs text-muted-foreground mt-0.5">Issue PO to a registered vendor</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Vendor *</label>
                <select value={vendor} onChange={e => setVendor(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {VENDORS_LIST.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {['Raw Materials', 'MRO', 'Hardware', 'Components', 'Safety', 'Services'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">PR Reference</label>
                <input value={prRef} onChange={e => setPrRef(e.target.value)} placeholder="e.g. PR-3301 (optional)"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Expected Delivery *</label>
                <input value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} placeholder="e.g. Jun 15" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Contact Person *</label>
                <input value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Name & phone" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Payment Terms</label>
                <select value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Delivery Address</label>
                <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase">Line Items *</label>
                <button type="button" onClick={addItem} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Item</button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[70px_2fr_55px_65px_80px_28px] gap-2 items-center p-2.5 bg-muted/30 rounded-xl border border-border">
                    <input value={item.sku} onChange={e => updateItem(i, 'sku', e.target.value)} placeholder="SKU"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} min="1"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    <input type="number" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} min="0" placeholder="$/unit"
                      className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                    {items.length > 1 ? <button type="button" onClick={() => removeItem(i)} className="p-1 rounded-lg hover:bg-red-100 text-red-500"><X className="h-3.5 w-3.5" /></button> : <div />}
                  </div>
                ))}
              </div>
              {total > 0 && <p className="text-xs text-muted-foreground mt-2">PO Total: <span className="font-bold text-foreground">${total.toLocaleString()}</span></p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Special instructions, references..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create PO</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PurchaseOrdersPage({ user }: { user: User }) {
  const [pos, setPos] = useState<PO[]>(INITIAL_POS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PO['status']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<PO | null>(null);

  const filtered = pos.filter(p =>
    (statusFilter === 'All' || p.status === statusFilter) &&
    (p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (po: PO) => {
    setPos(prev => [po, ...prev]);
    setShowNew(false);
    toast.success(`${po.id} created — ${po.vendor} will be notified`);
  };

  const handleUpdateStatus = (id: string, status: PO['status']) => {
    setPos(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    const msgs: Partial<Record<PO['status'], string>> = {
      'Pending Approval': 'Submitted for approval',
      Approved: 'PO approved',
      'Sent to Vendor': 'PO sent to vendor',
      'In Transit': 'Marked as In Transit',
      Delivered: 'Delivered — GRN process can begin',
      Cancelled: 'PO cancelled',
    };
    toast.success(`${id}: ${msgs[status] ?? status}`);
  };

  const stats = {
    open: pos.filter(p => !['Delivered', 'Cancelled'].includes(p.status)).length,
    inTransit: pos.filter(p => p.status === 'In Transit').length,
    pending: pos.filter(p => p.status === 'Pending Approval').length,
    delivered: pos.filter(p => p.status === 'Delivered').length,
    totalValue: pos.filter(p => !['Cancelled'].includes(p.status)).reduce((s, p) => s + p.totalValue, 0),
  };

  const statusBadge = (status: PO['status']) =>
    status === 'Delivered' || status === 'Approved' ? 'success' :
    status === 'In Transit' || status === 'Sent to Vendor' ? 'default' :
    status === 'Cancelled' ? 'error' : 'warning';

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> Purchase Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Issue, track and manage vendor purchase orders</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> Create PO
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Open POs', value: stats.open, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: ShoppingCart },
          { label: 'Pending Approval', value: stats.pending, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
          { label: 'In Transit', value: stats.inTransit, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Truck },
          { label: 'Delivered (MTD)', value: stats.delivered, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
          { label: 'Active Value', value: `$${(stats.totalValue / 1000).toFixed(0)}K`, color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Package },
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
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PO ID, vendor, category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Draft', 'Pending Approval', 'Approved', 'Sent to Vendor', 'In Transit', 'Delivered'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>{['PO ID', 'Vendor', 'Category', 'Items', 'Total Value', 'Order Date', 'Expected', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-muted-foreground text-xs">No purchase orders found.</td></tr>
              ) : filtered.map(po => (
                <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{po.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{po.vendor}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.category}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.items.length} lines</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">${po.totalValue.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.ordered}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.expectedDelivery}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={statusBadge(po.status)} size="sm">{po.status}</StatusBadge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {po.status === 'Pending Approval' && <button onClick={() => handleUpdateStatus(po.id, 'Approved')} className="text-xs text-emerald-600 font-bold hover:underline">Approve</button>}
                      {po.status === 'Approved' && <button onClick={() => handleUpdateStatus(po.id, 'Sent to Vendor')} className="text-xs text-blue-600 font-bold hover:underline">Send</button>}
                      {po.status === 'In Transit' && <button onClick={() => handleUpdateStatus(po.id, 'Delivered')} className="text-xs text-emerald-600 font-bold hover:underline">Received</button>}
                      <button onClick={() => setSelected(po)} className="text-xs text-muted-foreground hover:text-foreground hover:underline font-semibold">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <NewPOModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && <PODetailModal po={selected} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} />}
    </div>
  );
}
