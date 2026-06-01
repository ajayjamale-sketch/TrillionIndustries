import { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const PRODUCTS = [
  { id: 'PRD-001', name: 'Hydraulic Cylinder 50mm', sku: 'HYD-CYL-50', category: 'Hydraulics', price: '$285', stock: 148, moq: 10, status: 'Active' },
  { id: 'PRD-002', name: 'Bearing Housing Type A', sku: 'BRG-HSG-A', category: 'Bearings', price: '$42', stock: 520, moq: 50, status: 'Active' },
  { id: 'PRD-003', name: 'Seal Kit 30mm Standard', sku: 'SEL-KIT-30', category: 'Seals', price: '$18', stock: 1200, moq: 100, status: 'Active' },
  { id: 'PRD-004', name: 'Pump Shaft 60mm', sku: 'PMP-SFT-60', category: 'Shafts', price: '$128', stock: 0, moq: 5, status: 'Out of Stock' },
];

export function ProductListingsPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Product Listings</h1><p className="text-sm text-muted-foreground">{PRODUCTS.length} products listed on marketplace</p></div>
        <button onClick={() => setShowNew(v => !v)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Product</button>
      </div>
      {showNew && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground">New Product Listing</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ label: 'Product Name', ph: 'Product name' }, { label: 'SKU', ph: 'SKU-XXXX' }, { label: 'Category', ph: 'Category' }, { label: 'Unit Price', ph: '$0.00' }, { label: 'Current Stock', ph: '0' }, { label: 'Min Order Qty', ph: '1' }].map(f => (
              <div key={f.label}><label className="text-xs font-medium block mb-1.5">{f.label}</label><input placeholder={f.ph} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none" /></div>
            ))}
          </div>
          <div className="flex gap-2"><button onClick={() => { toast.success('Product listed on marketplace'); setShowNew(false); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">List Product</button><button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button></div>
        </div>
      )}
      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full" /></div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['ID', 'Product', 'SKU', 'Category', 'Price', 'Stock', 'MOQ', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{p.price}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{p.stock}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.moq}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={p.status === 'Active' ? 'success' : 'error'} size="sm">{p.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    <button onClick={() => toast.info(`Editing ${p.name}`)} className="p-1 rounded hover:bg-muted transition-colors"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button onClick={() => toast.warning(`${p.name} removed from listing`)} className="p-1 rounded hover:bg-muted transition-colors"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
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
