import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Plus, Clock, CheckCircle2, X, Search } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface PMTask {
  id: string;
  asset: string;
  type: string;
  due: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  technician: string;
  status: 'Completed' | 'Due' | 'Scheduled' | 'In Progress';
}

const INITIAL_SCHEDULE: PMTask[] = [
  { id: 'PM-3341', asset: 'Hydraulic Press', type: 'Preventive PM', due: '2026-06-04', duration: '4h', priority: 'High', technician: 'James Williams', status: 'Due' },
  { id: 'PM-3342', asset: 'CNC Milling Center #1', type: 'Lubrication Check', due: '2026-06-05', duration: '1h', priority: 'Medium', technician: 'Tom Bradley', status: 'Scheduled' },
  { id: 'PM-3343', asset: 'Conveyor Belt Main', type: 'Visual Inspection', due: '2026-06-06', duration: '2h', priority: 'Low', technician: 'Mark Rahman', status: 'Scheduled' },
  { id: 'PM-3344', asset: 'CNC Lathe #2', type: 'Calibration Rerun', due: '2026-06-08', duration: '3h', priority: 'Medium', technician: 'James Williams', status: 'Due' },
  { id: 'PM-3340', asset: 'Robotic Welder', type: 'Full Overhaul Service', due: '2026-06-02', duration: '8h', priority: 'High', technician: 'Chris Okafor', status: 'Completed' },
];

export function MaintenanceSchedulePage({ user }: { user: User }) {
  const [schedule, setSchedule] = useState<PMTask[]>(INITIAL_SCHEDULE);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [asset, setAsset] = useState('');
  const [type, setType] = useState('Preventive PM');
  const [due, setDue] = useState('');
  const [duration, setDuration] = useState('2h');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [technician, setTechnician] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim() || !due || !technician.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newTask: PMTask = {
      id: `PM-${3340 + schedule.length + 1}`,
      asset,
      type,
      due,
      duration,
      priority,
      technician,
      status: 'Scheduled'
    };

    setSchedule([newTask, ...schedule]);
    setShowNew(false);
    toast.success(`PM Scheduled successfully: ${newTask.id}`);

    // Reset Form
    setAsset('');
    setDue('');
    setTechnician('');
  };

  const handleStart = (id: string) => {
    setSchedule(prev => prev.map(item => {
      if (item.id === id) {
        toast.info(`Work started on task ${id}`);
        return { ...item, status: 'In Progress' };
      }
      return item;
    }));
  };

  const handleComplete = (id: string) => {
    setSchedule(prev => prev.map(item => {
      if (item.id === id) {
        toast.success(`Task ${id} marked completed`);
        return { ...item, status: 'Completed' };
      }
      return item;
    }));
  };

  const filtered = schedule.filter(item =>
    item.asset.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const complianceVal = Math.round((schedule.filter(s => s.status === 'Completed').length / schedule.length) * 100);

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />Maintenance Schedule
          </h1>
          <p className="text-sm text-muted-foreground">Preventive maintenance calendar and calibration task dispatcher</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Schedule PM
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Due This Week', value: schedule.filter(s => s.status === 'Due').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Completed (MTD)', value: schedule.filter(s => s.status === 'Completed').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'PM Compliance Index', value: `${complianceVal}%`, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' }
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-lg font-bold text-foreground">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scheduled tasks by ID, asset or program..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['PM ID', 'Asset', 'Inspection Program', 'Due Date', 'Duration', 'Priority', 'Technician', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-muted-foreground">No tasks scheduled.</td>
                </tr>
              ) : (
                filtered.map(pm => (
                  <tr key={pm.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground font-semibold">{pm.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{pm.asset}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.type}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.due}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.duration}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${
                        pm.priority === 'High' ? 'text-red-500' :
                        pm.priority === 'Medium' ? 'text-amber-500' :
                        'text-muted-foreground'
                      }`}>
                        {pm.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{pm.technician}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        variant={
                          pm.status === 'Completed' ? 'success' :
                          pm.status === 'Due' ? 'error' :
                          pm.status === 'In Progress' ? 'warning' :
                          'default'
                        }
                        size="sm"
                      >
                        {pm.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {pm.status !== 'Completed' ? (
                        <div className="flex gap-2">
                          {pm.status !== 'In Progress' && (
                            <button
                              onClick={() => handleStart(pm.id)}
                              className="text-primary hover:underline font-bold"
                            >
                              Start
                            </button>
                          )}
                          <button
                            onClick={() => handleComplete(pm.id)}
                            className="text-emerald-600 hover:underline font-bold"
                          >
                            Complete
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground font-semibold">Archived</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule PM Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Schedule PM Task</h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Target Machinery *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Lathe #2"
                    value={asset}
                    onChange={e => setAsset(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">PM Program Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Preventive PM">Preventive PM</option>
                    <option value="Lubrication Check">Lubrication Check</option>
                    <option value="Visual Inspection">Visual Inspection</option>
                    <option value="Calibration Rerun">Calibration Rerun</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={due}
                    onChange={e => setDue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Assigned Mechanic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James Williams"
                    value={technician}
                    onChange={e => setTechnician(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
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
                  Schedule
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
