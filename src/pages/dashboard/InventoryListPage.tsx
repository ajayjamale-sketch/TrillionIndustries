import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Package, Plus, Search, AlertTriangle, X, Edit, RotateCcw, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface InventoryItem {
  sku: string;
  name: string;
  location: string;
  qty: number;
  min: number;
  unit: string;
  value: number;
  status: 'Normal' | 'Low' | 'Critical' | 'Overstock';
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { sku: 'STL-3012', name: 'Steel Rod 30mm', location: 'A-12-3', qty: 840, min: 200, unit: 'pieces', value: 42000, status: 'Normal' },
  { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', location: 'B-04-1', qty: 120, min: 150, unit: 'sets', value: 18000, status: 'Low' },
  { sku: 'BRG-4401', name: 'Ball Bearing 40mm', location: 'C-08-2', qty: 650, min: 300, unit: 'pieces', value: 32500, status: 'Normal' },
  { sku: 'FST-1122', name: 'M12 Hex Bolt (100pk)', location: 'D-01-5', qty: 2400, min: 500, unit: 'packs', value: 24000, status: 'Overstock' },
  { sku: 'SEL-2201', name: 'O-Ring Seal 25mm', location: 'B-07-3', qty: 180, min: 200, unit: 'pieces', value: 5400, status: 'Low' },
  { sku: 'VLV-0091', name: 'Check Valve 1/2"', location: 'E-03-1', qty: 45, min: 50, unit: 'pieces', value: 6750, status: 'Critical' },
  { sku: 'GEA-0011', name: 'Spur Gear M4 Z48', location: 'C-11-1', qty: 320, min: 100, unit: 'pieces', value: 28800, status: 'Normal' },
];

const STATUS_FILTERS = ['All', 'Normal', 'Low', 'Critical', 'Overstock'];

export function InventoryListPage({ user, path }: { user: User; path?: string }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  // Adjust modal state
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [adjustMode, setAdjustMode] = useState<'add' | 'subtract' | 'set'>('add');

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState(0);
  const [min, setMin] = useState(100);
  const [unit, setUnit] = useState('pieces');
  const [itemValue, setItemValue] = useState(1000);

  useEffect(() => {
    if (path === '/dashboard/warehouse/add-inventory') {
      setShowAdd(true);
    }
  }, [path]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || !location.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    let status: 'Normal' | 'Low' | 'Critical' | 'Overstock' = 'Normal';
    if (qty <= min * 0.5) {
      status = 'Critical';
    } else if (qty < min) {
      status = 'Low';
    } else if (qty >= min * 4) {
      status = 'Overstock';
    }

    const newItem: InventoryItem = {
      sku: sku.toUpperCase(),
      name,
      location,
      qty,
      min,
      unit,
      value: itemValue,
      status
    };

    setInventory([newItem, ...inventory]);
    setShowAdd(false);
    toast.success(`Inventory SKU ${sku} added successfully`);

    // Reset Form
    setSku('');
    setName('');
    setLocation('');
    setQty(0);
    setMin(100);
    setItemValue(1000);
  };

  const handleReorder = (sku: string) => {
    setInventory(prev => prev.map(item => {
      if (item.sku === sku) {
        toast.success(`Reorder purchase request filed for ${item.name}`);
        return { ...item, qty: item.qty + 500, status: 'Normal' };
      }
      return item;
    }));
  };

  const handleReorderAllLow = () => {
    setInventory(prev => prev.map(item => {
      if (item.status === 'Low' || item.status === 'Critical') {
        return { ...item, qty: item.qty + 500, status: 'Normal' };
      }
      return item;
    }));
    toast.success('Triggered automatic reorder forms for all sub-threshold items');
  };

  const handleDelete = (sku: string) => {
    const item = inventory.find(i => i.sku === sku);
    setInventory(prev => prev.filter(i => i.sku !== sku));
    toast.success(`${item?.name ?? sku} removed from inventory`);
  };

  const openAdjust = (item: InventoryItem) => {
    setAdjustItem(item);
    setAdjustDelta(0);
    setAdjustMode('add');
  };

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    setInventory(prev => prev.map(i => {
      if (i.sku !== adjustItem.sku) return i;
      let newQty: number;
      if (adjustMode === 'add') newQty = i.qty + adjustDelta;
      else if (adjustMode === 'subtract') newQty = Math.max(0, i.qty - adjustDelta);
      else newQty = adjustDelta;
      let status: InventoryItem['status'] = 'Normal';
      if (newQty <= i.min * 0.5) status = 'Critical';
      else if (newQty < i.min) status = 'Low';
      else if (newQty >= i.min * 4) status = 'Overstock';
      toast.success(`Stock for ${i.name} adjusted to ${newQty} ${i.unit}`);
      return { ...i, qty: newQty, status };
    }));
    setAdjustItem(null);
  };

  const filtered = inventory.filter(i =>
    (statusF === 'All' || i.status === statusF) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const lowCount = inventory.filter(i => i.status === 'Low' || i.status === 'Critical').length;

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Inventory Directory</h1>
          <p className="text-sm text-muted-foreground">{inventory.length} active SKUs tracked in plant receiving locker</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Add Stock Item
        </button>
      </div>

      {lowCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            <span className="font-bold">{lowCount} stock items</span> are below minimum safety counts threshold
          </p>
          <button
            onClick={handleReorderAllLow}
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
          >
            Reorder Low Stock
          </button>
        </div>
      )}

      {/* Filter / search tools */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search SKU or name..."
            className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusF(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusF === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['SKU Code', 'Item Name', 'Warehouse Slot', 'Available Qty', 'Safety Min', 'Value Estimate', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted-foreground">No matching inventory.</td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.sku} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground font-semibold">{item.sku}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-foreground">{item.name}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{item.location}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-foreground">{item.qty.toLocaleString()} {item.unit}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{item.min}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-foreground">${item.value.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={item.status === 'Normal' ? 'success' : item.status === 'Low' ? 'warning' : item.status === 'Critical' ? 'error' : 'default'} size="sm">
                        {item.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                       <div className="flex gap-2">
                         <button
                           onClick={() => handleReorder(item.sku)}
                           className="text-primary hover:underline font-bold"
                         >
                           Reorder
                         </button>
                         <button
                           onClick={() => openAdjust(item)}
                           className="text-muted-foreground hover:text-foreground hover:underline font-semibold"
                         >
                           Adjust
                         </button>
                         <button
                           onClick={() => handleDelete(item.sku)}
                           className="text-red-500 hover:text-red-600 hover:underline font-semibold"
                         >
                           Delete
                         </button>
                       </div>
                     </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Item Modal */}
      {showAdd && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Add SKU Inventory</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">SKU Reference ID *</label>
                  <input type="text" required placeholder="e.g. STL-9012" value={sku} onChange={e => setSku(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Item Description Name *</label>
                  <input type="text" required placeholder="e.g. M12 Hex Fastener Bolts" value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Warehouse Location Slot *</label>
                  <input type="text" required placeholder="e.g. A-12-3" value={location} onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Measurement Unit</label>
                  <input type="text" value={unit} onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Initial Qty *</label>
                  <input type="number" min="0" value={qty} onChange={e => setQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Safety Min Stock Level *</label>
                  <input type="number" min="0" value={min} onChange={e => setMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Value Estimate ($) *</label>
                  <input type="number" min="0" value={itemValue} onChange={e => setItemValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Register Item</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Adjust Stock Modal */}
      {adjustItem && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">Adjust Stock</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{adjustItem.name} — Current: {adjustItem.qty} {adjustItem.unit}</p>
              </div>
              <button onClick={() => setAdjustItem(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdjust} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-2">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['add', 'subtract', 'set'] as const).map(m => (
                    <button key={m} type="button" onClick={() => setAdjustMode(m)}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-colors ${adjustMode === m ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}>
                      {m === 'add' ? '+ Add' : m === 'subtract' ? '− Subtract' : '= Set'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">
                  {adjustMode === 'add' ? 'Add Quantity' : adjustMode === 'subtract' ? 'Subtract Quantity' : 'Set New Quantity'} ({adjustItem.unit})
                </label>
                <input type="number" min="0" value={adjustDelta} onChange={e => setAdjustDelta(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Result: <span className="font-bold text-foreground">
                    {adjustMode === 'add' ? adjustItem.qty + adjustDelta
                      : adjustMode === 'subtract' ? Math.max(0, adjustItem.qty - adjustDelta)
                      : adjustDelta} {adjustItem.unit}
                  </span>
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button type="button" onClick={() => setAdjustItem(null)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Apply</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
