import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Plus, Download, Search, Clock,
  ArrowRight, FileText, DollarSign, Users, X,
  CheckSquare, Briefcase, BarChart3, TrendingUp,
  Building2, Package, Check, Eye, Award, Send,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface PurchaseOrder {
  id: string; vendor: string; items: number; value: string; due: string; status: string;
}
interface Vendor {
  name: string; score: number; onTime: string; orders: number; spend: string; status: string;
}
interface RFQ {
  id: string; title: string; vendors: number; responses: number; deadline: string; status: string;
}

/* ─────────────────────────────────────────────
   Seed data
───────────────────────────────────────────── */
const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-7821', vendor: 'SteelPro Ltd.', items: 4, value: '$48,200', due: 'Jun 10', status: 'Approved' },
  { id: 'PO-7822', vendor: 'Hydraulic Systems Inc.', items: 2, value: '$32,500', due: 'Jun 12', status: 'Pending Review' },
  { id: 'PO-7823', vendor: 'FastenTech Corp.', items: 8, value: '$12,750', due: 'Jun 14', status: 'Draft' },
  { id: 'PO-7824', vendor: 'Global Bearings', items: 3, value: '$67,100', due: 'Jun 5', status: 'Delivered' },
  { id: 'PO-7825', vendor: 'Polymer World', items: 6, value: '$24,300', due: 'Jun 8', status: 'In Transit' },
];

const INITIAL_VENDORS: Vendor[] = [
  { name: 'SteelPro Ltd.', score: 94, onTime: '96%', orders: 48, spend: '$1.2M', status: 'Preferred' },
  { name: 'Hydraulic Systems Inc.', score: 87, onTime: '89%', orders: 22, spend: '$840K', status: 'Active' },
  { name: 'Global Bearings', score: 91, onTime: '93%', orders: 35, spend: '$620K', status: 'Active' },
  { name: 'FastenTech Corp.', score: 78, onTime: '82%', orders: 64, spend: '$410K', status: 'Under Review' },
];

const INITIAL_RFQS: RFQ[] = [
  { id: 'RFQ-2201', title: 'Hydraulic Seals Q3 Supply', vendors: 4, responses: 2, deadline: 'Jun 8', status: 'Open' },
  { id: 'RFQ-2202', title: 'Steel Rod 30mm — 1000 units', vendors: 6, responses: 5, deadline: 'Jun 6', status: 'Evaluating' },
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

/* ─────────────────────────────────────────────
   PO Detail Modal
───────────────────────────────────────────── */
function PODetailModal({ po, onClose, onApprove }: {
  po: PurchaseOrder; onClose: () => void; onApprove: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{po.id}</span>
              <StatusBadge
                variant={po.status === 'Approved' || po.status === 'Delivered' ? 'success' : po.status === 'Pending Review' ? 'warning' : po.status === 'In Transit' ? 'default' : 'error'}
                size="sm">{po.status}
              </StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{po.vendor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Vendor', value: po.vendor },
              { label: 'Line Items', value: `${po.items} items` },
              { label: 'Order Value', value: po.value },
              { label: 'Due Date', value: po.due },
            ].map(m => (
              <div key={m.label} className="bg-muted/30 border border-border rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">{m.label}</p>
                <p className="text-sm font-bold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground bg-muted/30 border border-border rounded-xl p-3">
            This is a summary view. <span className="text-primary font-semibold cursor-pointer hover:underline">Go to Purchase Orders</span> for full line-item details, delivery tracking, and document attachments.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
          {po.status === 'Pending Review' && (
            <button onClick={() => { onApprove(po.id); onClose(); }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center gap-1.5 transition-colors">
              <Check className="h-3.5 w-3.5" /> Approve PO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Vendor Profile Modal
───────────────────────────────────────────── */
function VendorModal({ vendor, onClose, onNavigate }: {
  vendor: Vendor; onClose: () => void; onNavigate: () => void;
}) {
  const scoreColor = vendor.score >= 90 ? 'text-emerald-500' : vendor.score >= 80 ? 'text-amber-500' : 'text-red-500';
  const statusV = vendor.status === 'Preferred' ? 'success' : vendor.status === 'Active' ? 'default' : 'warning';
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{vendor.name}</p>
              <StatusBadge variant={statusV} size="sm">{vendor.status}</StatusBadge>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Performance Score', value: vendor.score.toString(), color: scoreColor },
              { label: 'On-Time Delivery', value: vendor.onTime, color: 'text-foreground' },
              { label: 'Orders (YTD)', value: vendor.orders.toString(), color: 'text-foreground' },
              { label: 'Annual Spend', value: vendor.spend, color: 'text-foreground' },
            ].map(m => (
              <div key={m.label} className="bg-muted/40 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${vendor.score >= 90 ? 'bg-emerald-500' : vendor.score >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${vendor.score}%` }} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
          <button onClick={() => { onClose(); onNavigate(); }}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors">
            Full Profile <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RFQ Detail Modal
───────────────────────────────────────────── */
function RFQModal({ rfq, onClose, onAward, onNavigate }: {
  rfq: RFQ; onClose: () => void; onAward: (id: string) => void; onNavigate: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{rfq.id}</span>
              <StatusBadge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Evaluating' ? 'warning' : 'default'} size="sm">{rfq.status}</StatusBadge>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{rfq.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Vendors Invited', value: rfq.vendors.toString() },
              { label: 'Responses', value: rfq.responses.toString() },
              { label: 'Response Rate', value: `${Math.round((rfq.responses / rfq.vendors) * 100)}%` },
              { label: 'Deadline', value: rfq.deadline },
            ].map(m => (
              <div key={m.label} className="bg-muted/40 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
                <p className="text-base font-bold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
          {rfq.status === 'Evaluating' && (
            <button onClick={() => { onAward(rfq.id); onClose(); }}
              className="flex-1 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center justify-center gap-1 transition-colors">
              <Award className="h-3.5 w-3.5" /> Award
            </button>
          )}
          <button onClick={() => { onClose(); onNavigate(); }}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-1 transition-colors">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   New Requisition Modal (quick-create)
───────────────────────────────────────────── */
function NewRequisitionModal({ vendors, onClose, onSubmit }: {
  vendors: Vendor[]; onClose: () => void; onSubmit: (po: PurchaseOrder) => void;
}) {
  const [vendor, setVendor] = useState(vendors[0]?.name || '');
  const [items, setItems] = useState(1);
  const [value, setValue] = useState('');
  const [due, setDue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !due.trim()) { toast.error('Value and due date are required'); return; }
    const po: PurchaseOrder = {
      id: `PO-${7826 + Math.floor(Math.random() * 100)}`,
      vendor, items,
      value: value.startsWith('$') ? value : `$${value}`,
      due, status: 'Pending Review',
    };
    onSubmit(po);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">New Purchase Requisition</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Quick-create · Full form on Purchase Orders page</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Vendor *</label>
            <select value={vendor} onChange={e => setVendor(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
              {vendors.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Items Count</label>
              <input type="number" value={items} onChange={e => setItems(Number(e.target.value))} min="1"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Value *</label>
              <input value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. $15,200" required
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Due Date *</label>
            <input value={due} onChange={e => setDue(e.target.value)} placeholder="e.g. Jun 20" required
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create Requisition</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   New RFQ Modal (quick-create)
───────────────────────────────────────────── */
function NewRFQModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (rfq: RFQ) => void }) {
  const [title, setTitle] = useState('');
  const [vendorCount, setVendorCount] = useState(3);
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline.trim()) { toast.error('Title and deadline are required'); return; }
    const rfq: RFQ = {
      id: `RFQ-${2205 + Math.floor(Math.random() * 100)}`,
      title, vendors: vendorCount, responses: 0, deadline, status: 'Open',
    };
    onSubmit(rfq);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Create RFQ</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Quick-create · Full vendor invite on RFQ Management page</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">RFQ Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Steel Rod Q3 Supply" required
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Vendors to Invite</label>
              <input type="number" value={vendorCount} onChange={e => setVendorCount(Number(e.target.value))} min="1"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Response Deadline *</label>
              <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="e.g. Jun 20" required
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create RFQ</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Dashboard Component
───────────────────────────────────────────── */
export function ProcurementDashboard({ user }: { user: User }) {
  const navigate = useNavigate();

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors' | 'rfq'>('orders');

  // Modal states
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  /* ── Derived filters ── */
  const filteredPOs = purchaseOrders.filter(p =>
    p.vendor.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );
  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
  const filteredRFQs = rfqs.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Actions ── */
  const handleApprovePO = (id: string) => {
    setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'Approved' } : po));
    toast.success(`${id} approved successfully`);
  };

  const handleAwardRFQ = (id: string) => {
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Awarded' } : r));
    toast.success(`${id} awarded to best vendor`);
  };

  const handleCreatePO = (po: PurchaseOrder) => {
    setPurchaseOrders(prev => [po, ...prev]);
    setIsPOModalOpen(false);
    toast.success(`${po.id} created — pending approval`);
  };

  const handleCreateRFQ = (rfq: RFQ) => {
    setRfqs(prev => [rfq, ...prev]);
    setIsRFQModalOpen(false);
    toast.success(`${rfq.id} published — vendor invitations sent`);
  };

  const handleExport = () => {
    const data = { purchaseOrders, vendors, rfqs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procurement_dashboard_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Dashboard data exported');
  };

  /* ── KPI data (dynamic) ── */
  const pendingApprovalCount = purchaseOrders.filter(po => po.status === 'Pending Review').length;
  const openPOsCount = purchaseOrders.filter(po => !['Delivered', 'Cancelled'].includes(po.status)).length;

  const kpis = [
    {
      label: 'Monthly Spend', value: '$530K', sub: '+8.2% vs last month',
      icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10',
      onClick: () => navigate('/dashboard/procurement/spend'),
    },
    {
      label: 'Open POs', value: `${openPOsCount}`, sub: 'Active / In Transit',
      icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-500/10',
      onClick: () => navigate('/dashboard/procurement/orders'),
    },
    {
      label: 'Pending Approval', value: `${pendingApprovalCount}`, sub: 'Requires action',
      icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10',
      onClick: () => navigate('/dashboard/procurement/approvals'),
    },
    {
      label: 'Active Vendors', value: `${vendors.length}`, sub: 'Verified partners',
      icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10',
      onClick: () => navigate('/dashboard/procurement/vendors'),
    },
  ];

  /* ── Quick Action shortcuts ── */
  const quickActions = [
    { label: 'Purchase Requests', icon: Plus, href: '/dashboard/procurement/requests', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Purchase Orders', icon: ShoppingCart, href: '/dashboard/procurement/orders', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'RFQ Management', icon: FileText, href: '/dashboard/procurement/rfq', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Approval Workflow', icon: CheckSquare, href: '/dashboard/procurement/approvals', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Vendor Profiles', icon: Building2, href: '/dashboard/procurement/vendors', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Contract Management', icon: Briefcase, href: '/dashboard/procurement/contracts', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Spend Analysis', icon: BarChart3, href: '/dashboard/procurement/spend', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Supplier Analytics', icon: TrendingUp, href: '/dashboard/procurement/analytics', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  const poStatusBadge = (status: string) =>
    status === 'Approved' || status === 'Delivered' ? 'success' :
    status === 'Pending Review' ? 'warning' :
    status === 'In Transit' ? 'default' : 'error';

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">

      {/* ── Header ── */}
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
            onClick={() => setIsPOModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
          >
            <Plus className="h-4 w-4" /> New Requisition
          </button>
          <button
            type="button"
            onClick={() => setIsRFQModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
          >
            <FileText className="h-4 w-4" /> Create RFQ
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {quickActions.map(qa => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              type="button"
              onClick={() => navigate(qa.href)}
              className="flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl ${qa.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`h-4 w-4 ${qa.color}`} />
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground text-center leading-tight group-hover:text-foreground transition-colors">{qa.label}</p>
            </button>
          );
        })}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              type="button"
              onClick={m.onClick}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{m.sub}</p>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Spend Chart + Top Vendors ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Monthly Procurement Spend</h3>
            <button
              type="button"
              onClick={() => navigate('/dashboard/procurement/spend')}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              Full Analysis <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={spendData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={v => [`$${Number(v).toLocaleString()}`, 'Spend']}
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="spend" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Top Vendor Performance</h3>
            <button
              type="button"
              onClick={() => navigate('/dashboard/procurement/vendors')}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Vendor
            </button>
          </div>
          <div className="space-y-2">
            {vendors.map(v => (
              <button
                key={v.name}
                type="button"
                onClick={() => setSelectedVendor(v)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{v.name}</p>
                  <p className="text-[11px] text-muted-foreground">{v.orders} orders · {v.spend}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className={`text-sm font-bold ${v.score >= 90 ? 'text-emerald-500' : v.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{v.score}</p>
                  <p className="text-[10px] text-muted-foreground">score</p>
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/procurement/vendors')}
            className="w-full mt-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-1"
          >
            View All Vendors <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Tabbed Data Table ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex gap-2">
            {([['orders', 'Purchase Orders'], ['vendors', 'Vendor Comparison'], ['rfq', 'RFQ Management']] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => { setActiveTab(id); setSearch(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-44"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'orders') navigate('/dashboard/procurement/orders');
                else if (activeTab === 'vendors') navigate('/dashboard/procurement/vendors');
                else navigate('/dashboard/procurement/rfq');
              }}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Purchase Orders Tab */}
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
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{po.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{po.vendor}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.items} items</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-foreground">{po.value}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{po.due}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={poStatusBadge(po.status)} size="sm">{po.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {po.status === 'Pending Review' && (
                          <button
                            type="button"
                            onClick={() => handleApprovePO(po.id)}
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedPO(po)}
                          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vendor Comparison Tab */}
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
                  <tr key={v.name} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedVendor(v)}>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{v.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-bold ${v.score >= 90 ? 'text-emerald-500' : v.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{v.score}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.onTime}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.orders}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{v.spend}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={v.status === 'Preferred' ? 'success' : v.status === 'Active' ? 'default' : 'warning'} size="sm">{v.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard/procurement/contracts')}
                          className="text-xs text-primary hover:underline font-semibold"
                        >
                          Contract
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedVendor(v)}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline font-semibold"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RFQ Tab */}
        {activeTab === 'rfq' && (
          <div className="p-5 space-y-3">
            {filteredRFQs.map(rfq => (
              <div key={rfq.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{rfq.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {rfq.id} · {rfq.vendors} vendors invited · {rfq.responses} responses · Deadline: {rfq.deadline}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <StatusBadge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Evaluating' ? 'warning' : 'default'} size="sm">
                    {rfq.status}
                  </StatusBadge>
                  <button
                    type="button"
                    onClick={() => setSelectedRFQ(rfq)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" /> View
                  </button>
                  {rfq.status === 'Evaluating' && (
                    <button
                      type="button"
                      onClick={() => handleAwardRFQ(rfq.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                    >
                      <Award className="h-3 w-3" /> Award
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsRFQModalOpen(true)}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Create New RFQ
            </button>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {isPOModalOpen && (
        <NewRequisitionModal
          vendors={vendors}
          onClose={() => setIsPOModalOpen(false)}
          onSubmit={handleCreatePO}
        />
      )}
      {isRFQModalOpen && (
        <NewRFQModal
          onClose={() => setIsRFQModalOpen(false)}
          onSubmit={handleCreateRFQ}
        />
      )}
      {selectedPO && (
        <PODetailModal
          po={selectedPO}
          onClose={() => setSelectedPO(null)}
          onApprove={handleApprovePO}
        />
      )}
      {selectedVendor && (
        <VendorModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onNavigate={() => navigate('/dashboard/procurement/vendors')}
        />
      )}
      {selectedRFQ && (
        <RFQModal
          rfq={selectedRFQ}
          onClose={() => setSelectedRFQ(null)}
          onAward={handleAwardRFQ}
          onNavigate={() => navigate('/dashboard/procurement/rfq')}
        />
      )}
    </div>
  );
}
