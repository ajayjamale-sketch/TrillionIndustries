import { useState } from 'react';
import { createPortal } from 'react-dom';
import { HardDrive, Plus, Search, MapPin, X, Settings } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  manufacturer: string;
  model: string;
  age: string;
  oee: number;
  health: 'Good' | 'Fair' | 'Critical';
  status: 'Operational' | 'Idle' | 'Alert' | 'Maintenance';
}

const INITIAL_ASSETS: Asset[] = [
  { id: 'AST-001', name: 'CNC Milling Center #1', type: 'Machine', location: 'Line A, Bay 1', manufacturer: 'Haas Automation', model: 'VF-4', age: '3 yrs', oee: 94, health: 'Good', status: 'Operational' },
  { id: 'AST-002', name: 'CNC Lathe #2', type: 'Machine', location: 'Line A, Bay 3', manufacturer: 'Mazak', model: 'QTN-200', age: '2 yrs', oee: 91, health: 'Good', status: 'Operational' },
  { id: 'AST-003', name: 'Hydraulic Press', type: 'Press', location: 'Line B, Bay 1', manufacturer: 'Schuler', model: 'HP-200', age: '5 yrs', oee: 88, health: 'Fair', status: 'Operational' },
  { id: 'AST-004', name: 'Robotic Welder', type: 'Robot', location: 'Line C, Bay 2', manufacturer: 'ABB', model: 'IRB-6700', age: '1 yr', oee: 0, health: 'Good', status: 'Idle' },
  { id: 'AST-005', name: 'CNC Milling Center #12', type: 'Machine', location: 'Line A, Bay 5', manufacturer: 'Haas', model: 'VF-4SS', age: '4 yrs', oee: 72, health: 'Critical', status: 'Alert' },
  { id: 'AST-006', name: 'Conveyor Belt Main', type: 'Conveyor', location: 'Line D, Floor', manufacturer: 'Interroll', model: 'RB300', age: '6 yrs', oee: 0, health: 'Fair', status: 'Maintenance' },
];

export function AssetRegistryPage({ user }: { user: User }) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Machine');
  const [location, setLocation] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [age, setAge] = useState('1 yr');
  const [health, setHealth] = useState<'Good' | 'Fair' | 'Critical'>('Good');
  const [status, setStatus] = useState<'Operational' | 'Idle' | 'Alert' | 'Maintenance'>('Operational');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !manufacturer.trim() || !model.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newAsset: Asset = {
      id: `AST-0${assets.length + 1}`,
      name,
      type,
      location,
      manufacturer,
      model,
      age,
      oee: status === 'Operational' ? 85 : 0,
      health,
      status
    };

    setAssets([...assets, newAsset]);
    setShowNew(false);
    toast.success(`Registered asset: ${name}`);

    // Reset Form
    setName('');
    setLocation('');
    setManufacturer('');
    setModel('');
  };

  const handleSchedulePM = (id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        toast.info(`Scheduling Preventive PM for ${a.name}`);
        return { ...a, status: 'Maintenance' };
      }
      return a;
    }));
  };

  const handleRaiseTicket = (id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        toast.success(`Emergency breakdown ticket logged for ${a.name}`);
        return { ...a, status: 'Alert', health: 'Critical' };
      }
      return a;
    }));
  };

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Asset Registry</h1>
          <p className="text-sm text-muted-foreground">{assets.length} registered equipment nodes</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Register Asset
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search machines, locations, tags..."
          className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(asset => (
          <div
            key={asset.id}
            className={`bg-card border rounded-xl p-4 transition-all flex flex-col justify-between ${
              asset.status === 'Alert' ? 'border-red-500/30' : 'border-border hover:border-primary/30 hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HardDrive className="h-4 w-4 text-primary" />
                </div>
                <StatusBadge
                  variant={
                    asset.status === 'Operational' ? 'success' :
                    asset.status === 'Alert' ? 'error' :
                    asset.status === 'Idle' ? 'warning' :
                    'default'
                  }
                  size="sm"
                >
                  {asset.status}
                </StatusBadge>
              </div>

              <p className="font-bold text-foreground text-sm mb-0.5">{asset.name}</p>
              <p className="text-xs text-muted-foreground mb-3">{asset.id} · {asset.type} · {asset.age} old</p>

              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <div className="flex justify-between">
                  <span>Manufacturer</span>
                  <span className="font-medium text-foreground">{asset.manufacturer} {asset.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium text-foreground">{asset.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Status</span>
                  <span className={`font-bold ${
                    asset.health === 'Good' ? 'text-emerald-500' :
                    asset.health === 'Critical' ? 'text-red-500' :
                    'text-amber-500'
                  }`}>
                    {asset.health}
                  </span>
                </div>
                {asset.oee > 0 && (
                  <div className="flex justify-between">
                    <span>OEE Efficiency</span>
                    <span className="font-bold text-foreground">{asset.oee}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 border-t border-border/40 pt-3 mt-1">
              <button
                onClick={() => handleSchedulePM(asset.id)}
                className="flex-1 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors text-foreground"
              >
                Schedule PM
              </button>
              {asset.status !== 'Alert' ? (
                <button
                  onClick={() => handleRaiseTicket(asset.id)}
                  className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Raise Alert
                </button>
              ) : (
                <span className="flex-1 py-1.5 rounded-lg bg-red-500/5 text-red-500 text-center text-xs font-bold border border-red-500/10">
                  Ticket Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Register Asset Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Register Machinery Asset</h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Asset Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Milling Center Haas"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Asset Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Machine">Machinery</option>
                    <option value="Press">Press Node</option>
                    <option value="Robot">Robotic Arm</option>
                    <option value="Conveyor">Conveyor Line</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Location Floor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Line B, Bay 4"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mazak"
                    value={manufacturer}
                    onChange={e => setManufacturer(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Model ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VF-4"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Asset Age</label>
                  <input
                    type="text"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Initial Health</label>
                  <select
                    value={health}
                    onChange={e => setHealth(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
