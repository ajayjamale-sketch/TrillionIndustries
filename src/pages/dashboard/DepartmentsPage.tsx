import { useState } from 'react';
import { Layers, Plus, ChevronRight, Users, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Department {
  id: string;
  name: string;
  head: string;
  employees: number;
  subDepts: string[];
  budget: string;
}

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP-001', name: 'Production', head: 'Sarah Mitchell', employees: 640, subDepts: ['Line A', 'Line B', 'Line C', 'Line D'], budget: '$1.2M' },
  { id: 'DEP-002', name: 'Procurement & Supply Chain', head: 'David Chen', employees: 48, subDepts: ['Purchasing', 'Vendor Relations', 'Logistics'], budget: '$800K' },
  { id: 'DEP-003', name: 'Warehouse & Inventory', head: 'Maria Rodriguez', employees: 180, subDepts: ['Receiving', 'Storage', 'Dispatch'], budget: '$320K' },
  { id: 'DEP-004', name: 'Maintenance & Engineering', head: 'James Williams', employees: 92, subDepts: ['Preventive PM', 'Electrical', 'Mechanical'], budget: '$250K' },
  { id: 'DEP-005', name: 'Quality Assurance', head: 'Thomas Anderson', employees: 56, subDepts: ['Inspection', 'CAPA', 'Compliance'], budget: '$180K' },
  { id: 'DEP-006', name: 'Finance & Compliance', head: 'Robert Kumar', employees: 24, subDepts: ['Accounting', 'Tax', 'Audit'], budget: '$450K' },
  { id: 'DEP-007', name: 'Human Resources', head: 'Patricia Lee', employees: 18, subDepts: ['Recruitment', 'Training', 'Payroll'], budget: '$280K' },
];

export function DepartmentsPage({ user }: { user: User }) {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [head, setHead] = useState('');
  const [employees, setEmployees] = useState(0);
  const [subDeptsText, setSubDeptsText] = useState('');
  const [budget, setBudget] = useState('');

  const openAddModal = () => {
    setEditingDept(null);
    setName('');
    setHead('');
    setEmployees(0);
    setSubDeptsText('');
    setBudget('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setHead(dept.head);
    setEmployees(dept.employees);
    setSubDeptsText(dept.subDepts.join(', '));
    setBudget(dept.budget);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !head.trim() || !budget.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const parsedSubDepts = subDeptsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (editingDept) {
      setDepartments(prev =>
        prev.map(d =>
          d.id === editingDept.id
            ? { ...d, name, head, employees, subDepts: parsedSubDepts, budget }
            : d
        )
      );
      toast.success('Department updated successfully');
    } else {
      const newDept: Department = {
        id: `DEP-00${departments.length + 1}`,
        name,
        head,
        employees,
        subDepts: parsedSubDepts,
        budget,
      };
      setDepartments(prev => [...prev, newDept]);
      toast.success('Department added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setDepartments(prev => prev.filter(d => d.id !== itemToDelete));
      toast.success('Department deleted successfully');
      if (expanded === itemToDelete) setExpanded(null);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Department Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Organizational hierarchy and department structure</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
        {departments.map(dept => (
          <div key={dept.id} className="group relative">
            <button onClick={() => setExpanded(expanded === dept.id ? null : dept.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left pr-24">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{dept.name}</p>
                <p className="text-xs text-muted-foreground">Head: {dept.head} · {dept.employees} employees</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{dept.budget}</span>
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === dept.id ? 'rotate-90' : ''}`} />
            </button>

            {/* Quick Actions (Absolute layout to maintain styling) */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); openEditModal(dept); }}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-colors"
                title="Edit Department"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(dept.id); }}
                className="p-1.5 rounded-lg border border-border bg-card text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete Department"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {expanded === dept.id && (
              <div className="px-5 pb-4 bg-muted/20 pt-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Functions / Sub-departments</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dept.subDepts.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">No sub-departments defined</span>
                  ) : (
                    dept.subDepts.map(sub => (
                      <span key={sub} className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:border-primary/30 cursor-pointer transition-colors">{sub}</span>
                    ))
                  )}
                </div>
                <div className="flex gap-4 pt-2 border-t border-border/50">
                  <button onClick={() => openEditModal(dept)} className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold">
                    <Edit className="h-3 w-3" />
                    Edit Department
                  </button>
                  <button onClick={() => toast.info(`Managing ${dept.name} employees`)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline">
                    <Users className="h-3 w-3" />
                    Manage Employees
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Department Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Quality Assurance"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Department Head *</label>
                <input
                  type="text"
                  value={head}
                  onChange={e => setHead(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Thomas Anderson"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Employees count</label>
                  <input
                    type="number"
                    value={employees}
                    onChange={e => setEmployees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Annual Budget *</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. $450K"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Sub-departments / Functions (Comma separated)</label>
                <input
                  type="text"
                  value={subDeptsText}
                  onChange={e => setSubDeptsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Inspection, CAPA, Compliance"
                />
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
        </div>
      )}

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
      />
    </div>
  );
}
