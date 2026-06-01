import { BarChart3, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const oeeData = [
  { week: 'W1', oee: 88 }, { week: 'W2', oee: 85 }, { week: 'W3', oee: 91 }, { week: 'W4', oee: 87 }, { week: 'W5', oee: 94 }, { week: 'W6', oee: 92 },
];

const failureData = [
  { cause: 'Bearing Failure', count: 4 }, { cause: 'Seal Leakage', count: 3 }, { cause: 'Belt Wear', count: 2 }, { cause: 'Electrical', count: 2 }, { cause: 'Lubrication', count: 1 },
];

export function AssetPerformancePage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Asset Performance Analytics</h1><p className="text-sm text-muted-foreground">OEE, failure analysis, and maintenance intelligence</p></div>
        <button onClick={() => toast.success('Exporting performance report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Average OEE', value: '89.4%', icon: TrendingUp }, { label: 'MTBF (hrs)', value: '312', icon: BarChart3 }, { label: 'MTTR (hrs)', value: '2.8', icon: TrendingDown }, { label: 'PM Compliance', value: '94%', icon: TrendingUp }].map(m => {
          const Icon = m.icon;
          return <div key={m.label} className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">{m.label}</p></div><p className="text-2xl font-bold text-foreground">{m.value}</p></div>;
        })}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">OEE Trend (6 Weeks)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={oeeData}><XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis domain={[80, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} /><Line type="monotone" dataKey="oee" stroke="#1E40AF" strokeWidth={2} dot={{ r: 4, fill: '#1E40AF' }} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Top Failure Causes (YTD)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={failureData} layout="vertical"><XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="cause" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} /><Bar dataKey="count" fill="#F97316" radius={[0, 3, 3, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
