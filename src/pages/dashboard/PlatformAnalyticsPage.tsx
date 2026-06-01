import { BarChart3, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '@/types';

const growthData = [
  { month: 'Jan', orgs: 180, users: 1200, revenue: 420000 }, { month: 'Feb', orgs: 195, users: 1400, revenue: 480000 },
  { month: 'Mar', orgs: 212, users: 1650, revenue: 520000 }, { month: 'Apr', orgs: 240, users: 1920, revenue: 610000 },
  { month: 'May', orgs: 265, users: 2180, revenue: 680000 }, { month: 'Jun', orgs: 290, users: 2450, revenue: 760000 },
];

export function PlatformAnalyticsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div><h1 className="text-xl font-bold text-foreground">Platform Analytics</h1><p className="text-sm text-muted-foreground">Growth metrics, usage analytics, and revenue intelligence</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Total Orgs', value: '290', change: '+25 MoM' }, { label: 'Active Users', value: '2,450', change: '+270 MoM' }, { label: 'MRR', value: '$760K', change: '+11.8%' }, { label: 'Churn Rate', value: '1.2%', change: '-0.3%' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p><p className="text-xs text-emerald-500 mt-1">{m.change}</p></div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Organization & User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} /><stop offset="95%" stopColor="#1E40AF" stopOpacity={0} /></linearGradient>
                <linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F97316" stopOpacity={0.2} /><stop offset="95%" stopColor="#F97316" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#1E40AF" fill="url(#ug)" strokeWidth={2} name="Users" />
              <Area type="monotone" dataKey="orgs" stroke="#F97316" fill="url(#og)" strokeWidth={2} name="Organizations" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Revenue (MRR)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthData}><XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} /><Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, 'MRR']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} /><Bar dataKey="revenue" fill="#1E40AF" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
