import { UserCheck, Search, Download } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { useState } from 'react';
import { getInitials } from '@/lib/utils';

interface AttendanceRecord {
  id: string;
  name: string;
  dept: string;
  checkin: string;
  checkout: string;
  hrs: string;
  status: string;
}

const INITIAL_RECORDS: AttendanceRecord[] = [
  { id: 'EMP-001', name: 'Tom Bradley', dept: 'Production', checkin: '06:02', checkout: '—', hrs: '6h+', status: 'Present' },
  { id: 'EMP-002', name: 'Alice Kim', dept: 'Quality', checkin: '06:15', checkout: '—', hrs: '5h45m+', status: 'Present' },
  { id: 'EMP-003', name: 'Mark Rahman', dept: 'Maintenance', checkin: '—', checkout: '—', hrs: '—', status: 'On Leave' },
  { id: 'EMP-004', name: 'Sara Liu', dept: 'Warehouse', checkin: '06:45', checkout: '—', hrs: '5h15m+', status: 'Present' },
  { id: 'EMP-005', name: 'Chris Okafor', dept: 'Production', checkin: '07:22', checkout: '—', hrs: '4h38m+', status: 'Late' },
];

export function AttendancePage({ user }: { user: User }) {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [search, setSearch] = useState('');

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        let checkin = rec.checkin;
        let checkout = rec.checkout;
        let hrs = rec.hrs;

        if (newStatus === 'Present') {
          checkin = '08:00';
          checkout = '—';
          hrs = '8h';
        } else if (newStatus === 'Late') {
          checkin = '08:45';
          checkout = '—';
          hrs = '7h15m';
        } else {
          checkin = '—';
          checkout = '—';
          hrs = '—';
        }

        toast.success(`Updated ${rec.name} to ${newStatus}`);
        return {
          ...rec,
          status: newStatus,
          checkin,
          checkout,
          hrs
        };
      }
      return rec;
    }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_log_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Attendance logs exported');
  };

  const filtered = records.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.dept.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = records.filter(r => r.status === 'Present').length;
  const lateCount = records.filter(r => r.status === 'Late').length;
  const leaveCount = records.filter(r => r.status === 'On Leave' || r.status === 'Absent').length;

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />Attendance Management
          </h1>
          <p className="text-sm text-muted-foreground">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Download className="h-4 w-4" /> Export logs
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present Today', value: presentCount, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Late Shifts', value: lateCount, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'On Leave/Absent', value: leaveCount, color: 'text-red-500', bg: 'bg-red-500/10' }
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border border-border/20`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roster by name or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['Employee', 'Department', 'Check In', 'Check Out', 'Hours Logged', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground">No personnel records found.</td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {getInitials(r.name)}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.dept}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-foreground">{r.checkin}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{r.checkout}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.hrs}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'error'} size="sm">
                        {r.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={r.status}
                        onChange={e => handleUpdateStatus(r.id, e.target.value)}
                        className="text-xs px-2.5 py-1 bg-muted border border-border rounded-lg outline-none font-semibold cursor-pointer"
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
