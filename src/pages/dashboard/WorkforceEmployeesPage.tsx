import { Users, Plus, Search, Eye, Edit, Mail, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Employee {
  id: string;
  name: string;
  dept: string;
  shift: string;
  skills: string[];
  productivity: number;
  status: string;
  email: string;
  joined: string;
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Tom Bradley', dept: 'Production', shift: 'Day', skills: ['CNC Operation', 'QC Checking'], productivity: 96, status: 'Present', email: 't.bradley@trillion.com', joined: '2024-03-12' },
  { id: 'EMP-002', name: 'Alice Kim', dept: 'Quality', shift: 'Day', skills: ['QA Inspection', 'QMS/ISO'], productivity: 98, status: 'Present', email: 'a.kim@trillion.com', joined: '2024-05-18' },
  { id: 'EMP-003', name: 'Mark Rahman', dept: 'Maintenance', shift: 'Night', skills: ['PLC Coding', 'Hydraulics'], productivity: 89, status: 'On Leave', email: 'm.rahman@trillion.com', joined: '2023-11-05' },
  { id: 'EMP-004', name: 'Sara Liu', dept: 'Warehouse', shift: 'Day', skills: ['Forklift Certified', 'SAP WM'], productivity: 91, status: 'Present', email: 's.liu@trillion.com', joined: '2025-01-20' },
  { id: 'EMP-005', name: 'Chris Okafor', dept: 'Production', shift: 'Evening', skills: ['Mig Welding', 'Assembly Check'], productivity: 84, status: 'Late', email: 'c.okafor@trillion.com', joined: '2024-09-01' },
];

export function WorkforceEmployeesPage({ user }: { user: User }) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  // New Employee Form State
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Production');
  const [shift, setShift] = useState('Day');
  const [status, setStatus] = useState('Present');
  const [skills, setSkills] = useState('');
  const [productivity, setProductivity] = useState(90);
  const [email, setEmail] = useState('');

  // Details Edit States
  const [detailDept, setDetailDept] = useState('');
  const [detailShift, setDetailShift] = useState('');
  const [detailStatus, setDetailStatus] = useState('');
  const [detailProd, setDetailProd] = useState(90);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !skills.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const newEmp: Employee = {
      id: `EMP-00${employees.length + 1}`,
      name,
      dept,
      shift,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      productivity,
      status,
      email,
      joined: new Date().toISOString().slice(0, 10)
    };

    setEmployees([...employees, newEmp]);
    setShowNew(false);
    toast.success(`Registered employee: ${name}`);

    // Reset Form
    setName('');
    setEmail('');
    setSkills('');
    setProductivity(90);
  };

  const handleSaveDetails = () => {
    if (!selectedEmp) return;

    setEmployees(prev => prev.map(emp => {
      if (emp.id === selectedEmp.id) {
        const updated = {
          ...emp,
          dept: detailDept,
          shift: detailShift,
          status: detailStatus,
          productivity: detailProd
        };
        setSelectedEmp(updated);
        return updated;
      }
      return emp;
    }));

    toast.success(`Employee file updated successfully`);
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Employee Directory</h1>
          <p className="text-sm text-muted-foreground">Manage workforce profiles, assignments, and productivity records</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Add Employee
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search employees by ID, name or department..."
          className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-xs focus:outline-none w-full"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['Employee', 'Department', 'Shift', 'Skills', 'Productivity', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground">No employees found.</td>
                </tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{emp.dept}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{emp.shift}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.map(s => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${emp.productivity >= 90 ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{ width: `${emp.productivity}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold">{emp.productivity}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={emp.status === 'Present' ? 'success' : emp.status === 'Late' ? 'warning' : 'error'} size="sm">
                        {emp.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          setSelectedEmp(emp);
                          setDetailDept(emp.dept);
                          setDetailShift(emp.shift);
                          setDetailStatus(emp.status);
                          setDetailProd(emp.productivity);
                        }}
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Register Employee
              </h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tom Bradley"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. t.bradley@trillion.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Production">Production</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Quality">Quality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Shift</label>
                  <select
                    value={shift}
                    onChange={e => setShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Productivity (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={productivity}
                    onChange={e => setProductivity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC, Forklift, QMS"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Profile Modal */}
      {selectedEmp && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                {selectedEmp.id}
              </span>
              <button onClick={() => setSelectedEmp(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {getInitials(selectedEmp.name)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{selectedEmp.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {selectedEmp.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Department</label>
                  <select
                    value={detailDept}
                    onChange={e => setDetailDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="Production">Production</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Quality">Quality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Shift</label>
                  <select
                    value={detailShift}
                    onChange={e => setDetailShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Attendance</label>
                  <select
                    value={detailStatus}
                    onChange={e => setDetailStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1">Productivity %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={detailProd}
                    onChange={e => setDetailProd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase">Skills Inventory</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedEmp.skills.map(s => (
                    <span key={s} className="text-[10px] bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">Joined: {selectedEmp.joined}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedEmp(null)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
