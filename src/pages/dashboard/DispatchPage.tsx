import { useState } from 'react';
import { MapPin, Plus, Truck, Search, X, CheckCircle2, Clock, Package, Navigation } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface DispatchItem {
  sku: string;
  name: string;
  qty: number;
  unit: string;
}

interface Dispatch {
  id: string;
  destination: string;
  destType: 'Customer' | 'Internal' | 'Supplier Return';
  contactPerson: string;
  items: DispatchItem[];
  driver: string;
  vehicle: string;
  scheduled: string;
  status: 'Scheduled' | 'Loading' | 'In Transit' | 'Delivered' | 'Failed';
  trackingRef: string;
  notes: string;
}

const DRIVERS = ['Carlos M.', 'Jake T.', 'Kim L.', 'Phil R.', 'Ana S.'];
const VEHICLES = ['TRK-001 (10T Lorry)', 'TRK-002 (5T Van)', 'TRK-003 (3T Pickup)', 'TRK-004 (1T Van)'];

const INITIAL_DISPATCHES: Dispatch[] = [
  {
    id: 'DO-881', destination: 'Production Floor — Line A', destType: 'Internal', contactPerson: 'James K. (Line Supervisor)',
    items: [
      { sku: 'STL-3012', name: 'Steel Rod 30mm', qty: 200, unit: 'pieces' },
      { sku: 'BRG-4401', name: 'Ball Bearing 40mm', qty: 100, unit: 'pieces' },
    ],
    driver: 'Carlos M.', vehicle: 'TRK-003 (3T Pickup)', scheduled: 'Jun 2, 10:00', status: 'Delivered',
    trackingRef: 'TRK-REF-4821', notes: 'Priority delivery — Line A was on hold'
  },
  {
    id: 'DO-882', destination: 'Titan Corp — Main Plant, Chennai', destType: 'Customer', contactPerson: 'Priya S. (Logistics)',
    items: [
      { sku: 'STL-3012', name: 'Steel Rod 30mm', qty: 500, unit: 'pieces' },
      { sku: 'STL-5012', name: 'Steel Rod 50mm', qty: 300, unit: 'pieces' },
      { sku: 'FST-1122', name: 'M12 Hex Bolt', qty: 20, unit: 'packs' },
    ],
    driver: 'Jake T.', vehicle: 'TRK-001 (10T Lorry)', scheduled: 'Jun 3, 08:00', status: 'In Transit',
    trackingRef: 'TRK-REF-4822', notes: 'Customer PO# TC-2290 — Invoice IN-4890 attached'
  },
  {
    id: 'DO-883', destination: 'Maintenance Store', destType: 'Internal', contactPerson: 'Raj V. (Maintenance Lead)',
    items: [
      { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', qty: 10, unit: 'sets' },
      { sku: 'SEL-2201', name: 'O-Ring Seal 25mm', qty: 100, unit: 'pieces' },
    ],
    driver: 'Kim L.', vehicle: 'TRK-004 (1T Van)', scheduled: 'Jun 3, 13:00', status: 'Scheduled',
    trackingRef: 'TRK-REF-4823', notes: ''
  },
  {
    id: 'DO-884', destination: 'Polymer World — Returns Dept', destType: 'Supplier Return', contactPerson: 'Sara (Returns)',
    items: [
      { sku: 'SEL-2201', name: 'O-Ring Seal 25mm (short-shipped)', qty: 200, unit: 'pieces' },
    ],
    driver: 'Phil R.', vehicle: 'TRK-002 (5T Van)', scheduled: 'Jun 4, 09:00', status: 'Scheduled',
    trackingRef: 'TRK-REF-4824', notes: 'Returning short-shipped items from GRN-5523 for credit note'
  },
  {
    id: 'DO-879', destination: 'Axis Manufacturing — Pune', destType: 'Customer', contactPerson: 'Vijay K.',
    items: [
      { sku: 'BRG-6601', name: 'Roller Bearing 60mm', qty: 500, unit: 'pieces' },
      { sku: 'BRG-2201', name: 'Thrust Bearing 22mm', qty: 200, unit: 'pieces' },
    ],
    driver: 'Ana S.', vehicle: 'TRK-001 (10T Lorry)', scheduled: 'May 31, 07:00', status: 'Delivered',
    trackingRef: 'TRK-REF-4819', notes: ''
  },
];

function DispatchDetailModal({ dispatch, onClose, onUpdateStatus }: {
  dispatch: Dispatch;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Dispatch['status']) => void;
}) {
  const statusColor = {
    Delivered: 'text-emerald-500', 'In Transit': 'text-blue-500',
    Scheduled: 'text-amber-500', Loading: 'text-purple-500', Failed: 'text-red-500'
  };
  const destTypeColor = {
    Customer: 'bg-blue-500/10 text-blue-600', Internal: 'bg-emerald-500/10 text-emerald-600',
    'Supplier Return': 'bg-amber-500/10 text-amber-600'
  };
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dispatch.status === 'Delivered' ? 'bg-emerald-500/10' : dispatch.status === 'In Transit' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
              <Truck className={`h-4.5 w-4.5 ${statusColor[dispatch.status]}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">{dispatch.id}</span>
                <StatusBadge variant={dispatch.status === 'Delivered' ? 'success' : dispatch.status === 'In Transit' || dispatch.status === 'Loading' ? 'default' : dispatch.status === 'Failed' ? 'error' : 'warning'} size="sm">{dispatch.status}</StatusBadge>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${destTypeColor[dispatch.destType]}`}>{dispatch.destType}</span>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5 truncate max-w-xs">{dispatch.destination}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Contact Person', value: dispatch.contactPerson },
              { label: 'Tracking Ref', value: dispatch.trackingRef },
              { label: 'Driver', value: dispatch.driver },
              { label: 'Vehicle', value: dispatch.vehicle },
              { label: 'Scheduled', value: dispatch.scheduled },
              { label: 'Total Items', value: `${dispatch.items.reduce((s, i) => s + i.qty, 0).toLocaleString()} units` },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Status timeline */}
          <div className="flex items-center gap-0">
            {(['Scheduled', 'Loading', 'In Transit', 'Delivered'] as const).map((s, i, arr) => {
              const stages: Dispatch['status'][] = ['Scheduled', 'Loading', 'In Transit', 'Delivered'];
              const currentIdx = stages.indexOf(dispatch.status === 'Failed' ? 'In Transit' : dispatch.status);
              const isActive = stages.indexOf(s) <= currentIdx;
              const isCurrent = stages.indexOf(s) === currentIdx && dispatch.status !== 'Failed';
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center flex-1 ${i > 0 ? 'pl-0' : ''}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary' : 'border-border bg-muted'} ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}>
                      {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p className={`text-[9px] font-semibold mt-1 text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{s}</p>
                  </div>
                  {i < arr.length - 1 && <div className={`h-0.5 flex-1 mx-1 mb-4 rounded ${stages.indexOf(arr[i + 1]) <= currentIdx ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-foreground">{dispatch.items.length} Item Types Dispatched</p>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{['SKU', 'Item', 'Qty', 'Unit'].map(h => <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dispatch.items.map(item => (
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

          {dispatch.notes && (
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Notes</p>
              <p className="text-xs text-foreground">{dispatch.notes}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
          {dispatch.status === 'Scheduled' && (
            <button onClick={() => { onUpdateStatus(dispatch.id, 'Loading'); onClose(); }}
              className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors">
              Start Loading
            </button>
          )}
          {dispatch.status === 'Loading' && (
            <button onClick={() => { onUpdateStatus(dispatch.id, 'In Transit'); onClose(); }}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
              Dispatch
            </button>
          )}
          {dispatch.status === 'In Transit' && (
            <button onClick={() => { onUpdateStatus(dispatch.id, 'Delivered'); onClose(); }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
              Mark Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NewDispatchModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (d: Dispatch) => void }) {
  const [destination, setDestination] = useState('');
  const [destType, setDestType] = useState<Dispatch['destType']>('Customer');
  const [contactPerson, setContactPerson] = useState('');
  const [driver, setDriver] = useState(DRIVERS[0]);
  const [vehicle, setVehicle] = useState(VEHICLES[0]);
  const [scheduled, setScheduled] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<DispatchItem[]>([{ sku: '', name: '', qty: 1, unit: 'pieces' }]);

  const addItem = () => setItems(prev => [...prev, { sku: '', name: '', qty: 1, unit: 'pieces' }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof DispatchItem, value: string | number) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !contactPerson.trim() || !scheduled.trim()) {
      toast.error('Destination, contact person and schedule are required'); return;
    }
    if (items.some(i => !i.sku.trim() || !i.name.trim() || i.qty <= 0)) {
      toast.error('All items require SKU, name, and valid quantity'); return;
    }
    const newD: Dispatch = {
      id: `DO-${885 + Math.floor(Math.random() * 100)}`,
      destination, destType, contactPerson, items, driver, vehicle, scheduled, notes,
      status: 'Scheduled',
      trackingRef: `TRK-REF-${4825 + Math.floor(Math.random() * 100)}`,
    };
    onSubmit(newD);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">New Dispatch Order</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Schedule outbound delivery or internal transfer</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Dispatch Type *</label>
              <div className="flex gap-2">
                {(['Customer', 'Internal', 'Supplier Return'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setDestType(t)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${destType === t ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Destination *</label>
                <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Titan Corp — Main Plant, Chennai"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Contact Person *</label>
                <input value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Name & role"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Scheduled Date & Time *</label>
                <input value={scheduled} onChange={e => setScheduled(e.target.value)} placeholder="e.g. Jun 5, 09:00"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Driver *</label>
                <select value={driver} onChange={e => setDriver(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Vehicle *</label>
                <select value={vehicle} onChange={e => setVehicle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase">Items *</label>
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
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Special delivery instructions, PO references..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create Dispatch</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DispatchPage({ user }: { user: User }) {
  const [dispatches, setDispatches] = useState<Dispatch[]>(INITIAL_DISPATCHES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Dispatch['status']>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | Dispatch['destType']>('All');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Dispatch | null>(null);

  const filtered = dispatches.filter(d =>
    (statusFilter === 'All' || d.status === statusFilter) &&
    (typeFilter === 'All' || d.destType === typeFilter) &&
    (d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.destination.toLowerCase().includes(search.toLowerCase()) ||
      d.driver.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (d: Dispatch) => {
    setDispatches(prev => [d, ...prev]);
    setShowNew(false);
    toast.success(`${d.id} scheduled — ${d.items.length} item types queued for dispatch`);
  };

  const handleUpdateStatus = (id: string, status: Dispatch['status']) => {
    setDispatches(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const msgs: Record<string, string> = {
      Loading: 'Loading bay assigned',
      'In Transit': 'Dispatched — now in transit',
      Delivered: 'Confirmed as delivered',
    };
    toast.success(`${id}: ${msgs[status] || status}`);
  };

  const stats = {
    scheduled: dispatches.filter(d => d.status === 'Scheduled').length,
    loading: dispatches.filter(d => d.status === 'Loading').length,
    inTransit: dispatches.filter(d => d.status === 'In Transit').length,
    delivered: dispatches.filter(d => d.status === 'Delivered').length,
  };

  const statusIcon = {
    Delivered: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'In Transit': { icon: Navigation, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    Loading: { icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    Scheduled: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    Failed: { icon: X, color: 'text-red-500', bg: 'bg-red-500/10' },
  };

  const destTypeColor: Record<Dispatch['destType'], string> = {
    Customer: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    Internal: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    'Supplier Return': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Dispatch Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage outbound deliveries, internal dispatches and returns</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> New Dispatch
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: stats.scheduled, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
          { label: 'Loading', value: stats.loading, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Package },
          { label: 'In Transit', value: stats.inTransit, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Truck },
          { label: 'Delivered', value: stats.delivered, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search DO ID, destination, driver..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Scheduled', 'Loading', 'In Transit', 'Delivered'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Customer', 'Internal', 'Supplier Return'] as const).map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === f ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">No dispatches found.</div>
        ) : filtered.map(d => {
          const si = statusIcon[d.status];
          const Icon = si.icon;
          return (
            <div key={d.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${si.bg}`}>
                    <Icon className={`h-5 w-5 ${si.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{d.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${destTypeColor[d.destType]}`}>{d.destType}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{d.destination}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {d.items.slice(0, 2).map(item => (
                        <span key={item.sku} className="text-[11px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                          {item.name} ×{item.qty}
                        </span>
                      ))}
                      {d.items.length > 2 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-semibold">
                          +{d.items.length - 2} more
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Driver: {d.driver} · {d.vehicle} · Scheduled: {d.scheduled}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge variant={d.status === 'Delivered' ? 'success' : d.status === 'In Transit' || d.status === 'Loading' ? 'default' : d.status === 'Failed' ? 'error' : 'warning'} size="sm">
                    {d.status}
                  </StatusBadge>
                  {d.status === 'Scheduled' && (
                    <button onClick={() => handleUpdateStatus(d.id, 'Loading')}
                      className="px-3 py-1.5 rounded-xl bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors">
                      Start Loading
                    </button>
                  )}
                  {d.status === 'Loading' && (
                    <button onClick={() => handleUpdateStatus(d.id, 'In Transit')}
                      className="px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors">
                      Dispatch
                    </button>
                  )}
                  {d.status === 'In Transit' && (
                    <button onClick={() => handleUpdateStatus(d.id, 'Delivered')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                      Mark Delivered
                    </button>
                  )}
                  <button onClick={() => setSelected(d)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNew && <NewDispatchModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && (
        <DispatchDetailModal
          dispatch={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
