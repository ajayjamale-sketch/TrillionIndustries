import { useState } from 'react';
import {
  Store, Package, TrendingUp, ShoppingCart, Star, Plus, Download,
  Search, ArrowRight, DollarSign, Clock, CheckCircle2, Truck, FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const revenueData = [
  { month: 'Jan', revenue: 84000, orders: 12 },
  { month: 'Feb', revenue: 92000, orders: 14 },
  { month: 'Mar', revenue: 78000, orders: 11 },
  { month: 'Apr', revenue: 105000, orders: 18 },
  { month: 'May', revenue: 118000, orders: 21 },
  { month: 'Jun', revenue: 132000, orders: 24 },
];

const ORDERS = [
  { id: 'SO-8821', buyer: 'Trillion Industries Corp', items: 'Steel Rod 30mm × 500', value: '$48,200', due: 'Jun 5', status: 'Processing' },
  { id: 'SO-8822', buyer: 'MechPro Manufacturing', items: 'Hydraulic Seal Kit × 200', value: '$32,500', due: 'Jun 7', status: 'Dispatched' },
  { id: 'SO-8823', buyer: 'FastBuild Corp', items: 'M12 Bolt Pack × 1000', value: '$8,750', due: 'Jun 8', status: 'Confirmed' },
  { id: 'SO-8824', buyer: 'Trillion Industries Corp', items: 'Ball Bearing 40mm × 300', value: '$14,100', due: 'Jun 10', status: 'Delivered' },
];

const LISTINGS = [
  { sku: 'STL-3012', name: 'Steel Rod 30mm', price: '$96.40/100pcs', stock: 840, orders: 48, status: 'Active' },
  { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', price: '$162.50/set', stock: 220, orders: 22, status: 'Active' },
  { sku: 'BRG-4401', name: 'Ball Bearing 40mm', price: '$47.00/pc', stock: 1200, orders: 35, status: 'Active' },
  { sku: 'FST-1122', name: 'M12 Hex Bolt (100pk)', price: '$8.75/pack', stock: 5000, orders: 64, status: 'Active' },
];

export function SupplierDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<'orders' | 'listings' | 'contracts'>('orders');

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Supplier Portal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.company} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('New product listing created')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />Add Listing
          </button>
          <button onClick={() => toast.info('Responding to latest RFQ')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors">
            <FileText className="h-4 w-4" />Respond to RFQ
          </button>
        </div>
      </div>

      {/* Performance Badge */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Star className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Preferred Supplier Status — Score: 94/100</p>
          <p className="text-xs text-muted-foreground mt-0.5">On-time delivery: 96% · Quality rating: 4.8/5 · Response time: &lt;2 hours</p>
        </div>
        <button onClick={() => toast.info('Viewing performance certificate')} className="ml-auto text-xs text-primary hover:underline shrink-0">View Certificate</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (Jun)', value: '$132K', change: '+12% vs May', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Orders', value: '24', change: '3 need action', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Product Listings', value: '47', change: '2 under review', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Avg Rating', value: '4.8★', change: 'Based on 148 reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Revenue & Order Trend</h3>
          <button onClick={() => toast.info('Downloading revenue report')} className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Download className="h-3 w-3" />Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          {[['orders', 'Sales Orders'], ['listings', 'Product Listings'], ['contracts', 'Contracts']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Order ID</th>
                  <th className="text-left px-5 py-3 font-medium">Buyer</th>
                  <th className="text-left px-5 py-3 font-medium">Items</th>
                  <th className="text-left px-5 py-3 font-medium">Value</th>
                  <th className="text-left px-5 py-3 font-medium">Due Date</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ORDERS.map(o => (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{o.id}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{o.buyer}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{o.items}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{o.value}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{o.due}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={o.status === 'Delivered' ? 'success' : o.status === 'Dispatched' ? 'default' : o.status === 'Processing' ? 'warning' : 'default'} size="sm">{o.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {o.status === 'Confirmed' && (
                          <button onClick={() => toast.success(`${o.id} dispatched`)} className="text-xs text-primary hover:underline">Dispatch</button>
                        )}
                        <button onClick={() => toast.info(`Viewing ${o.id}`)} className="text-xs text-muted-foreground hover:text-foreground hover:underline">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'listings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">SKU</th>
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-left px-5 py-3 font-medium">Price</th>
                  <th className="text-left px-5 py-3 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Orders</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {LISTINGS.map(l => (
                  <tr key={l.sku} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{l.sku}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{l.name}</td>
                    <td className="px-5 py-3.5 text-xs text-foreground">{l.price}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{l.stock}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{l.orders}</td>
                    <td className="px-5 py-3.5"><StatusBadge variant="success" size="sm">{l.status}</StatusBadge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => toast.success(`${l.name} listing updated`)} className="text-xs text-primary hover:underline">Edit</button>
                        <button onClick={() => toast.info(`Viewing ${l.name} analytics`)} className="text-xs text-muted-foreground hover:underline">Analytics</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'contracts' && (
          <div className="p-5 space-y-3">
            {[
              { id: 'CTR-101', buyer: 'Trillion Industries Corp', value: '$1.2M/year', expires: 'Dec 31, 2026', status: 'Active' },
              { id: 'CTR-102', buyer: 'MechPro Manufacturing', value: '$480K/year', expires: 'Mar 31, 2027', status: 'Active' },
              { id: 'CTR-103', buyer: 'FastBuild Corp', value: '$240K/year', expires: 'Jun 30, 2026', status: 'Expiring Soon' },
            ].map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.id} — {c.buyer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.value} · Expires: {c.expires}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <StatusBadge variant={c.status === 'Active' ? 'success' : 'warning'} size="sm">{c.status}</StatusBadge>
                  {c.status === 'Expiring Soon' && (
                    <button onClick={() => toast.success('Contract renewal initiated')} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors">Renew</button>
                  )}
                  <button onClick={() => toast.info(`Viewing contract ${c.id}`)} className="text-xs text-primary hover:underline">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
