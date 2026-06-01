import { useState } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, DollarSign, Users, Target, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const monthlySpend = [
  { month: 'Jan', spend: 420000, budget: 450000, savings: 18000 },
  { month: 'Feb', spend: 380000, budget: 400000, savings: 12000 },
  { month: 'Mar', spend: 510000, budget: 480000, savings: 22000 },
  { month: 'Apr', spend: 460000, budget: 470000, savings: 19000 },
  { month: 'May', spend: 490000, budget: 510000, savings: 28000 },
  { month: 'Jun', spend: 530000, budget: 550000, savings: 24000 },
];

const byCategory = [
  { name: 'Raw Materials', value: 42, color: '#1E40AF', amount: 1171800 },
  { name: 'MRO', value: 22, color: '#F97316', amount: 614200 },
  { name: 'Capital Equipment', value: 18, color: '#10B981', amount: 502600 },
  { name: 'Services', value: 12, color: '#8B5CF6', amount: 335000 },
  { name: 'Hardware & Other', value: 6, color: '#6B7280', amount: 167400 },
];

const vendorSpend = [
  { name: 'SteelPro Ltd.', spend: 1200000, orders: 48, score: 94 },
  { name: 'Hydraulic Systems', spend: 840000, orders: 22, score: 87 },
  { name: 'Global Bearings', spend: 620000, orders: 35, score: 91 },
  { name: 'FastenTech Corp.', spend: 410000, orders: 64, score: 78 },
  { name: 'Polymer World', spend: 290000, orders: 18, score: 85 },
];

const supplierScorecard = [
  { vendor: 'SteelPro Ltd.', onTime: 96, quality: 97, responsiveness: 94, compliance: 98, pricing: 92 },
  { vendor: 'Hydraulic Systems', onTime: 89, quality: 91, responsiveness: 88, compliance: 95, pricing: 87 },
  { vendor: 'Global Bearings', onTime: 93, quality: 95, responsiveness: 90, compliance: 96, pricing: 89 },
  { vendor: 'FastenTech Corp.', onTime: 82, quality: 80, responsiveness: 78, compliance: 92, pricing: 85 },
];

const savingsTrend = [
  { month: 'Jan', actual: 18000, target: 20000 },
  { month: 'Feb', actual: 12000, target: 20000 },
  { month: 'Mar', actual: 22000, target: 20000 },
  { month: 'Apr', actual: 19000, target: 20000 },
  { month: 'May', actual: 28000, target: 20000 },
  { month: 'Jun', actual: 24000, target: 20000 },
];

const radarData = [
  { metric: 'On-Time', SteelPro: 96, FastenTech: 82 },
  { metric: 'Quality', SteelPro: 97, FastenTech: 80 },
  { metric: 'Response', SteelPro: 94, FastenTech: 78 },
  { metric: 'Compliance', SteelPro: 98, FastenTech: 92 },
  { metric: 'Pricing', SteelPro: 92, FastenTech: 85 },
];

const CHART_COLORS = ['#1E40AF', '#F97316', '#10B981', '#8B5CF6', '#6B7280'];
const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 };

type TabKey = 'spend' | 'suppliers';

export function SpendAnalysisPage({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<TabKey>('spend');
  const [selectedVendor, setSelectedVendor] = useState('SteelPro Ltd.');

  const totalYTD = monthlySpend.reduce((s, m) => s + m.spend, 0);
  const totalSavings = monthlySpend.reduce((s, m) => s + m.savings, 0);
  const totalBudget = monthlySpend.reduce((s, m) => s + m.budget, 0);
  const budgetUtil = Math.round((totalYTD / totalBudget) * 100);

  const radarVendorData = radarData;
  const selectedScorecard = supplierScorecard.find(s => s.vendor.startsWith(selectedVendor.split(' ')[0]));

  const handleExport = () => {
    const data = { monthlySpend, byCategory, vendorSpend, supplierScorecard };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `procurement_analytics_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analytics report exported');
  };

  const tabs: { id: TabKey; label: string }[] = [
    { id: 'spend', label: 'Spend Analysis' },
    { id: 'suppliers', label: 'Supplier Analytics' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {activeTab === 'spend' ? 'Spend Analysis' : 'Supplier Analytics'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Procurement cost intelligence and supplier performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeTab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* ══════════════ SPEND ANALYSIS TAB ══════════════ */}
      {activeTab === 'spend' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'YTD Total Spend', value: `$${(totalYTD / 1000000).toFixed(2)}M`, sub: `${budgetUtil}% of budget`, trend: 'up', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Jun Spend', value: `$${(monthlySpend[5].spend / 1000).toFixed(0)}K`, sub: 'vs $550K budget', trend: 'down', icon: TrendingDown, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'YTD Savings', value: `$${(totalSavings / 1000).toFixed(0)}K`, sub: `avg $${(totalSavings / 6 / 1000).toFixed(0)}K/mo`, trend: 'up', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Active Vendors', value: '84', sub: '5 preferred suppliers', trend: 'up', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            ].map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Spend vs Budget</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlySpend} barCategoryGap="20%">
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={TOOLTIP_STYLE} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="spend" name="Actual Spend" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="budget" name="Budget" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Spend by Category</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35} paddingAngle={3}>
                    {byCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {byCategory.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <div className="flex gap-2 text-right">
                      <span className="font-medium text-foreground">{d.value}%</span>
                      <span className="text-muted-foreground">${(d.amount / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Procurement Savings Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={savingsTrend}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={TOOLTIP_STYLE} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="actual" name="Actual Savings" stroke="#10B981" fill="url(#savingsGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" name="Monthly Target" stroke="#F97316" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Top Vendor Spend</h3>
              <div className="space-y-3">
                {vendorSpend.map((v, i) => {
                  const pct = Math.round((v.spend / vendorSpend[0].spend) * 100);
                  return (
                    <div key={v.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-foreground">{v.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{v.orders} orders</span>
                          <span className="font-bold text-foreground">${(v.spend / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: CHART_COLORS[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════ SUPPLIER ANALYTICS TAB ══════════════ */}
      {activeTab === 'suppliers' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Performance Score', value: '87/100', sub: 'Fleet average', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Avg On-Time Delivery', value: '90%', sub: 'Target: 95%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Preferred Suppliers', value: '1', sub: '4 total tracked', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Suppliers Under Review', value: '1', sub: 'Action required', icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10' },
            ].map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Vendor Performance Scorecard</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>{['Vendor', 'On-Time', 'Quality', 'Response', 'Compliance', 'Pricing', 'Overall'].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 font-medium">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {supplierScorecard.map(s => {
                      const overall = Math.round((s.onTime + s.quality + s.responsiveness + s.compliance + s.pricing) / 5);
                      const color = overall >= 90 ? 'text-emerald-500' : overall >= 80 ? 'text-amber-500' : 'text-red-500';
                      return (
                        <tr key={s.vendor} className="hover:bg-muted/30">
                          <td className="px-3 py-2.5 font-semibold text-foreground">{s.vendor.split(' ')[0]}</td>
                          {[s.onTime, s.quality, s.responsiveness, s.compliance, s.pricing].map((v, i) => (
                            <td key={i} className={`px-3 py-2.5 font-semibold ${v >= 90 ? 'text-emerald-500' : v >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{v}%</td>
                          ))}
                          <td className={`px-3 py-2.5 font-bold text-base ${color}`}>{overall}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Vendor Comparison Radar</h3>
                <div className="flex gap-1.5">
                  {['SteelPro', 'Hydraulic', 'Global', 'FastenTech'].map(v => (
                    <button key={v} onClick={() => setSelectedVendor(v)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${selectedVendor.startsWith(v) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <RadarChart data={radarVendorData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <Radar name="SteelPro" dataKey="SteelPro" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.2} />
                  <Radar name="FastenTech" dataKey="FastenTech" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Vendor Spend Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vendorSpend} layout="vertical" barCategoryGap="25%">
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={130} tickFormatter={v => v.split(' ')[0] + ' ' + (v.split(' ')[1] || '')} />
                <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, 'Annual Spend']} contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                  {vendorSpend.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
