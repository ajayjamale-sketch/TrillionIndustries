import { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const SCHEDULE = [
  { id: 'PM-3341', asset: 'Hydraulic Press', type: 'Preventive', due: 'Jun 4', duration: '4h', priority: 'High', technician: 'J. Williams', status: 'Due' },
  { id: 'PM-3342', asset: 'CNC Milling #1', type: 'Lubrication', due: 'Jun 5', duration: '1h', priority: 'Medium', technician: 'M. Lopez', status: 'Scheduled' },
  { id: 'PM-3343', asset: 'Conveyor Belt', type: 'Inspection', due: 'Jun 6', duration: '2h', priority: 'Low', technician: 'T. Park', status: 'Scheduled' },
  { id: 'PM-3344', asset: 'CNC Lathe #2', type: 'Calibration', due: 'Jun 8', duration: '3h', priority: 'Medium', technician: 'J. Williams', status: 'Planned' },
  { id: 'PM-3340', asset: 'Robotic Welder', type: 'Full Service', due: 'Jun 2', duration: '8h', priority: 'High', technician: 'K. Singh', status: 'Completed' },
];

export function MaintenanceSchedulePage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Calendar className="h-5 w-5" />Maintenance Schedule</h1><p className="text-sm text-muted-foreground">Preventive maintenance calendar and task tracking</p></div>
        <button onClick={() => toast.success('New PM schedule created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Schedule PM</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Due This Week', value: '4', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' }, { label: 'Completed (MTD)', value: '18', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }, { label: 'PM Compliance', value: '94%', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' }].map(m => {
          const Icon = m.icon;
          return <div key={m.label} className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}><Icon className={`h-4 w-4 ${m.color}`} /></div><p className="text-xs text-muted-foreground">{m.label}</p></div><p className="text-2xl font-bold text-foreground">{m.value}</p></div>;
        })}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['PM ID', 'Asset', 'Type', 'Due Date', 'Duration', 'Priority', 'Technician', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {SCHEDULE.map(pm => (
                <tr key={pm.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{pm.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{pm.asset}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.type}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.due}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.duration}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold ${pm.priority === 'High' ? 'text-red-500' : pm.priority === 'Medium' ? 'text-amber-500' : 'text-muted-foreground'}`}>{pm.priority}</span></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.technician}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={pm.status === 'Completed' ? 'success' : pm.status === 'Due' ? 'error' : 'warning'} size="sm">{pm.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    {pm.status !== 'Completed' && <button onClick={() => toast.success(`${pm.id} marked as started`)} className="text-xs text-primary hover:underline">Start</button>}
                    {pm.status !== 'Completed' && <button onClick={() => toast.success(`${pm.id} completed`)} className="text-xs text-emerald-600 hover:underline">Complete</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
