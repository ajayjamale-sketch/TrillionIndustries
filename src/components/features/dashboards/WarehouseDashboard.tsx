import { useState } from 'react';
import {
  Package, TrendingUp, TrendingDown, Plus, Download, Search,
  ArrowRight, RefreshCw, AlertTriangle, CheckCircle2, Truck, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const stockData = [
  { category: 'Steel', current: 840, min: 200, max: 1200 },
  { category: 'Hydraulic', current: 120, min: 150, max: 400 },
  { category: 'Bearings', current: 650, min: 300, max: 1000 },
  { category: 'Fasteners', current: 2400, min: 500, max: 3000 },
  { category: 'Seals', current: 180, min: 200, max: 600 },
];

const INVENTORY_ITEMS = [
  { sku: 'STL-3012', name: 'Steel Rod 30mm', location: 'A-12-3', qty: 840, min: 200, unit: 'pieces', status: 'Normal' },
  { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', location: 'B-04-1', qty: 120, min: 150, unit: 'sets', status: 'Low' },
  { sku: 'BRG-4401', name: 'Ball Bearing 40mm', location: 'C-08-2', qty: 650, min: 300, unit: 'pieces', status: 'Normal' },
  { sku: 'FST-1122', name: 'M12 Hex Bolt (100pk)', location: 'D-01-5', qty: 2400, min: 500, unit: 'packs', status: 'Overstock' },
  { sku: 'SEL-2201', name: 'O-Ring Seal 25mm', location: 'B-07-3', qty: 180, min: 200, unit: 'pieces', status: 'Low' },
  { sku: 'VLV-0091', name: 'Check Valve 1/2"', location: 'E-03-1', qty: 45, min: 50, unit: 'pieces', status: 'Critical' },
];

const RECENT_MOVEMENTS = [
  { ref: 'GR-5521', type: 'Goods Receipt', item: 'Steel Rod 30mm', qty: '+500', from: 'Supplier', time: '2 hrs ago' },
  { ref: 'IS-3342', type: 'Issue to Production', item: 'Hydraulic Seal Kit', qty: '-30', from: 'Warehouse A', time: '4 hrs ago' },
  { ref: 'TR-1192', type: 'Transfer', item: 'Ball Bearing 40mm', qty: '200', from: 'A→B', time: '6 hrs ago' },
  { ref: 'GR-5522', type: 'Goods Receipt', item: 'O-Ring Seal 25mm', qty: '+150', from: 'Supplier', time: '8 hrs ago' },
];

export function WarehouseDashboard({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'stock' | 'movements' | 'transfers'>('stock');

  const filtered = INVENTORY_ITEMS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.includes(search.toUpperCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Warehouse & Inventory Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('New Goods Receipt recorded')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />Receive Goods
          </button>
          <button onClick={() => toast.info('Stock transfer initiated')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors">
            <Truck className="h-4 w-4" />Transfer Stock
          </button>
          <button onClick={() => toast.info('Downloading inventory report')}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Alerts for low stock */}
      {INVENTORY_ITEMS.filter(i => i.status === 'Low' || i.status === 'Critical').length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <span className="font-semibold">{INVENTORY_ITEMS.filter(i => i.status === 'Low' || i.status === 'Critical').length} items</span> are below minimum stock levels. Review and initiate replenishment orders.
          </p>
          <button onClick={() => toast.info('Opening reorder suggestions')}
            className="ml-auto shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors">
            Reorder Now
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', value: '4,821', change: '+12 this week', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Inventory Value', value: '$2.1M', change: '-$84K vs last month', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Low Stock Alerts', value: '3', change: 'Requires attention', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Pending Receipts', value: '8', change: '2 arriving today', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => toast.info(`Viewing ${m.label}`)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Stock Level Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Stock Levels by Category</h3>
          <button onClick={() => toast.info('Viewing full stock analysis')} className="text-xs text-primary hover:underline flex items-center gap-1">
            Full Report <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stockData} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="max" fill="hsl(var(--muted))" radius={[0, 3, 3, 0]} />
            <Bar dataKey="current" fill="#1E40AF" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-primary inline-block" />Current Stock</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-muted inline-block" />Max Capacity</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex gap-2">
            {[['stock', 'Stock Items'], ['movements', 'Recent Movements'], ['transfers', 'Transfers']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search SKU, name..." className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-44" />
          </div>
        </div>

        {tab === 'stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">SKU</th>
                  <th className="text-left px-5 py-3 font-medium">Item Name</th>
                  <th className="text-left px-5 py-3 font-medium">Location</th>
                  <th className="text-left px-5 py-3 font-medium">Qty</th>
                  <th className="text-left px-5 py-3 font-medium">Min Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(item => (
                  <tr key={item.sku} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{item.sku}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{item.name}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{item.location}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{item.qty.toLocaleString()} {item.unit}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{item.min}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={item.status === 'Normal' ? 'success' : item.status === 'Low' ? 'warning' : item.status === 'Critical' ? 'error' : 'default'} size="sm">
                        {item.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toast.success(`Reorder request for ${item.name} submitted`)} className="text-xs text-primary hover:underline">Reorder</button>
                        <button onClick={() => toast.info(`Adjusting ${item.name} stock`)} className="text-xs text-muted-foreground hover:text-foreground hover:underline">Adjust</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'movements' && (
          <div className="divide-y divide-border">
            {RECENT_MOVEMENTS.map(m => (
              <div key={m.ref} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.qty.startsWith('+') ? 'bg-emerald-500/10' : 'bg-orange-500/10'}`}>
                  {m.qty.startsWith('+') ? <Package className="h-4 w-4 text-emerald-500" /> : <Truck className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{m.type} — {m.item}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.ref} · {m.from} · {m.time}</p>
                </div>
                <span className={`text-sm font-bold ${m.qty.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'}`}>{m.qty}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'transfers' && (
          <div className="p-5 space-y-3">
            {[
              { id: 'ST-441', from: 'Warehouse A', to: 'Production Floor', items: 3, status: 'In Transit' },
              { id: 'ST-442', from: 'Receiving Dock', to: 'Warehouse B', items: 8, status: 'Pending' },
              { id: 'ST-443', from: 'Warehouse B', to: 'Quality Lab', items: 1, status: 'Completed' },
            ].map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.id}: {t.from} → {t.to}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.items} item types</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge variant={t.status === 'Completed' ? 'success' : t.status === 'In Transit' ? 'default' : 'warning'} size="sm">{t.status}</StatusBadge>
                  <button onClick={() => toast.info(`Viewing transfer ${t.id}`)} className="text-xs text-primary hover:underline">View</button>
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('New transfer initiated')}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />New Stock Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
