import { useState } from 'react';
import {
  ShoppingCart, Plus, Download, Search, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, TrendingDown, ArrowRight, FileText, Package, DollarSign, Users, X, Edit, Eye, UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: number;
  value: string;
  due: string;
  status: string;
}

interface Vendor {
  name: string;
  score: number;
  onTime: string;
  orders: number;
  spend: string;
  status: string;
}

interface RFQ {
  id: string;
  title: string;
  vendors: number;
  responses: number;
  deadline: string;
  status: string;
}

const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-7821', vendor: 'SteelPro Ltd.', items: 4, value: '$48,200', due: 'Jun 5', status: 'Approved' },
  { id: 'PO-7822', vendor: 'Hydraulic Systems Inc.', items: 2, value: '$32,500', due: 'Jun 7', status: 'Pending Review' },
  { id: 'PO-7823', vendor: 'FastenTech Corp.', items: 8, value: '$12,750', due: 'Jun 8', status: 'Draft' },
  { id: 'PO-7824', vendor: 'Global Bearings', items: 3, value: '$67,100', due: 'Jun 10', status: 'Delivered' },
  { id: 'PO-7825', vendor: 'Polymer World', items: 6, value: '$24,300', due: 'Jun 12', status: 'In Transit' },
];

const INITIAL_VENDORS: Vendor[] = [
  { name: 'SteelPro Ltd.', score: 94, onTime: '96%', orders: 48, spend: '$1.2M', status: 'Active' },
  { name: 'Hydraulic Systems Inc.', score: 87, onTime: '89%', orders: 22, spend: '$840K', status: 'Active' },
  { name: 'Global Bearings', score: 91, onTime: '93%', orders: 35, spend: '$620K', status: 'Active' },
  { name: 'FastenTech Corp.', score: 78, onTime: '82%', orders: 64, spend: '$410K', status: 'Review' },
];

const INITIAL_RFQS: RFQ[] = [
  { id: 'RFQ-2201', title: 'Hydraulic Seals Q3', vendors: 4, responses: 2, deadline: 'Jun 8', status: 'Open' },
  { id: 'RFQ-2202', title: 'Steel Rod 30mm 1000 units', vendors: 6, responses: 5, deadline: 'Jun 6', status: 'Evaluating' },
  { id: 'RFQ-2203', title: 'Conveyor Belt Replacement', vendors: 3, responses: 3, deadline: 'Jun 4', status: 'Awarded' },
];

const spendData = [
  { month: 'Jan', spend: 420000 },
  { month: 'Feb', spend: 380000 },
  { month: 'Mar', spend: 510000 },
  { month: 'Apr', spend: 460000 },
  { month: 'May', spend: 490000 },
  { month: 'Jun', spend: 530000 },
];

export function ProcurementDashboard({ user }: { user: User }) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors' | 'rfq'>('orders');

  // Modals state
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // Requisition Form state
  const [poVendor, setPoVendor] = useState('SteelPro Ltd.');
  const [poItems, setPoItems] = useState(1);
  const [poValue, setPoValue] = useState('');
  const [poDue, setPoDue] = useState('');
  const [poStatus, setPoStatus] = useState('Pending Review');

  // RFQ Form state
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqVendorsCount, setRfqVendorsCount] = useState(3);
  const [rfqDeadline, setRfqDeadline] = useState('');

  // Vendor Form state
  const [vName, setVName] = useState('');
  const [vScore, setVScore] = useState(90);
  const [vOnTime, setVOnTime] = useState('95%');
  const [vSpend, setVSpend] = useState('');

  const filteredPOs = purchaseOrders.filter(p =>
    p.vendor.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRFQs = rfqs.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprovePO = (id: string) => {
    setPurchaseOrders(prev =>
      prev.map(po => {
        if (po.id === id) {
          toast.success(`Purchase Order ${po.id} approved successfully`);
          return { ...po, status: 'Approved' };
        }
        return po;
      })
    );
  };

  const handleAwardRFQ = (id: string) => {
    setRfqs(prev =>
      prev.map(r => {
        if (r.id === id) {
          toast.success(`RFQ ${r.id} awarded`);
          return { ...r, status: 'Awarded' };
        }
        return r;
      })
    );
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poValue.trim() || !poDue.trim()) {
      toast.error('Please enter all required fields');
      return;
    }
    const newPO: PurchaseOrder = {
      id: `PO-${7820 + purchaseOrders.length + 1}`,
      vendor: poVendor,
      items: poItems,
      value: poValue.startsWith('$') ? poValue : `$${poValue}`,
      due: poDue,
      status: poStatus
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    setIsPOModalOpen(false);
    toast.success(`Purchase Requisition ${newPO.id} created`);
  };

  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqTitle.trim() || !rfqDeadline.trim()) {
      toast.error('Please enter all required fields');
      return;
    }
    const newRFQ: RFQ = {
      id: `RFQ-${2200 + rfqs.length + 1}`,
      title: rfqTitle,
      vendors: rfqVendorsCount,
      responses: 0,
      deadline: rfqDeadline,
      status: 'Open'
    };
    setRfqs(prev => [...prev, newRFQ]);
    setIsRFQModalOpen(false);
    toast.success(`RFQ ${newRFQ.id} created successfully`);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vSpend.trim()) {
      toast.error('Please enter all required fields');
      return;
    }
    const newVendor: Vendor = {
      name: vName,
      score: vScore,
      onTime: vOnTime,
      orders: 1,
      spend: vSpend.startsWith('$') ? vSpend : `$${vSpend}`,
      status: 'Active'
    };
    setVendors(prev => [...prev, newVendor]);
    setIsVendorModalOpen(false);
    toast.success(`Vendor ${vName} registered`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ purchaseOrders, vendors, rfqs }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procurement_spend_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Procurement data exported successfully');
  };

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
          <button 
            type="button"
            onClick={() => {
              setPoVendor('SteelPro Ltd.');
              setPoItems(1);
              setPoValue('');
              setPoDue('');
              setPoStatus('Pending Review');
              setIsPOModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
          >
            <Plus className="h-4 w-4" />New Requisition
          </button>
          <button 
            type="button"
            onClick={() => {
              setRfqTitle('');
              setRfqVendorsCount(3);
              setRfqDeadline('');
              setIsRFQModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
          >
            <FileText className="h-4 w-4" />Create RFQ
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Spend', value: '$530K', change: '+8.2%', trend: 'up', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Open POs', value: `${purchaseOrders.filter(po => po.status !== 'Delivered').length}`, change: 'Active Transit', trend: 'down', icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Pending Approval', value: `${purchaseOrders.filter(po => po.status === 'Pending Review').length}`, change: 'Requires Action', trend: 'down', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Active Vendors', value: `${vendors.length}`, change: 'Verified Partners', trend: 'up', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
            <button 
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Top Vendor Performance</h3>
            <button 
              type="button" 
              onClick={() => {
                setVName('');
                setVScore(90);
                setVOnTime('95%');
                setVSpend('');
                setIsVendorModalOpen(true);
              }}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />Register Vendor
            </button>
          </div>
          <div className="space-y-3">
            {vendors.slice(0, 4).map(v => (
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
          <button 
            type="button"
            onClick={() => setActiveTab('vendors')}
            className="w-full mt-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors font-semibold"
          >
            View All Vendors
          </button>
        </div>
      </div>

      {/* Tabs: POs / Vendors / RFQ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex gap-2">
            {[['orders', 'Purchase Orders'], ['vendors', 'Vendor Comparison'], ['rfq', 'RFQ Management']].map(([id, label]) => (
              <button 
                key={id} 
                type="button"
                onClick={() => { setActiveTab(id as any); setSearch(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..." 
              className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-44" 
            />
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
                        {po.status === 'Pending Review' && (
                          <button 
                            type="button" 
                            onClick={() => handleApprovePO(po.id)} 
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        <button 
                          type="button" 
                          onClick={() => toast.info(`Viewing ${po.id}`)} 
                          className="text-xs text-primary hover:underline"
                        >
                          View
                        </button>
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
                {filteredVendors.map(v => (
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
                      <button 
                        type="button" 
                        onClick={() => toast.info(`Opening ${v.name} contract`)} 
                        className="text-xs text-primary hover:underline"
                      >
                        Contract
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rfq' && (
          <div className="p-5 space-y-3">
            {filteredRFQs.map(rfq => (
              <div key={rfq.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{rfq.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rfq.id} · {rfq.vendors} vendors invited · {rfq.responses} responses · Deadline: {rfq.deadline}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <StatusBadge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Evaluating' ? 'warning' : 'default'} size="sm">{rfq.status}</StatusBadge>
                  <button 
                    type="button" 
                    onClick={() => toast.info(`Opening ${rfq.id}`)} 
                    className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors"
                  >
                    View
                  </button>
                  {rfq.status === 'Evaluating' && (
                    <button 
                      type="button" 
                      onClick={() => handleAwardRFQ(rfq.id)} 
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Award
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => {
                setRfqTitle('');
                setRfqVendorsCount(3);
                setRfqDeadline('');
                setIsRFQModalOpen(true);
              }}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />Create New RFQ
            </button>
          </div>
        )}
      </div>

      {/* PO Modal */}
      {isPOModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsPOModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Create Purchase Requisition</h2>
            <form onSubmit={handleCreatePO} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Vendor *</label>
                <select
                  value={poVendor}
                  onChange={e => setPoVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                >
                  {vendors.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Number of Items</label>
                  <input
                    type="number"
                    value={poItems}
                    onChange={e => setPoItems(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Requisition Value *</label>
                  <input
                    type="text"
                    value={poValue}
                    onChange={e => setPoValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. $15,200"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Due Date *</label>
                  <input
                    type="text"
                    value={poDue}
                    onChange={e => setPoDue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Jun 15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Initial Status</label>
                  <select
                    value={poStatus}
                    onChange={e => setPoStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsPOModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Create Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RFQ Modal */}
      {isRFQModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsRFQModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Create RFQ (Request for Quote)</h2>
            <form onSubmit={handleCreateRFQ} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">RFQ Title *</label>
                <input
                  type="text"
                  value={rfqTitle}
                  onChange={e => setRfqTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Copper Wire Q3 Supply"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Invited Vendors</label>
                  <input
                    type="number"
                    value={rfqVendorsCount}
                    onChange={e => setRfqVendorsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Deadline *</label>
                  <input
                    type="text"
                    value={rfqDeadline}
                    onChange={e => setRfqDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Jun 20"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsRFQModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Create RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Registration Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsVendorModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Register New Vendor</h2>
            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Vendor Name *</label>
                <input
                  type="text"
                  value={vName}
                  onChange={e => setVName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. SteelPro Ltd."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Initial Score (1-100)</label>
                  <input
                    type="number"
                    value={vScore}
                    onChange={e => setVScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">On-Time Delivery Rate</label>
                  <input
                    type="text"
                    value={vOnTime}
                    onChange={e => setVOnTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. 96%"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Annual Spend Estimate *</label>
                <input
                  type="text"
                  value={vSpend}
                  onChange={e => setVSpend(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. $450K"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsVendorModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
