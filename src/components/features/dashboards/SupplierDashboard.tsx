import { useState } from 'react';
import {
  Store, Package, TrendingUp, ShoppingCart, Star, Plus, Download,
  Search, ArrowRight, DollarSign, Clock, CheckCircle2, Truck, FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

// Initial data with types
interface Order {
  id: string;
  buyer: string;
  items: string;
  value: string;
  due: string;
  status: 'Processing' | 'Dispatched' | 'Confirmed' | 'Delivered';
}

interface Listing {
  sku: string;
  name: string;
  price: string;
  stock: number;
  orders: number;
  status: 'Active' | 'Inactive' | 'Under Review';
}

interface Contract {
  id: string;
  buyer: string;
  value: string;
  expires: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

const revenueData = [
  { month: 'Jan', revenue: 84000, orders: 12 },
  { month: 'Feb', revenue: 92000, orders: 14 },
  { month: 'Mar', revenue: 78000, orders: 11 },
  { month: 'Apr', revenue: 105000, orders: 18 },
  { month: 'May', revenue: 118000, orders: 21 },
  { month: 'Jun', revenue: 132000, orders: 24 },
];

const INITIAL_ORDERS: Order[] = [
  { id: 'SO-8821', buyer: 'Trillion Industries Corp', items: 'Steel Rod 30mm × 500', value: '$48,200', due: 'Jun 5', status: 'Processing' },
  { id: 'SO-8822', buyer: 'MechPro Manufacturing', items: 'Hydraulic Seal Kit × 200', value: '$32,500', due: 'Jun 7', status: 'Dispatched' },
  { id: 'SO-8823', buyer: 'FastBuild Corp', items: 'M12 Bolt Pack × 1000', value: '$8,750', due: 'Jun 8', status: 'Confirmed' },
  { id: 'SO-8824', buyer: 'Trillion Industries Corp', items: 'Ball Bearing 40mm × 300', value: '$14,100', due: 'Jun 10', status: 'Delivered' },
];

const INITIAL_LISTINGS: Listing[] = [
  { sku: 'STL-3012', name: 'Steel Rod 30mm', price: '$96.40/100pcs', stock: 840, orders: 48, status: 'Active' },
  { sku: 'HYD-8821', name: 'Hydraulic Seal Kit', price: '$162.50/set', stock: 220, orders: 22, status: 'Active' },
  { sku: 'BRG-4401', name: 'Ball Bearing 40mm', price: '$47.00/pc', stock: 1200, orders: 35, status: 'Active' },
  { sku: 'FST-1122', name: 'M12 Hex Bolt (100pk)', price: '$8.75/pack', stock: 5000, orders: 64, status: 'Active' },
];

const INITIAL_CONTRACTS: Contract[] = [
  { id: 'CTR-101', buyer: 'Trillion Industries Corp', value: '$1.2M/year', expires: 'Dec 31, 2026', status: 'Active' },
  { id: 'CTR-102', buyer: 'MechPro Manufacturing', value: '$480K/year', expires: 'Mar 31, 2027', status: 'Active' },
  { id: 'CTR-103', buyer: 'FastBuild Corp', value: '$240K/year', expires: 'Jun 30, 2026', status: 'Expiring Soon' },
];

// Helper: format currency for display
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper: parse price string to numeric value (handles "/100pcs", "/set", "/pc", "/pack" etc.)
const parsePriceToNumber = (priceStr: string): number => {
  const match = priceStr.match(/^\$([\d,]+(?:\.\d+)?)/);
  if (!match) return 0;
  return parseFloat(match[1].replace(/,/g, ''));
};

// Helper: generate a new SKU
const generateSKU = (): string => {
  const prefixes = ['STL', 'HYD', 'BRG', 'FST', 'MTL', 'RBR'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `${randomPrefix}-${num}`;
};

export function SupplierDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<'orders' | 'listings' | 'contracts'>('orders');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Form inputs
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState(0);

  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState(0);

  // ----- Orders actions -----
  const handleDispatchOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId && order.status === 'Confirmed'
          ? { ...order, status: 'Dispatched' }
          : order
      )
    );
    toast.success(`Order ${orderId} marked as Dispatched`);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  // ----- Listings actions -----
  const handleAddListing = () => {
    setNewName('');
    setNewPrice('');
    setNewStock(0);
    setIsAddOpen(true);
  };

  const saveNewListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice.trim()) {
      toast.error('All fields are required');
      return;
    }
    const newSku = generateSKU();
    const formattedPrice = newPrice.startsWith('$') ? newPrice : `$${newPrice}`;
    const newListing: Listing = {
      sku: newSku,
      name: newName,
      price: formattedPrice,
      stock: Number(newStock),
      orders: 0,
      status: 'Active',
    };
    setListings(prev => [...prev, newListing]);
    toast.success(`Listing "${newName}" created successfully!`);
    setIsAddOpen(false);
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setEditPrice(listing.price);
    setEditStock(listing.stock);
  };

  const saveEditedListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    setListings(prev =>
      prev.map(l =>
        l.sku === editingListing.sku
          ? { ...l, price: editPrice, stock: Number(editStock) }
          : l
      )
    );
    toast.success(`Listing "${editingListing.name}" updated`);
    setEditingListing(null);
  };

  const handleViewAnalytics = (listing: Listing) => {
    toast.info(`${listing.name} analytics: ${listing.orders} orders in last 30 days, ${listing.stock} units remaining.`);
  };

  // ----- Contracts actions -----
  const handleRenewContract = (contractId: string) => {
    setContracts(prev =>
      prev.map(contract => {
        if (contract.id === contractId && contract.status === 'Expiring Soon') {
          const currentDate = new Date(contract.expires);
          const newDate = new Date(currentDate);
          newDate.setFullYear(currentDate.getFullYear() + 1);
          const newExpiry = newDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '');
          return {
            ...contract,
            expires: newExpiry,
            status: 'Active',
          };
        }
        return contract;
      })
    );
    toast.success(`Contract ${contractId} renewed for another year`);
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  // ----- Dashboard buttons -----
  const handleRespondToRFQ = () => {
    toast.success('Your response has been sent to the buyer.');
  };

  const handleViewCertificate = () => {
    toast.info('Preferred Supplier Certificate: Score 94/100. Valid until Dec 2026.');
  };

  const handleExportRevenue = () => {
    const headers = ['Month', 'Revenue (USD)', 'Orders'];
    const rows = revenueData.map(d => [d.month, d.revenue, d.orders]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Revenue report downloaded');
  };

  // KPI click handlers
  const handleKpiClick = (label: string) => {
    toast.info(`Detailed view for ${label} coming soon`);
  };

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
          <button onClick={handleAddListing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />Add Listing
          </button>
          <button onClick={handleRespondToRFQ}
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
        <button onClick={handleViewCertificate} className="ml-auto text-xs text-primary hover:underline shrink-0">View Certificate</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (Jun)', value: '$132K', change: '+12% vs May', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Orders', value: orders.filter(o => o.status !== 'Delivered').length.toString(), change: `${orders.filter(o => o.status === 'Confirmed').length} need action`, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Product Listings', value: listings.length.toString(), change: `${listings.filter(l => l.status === 'Under Review').length} under review`, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Avg Rating', value: '4.8★', change: 'Based on 148 reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => handleKpiClick(m.label)}>
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
          <button onClick={handleExportRevenue} className="flex items-center gap-1 text-xs text-primary hover:underline">
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
                {orders.map(o => (
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
                          <button onClick={() => handleDispatchOrder(o.id)} className="text-xs text-primary hover:underline">Dispatch</button>
                        )}
                        <button onClick={() => handleViewOrder(o)} className="text-xs text-muted-foreground hover:text-foreground hover:underline">View</button>
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
                {listings.map(l => (
                  <tr key={l.sku} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{l.sku}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{l.name}</td>
                    <td className="px-5 py-3.5 text-xs text-foreground">{l.price}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{l.stock}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{l.orders}</td>
                    <td className="px-5 py-3.5"><StatusBadge variant="success" size="sm">{l.status}</StatusBadge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditListing(l)} className="text-xs text-primary hover:underline">Edit</button>
                        <button onClick={() => handleViewAnalytics(l)} className="text-xs text-muted-foreground hover:underline">Analytics</button>
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
            {contracts.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.id} — {c.buyer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.value} · Expires: {c.expires}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <StatusBadge variant={c.status === 'Active' ? 'success' : 'warning'} size="sm">{c.status}</StatusBadge>
                  {c.status === 'Expiring Soon' && (
                    <button onClick={() => handleRenewContract(c.id)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors">Renew</button>
                  )}
                  <button onClick={() => handleViewContract(c)} className="text-xs text-primary hover:underline">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PORTAL MODALS */}

      {/* Add Product Listing Modal */}
      {isAddOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Add Product Listing</h2>
            <form onSubmit={saveNewListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Copper Wire Spool"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Price per unit (e.g. $12.00/pc)</label>
                <input
                  type="text"
                  required
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  placeholder="$10.00/pc"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Initial Stock</label>
                <input
                  type="number"
                  required
                  value={newStock}
                  onChange={e => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">Create Listing</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Listing Modal */}
      {editingListing && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setEditingListing(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Edit Listing: {editingListing.name}</h2>
            <form onSubmit={saveEditedListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Price</label>
                <input
                  type="text"
                  required
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Stock</label>
                <input
                  type="number"
                  required
                  value={editStock}
                  onChange={e => setEditStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingListing(null)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Order Modal */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Sales Order Details</h2>
            <div className="space-y-3.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Order ID</span><span className="font-semibold text-foreground font-mono">{selectedOrder.id}</span></div>
              <div className="flex justify-between"><span>Buyer</span><span className="font-semibold text-foreground">{selectedOrder.buyer}</span></div>
              <div className="flex justify-between"><span>Item Description</span><span className="font-semibold text-foreground">{selectedOrder.items}</span></div>
              <div className="flex justify-between"><span>Total Value</span><span className="font-semibold text-foreground">{selectedOrder.value}</span></div>
              <div className="flex justify-between"><span>Due Date</span><span className="font-semibold text-foreground">{selectedOrder.due}</span></div>
              <div className="flex justify-between">
                <span>Status</span>
                <StatusBadge variant={selectedOrder.status === 'Delivered' ? 'success' : selectedOrder.status === 'Dispatched' ? 'default' : 'warning'} size="sm">
                  {selectedOrder.status}
                </StatusBadge>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              {selectedOrder.status === 'Confirmed' && (
                <button 
                  onClick={() => { handleDispatchOrder(selectedOrder.id); setSelectedOrder(null); }}
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
                >
                  Dispatch Cargo
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* View Contract Modal */}
      {selectedContract && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedContract(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Framework Agreement Contract</h2>
            <div className="space-y-3.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Contract ID</span><span className="font-semibold text-foreground font-mono">{selectedContract.id}</span></div>
              <div className="flex justify-between"><span>Buyer Entity</span><span className="font-semibold text-foreground">{selectedContract.buyer}</span></div>
              <div className="flex justify-between"><span>Value Terms</span><span className="font-semibold text-foreground">{selectedContract.value}</span></div>
              <div className="flex justify-between"><span>Expiration Date</span><span className="font-semibold text-foreground">{selectedContract.expires}</span></div>
              <div className="flex justify-between">
                <span>Status</span>
                <StatusBadge variant={selectedContract.status === 'Active' ? 'success' : 'warning'} size="sm">
                  {selectedContract.status}
                </StatusBadge>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              {selectedContract.status === 'Expiring Soon' && (
                <button 
                  onClick={() => { handleRenewContract(selectedContract.id); setSelectedContract(null); }}
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
                >
                  Renew Terms
                </button>
              )}
              <button onClick={() => setSelectedContract(null)} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}