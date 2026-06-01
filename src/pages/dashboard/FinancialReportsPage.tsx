import { BarChart3, Download } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const plData = [
  { month: 'Jan', revenue: 2100000, expense: 1840000, profit: 260000 },
  { month: 'Feb', revenue: 2240000, expense: 1920000, profit: 320000 },
  { month: 'Mar', revenue: 1980000, expense: 1780000, profit: 200000 },
  { month: 'Apr', revenue: 2380000, expense: 2050000, profit: 330000 },
  { month: 'May', revenue: 2520000, expense: 2120000, profit: 400000 },
  { month: 'Jun', revenue: 2680000, expense: 2240000, profit: 440000 },
];

export function FinancialReportsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Financial Reports</h1><p className="text-sm text-muted-foreground">P&L, cash flow, and financial performance</p></div>
        <button onClick={() => toast.success('Exporting financial report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export PDF</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Jun Revenue', value: '$2.68M' }, { label: 'Jun Expenses', value: '$2.24M' }, { label: 'Net Profit', value: '$440K' }, { label: 'Profit Margin', value: '16.4%' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">P&L — Revenue vs Expenses vs Profit</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={plData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} /><stop offset="95%" stopColor="#1E40AF" stopOpacity={0} /></linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={v => [`$${(Number(v) / 1000).toFixed(0)}K`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#1E40AF" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="expense" stroke="#F97316" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Expenses" />
            <Area type="monotone" dataKey="profit" stroke="#10B981" fill="url(#profGrad)" strokeWidth={2} name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
