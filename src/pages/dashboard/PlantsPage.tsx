import { useState } from 'react';
import { Factory, Plus, MapPin, Users, Settings, Activity } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const PLANTS = [
  { id: 'PLT-001', name: 'Detroit Main Plant', location: 'Detroit, MI', lines: 8, employees: 640, output: '2,840 units/day', status: 'Operational', utilization: 92 },
  { id: 'PLT-002', name: 'Chicago Assembly', location: 'Chicago, IL', lines: 5, employees: 420, output: '1,680 units/day', status: 'Operational', utilization: 87 },
  { id: 'PLT-003', name: 'Houston Fabrication', location: 'Houston, TX', lines: 4, employees: 380, output: '1,240 units/day', status: 'Maintenance', utilization: 0 },
  { id: 'PLT-004', name: 'Cleveland Components', location: 'Cleveland, OH', lines: 3, employees: 290, output: '890 units/day', status: 'Operational', utilization: 78 },
];

export function PlantsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-foreground">Plant Management</h1><p className="text-sm text-muted-foreground mt-0.5">Manage multi-plant operations and configurations</p></div>
        <button onClick={() => toast.success('Add new plant wizard opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Plant</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANTS.map(plant => (
          <div key={plant.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer" onClick={() => toast.info(`Opening ${plant.name}`)}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Factory className="h-5 w-5 text-primary" /></div>
              <StatusBadge variant={plant.status === 'Operational' ? 'success' : 'warning'} size="sm">{plant.status}</StatusBadge>
            </div>
            <h3 className="font-bold text-foreground text-sm mb-1">{plant.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3"><MapPin className="h-3 w-3" />{plant.location}</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Production Lines</span><span className="font-semibold text-foreground">{plant.lines}</span></div>
              <div className="flex justify-between"><span>Employees</span><span className="font-semibold text-foreground">{plant.employees}</span></div>
              <div className="flex justify-between"><span>Daily Output</span><span className="font-semibold text-foreground">{plant.output}</span></div>
            </div>
            {plant.status === 'Operational' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Utilization</span><span className="font-semibold text-foreground">{plant.utilization}%</span></div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${plant.utilization}%` }} /></div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={e => { e.stopPropagation(); toast.info(`Opening ${plant.name} details`); }} className="flex-1 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">View Details</button>
              <button onClick={e => { e.stopPropagation(); toast.info(`Editing ${plant.name}`); }} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><Settings className="h-3.5 w-3.5 text-muted-foreground" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
