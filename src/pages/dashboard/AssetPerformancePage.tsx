import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Download, Award, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const INITIAL_OEE_DATA = [
  { week: 'W1', oee: 88, mttr: 3.1 },
  { week: 'W2', oee: 85, mttr: 3.4 },
  { week: 'W3', oee: 91, mttr: 2.8 },
  { week: 'W4', oee: 87, mttr: 2.9 },
  { week: 'W5', oee: 94, mttr: 2.1 },
  { week: 'W6', oee: 92, mttr: 2.4 },
];

export function AssetPerformancePage({ user }: { user: User }) {
  const [data, setData] = useState(INITIAL_OEE_DATA);
  const [chartMetric, setChartMetric] = useState<'oee' | 'mttr'>('oee');

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Asset_Performance_Log_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Performance analytics file downloaded');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Asset Performance</h1>
          <p className="text-sm text-muted-foreground">Log machinery OEE values, downtime rates and reliability parameters</p>
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
          { label: 'Average OEE', value: '89.5%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'MTBF (hrs)', value: '312 hrs', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'MTTR (hrs)', value: '2.4 hrs', icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'PM Compliance', value: '96.2%', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-lg font-bold text-foreground">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Panel */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Reliability Metrics Trend</h3>
            <p className="text-xs text-muted-foreground font-semibold">Weekly OEE averages and Mean Time to Repair</p>
          </div>

          <div className="flex gap-1 bg-muted p-1 rounded-xl">
            {(['oee', 'mttr'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setChartMetric(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  chartMetric === tab
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'oee' ? 'OEE Efficiency %' : 'MTTR (Hours)'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={chartMetric === 'oee' ? [80, 100] : [1, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey={chartMetric}
                stroke={chartMetric === 'oee' ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={chartMetric === 'oee' ? 'OEE %' : 'MTTR Hours'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
