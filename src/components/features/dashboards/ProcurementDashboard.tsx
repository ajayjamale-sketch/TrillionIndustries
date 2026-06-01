import { useState } from 'react';
import {
  ShoppingCart, Plus, Download, Search, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, TrendingDown, ArrowRight, FileText, Package, DollarSign, Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const spendData = [
  { month: 'Jan', spend: 420000 },
  { month: 'Feb', spend: 380000 },
  { month: 'Mar', spend: 510000 },
  { month: 'Apr', spend: 460000 },
  { month: 'May', spend: 490000 },
  { month: 'Jun', spend: 530000 },
];

const PURCHASE_ORDERS = [
  { id: 'PO-7821', vendor: 'SteelPro Ltd.', items: 4, value: '$48,200', due: 'Jun 5', status: 'Approved' },
  { id: 'PO-7822', vendor: 'Hydraulic Systems Inc.', items: 2, value: '$32,500', due: 'Jun 7', status: 'Pending Review' },
  { id: 'PO-7823', vendor: 'FastenTech Corp.', items: 8, value: '$12,750', due: 'Jun 8', status: 'Draft' },
  { id: 'PO-7824', vendor: 'Global Bearings', items: 3, value: '$67,100', due: 'Jun 10', status: 'Delivered' },
  { id: 'PO-7825', vendor: 'Polymer World', items: 6, value: '$24,300', due: 'Jun 12', status: 'In Transit' },
];

const VENDORS = [
  { name: 'SteelPro Ltd.', score: 94, onTime: '96%', orders: 48, spend: '$1.2M', status: 'Active' },
  { name: 'Hydraulic Systems Inc.', score: 87, onTime: '89%', orders: 22, spend: '$840K', status: 'Active' },
  { name: 'Global Bearings', score: 91, onTime: '93%', orders: 35, spend: '$620K', status: 'Active' },
  { name: 'FastenTech Corp.', score: 78, onTime: '82%', orders: 64, spend: '$410K', status: 'Review' },
];

export function ProcurementDashboard({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors' | 'rfq'>('orders');

  const filteredPOs = PURCHASE_ORDERS.filter(p =>
    p.vendor.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search.toUpperCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Procurement Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('New Purchase Requisition created')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />New Requisition
          </button>
          <button onClick={() => toast.info('Creating new RFQ')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors">
            <FileText className="h-4 w-4" />Create RFQ
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Spend', value: '$530K', change: '+8.2%', trend: 'up', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Open POs', value: '47', change: '-5 this week', trend: 'down', icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Pending Approval', value: '12', change: '4 urgent', trend: 'down', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Active Vendors', value: '84', change: '+3 new', trend: 'up', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Spend Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Monthly Procurement Spend</h3>
            <button onClick={() => toast.info('Downloading spend report')}
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Download className="h-3 w-3" />Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={spendData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Spend']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="spend" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendors */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Top Vendor Performance</h3>
          <div className="space-y-3">
            {VENDORS.map(v => (
              <div key={v.name} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toast.info(`Viewing ${v.name} profile`)}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{v.name}</p>
                  <p className="text-[11px] text-muted-foreground">{v.orders} orders · {v.spend}</p>
                </div>
                <div className="text-right ml-2">
                  <p className={`text-sm font-bold ${v.score >= 90 ? 'text-emerald-500' : v.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{v.score}</p>
                  <p className="text-[11px] text-muted-foreground">score</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => toast.info('Opening vendor directory')}
            className="w-full mt-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
            View All Vendors
          </button>
        </div>
      </div>

      {/* Tabs: POs / Vendors / RFQ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex gap-2">
            {[['orders', 'Purchase Orders'], ['vendors', 'Vendor Comparison'], ['rfq', 'RFQ Management']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..." className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-44" />
          </div>
        </div>

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">PO ID</th>
                  <th className="text-left px-5 py-3 font-medium">Vendor</th>
                  <th className="text-left px-5 py-3 font-medium">Items</th>
                  <th className="text-left px-5 py-3 font-medium">Value</th>
                  <th className="text-left px-5 py-3 font-medium">Due Date</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPOs.map(po => (
                  <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{po.id}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{po.vendor}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.items} items</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{po.value}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.due}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={po.status === 'Approved' || po.status === 'Delivered' ? 'success' : po.status === 'Pending Review' ? 'warning' : po.status === 'In Transit' ? 'default' : 'error'} size="sm">
                        {po.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toast.success(`${po.id} approved`)} className="text-xs text-emerald-600 hover:underline">Approve</button>
                        <button onClick={() => toast.info(`Viewing ${po.id}`)} className="text-xs text-primary hover:underline">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Vendor</th>
                  <th className="text-left px-5 py-3 font-medium">Score</th>
                  <th className="text-left px-5 py-3 font-medium">On-Time Delivery</th>
                  <th className="text-left px-5 py-3 font-medium">Total Orders</th>
                  <th className="text-left px-5 py-3 font-medium">Annual Spend</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {VENDORS.map(v => (
                  <tr key={v.name} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{v.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-bold ${v.score >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{v.score}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.onTime}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.orders}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{v.spend}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={v.status === 'Active' ? 'success' : 'warning'} size="sm">{v.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toast.info(`Opening ${v.name} contract`)} className="text-xs text-primary hover:underline">Contract</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rfq' && (
          <div className="p-5 space-y-3">
            {[
              { id: 'RFQ-2201', title: 'Hydraulic Seals Q3', vendors: 4, responses: 2, deadline: 'Jun 8', status: 'Open' },
              { id: 'RFQ-2202', title: 'Steel Rod 30mm 1000 units', vendors: 6, responses: 5, deadline: 'Jun 6', status: 'Evaluating' },
              { id: 'RFQ-2203', title: 'Conveyor Belt Replacement', vendors: 3, responses: 3, deadline: 'Jun 4', status: 'Awarded' },
            ].map(rfq => (
              <div key={rfq.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{rfq.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rfq.id} · {rfq.vendors} vendors invited · {rfq.responses} responses · Deadline: {rfq.deadline}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <StatusBadge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Evaluating' ? 'warning' : 'default'} size="sm">{rfq.status}</StatusBadge>
                  <button onClick={() => toast.info(`Opening ${rfq.id}`)} className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">View</button>
                  {rfq.status === 'Evaluating' && (
                    <button onClick={() => toast.success(`${rfq.id} awarded`)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors">Award</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('New RFQ created')}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />Create New RFQ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
