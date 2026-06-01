import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Users, Plus, Search, Edit, Eye, Mail, Trash2, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  email: string;
  dept: string;
  role: string;
  status: string;
  joined: string;
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Tom Bradley', email: 'tom.b@trillion.com', dept: 'Production', role: 'CNC Operator', status: 'Active', joined: 'Mar 2022' },
  { id: 'EMP-002', name: 'Alice Kim', email: 'alice.k@trillion.com', dept: 'Quality', role: 'Quality Inspector', status: 'Active', joined: 'Jun 2023' },
  { id: 'EMP-003', name: 'Mark Rahman', email: 'mark.r@trillion.com', dept: 'Maintenance', role: 'Mechanical Engineer', status: 'On Leave', joined: 'Jan 2021' },
  { id: 'EMP-004', name: 'Sara Liu', email: 'sara.l@trillion.com', dept: 'Warehouse', role: 'Warehouse Operator', status: 'Active', joined: 'Sep 2022' },
  { id: 'EMP-005', name: 'Chris Okafor', email: 'chris.o@trillion.com', dept: 'Production', role: 'Welder', status: 'Active', joined: 'Feb 2023' },
  { id: 'EMP-006', name: 'Priya Nair', email: 'priya.n@trillion.com', dept: 'Finance', role: 'Accountant', status: 'Active', joined: 'Nov 2022' },
  { id: 'EMP-007', name: 'Diego Martinez', email: 'diego.m@trillion.com', dept: 'Production', role: 'Line Supervisor', status: 'Active', joined: 'May 2020' },
];

const DEPTS = ['All', 'Production', 'Quality', 'Maintenance', 'Warehouse', 'Finance'];

export function EmployeesPage({ user }: { user: User }) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [viewingEmp, setViewingEmp] = useState<Employee | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDept, setSelectedDept] = useState('Production');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Active');
  const [joined, setJoined] = useState('');

  const filtered = employees.filter(e => 
    (dept === 'All' || e.dept === dept) && 
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingEmp(null);
    setName('');
    setEmail('');
    setSelectedDept('Production');
    setRole('');
    setStatus('Active');
    setJoined(new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmp(emp);
    setName(emp.name);
    setEmail(emp.email);
    setSelectedDept(emp.dept);
    setRole(emp.role);
    setStatus(emp.status);
    setJoined(emp.joined);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim() || !joined.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingEmp) {
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === editingEmp.id
            ? { ...emp, name, email, dept: selectedDept, role, status, joined }
            : emp
        )
      );
      toast.success('Employee record updated successfully');
    } else {
      const newEmp: Employee = {
        id: `EMP-00${employees.length + 1}`,
        name,
        email,
        dept: selectedDept,
        role,
        status,
        joined,
      };
      setEmployees(prev => [...prev, newEmp]);
      toast.success('Employee added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast.success('Employee deleted successfully');
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Employee Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{employees.length} total employees</p>
        </div>
        <button 
          type="button"
          onClick={openAddModal} 
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search employees..." 
            className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-56" 
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {DEPTS.map(d => (
            <button 
              key={d} 
              type="button"
              onClick={() => setDept(d)} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dept === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all relative group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {getInitials(emp.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{emp.name}</p>
                <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
              </div>
              <StatusBadge variant={emp.status === 'Active' ? 'success' : 'warning'} size="sm">{emp.status}</StatusBadge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <p>{emp.dept} · {emp.id}</p>
              <p className="truncate">{emp.email}</p>
              <p>Joined: {emp.joined}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setViewingEmp(emp)} 
                className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/70 transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </button>
              <button 
                type="button"
                onClick={() => openEditModal(emp)} 
                className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors" 
                title="Edit Employee"
              >
                <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button 
                type="button"
                onClick={() => handleDelete(emp.id)} 
                className="p-1.5 rounded-lg border border-border text-red-500 hover:bg-red-500/10 transition-colors" 
                title="Delete Employee"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">{editingEmp ? 'Edit Employee Info' : 'Add New Employee'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Thomas Anderson"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. thomas.a@trillion.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Department</label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Production">Production</option>
                    <option value="Quality">Quality</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Role/Designation *</label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. CNC Specialist"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Joined Date *</label>
                  <input
                    type="text"
                    value={joined}
                    onChange={e => setJoined(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Jun 2026"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Details View Modal */}
      {viewingEmp && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setViewingEmp(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-6">Employee Profile</h2>
            
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-3">
                {getInitials(viewingEmp.name)}
              </div>
              <h3 className="text-base font-bold text-foreground">{viewingEmp.name}</h3>
              <p className="text-sm text-muted-foreground">{viewingEmp.role}</p>
              <div className="mt-2">
                <StatusBadge variant={viewingEmp.status === 'Active' ? 'success' : 'warning'} size="sm">
                  {viewingEmp.status}
                </StatusBadge>
              </div>
            </div>

            <div className="py-4 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Employee ID</span>
                <span className="text-foreground font-semibold">{viewingEmp.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Department</span>
                <span className="text-foreground font-semibold">{viewingEmp.dept}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Email Address</span>
                <span className="text-foreground font-semibold truncate max-w-[240px]" title={viewingEmp.email}>
                  {viewingEmp.email}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Joining Date</span>
                <span className="text-foreground font-semibold">{viewingEmp.joined}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button 
                type="button" 
                onClick={() => {
                  setViewingEmp(null);
                  openEditModal(viewingEmp);
                }} 
                className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit className="h-4 w-4 text-muted-foreground" />
                Edit Profile
              </button>
              <button 
                type="button" 
                onClick={() => setViewingEmp(null)} 
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
