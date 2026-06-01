import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const daily = [
  { hour: '06', production: 180 }, { hour: '07', production: 220 }, { hour: '08', production: 240 },
  { hour: '09', production: 235 }, { hour: '10', production: 260 }, { hour: '11', production: 248 },
  { hour: '12', production: 190 }, { hour: '13', production: 230 }, { hour: '14', production: 255 },
];

const weekly = [
  { day: 'Mon', actual: 920, target: 900 }, { day: 'Tue', actual: 880, target: 900 },
  { day: 'Wed', actual: 945, target: 900 }, { day: 'Thu', actual: 930, target: 950 },
  { day: 'Fri', actual: 970, target: 950 }, { day: 'Sat', actual: 850, target: 800 },
];

export function ProductionReportsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Production Reports</h1><p className="text-sm text-muted-foreground mt-0.5">Daily, weekly, and monthly output analytics</p></div>
        <button 
          type="button"
          onClick={() => toast.success('Generating production report')} 
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Download className="h-4 w-4" />Export PDF
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Output", value: '2,847', change: '+4.2% vs target' },
          { label: 'This Week', value: '13,295', change: '↑ 98.6% of target' },
          { label: 'OEE Score', value: '87.3%', change: '+1.8% WoW' },
          { label: 'Scrap Rate', value: '1.2%', change: '-0.3% improved' },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-emerald-500 mt-1">{m.change}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Today's Hourly Production</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={daily}>
              <defs><linearGradient id="dpg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} /><stop offset="95%" stopColor="#1E40AF" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}:00`} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="production" stroke="#1E40AF" fill="url(#dpg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Weekly Actual vs Target</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly} barGap={4}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="target" fill="hsl(var(--muted))" radius={[3, 3, 0, 0]} name="Target" />
              <Bar dataKey="actual" fill="#1E40AF" radius={[3, 3, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
