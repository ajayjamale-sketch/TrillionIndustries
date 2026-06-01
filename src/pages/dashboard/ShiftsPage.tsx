import { Calendar, Plus, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Shift {
  id: string;
  shift: string;
  dept: string;
  employees: number;
  coverage: number;
  supervisor: string;
  status: string;
}

const INITIAL_SHIFTS: Shift[] = [
  { id: 'SH-01', shift: 'Day (6AM–2PM)', dept: 'Production', employees: 420, coverage: 98, supervisor: 'J. Smith', status: 'Active' },
  { id: 'SH-02', shift: 'Evening (2PM–10PM)', dept: 'Production', employees: 380, coverage: 95, supervisor: 'R. Patel', status: 'Active' },
  { id: 'SH-03', shift: 'Night (10PM–6AM)', dept: 'Production', employees: 290, coverage: 91, supervisor: 'L. Garcia', status: 'Active' },
  { id: 'SH-04', shift: 'Day (6AM–2PM)', dept: 'Warehouse', employees: 180, coverage: 100, supervisor: 'M. Chan', status: 'Active' },
  { id: 'SH-05', shift: 'Day (6AM–2PM)', dept: 'Maintenance', employees: 42, coverage: 88, supervisor: 'J. Williams', status: 'Understaffed' },
];

export function ShiftsPage({ user }: { user: User }) {
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [showNew, setShowNew] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Form State
  const [shiftTime, setShiftTime] = useState('Day (6AM–2PM)');
  const [dept, setDept] = useState('Production');
  const [employees, setEmployees] = useState(10);
  const [coverage, setCoverage] = useState(100);
  const [supervisor, setSupervisor] = useState('');
  const [status, setStatus] = useState('Active');

  // Edit State
  const [detailSupervisor, setDetailSupervisor] = useState('');
  const [detailCoverage, setDetailCoverage] = useState(100);
  const [detailStatus, setDetailStatus] = useState('Active');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisor.trim()) {
      toast.error('Please enter a supervisor');
      return;
    }

    const newShift: Shift = {
      id: `SH-${shifts.length + 1}`,
      shift: shiftTime,
      dept,
      employees,
      coverage,
      supervisor,
      status
    };

    setShifts([...shifts, newShift]);
    setShowNew(false);
    toast.success(`New Shift scheduled under ${supervisor}`);

    // Reset Form
    setSupervisor('');
  };

  const handleSaveDetails = () => {
    if (!selectedShift) return;

    setShifts(prev => prev.map(s => {
      if (s.id === selectedShift.id) {
        const updated = {
          ...s,
          supervisor: detailSupervisor,
          coverage: detailCoverage,
          status: detailStatus
        };
        setSelectedShift(updated);
        return updated;
      }
      return s;
    }));

    toast.success(`Shift ${selectedShift.id} configurations saved`);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />Shift Scheduling
          </h1>
          <p className="text-sm text-muted-foreground">Manage rosters, supervisor assignments, and coverage percentages</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Create Shift
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['Shift ID', 'Shift Slot', 'Department', 'Employees', 'Coverage', 'Supervisor', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shifts.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground font-semibold">{s.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{s.shift}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.dept}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{s.employees}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.coverage >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${s.coverage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold">{s.coverage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.supervisor}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${s.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <button
                      onClick={() => {
                        setSelectedShift(s);
                        setDetailSupervisor(s.supervisor);
                        setDetailCoverage(s.coverage);
                        setDetailStatus(s.status);
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Edit Shift
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shift Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Create Shift Roster
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Shift Time *</label>
                  <select
                    value={shiftTime}
                    onChange={e => setShiftTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Day (6AM–2PM)">Day (6AM–2PM)</option>
                    <option value="Evening (2PM–10PM)">Evening (2PM–10PM)</option>
                    <option value="Night (10PM–6AM)">Night (10PM–6AM)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Production">Production</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Quality">Quality</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Assigned Employees</label>
                  <input
                    type="number"
                    min="1"
                    value={employees}
                    onChange={e => setEmployees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Supervisor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Aurelius"
                    value={supervisor}
                    onChange={e => setSupervisor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Coverage Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={coverage}
                    onChange={e => setCoverage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Shift Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Understaffed">Understaffed</option>
                    <option value="Standby">Standby</option>
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
                  Schedule Shift
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Shift Modal */}
      {selectedShift && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                Shift: {selectedShift.id}
              </span>
              <button onClick={() => setSelectedShift(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Shift Parameters</h4>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedShift.shift} ({selectedShift.dept})</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1">Supervisor</label>
                <input
                  type="text"
                  value={detailSupervisor}
                  onChange={e => setDetailSupervisor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Coverage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={detailCoverage}
                    onChange={e => setDetailCoverage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Status</label>
                  <select
                    value={detailStatus}
                    onChange={e => setDetailStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Understaffed">Understaffed</option>
                    <option value="Standby">Standby</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
              <button
                onClick={() => setSelectedShift(null)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveShift}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
              >
                Save configurations
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
