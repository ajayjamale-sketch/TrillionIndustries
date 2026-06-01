import { useState } from 'react';
import { 
  Network, Truck, AlertTriangle, CheckCircle2, Clock, 
  MapPin, Plus, Search, Eye, Filter, ArrowRight, X, 
  Globe, TrendingUp, DollarSign, Package, Bot, Zap, Edit, Compass
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Pending';
  progress: number;
  eta: string;
  itemsCount: number;
  value: string;
}

const INITIAL_SHIPMENTS: Shipment[] = [
  { id: 'SH-9011', origin: 'Detroit Hub', destination: 'Chicago Assembly', carrier: 'FedEx Freight', status: 'In Transit', progress: 65, eta: 'Jun 2 (4:00 PM)', itemsCount: 1500, value: '$45,000' },
  { id: 'SH-9012', origin: 'Houston Fabricators', destination: 'Detroit Main Plant', carrier: 'DHL Logistics', status: 'Delayed', progress: 40, eta: 'Jun 3 (9:00 AM)', itemsCount: 820, value: '$128,000' },
  { id: 'SH-9013', origin: 'Rotterdam Port (EU)', destination: 'New York Port', carrier: 'Maersk Line', status: 'In Transit', progress: 85, eta: 'Jun 4 (11:00 AM)', itemsCount: 4500, value: '$550,000' },
  { id: 'SH-9014', origin: 'Cleveland Components', destination: 'Chicago Assembly', carrier: 'UPS Ground', status: 'Delivered', progress: 100, eta: 'Delivered', itemsCount: 600, value: '$18,500' },
  { id: 'SH-9015', origin: 'San Jose Electronics', destination: 'Houston Fabrication', carrier: 'Swift Trans', status: 'Pending', progress: 0, eta: 'Jun 6 (2:00 PM)', itemsCount: 2200, value: '$92,000' },
];

const performanceData = [
  { month: 'Jan', otd: 94, delayed: 6 },
  { month: 'Feb', otd: 92, delayed: 8 },
  { month: 'Mar', otd: 95, delayed: 5 },
  { month: 'Apr', otd: 97, delayed: 3 },
  { month: 'May', otd: 93, delayed: 7 },
  { month: 'Jun', otd: 96, delayed: 4 },
];

export function SupplyChainPage({ user }: { user: User }) {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [trackingShipment, setTrackingShipment] = useState<Shipment | null>(null);

  // Form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [carrier, setCarrier] = useState('');
  const [status, setStatus] = useState<'In Transit' | 'Delayed' | 'Delivered' | 'Pending'>('Pending');
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState('');
  const [itemsCount, setItemsCount] = useState(100);
  const [value, setValue] = useState('');

  const filteredShipments = shipments.filter(s => {
    const matchesFilter = filter === 'All' || s.status === filter;
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.origin.toLowerCase().includes(search.toLowerCase()) ||
                          s.destination.toLowerCase().includes(search.toLowerCase()) ||
                          s.carrier.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openAddModal = () => {
    setEditingShipment(null);
    setOrigin('');
    setDestination('');
    setCarrier('');
    setStatus('Pending');
    setProgress(0);
    setEta('');
    setItemsCount(100);
    setValue('');
    setIsModalOpen(true);
  };

  const openEditModal = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setOrigin(shipment.origin);
    setDestination(shipment.destination);
    setCarrier(shipment.carrier);
    setStatus(shipment.status);
    setProgress(shipment.progress);
    setEta(shipment.eta);
    setItemsCount(shipment.itemsCount);
    setValue(shipment.value);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim() || !carrier.trim() || !value.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingShipment) {
      setShipments(prev =>
        prev.map(s =>
          s.id === editingShipment.id
            ? { ...s, origin, destination, carrier, status, progress: status === 'Delivered' ? 100 : progress, eta: status === 'Delivered' ? 'Delivered' : eta, itemsCount, value }
            : s
        )
      );
      toast.success(`Shipment ${editingShipment.id} updated`);
    } else {
      const newShipment: Shipment = {
        id: `SH-${9000 + shipments.length + 12}`,
        origin,
        destination,
        carrier,
        status,
        progress: status === 'Delivered' ? 100 : progress,
        eta: status === 'Delivered' ? 'Delivered' : eta,
        itemsCount,
        value,
      };
      setShipments(prev => [...prev, newShipment]);
      toast.success(`Shipment ${newShipment.id} created successfully`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete Shipment ${id}?`)) {
      setShipments(prev => prev.filter(s => s.id !== id));
      toast.success(`Shipment ${id} removed`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Supply Chain Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">End-to-end logistics tracking and network operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
          >
            <Plus className="h-4 w-4" />
            Create Shipment
          </button>
        </div>
      </div>

      {/* AI Assistant Banner */}
      <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-4 w-4 text-blue-500" />
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">AI LOGISTICS COPILOT — Network Optimizer</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-background/60 rounded-lg p-3 flex gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <p className="text-xs font-bold text-foreground">Weather Delay Pre-emption</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Storm system approaching Cleveland Hub. Recommended rerouting SH-9012 through Cincinnati bypassing Northern route to save 12 hours.
              </p>
            </div>
          </div>
          <div className="bg-background/60 rounded-lg p-3 flex gap-2.5">
            <Zap className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
            <div>
              <p className="text-xs font-bold text-foreground">Carrier Efficiency Suggestion</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                FedEx Freight currently showing 98.4% on-time delivery on mid-west lanes. Reallocate 15% pending load from UPS for higher efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: `${shipments.filter(s => s.status !== 'Delivered').length}`, change: 'Live Tracking', trend: 'up', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'On-Time Rate (OTD)', value: '96.2%', change: '+1.4% WoW', trend: 'up', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Transit Value', value: '$815K', change: '5 Active loads', trend: 'up', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Carrier Scorecard', value: '94/100', change: '8 Carriers active', trend: 'up', icon: Compass, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Map / Hub Flow Visualization & On-time performance */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Supply Network Flow</h3>
          <div className="relative border border-border/80 rounded-xl p-4 bg-muted/10 space-y-6">
            <div className="flex justify-between items-center relative">
              <div className="flex flex-col items-center bg-card border border-border px-3 py-2 rounded-xl text-center shadow-sm w-24">
                <Globe className="h-4 w-4 text-indigo-500 mb-1" />
                <span className="text-[10px] font-bold">Rotterdam Port</span>
                <span className="text-[9px] text-muted-foreground">Supplier</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-border mx-2 relative flex items-center justify-center">
                <Truck className="h-3.5 w-3.5 text-muted-foreground absolute" />
              </div>
              <div className="flex flex-col items-center bg-card border border-border px-3 py-2 rounded-xl text-center shadow-sm w-24">
                <MapPin className="h-4 w-4 text-blue-500 mb-1" />
                <span className="text-[10px] font-bold">New York Hub</span>
                <span className="text-[9px] text-muted-foreground">Port of Entry</span>
              </div>
            </div>

            <div className="flex justify-between items-center relative">
              <div className="flex flex-col items-center bg-card border border-border px-3 py-2 rounded-xl text-center shadow-sm w-24">
                <MapPin className="h-4 w-4 text-blue-500 mb-1" />
                <span className="text-[10px] font-bold">New York Hub</span>
                <span className="text-[9px] text-muted-foreground">Port of Entry</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-border mx-2 relative flex items-center justify-center">
                <Truck className="h-3.5 w-3.5 text-emerald-500 absolute animate-pulse" />
              </div>
              <div className="flex flex-col items-center bg-card border border-border px-3 py-2 rounded-xl text-center shadow-sm w-24">
                <MapPin className="h-4 w-4 text-orange-500 mb-1" />
                <span className="text-[10px] font-bold">Detroit Plant</span>
                <span className="text-[9px] text-muted-foreground">Primary Plant</span>
              </div>
            </div>

            <div className="flex justify-between items-center relative">
              <div className="flex flex-col items-center bg-card border border-border px-3 py-2 rounded-xl text-center shadow-sm w-24">
                <MapPin className="h-4 w-4 text-orange-500 mb-1" />
                <span className="text-[10px] font-bold">Detroit Plant</span>
                <span className="text-[9px] text-muted-foreground">Assembly</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-border mx-2 relative flex items-center justify-center">
                <Truck className="h-3.5 w-3.5 text-muted-foreground absolute" />
              </div>
              <div className="flex flex-col items-center bg-card border border-border px-3 py-2 rounded-xl text-center shadow-sm w-24">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mb-1" />
                <span className="text-[10px] font-bold">Chicago Hub</span>
                <span className="text-[9px] text-muted-foreground">Distribution</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">On-Time Performance vs Delayed</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="otdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="otd" stroke="#10B981" fill="url(#otdGrad)" strokeWidth={2} name="On-Time Delivery (%)" />
              <Area type="monotone" dataKey="delayed" stroke="#EF4444" fill="none" strokeWidth={1.5} name="Delayed (%)" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shipment Shipments Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-5 py-4 border-b border-border gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">Active Shipments Log</h3>
            <span className="text-xs text-muted-foreground">({filteredShipments.length} found)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="text" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search shipments..." 
                className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none w-48"
              />
            </div>
            <div className="flex items-center gap-1">
              {['All', 'In Transit', 'Delayed', 'Delivered', 'Pending'].map(s => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => setFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Shipment ID</th>
                <th className="text-left px-5 py-3 font-medium">Route (Origin → Destination)</th>
                <th className="text-left px-5 py-3 font-medium">Carrier</th>
                <th className="text-left px-5 py-3 font-medium">ETA</th>
                <th className="text-left px-5 py-3 font-medium">Progress</th>
                <th className="text-left px-5 py-3 font-medium">Items / Value</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredShipments.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-muted-foreground">{s.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-foreground">{s.origin} → {s.destination}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{s.carrier}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{s.eta}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.status === 'Delivered' ? 'bg-emerald-500' : s.status === 'Delayed' ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <p className="text-foreground">{s.itemsCount} units</p>
                    <p className="text-[10px] text-muted-foreground">{s.value}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge variant={s.status === 'Delivered' ? 'success' : s.status === 'Delayed' ? 'error' : s.status === 'Pending' ? 'warning' : 'default'} size="sm">
                      {s.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setTrackingShipment(s)}
                        className="p-1 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                        title="Track Shipment"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => openEditModal(s)}
                        className="p-1 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                        title="Edit Shipment"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="p-1 rounded-lg border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete Shipment"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">{editingShipment ? 'Edit Shipment Info' : 'Create Live Shipment'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Origin *</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Detroit Hub"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Destination *</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Houston Fabrication"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Carrier Name *</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={e => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. FedEx Logistics"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Items Qty</label>
                  <input
                    type="number"
                    value={itemsCount}
                    onChange={e => setItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Value (USD) *</label>
                  <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. $45,000"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">ETA Details</label>
                  <input
                    type="text"
                    value={eta}
                    onChange={e => setEta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Jun 12 (3:00 PM)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Progress ({progress}%)</label>
                <input
                  type="range"
                  value={progress}
                  onChange={e => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer mt-3"
                  min="0"
                  max="100"
                  disabled={status === 'Delivered'}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Track Shipment Modal */}
      {trackingShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
            <button type="button" onClick={() => setTrackingShipment(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-foreground">Live Telematics — {trackingShipment.id}</h2>
              <p className="text-xs text-muted-foreground">{trackingShipment.carrier} load · {trackingShipment.value}</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-muted/40 border border-border rounded-xl">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Active Route</p>
                <p className="text-xs font-bold">{trackingShipment.origin} → {trackingShipment.destination}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">Shipment Progress</p>
                <div className="relative pl-6 space-y-4 border-l border-border/80 ml-2.5">
                  <div className="relative">
                    <span className={`w-3.5 h-3.5 rounded-full absolute -left-[31px] border-2 border-background flex items-center justify-center ${trackingShipment.progress >= 100 ? 'bg-emerald-500' : 'bg-muted'}`} />
                    <p className="text-xs font-bold text-foreground">Delivered</p>
                    <p className="text-[10px] text-muted-foreground">Arrived at destination facility</p>
                  </div>
                  <div className="relative">
                    <span className={`w-3.5 h-3.5 rounded-full absolute -left-[31px] border-2 border-background flex items-center justify-center ${trackingShipment.progress >= 50 ? 'bg-primary' : 'bg-muted'}`} />
                    <p className="text-xs font-bold text-foreground">In Transit</p>
                    <p className="text-[10px] text-muted-foreground">Departed gateway terminal</p>
                  </div>
                  <div className="relative">
                    <span className="w-3.5 h-3.5 rounded-full absolute -left-[31px] border-2 border-background bg-primary flex items-center justify-center" />
                    <p className="text-xs font-bold text-foreground">Shipment Initiated</p>
                    <p className="text-[10px] text-muted-foreground">Carrier dispatched from origin</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setTrackingShipment(null)} 
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
