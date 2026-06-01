import { useState } from 'react';
import { Users, Plus, Search, Edit, Eye, Mail } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';

const EMPLOYEES = [
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
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const filtered = EMPLOYEES.filter(e => (dept === 'All' || e.dept === dept) && (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.includes(search)));
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-foreground">Employee Directory</h1><p className="text-sm text-muted-foreground mt-0.5">{EMPLOYEES.length} total employees</p></div>
        <button onClick={() => toast.success('New employee form opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Employee</button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-56" /></div>
        <div className="flex gap-1.5 flex-wrap">{DEPTS.map(d => <button key={d} onClick={() => setDept(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dept === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{d}</button>)}</div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{getInitials(emp.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{emp.name}</p>
                <p className="text-xs text-muted-foreground">{emp.role}</p>
              </div>
              <StatusBadge variant={emp.status === 'Active' ? 'success' : 'warning'} size="sm">{emp.status}</StatusBadge>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <p>{emp.dept} · {emp.id}</p>
              <p>{emp.email}</p>
              <p>Joined: {emp.joined}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.info(`Viewing ${emp.name} profile`)} className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/70 transition-colors flex items-center justify-center gap-1"><Eye className="h-3 w-3" />View</button>
              <button onClick={() => toast.info(`Editing ${emp.name}`)} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => toast.info(`Emailing ${emp.name}`)} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><Mail className="h-3.5 w-3.5 text-muted-foreground" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
