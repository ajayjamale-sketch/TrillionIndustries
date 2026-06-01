import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardList, Plus, CheckCircle2, X, Search, UserCheck } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface MaintenanceWO {
  id: string;
  asset: string;
  task: string;
  assigned: string;
  est: string;
  due: string;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Planned';
}

const INITIAL_TASKS: MaintenanceWO[] = [
  { id: 'MT-881', asset: 'CNC Milling Center #12', task: 'Bearing inspection and replacement', assigned: 'James Williams', est: '4h', due: '2026-06-03', status: 'Assigned' },
  { id: 'MT-882', asset: 'Hydraulic Press HP-200', task: 'Hydraulic oil change and filter replacement', assigned: 'Tom Bradley', est: '2h', due: '2026-06-04', status: 'In Progress' },
  { id: 'MT-883', asset: 'Conveyor Belt Main', task: 'Belt tension adjustment check', assigned: 'Mark Rahman', est: '1h', due: '2026-06-02', status: 'Completed' },
  { id: 'MT-884', asset: 'CNC Milling Center #1', task: 'Spindle lubrication — quarterly PM checklist', assigned: 'James Williams', est: '1h', due: '2026-06-05', status: 'Planned' },
];

export function MaintenanceWorkOrdersPage({ user }: { user: User }) {
  const [tasks, setTasks] = useState<MaintenanceWO[]>(INITIAL_TASKS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [asset, setAsset] = useState('');
  const [task, setTask] = useState('');
  const [assigned, setAssigned] = useState('');
  const [est, setEst] = useState('2h');
  const [due, setDue] = useState('');
  const [status, setStatus] = useState<'Assigned' | 'In Progress' | 'Completed' | 'Planned'>('Assigned');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim() || !task.trim() || !assigned.trim() || !due) {
      toast.error('Please enter all required fields');
      return;
    }

    const newWO: MaintenanceWO = {
      id: `MT-${880 + tasks.length + 5}`,
      asset,
      task,
      assigned,
      est,
      due,
      status
    };

    setTasks([newWO, ...tasks]);
    setShowNew(false);
    toast.success(`Work Order ${newWO.id} issued successfully`);

    // Reset Form
    setAsset('');
    setTask('');
    setAssigned('');
    setDue('');
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        toast.success(`Work Order ${id} marked completed`);
        return { ...t, status: 'Completed' };
      }
      return t;
    }));
  };

  const handleStartTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        toast.info(`Work started on task ${id}`);
        return { ...t, status: 'In Progress' };
      }
      return t;
    }));
  };

  const filtered = tasks.filter(t =>
    t.asset.toLowerCase().includes(search.toLowerCase()) ||
    t.task.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />Maintenance Work Orders
          </h1>
          <p className="text-sm text-muted-foreground">Assign, track and verify maintenance repair checklists</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />New Work Order
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search work orders by ID, asset or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center bg-card border border-border p-8 rounded-xl text-muted-foreground">
            No work orders matching search parameters.
          </div>
        ) : (
          filtered.map(t => (
            <div
              key={t.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-4 flex-wrap"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
              }`}>
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-muted-foreground font-semibold">{t.id}</span>
                </div>
                <p className="text-sm font-bold text-foreground leading-snug">{t.asset} — {t.task}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Assigned Tech: {t.assigned} · Est Spans: {t.est} · Target Due: {t.due}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <StatusBadge
                  variant={
                    t.status === 'Completed' ? 'success' :
                    t.status === 'In Progress' ? 'warning' :
                    t.status === 'Assigned' ? 'default' :
                    'default'
                  }
                  size="sm"
                >
                  {t.status}
                </StatusBadge>
                {t.status !== 'Completed' && (
                  <div className="flex gap-1.5">
                    {t.status !== 'In Progress' && (
                      <button
                        onClick={() => handleStartTask(t.id)}
                        className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => handleCompleteTask(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Work Order Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Issue Repair Work Order</h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Target Machine *</label>
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
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Assigned Mechanic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James Williams"
                    value={assigned}
                    onChange={e => setAssigned(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Task Scope *</label>
                  <input
                    type="text"
                    required
                    placeholder="Describe maintenance scope / repairs required"
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Est Hours (e.g. 4h)</label>
                  <input
                    type="text"
                    value={est}
                    onChange={e => setEst(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
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
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
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
                  Issue Work Order
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
