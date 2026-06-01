import { useState } from 'react';
import { Package, Plus, Search, AlertTriangle, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const INVENTORY = [
  { sku: 'STL-3012', name: 'Steel Rod 30mm', location: 'A-12-3', qty: 840, min: 200, unit: 'pieces', value: '$42,000', status: 'Normal' },
  { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', location: 'B-04-1', qty: 120, min: 150, unit: 'sets', value: '$18,000', status: 'Low' },
  { sku: 'BRG-4401', name: 'Ball Bearing 40mm', location: 'C-08-2', qty: 650, min: 300, unit: 'pieces', value: '$32,500', status: 'Normal' },
  { sku: 'FST-1122', name: 'M12 Hex Bolt (100pk)', location: 'D-01-5', qty: 2400, min: 500, unit: 'packs', value: '$24,000', status: 'Overstock' },
  { sku: 'SEL-2201', name: 'O-Ring Seal 25mm', location: 'B-07-3', qty: 180, min: 200, unit: 'pieces', value: '$5,400', status: 'Low' },
  { sku: 'VLV-0091', name: 'Check Valve 1/2"', location: 'E-03-1', qty: 45, min: 50, unit: 'pieces', value: '$6,750', status: 'Critical' },
  { sku: 'GEA-0011', name: 'Spur Gear M4 Z48', location: 'C-11-1', qty: 320, min: 100, unit: 'pieces', value: '$28,800', status: 'Normal' },
];

const STATUS_FILTERS = ['All', 'Normal', 'Low', 'Critical', 'Overstock'];

export function InventoryListPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ sku: '', name: '', location: '', qty: '', unit: 'pieces' });

  const filtered = INVENTORY.filter(i => (statusF === 'All' || i.status === statusF) && (i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.includes(search.toUpperCase())));

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Inventory Management</h1><p className="text-sm text-muted-foreground">{INVENTORY.length} SKUs tracked</p></div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Inventory</button>
      </div>

      {showAdd && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">Add Inventory Item</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{ label: 'SKU', key: 'sku', ph: 'STL-XXXX' }, { label: 'Item Name', key: 'name', ph: 'Product name' }, { label: 'Location', key: 'location', ph: 'A-00-0' }, { label: 'Initial Qty', key: 'qty', ph: '0' }].map(f => (
              <div key={f.key}><label className="text-xs font-medium text-foreground block mb-1.5">{f.label}</label><input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            ))}
          </div>
          <div className="flex gap-2"><button onClick={() => { toast.success('Inventory item added'); setShowAdd(false); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Add Item</button><button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button></div>
        </div>
      )}

      {INVENTORY.filter(i => i.status === 'Low' || i.status === 'Critical').length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400"><span className="font-semibold">{INVENTORY.filter(i => i.status === 'Low' || i.status === 'Critical').length} items</span> below minimum stock levels</p>
          <button onClick={() => toast.info('Generating reorder list')} className="ml-auto px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors">Reorder Now</button>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU, name..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-52" /></div>
        <div className="flex gap-1.5">{STATUS_FILTERS.map(f => <button key={f} onClick={() => setStatusF(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusF === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{f}</button>)}</div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['SKU', 'Item Name', 'Location', 'Quantity', 'Min Stock', 'Value', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(item => (
                <tr key={item.sku} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{item.sku}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{item.name}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{item.location}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{item.qty.toLocaleString()} {item.unit}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{item.min}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{item.value}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={item.status === 'Normal' ? 'success' : item.status === 'Low' ? 'warning' : item.status === 'Critical' ? 'error' : 'default'} size="sm">{item.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    <button onClick={() => toast.success(`Reorder for ${item.name} submitted`)} className="text-xs text-primary hover:underline">Reorder</button>
                    <button onClick={() => toast.info(`Adjusting ${item.name}`)} className="text-xs text-muted-foreground hover:underline">Adjust</button>
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
