import { Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const SHIFTS = [
  { shift: 'Day (6AM–2PM)', dept: 'Production', employees: 420, coverage: 98, supervisor: 'J. Smith', status: 'Active' },
  { shift: 'Evening (2PM–10PM)', dept: 'Production', employees: 380, coverage: 95, supervisor: 'R. Patel', status: 'Active' },
  { shift: 'Night (10PM–6AM)', dept: 'Production', employees: 290, coverage: 91, supervisor: 'L. Garcia', status: 'Active' },
  { shift: 'Day (6AM–2PM)', dept: 'Warehouse', employees: 180, coverage: 100, supervisor: 'M. Chan', status: 'Active' },
  { shift: 'Day (6AM–2PM)', dept: 'Maintenance', employees: 42, coverage: 88, supervisor: 'J. Williams', status: 'Understaffed' },
];

export function ShiftsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Calendar className="h-5 w-5" />Shift Scheduling</h1><p className="text-sm text-muted-foreground">Manage shift rosters and coverage</p></div>
        <button onClick={() => toast.success('New shift created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Create Shift</button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Shift', 'Department', 'Employees', 'Coverage', 'Supervisor', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {SHIFTS.map((s, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{s.shift}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.dept}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{s.employees}</td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.coverage}%` }} /></div><span className="text-xs text-muted-foreground">{s.coverage}%</span></div></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.supervisor}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold ${s.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>{s.status}</span></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2"><button onClick={() => toast.info(`Editing shift`)} className="text-xs text-primary hover:underline">Edit</button><button onClick={() => toast.info(`Viewing roster`)} className="text-xs text-muted-foreground hover:underline">Roster</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
