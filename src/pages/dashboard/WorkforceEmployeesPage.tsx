import { Users, Plus, Search, Eye, Edit, Mail } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';

const EMPLOYEES = [
  { id: 'EMP-001', name: 'Tom Bradley', dept: 'Production', shift: 'Day', skills: ['CNC', 'QC'], productivity: 96, status: 'Present' },
  { id: 'EMP-002', name: 'Alice Kim', dept: 'Quality', shift: 'Day', skills: ['Inspection', 'QMS'], productivity: 98, status: 'Present' },
  { id: 'EMP-003', name: 'Mark Rahman', dept: 'Maintenance', shift: 'Night', skills: ['PLC', 'Hydraulics'], productivity: 89, status: 'On Leave' },
  { id: 'EMP-004', name: 'Sara Liu', dept: 'Warehouse', shift: 'Day', skills: ['Forklift', 'SAP WM'], productivity: 91, status: 'Present' },
  { id: 'EMP-005', name: 'Chris Okafor', dept: 'Production', shift: 'Evening', skills: ['Welding', 'Assembly'], productivity: 84, status: 'Late' },
];

export function WorkforceEmployeesPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const filtered = EMPLOYEES.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Employee Directory</h1><p className="text-sm text-muted-foreground">Manage workforce profiles and assignments</p></div>
        <button onClick={() => toast.success('New employee form opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Employee</button>
      </div>
      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full" /></div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Employee', 'Department', 'Shift', 'Skills', 'Productivity', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{getInitials(emp.name)}</div><div><p className="text-xs font-semibold text-foreground">{emp.name}</p><p className="text-[11px] text-muted-foreground">{emp.id}</p></div></div></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{emp.dept}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{emp.shift}</td>
                  <td className="px-5 py-3.5"><div className="flex flex-wrap gap-1">{emp.skills.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>)}</div></td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${emp.productivity >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${emp.productivity}%` }} /></div><span className="text-xs text-muted-foreground">{emp.productivity}%</span></div></td>
                  <td className="px-5 py-3.5"><StatusBadge variant={emp.status === 'Present' ? 'success' : emp.status === 'Late' ? 'warning' : 'error'} size="sm">{emp.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2"><button onClick={() => toast.info(`Viewing ${emp.name}`)} className="text-xs text-primary hover:underline">Profile</button><button onClick={() => toast.info(`Editing ${emp.name}`)} className="text-xs text-muted-foreground hover:underline">Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
