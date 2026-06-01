import { UserCheck, Search } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { useState } from 'react';
import { getInitials } from '@/lib/utils';

const RECORDS = [
  { name: 'Tom Bradley', dept: 'Production', checkin: '06:02', checkout: '—', hrs: '6h+', status: 'Present' },
  { name: 'Alice Kim', dept: 'Quality', checkin: '06:15', checkout: '—', hrs: '5h45m+', status: 'Present' },
  { name: 'Mark Rahman', dept: 'Maintenance', checkin: '—', checkout: '—', hrs: '—', status: 'On Leave' },
  { name: 'Sara Liu', dept: 'Warehouse', checkin: '06:45', checkout: '—', hrs: '5h15m+', status: 'Present' },
  { name: 'Chris Okafor', dept: 'Production', checkin: '07:22', checkout: '—', hrs: '4h38m+', status: 'Late' },
];

export function AttendancePage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><UserCheck className="h-5 w-5" />Attendance Management</h1><p className="text-sm text-muted-foreground">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Present', value: '1,820', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }, { label: 'Absent', value: '38', color: 'text-red-500', bg: 'bg-red-500/10' }, { label: 'Late', value: '22', color: 'text-amber-500', bg: 'bg-amber-500/10' }].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}><p className={`text-3xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label} Today</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['Employee', 'Department', 'Check In', 'Check Out', 'Hours', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {RECORDS.map((r, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{getInitials(r.name)}</div><span className="text-xs font-semibold text-foreground">{r.name}</span></div></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.dept}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-foreground">{r.checkin}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{r.checkout}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.hrs}</td>
                  <td className="px-5 py-3.5"><StatusBadge variant={r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'error'} size="sm">{r.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><button onClick={() => toast.info(`Updating ${r.name} attendance`)} className="text-xs text-primary hover:underline">Update</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
