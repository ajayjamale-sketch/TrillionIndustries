import { useState } from 'react';
import {
  Users, TrendingUp, Clock, Calendar, Award, Shield, Plus,
  Download, Search, ArrowRight, CheckCircle2, AlertTriangle,
  UserCheck, BarChart3, RefreshCw, ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const attendanceData = [
  { day: 'Mon', present: 1820, absent: 42, late: 18 },
  { day: 'Tue', present: 1845, absent: 28, late: 7 },
  { day: 'Wed', present: 1792, absent: 65, late: 23 },
  { day: 'Thu', present: 1860, absent: 20, late: 10 },
  { day: 'Fri', present: 1810, absent: 45, late: 25 },
];

const productivityData = [
  { dept: 'Production', score: 94 },
  { dept: 'Warehouse', score: 88 },
  { dept: 'Maintenance', score: 91 },
  { dept: 'Quality', score: 96 },
  { dept: 'Procurement', score: 87 },
];

const EMPLOYEES = [
  { id: 'EMP-001', name: 'Tom Bradley', dept: 'Production', shift: 'Day', status: 'Present', skills: ['CNC Operation', 'QC'], productivity: 96 },
  { id: 'EMP-002', name: 'Alice Kim', dept: 'Quality', shift: 'Day', status: 'Present', skills: ['Inspection', 'QMS'], productivity: 98 },
  { id: 'EMP-003', name: 'Mark Rahman', dept: 'Maintenance', shift: 'Night', status: 'On Leave', skills: ['PLC', 'Hydraulics'], productivity: 89 },
  { id: 'EMP-004', name: 'Sara Liu', dept: 'Warehouse', shift: 'Day', status: 'Present', skills: ['Forklift', 'SAP WM'], productivity: 91 },
  { id: 'EMP-005', name: 'Chris Okafor', dept: 'Production', shift: 'Evening', status: 'Late', skills: ['Welding', 'Assembly'], productivity: 84 },
];

const SHIFTS = [
  { shift: 'Day (6AM–2PM)', dept: 'Production', employees: 420, coverage: 98, supervisor: 'J. Smith' },
  { shift: 'Evening (2PM–10PM)', dept: 'Production', employees: 380, coverage: 95, supervisor: 'R. Patel' },
  { shift: 'Night (10PM–6AM)', dept: 'Production', employees: 290, coverage: 91, supervisor: 'L. Garcia' },
  { shift: 'Day (6AM–2PM)', dept: 'Warehouse', employees: 180, coverage: 100, supervisor: 'M. Chan' },
];

export function WorkforceDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<'employees' | 'attendance' | 'shifts'>('employees');
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Workforce Management Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('New employee record created')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />Add Employee
          </button>
          <button onClick={() => toast.info('Downloading workforce report')}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: '1,880', change: '+12 this month', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Present Today', value: '1,820', change: '96.8% attendance', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'On Leave', value: '38', change: '8 pending approval', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Avg Productivity', value: '91.2%', change: '+2.1% vs last week', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => toast.info(`Viewing ${m.label}`)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Weekly Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barGap={4}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="present" fill="#1E40AF" radius={[3, 3, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#EF4444" radius={[3, 3, 0, 0]} name="Absent" />
              <Bar dataKey="late" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Productivity by Department</h3>
          <div className="space-y-3">
            {productivityData.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{d.dept}</span>
                  <span className={`font-semibold ${d.score >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{d.score}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${d.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${d.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex gap-2">
            {[['employees', 'Employees'], ['attendance', 'Attendance'], ['shifts', 'Shift Schedule']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-44" />
          </div>
        </div>

        {tab === 'employees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Employee</th>
                  <th className="text-left px-5 py-3 font-medium">Department</th>
                  <th className="text-left px-5 py-3 font-medium">Shift</th>
                  <th className="text-left px-5 py-3 font-medium">Skills</th>
                  <th className="text-left px-5 py-3 font-medium">Productivity</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EMPLOYEES.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase())).map(emp => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{emp.name.split(' ').map(n => n[0]).join('')}</div>
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
                        {emp.skills.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${emp.productivity >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${emp.productivity}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">{emp.productivity}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={emp.status === 'Present' ? 'success' : emp.status === 'Late' ? 'warning' : 'error'} size="sm">{emp.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => toast.info(`Viewing ${emp.name} profile`)} className="text-xs text-primary hover:underline">Profile</button>
                        <button onClick={() => toast.info(`Editing ${emp.name}`)} className="text-xs text-muted-foreground hover:text-foreground hover:underline">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'attendance' && (
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Present', value: '1,820', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Absent', value: '38', color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Late', value: '22', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {EMPLOYEES.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-3 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{emp.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{emp.name}</p>
                    <p className="text-[11px] text-muted-foreground">{emp.dept} · {emp.shift} Shift</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge variant={emp.status === 'Present' ? 'success' : emp.status === 'Late' ? 'warning' : 'error'} size="sm">{emp.status}</StatusBadge>
                  <button onClick={() => toast.info(`Updating ${emp.name} attendance`)} className="text-xs text-primary hover:underline">Update</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'shifts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Shift</th>
                  <th className="text-left px-5 py-3 font-medium">Department</th>
                  <th className="text-left px-5 py-3 font-medium">Employees</th>
                  <th className="text-left px-5 py-3 font-medium">Coverage</th>
                  <th className="text-left px-5 py-3 font-medium">Supervisor</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SHIFTS.map((s, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{s.shift}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.dept}</td>
                    <td className="px-5 py-3.5 text-xs text-foreground font-semibold">{s.employees}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.coverage}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{s.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.supervisor}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toast.info(`Editing shift schedule`)} className="text-xs text-primary hover:underline">Edit Shift</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
