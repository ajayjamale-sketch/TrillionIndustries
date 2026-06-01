import { useState } from 'react';
import { HardDrive, Plus, Search, Activity, Cpu, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const ASSETS = [
  { id: 'AST-001', name: 'CNC Milling Center #1', type: 'Machine', location: 'Line A, Bay 1', manufacturer: 'Haas Automation', model: 'VF-4', age: '3 yrs', oee: 94, health: 'Good', status: 'Operational' },
  { id: 'AST-002', name: 'CNC Lathe #2', type: 'Machine', location: 'Line A, Bay 3', manufacturer: 'Mazak', model: 'QTN-200', age: '2 yrs', oee: 91, health: 'Good', status: 'Operational' },
  { id: 'AST-003', name: 'Hydraulic Press', type: 'Press', location: 'Line B, Bay 1', manufacturer: 'Schuler', model: 'HP-200', age: '5 yrs', oee: 88, health: 'Fair', status: 'Operational' },
  { id: 'AST-004', name: 'Robotic Welder', type: 'Robot', location: 'Line C, Bay 2', manufacturer: 'ABB', model: 'IRB-6700', age: '1 yr', oee: 0, health: 'Good', status: 'Idle' },
  { id: 'AST-005', name: 'CNC Milling Center #12', type: 'Machine', location: 'Line A, Bay 5', manufacturer: 'Haas', model: 'VF-4SS', age: '4 yrs', oee: 72, health: 'Critical', status: 'Alert' },
  { id: 'AST-006', name: 'Conveyor Belt Main', type: 'Conveyor', location: 'Line D, Floor', manufacturer: 'Interroll', model: 'RB300', age: '6 yrs', oee: 0, health: 'Fair', status: 'Maintenance' },
];

export function AssetRegistryPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const filtered = ASSETS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Asset Registry</h1><p className="text-sm text-muted-foreground">{ASSETS.length} registered assets</p></div>
        <button onClick={() => toast.success('New asset registered')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Register Asset</button>
      </div>
      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full" /></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(asset => (
          <div key={asset.id} onClick={() => toast.info(`Viewing ${asset.name} details`)}
            className={`bg-card border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all ${asset.status === 'Alert' ? 'border-red-500/30' : 'border-border hover:border-primary/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><HardDrive className="h-4 w-4 text-primary" /></div>
              <StatusBadge variant={asset.status === 'Operational' ? 'success' : asset.status === 'Alert' ? 'error' : asset.status === 'Idle' ? 'warning' : 'default'} size="sm">{asset.status}</StatusBadge>
            </div>
            <p className="font-bold text-foreground text-sm mb-0.5">{asset.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{asset.id} · {asset.type} · {asset.age} old</p>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div className="flex justify-between"><span>Manufacturer</span><span className="font-medium text-foreground">{asset.manufacturer} {asset.model}</span></div>
              <div className="flex justify-between"><span>Location</span><span>{asset.location}</span></div>
              <div className="flex justify-between"><span>Health</span><span className={`font-bold ${asset.health === 'Good' ? 'text-emerald-500' : asset.health === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>{asset.health}</span></div>
              {asset.oee > 0 && <div className="flex justify-between"><span>OEE</span><span className="font-bold text-foreground">{asset.oee}%</span></div>}
            </div>
            <div className="flex gap-2">
              <button onClick={e => { e.stopPropagation(); toast.info(`Scheduling maintenance for ${asset.name}`); }} className="flex-1 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">Schedule PM</button>
              {asset.status === 'Alert' && <button onClick={e => { e.stopPropagation(); toast.success(`Breakdown ticket raised for ${asset.name}`); }} className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors">Raise Ticket</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
