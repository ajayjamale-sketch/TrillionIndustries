import { useState } from 'react';
import { Building2, Plus, Search, X, Star, TrendingUp, TrendingDown, Phone, Mail, Globe, MapPin, ShoppingCart, BarChart3, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Vendor {
  id: string; name: string; category: string; contact: string; phone: string;
  email: string; website: string; address: string;
  score: number; onTime: number; defectRate: number; responseTime: string;
  totalOrders: number; annualSpend: number;
  status: 'Preferred' | 'Active' | 'Under Review' | 'Suspended' | 'Inactive';
  since: string; certifications: string[];
  monthlySpend: { month: string; spend: number }[];
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VEN-001', name: 'SteelPro Ltd.', category: 'Raw Materials', contact: 'Mike Donovan',
    phone: '+91-98001-12345', email: 'm.donovan@steelpro.com', website: 'steelpro.com', address: 'Plot 14, MIDC, Pune - 411018',
    score: 94, onTime: 96, defectRate: 0.3, responseTime: '1.2 hrs',
    totalOrders: 48, annualSpend: 1200000, status: 'Preferred', since: 'Jan 2021',
    certifications: ['ISO 9001:2015', 'ISO 14001', 'OHSAS 18001'],
    monthlySpend: [{ month: 'Jan', spend: 95000 }, { month: 'Feb', spend: 88000 }, { month: 'Mar', spend: 112000 }, { month: 'Apr', spend: 98000 }, { month: 'May', spend: 105000 }, { month: 'Jun', spend: 118000 }],
  },
  {
    id: 'VEN-002', name: 'Hydraulic Systems Inc.', category: 'MRO', contact: 'Jane Cooper',
    phone: '+1-800-555-0091', email: 'j.cooper@hydrosys.com', website: 'hydrosys.com', address: '1200 Industrial Drive, Chicago, IL 60601',
    score: 87, onTime: 89, defectRate: 0.8, responseTime: '2.1 hrs',
    totalOrders: 22, annualSpend: 840000, status: 'Active', since: 'Mar 2022',
    certifications: ['ISO 9001:2015', 'ATEX Certified'],
    monthlySpend: [{ month: 'Jan', spend: 62000 }, { month: 'Feb', spend: 58000 }, { month: 'Mar', spend: 74000 }, { month: 'Apr', spend: 68000 }, { month: 'May', spend: 71000 }, { month: 'Jun', spend: 80000 }],
  },
  {
    id: 'VEN-003', name: 'Global Bearings', category: 'Components', contact: 'Peter Lau',
    phone: '+65-6321-7890', email: 'p.lau@globalbearings.com', website: 'globalbearings.com', address: '25 International Business Park, Singapore 609916',
    score: 91, onTime: 93, defectRate: 0.5, responseTime: '1.8 hrs',
    totalOrders: 35, annualSpend: 620000, status: 'Active', since: 'Jun 2021',
    certifications: ['ISO 9001:2015', 'IATF 16949'],
    monthlySpend: [{ month: 'Jan', spend: 48000 }, { month: 'Feb', spend: 44000 }, { month: 'Mar', spend: 56000 }, { month: 'Apr', spend: 50000 }, { month: 'May', spend: 54000 }, { month: 'Jun', spend: 67000 }],
  },
  {
    id: 'VEN-004', name: 'FastenTech Corp.', category: 'Hardware', contact: 'Amy Singh',
    phone: '+91-98765-43210', email: 'a.singh@fastentech.com', website: 'fastentech.com', address: 'B-45, Industrial Estate, Mumbai - 400072',
    score: 78, onTime: 82, defectRate: 1.4, responseTime: '3.5 hrs',
    totalOrders: 64, annualSpend: 410000, status: 'Under Review', since: 'Sep 2020',
    certifications: ['ISO 9001:2015'],
    monthlySpend: [{ month: 'Jan', spend: 30000 }, { month: 'Feb', spend: 28000 }, { month: 'Mar', spend: 38000 }, { month: 'Apr', spend: 32000 }, { month: 'May', spend: 35000 }, { month: 'Jun', spend: 42000 }],
  },
  {
    id: 'VEN-005', name: 'Polymer World', category: 'Raw Materials', contact: 'Carlos Ruiz',
    phone: '+52-555-0192', email: 'c.ruiz@polyworld.com', website: 'polyworld.mx', address: 'Av. Industrial 882, Monterrey, Mexico',
    score: 85, onTime: 88, defectRate: 0.9, responseTime: '2.4 hrs',
    totalOrders: 18, annualSpend: 290000, status: 'Active', since: 'Nov 2022',
    certifications: ['ISO 9001:2015', 'RoHS Compliant'],
    monthlySpend: [{ month: 'Jan', spend: 21000 }, { month: 'Feb', spend: 19000 }, { month: 'Mar', spend: 25000 }, { month: 'Apr', spend: 22000 }, { month: 'May', spend: 24000 }, { month: 'Jun', spend: 28000 }],
  },
];

function VendorCard({ vendor, onClick }: { vendor: Vendor; onClick: () => void }) {
  const statusVariant = vendor.status === 'Preferred' ? 'success' : vendor.status === 'Active' ? 'default' : vendor.status === 'Under Review' ? 'warning' : 'error';
  const scoreColor = vendor.score >= 90 ? 'text-emerald-500' : vendor.score >= 80 ? 'text-amber-500' : 'text-red-500';
  return (
    <div onClick={onClick} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5.5 w-5.5 text-primary" />
        </div>
        <StatusBadge variant={statusVariant} size="sm">{vendor.status}</StatusBadge>
      </div>
      <p className="font-bold text-foreground text-sm mb-0.5">{vendor.name}</p>
      <p className="text-xs text-muted-foreground mb-4">{vendor.category} · {vendor.contact}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/40 rounded-lg p-2.5">
          <p className="text-[10px] text-muted-foreground">Performance</p>
          <p className={`text-lg font-bold ${scoreColor}`}>{vendor.score}<span className="text-xs text-muted-foreground">/100</span></p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5">
          <p className="text-[10px] text-muted-foreground">On-Time Delivery</p>
          <p className="text-lg font-bold text-foreground">{vendor.onTime}%</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5">
          <p className="text-[10px] text-muted-foreground">Orders (YTD)</p>
          <p className="text-base font-bold text-foreground">{vendor.totalOrders}</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5">
          <p className="text-[10px] text-muted-foreground">Annual Spend</p>
          <p className="text-base font-bold text-foreground">${(vendor.annualSpend / 1000).toFixed(0)}K</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={e => { e.stopPropagation(); toast.success(`Creating new PO for ${vendor.name}`); }}
          className="flex-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1">
          <ShoppingCart className="h-3 w-3" /> New PO
        </button>
        <button onClick={e => { e.stopPropagation(); onClick(); }}
          className="flex-1 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}

function VendorProfileModal({ vendor, onClose, onUpdateStatus }: {
  vendor: Vendor; onClose: () => void; onUpdateStatus: (id: string, status: Vendor['status']) => void;
}) {
  const scoreColor = vendor.score >= 90 ? 'text-emerald-500' : vendor.score >= 80 ? 'text-amber-500' : 'text-red-500';
  const metrics = [
    { label: 'Performance Score', value: `${vendor.score}/100`, color: scoreColor },
    { label: 'On-Time Delivery', value: `${vendor.onTime}%`, color: vendor.onTime >= 95 ? 'text-emerald-500' : vendor.onTime >= 85 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Defect Rate', value: `${vendor.defectRate}%`, color: vendor.defectRate <= 0.5 ? 'text-emerald-500' : vendor.defectRate <= 1.0 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Response Time', value: vendor.responseTime, color: 'text-foreground' },
    { label: 'Total Orders (YTD)', value: vendor.totalOrders.toString(), color: 'text-foreground' },
    { label: 'Annual Spend', value: `$${(vendor.annualSpend / 1000).toFixed(0)}K`, color: 'text-foreground' },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{vendor.name}</p>
              <p className="text-xs text-muted-foreground">{vendor.id} · {vendor.category} · Partner since {vendor.since}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Phone, value: vendor.phone }, { icon: Mail, value: vendor.email },
              { icon: Globe, value: vendor.website }, { icon: MapPin, value: vendor.address },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {metrics.map(m => (
              <div key={m.label} className="bg-muted/30 rounded-xl p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase mb-0.5">{m.label}</p>
                <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Performance Rating</span>
              <span className={`text-xs font-bold ${scoreColor}`}>{vendor.score}/100</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${vendor.score >= 90 ? 'bg-emerald-500' : vendor.score >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${vendor.score}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground"><span>0</span><span>50</span><span>100</span></div>
          </div>

          {/* Monthly spend chart */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-3">Monthly Spend — Last 6 Months</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={vendor.monthlySpend}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Spend']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="spend" fill="#1E40AF" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Certifications */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Certifications & Compliance</p>
            <div className="flex flex-wrap gap-2">
              {vendor.certifications.map(c => (
                <span key={c} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
          <select value={vendor.status} onChange={e => { onUpdateStatus(vendor.id, e.target.value as Vendor['status']); }}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none">
            {(['Preferred', 'Active', 'Under Review', 'Suspended', 'Inactive'] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Close</button>
            <button onClick={() => { toast.success(`Creating new PO for ${vendor.name}`); onClose(); }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center gap-1.5 transition-colors">
              <ShoppingCart className="h-3.5 w-3.5" /> New PO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewVendorModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (v: Vendor) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !email.trim()) { toast.error('Name, contact and email are required'); return; }
    const v: Vendor = {
      id: `VEN-00${6 + Math.floor(Math.random() * 10)}`, name, category, contact, phone, email, website, address,
      score: 80, onTime: 90, defectRate: 1.0, responseTime: '2.0 hrs',
      totalOrders: 0, annualSpend: 0, status: 'Active',
      since: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      certifications: [],
      monthlySpend: [{ month: 'Jun', spend: 0 }],
    };
    onSubmit(v);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div><h3 className="font-bold text-foreground">Register New Vendor</h3><p className="text-xs text-muted-foreground mt-0.5">Add a new supplier to your vendor registry</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Company Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Apex Industrial Supplies Ltd." required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                  {['Raw Materials', 'MRO', 'Components', 'Hardware', 'Safety', 'Services', 'Capital Equipment'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Contact Person *</label>
                <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Full name" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@vendor.com" required
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91-98xxx-xxxxx"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Website</label>
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="vendor.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="City, Country"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Register Vendor</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function VendorsPage({ user }: { user: User }) {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Vendor['status']>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Vendor | null>(null);

  const filtered = vendors.filter(v =>
    (statusFilter === 'All' || v.status === statusFilter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()) || v.contact.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (v: Vendor) => {
    setVendors(prev => [...prev, v]);
    setShowNew(false);
    toast.success(`${v.name} registered — pending background verification`);
  };

  const handleUpdateStatus = (id: string, status: Vendor['status']) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    toast.success(`Vendor status updated to ${status}`);
  };

  const stats = {
    preferred: vendors.filter(v => v.status === 'Preferred').length,
    active: vendors.filter(v => v.status === 'Active').length,
    review: vendors.filter(v => v.status === 'Under Review').length,
    avgScore: Math.round(vendors.reduce((s, v) => s + v.score, 0) / vendors.length),
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Vendor Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your approved supplier registry and performance data</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" /> Register Vendor
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Preferred Suppliers', value: stats.preferred, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Vendors', value: stats.active, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Under Review', value: stats.review, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Avg. Score', value: stats.avgScore, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor, category, contact..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Preferred', 'Active', 'Under Review', 'Suspended'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg ml-auto">
          {(['cards', 'table'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors capitalize ${viewMode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 bg-card border border-border rounded-xl p-10 text-center text-muted-foreground text-xs">No vendors found.</div>
          ) : filtered.map(v => <VendorCard key={v.id} vendor={v} onClick={() => setSelected(v)} />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>{['Vendor', 'Category', 'Contact', 'Score', 'On-Time', 'Defect Rate', 'Orders', 'Spend', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5"><p className="text-xs font-bold text-foreground">{v.name}</p><p className="text-[10px] text-muted-foreground">{v.id}</p></td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.category}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.contact}</td>
                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: v.score >= 90 ? '#10b981' : v.score >= 80 ? '#f59e0b' : '#ef4444' }}>{v.score}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.onTime}%</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: v.defectRate <= 0.5 ? '#10b981' : v.defectRate <= 1 ? '#f59e0b' : '#ef4444' }}>{v.defectRate}%</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{v.totalOrders}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">${(v.annualSpend / 1000).toFixed(0)}K</td>
                    <td className="px-5 py-3.5"><StatusBadge variant={v.status === 'Preferred' ? 'success' : v.status === 'Active' ? 'default' : v.status === 'Under Review' ? 'warning' : 'error'} size="sm">{v.status}</StatusBadge></td>
                    <td className="px-5 py-3.5"><button onClick={() => setSelected(v)} className="text-xs text-primary hover:underline font-semibold">View Profile</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNew && <NewVendorModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {selected && <VendorProfileModal vendor={selected} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} />}
    </div>
  );
}
