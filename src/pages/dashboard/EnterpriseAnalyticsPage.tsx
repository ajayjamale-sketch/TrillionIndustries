import { BarChart3, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const monthly = [
  { month: 'Jan', production: 820, procurement: 420, quality: 97.2, workforce: 88 },
  { month: 'Feb', production: 870, procurement: 380, quality: 96.8, workforce: 91 },
  { month: 'Mar', production: 910, procurement: 510, quality: 98.1, workforce: 89 },
  { month: 'Apr', production: 940, procurement: 460, quality: 97.5, workforce: 93 },
  { month: 'May', production: 925, procurement: 490, quality: 97.9, workforce: 92 },
  { month: 'Jun', production: 980, procurement: 530, quality: 98.4, workforce: 94 },
];

export function EnterpriseAnalyticsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-foreground">Enterprise Analytics</h1><p className="text-sm text-muted-foreground mt-0.5">Unified cross-module performance intelligence</p></div>
        <button onClick={() => toast.success('Exporting analytics report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Production Index', value: '98.4', unit: '%', change: '+2.1%', up: true },
          { label: 'Procurement Efficiency', value: '91.2', unit: '%', change: '+1.4%', up: true },
          { label: 'Quality Score', value: '98.4', unit: '%', change: '+0.5%', up: true },
          { label: 'Workforce Utilization', value: '94', unit: '%', change: '+2%', up: true },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-3xl font-bold text-foreground">{m.value}<span className="text-base font-normal text-muted-foreground">{m.unit}</span></p>
            <div className="flex items-center gap-1 mt-1">{m.up ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-red-400" />}<span className={`text-xs ${m.up ? 'text-emerald-500' : 'text-red-400'}`}>{m.change} vs last month</span></div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Production vs Procurement Spend (Monthly)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="production" fill="#1E40AF" radius={[3, 3, 0, 0]} name="Production (units)" />
              <Bar dataKey="procurement" fill="#F97316" radius={[3, 3, 0, 0]} name="Procurement ($K)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Quality & Workforce Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Quality %" />
              <Line type="monotone" dataKey="workforce" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} name="Workforce %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
