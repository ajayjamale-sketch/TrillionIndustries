import { useState } from 'react';
import { Layers, Plus, ChevronRight, Users, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const DEPARTMENTS = [
  { id: 'DEP-001', name: 'Production', head: 'Sarah Mitchell', employees: 640, subDepts: ['Line A', 'Line B', 'Line C', 'Line D'], budget: '$1.2M' },
  { id: 'DEP-002', name: 'Procurement & Supply Chain', head: 'David Chen', employees: 48, subDepts: ['Purchasing', 'Vendor Relations', 'Logistics'], budget: '$800K' },
  { id: 'DEP-003', name: 'Warehouse & Inventory', head: 'Maria Rodriguez', employees: 180, subDepts: ['Receiving', 'Storage', 'Dispatch'], budget: '$320K' },
  { id: 'DEP-004', name: 'Maintenance & Engineering', head: 'James Williams', employees: 92, subDepts: ['Preventive PM', 'Electrical', 'Mechanical'], budget: '$250K' },
  { id: 'DEP-005', name: 'Quality Assurance', head: 'Thomas Anderson', employees: 56, subDepts: ['Inspection', 'CAPA', 'Compliance'], budget: '$180K' },
  { id: 'DEP-006', name: 'Finance & Compliance', head: 'Robert Kumar', employees: 24, subDepts: ['Accounting', 'Tax', 'Audit'], budget: '$450K' },
  { id: 'DEP-007', name: 'Human Resources', head: 'Patricia Lee', employees: 18, subDepts: ['Recruitment', 'Training', 'Payroll'], budget: '$280K' },
];

export function DepartmentsPage({ user }: { user: User }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-foreground">Department Management</h1><p className="text-sm text-muted-foreground mt-0.5">Organizational hierarchy and department structure</p></div>
        <button onClick={() => toast.success('New department form opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Department</button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
        {DEPARTMENTS.map(dept => (
          <div key={dept.id}>
            <button onClick={() => setExpanded(expanded === dept.id ? null : dept.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Layers className="h-4 w-4 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{dept.name}</p>
                <p className="text-xs text-muted-foreground">Head: {dept.head} · {dept.employees} employees</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{dept.budget}</span>
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === dept.id ? 'rotate-90' : ''}`} />
            </button>
            {expanded === dept.id && (
              <div className="px-5 pb-4 bg-muted/20">
                <div className="flex flex-wrap gap-2 mb-3">
                  {dept.subDepts.map(sub => (
                    <span key={sub} className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:border-primary/30 cursor-pointer transition-colors">{sub}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toast.info(`Editing ${dept.name}`)} className="flex items-center gap-1 text-xs text-primary hover:underline"><Edit className="h-3 w-3" />Edit</button>
                  <button onClick={() => toast.info(`Managing ${dept.name} employees`)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"><Users className="h-3 w-3" />Manage Employees</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
