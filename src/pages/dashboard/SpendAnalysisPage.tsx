import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const monthly = [
  { month: 'Jan', spend: 420000 }, { month: 'Feb', spend: 380000 }, { month: 'Mar', spend: 510000 },
  { month: 'Apr', spend: 460000 }, { month: 'May', spend: 490000 }, { month: 'Jun', spend: 530000 },
];

const byCategory = [
  { name: 'Raw Materials', value: 42, color: '#1E40AF' }, { name: 'MRO', value: 22, color: '#F97316' },
  { name: 'Capital', value: 18, color: '#10B981' }, { name: 'Services', value: 12, color: '#8B5CF6' }, { name: 'Other', value: 6, color: '#6B7280' },
];

export function SpendAnalysisPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Spend Analysis</h1><p className="text-sm text-muted-foreground">Procurement cost intelligence and optimization</p></div>
        <button onClick={() => toast.success('Exporting spend report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'YTD Spend', value: '$2.79M' }, { label: 'Jun Spend', value: '$530K' }, { label: 'Savings (YTD)', value: '$142K' }, { label: 'Vendors Active', value: '84' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Spend Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}><XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} /><Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'Spend']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} /><Bar dataKey="spend" fill="#F97316" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-3">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={byCategory} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30} paddingAngle={3}>{byCategory.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip formatter={v => [`${v}%`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">{byCategory.map(d => <div key={d.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} /><span className="text-muted-foreground">{d.name}</span></div><span className="font-medium text-foreground">{d.value}%</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}
