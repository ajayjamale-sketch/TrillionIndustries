import { BarChart3, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const qData = [
  { month: 'Jan', score: 96.8, defects: 42 }, { month: 'Feb', score: 97.2, defects: 38 },
  { month: 'Mar', score: 97.8, defects: 29 }, { month: 'Apr', score: 97.5, defects: 31 },
  { month: 'May', score: 97.9, defects: 24 }, { month: 'Jun', score: 98.4, defects: 18 },
];

export function QualityReportsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Quality Reports</h1><p className="text-sm text-muted-foreground">Quality metrics and performance analytics</p></div>
        <button onClick={() => toast.success('Generating quality report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Quality Score', value: '98.4%' }, { label: 'Defect Rate', value: '1.2%' }, { label: 'Open NCRs', value: '3' }, { label: 'CAPA Open', value: '2' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Quality Score Trend (6 Months)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={qData}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[95, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Quality Score %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
