import { useState } from 'react';
import { BarChart3, Download, TrendingUp, ShieldAlert, Award, FileJson } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const MONTHLY_QUALITY_DATA = [
  { month: 'Jan', score: 96.8, defects: 42, audits: 2 },
  { month: 'Feb', score: 97.2, defects: 38, audits: 3 },
  { month: 'Mar', score: 97.8, defects: 29, audits: 1 },
  { month: 'Apr', score: 97.5, defects: 31, audits: 4 },
  { month: 'May', score: 97.9, defects: 24, audits: 2 },
  { month: 'Jun', score: 98.4, defects: 18, audits: 3 },
];

export function QualityReportsPage({ user }: { user: User }) {
  const [metric, setMetric] = useState<'score' | 'defects' | 'audits'>('score');

  const handleExport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      generatedBy: user.name,
      department: user.department,
      timeframe: 'Last 6 Months',
      metrics: MONTHLY_QUALITY_DATA
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Quality_Report_Analytics_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Quality analytical report exported successfully');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Quality Reports</h1>
          <p className="text-sm text-muted-foreground">Quality metrics, audits, and defect analytics</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Quality Score Average', value: '98.4%', change: '+0.5% MTD', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Defects Flagged', value: '18', change: '-25% vs May', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Compliance Audits Run', value: '15', change: '100% Passed', icon: FileJson, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Average Defect Resolution', value: '1.4 days', change: '-4 hrs vs Q1', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Panel */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Quality Performance Trend</h3>
            <p className="text-xs text-muted-foreground">Historical charts tracking enterprise metrics</p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-xl">
            {(['score', 'defects', 'audits'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMetric(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  metric === tab
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'score' ? 'Quality Score %' : tab === 'defects' ? 'Defects Count' : 'Audits Logged'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Chart Display */}
        <div className="h-[260px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {metric === 'score' ? (
              <LineChart data={MONTHLY_QUALITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[95, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} name="Quality Score %" />
              </LineChart>
            ) : metric === 'defects' ? (
              <AreaChart data={MONTHLY_QUALITY_DATA}>
                <defs>
                  <linearGradient id="defectColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="defects" stroke="#EF4444" fill="url(#defectColor)" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} name="Defects Count" />
              </AreaChart>
            ) : (
              <AreaChart data={MONTHLY_QUALITY_DATA}>
                <defs>
                  <linearGradient id="auditColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="audits" stroke="#3B82F6" fill="url(#auditColor)" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6' }} name="Compliance Audits Run" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
