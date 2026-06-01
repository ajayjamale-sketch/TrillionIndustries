import { useState } from 'react';
import { TrendingUp, Award, Download, ClipboardCheck, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

interface ProductivityItem {
  id: string;
  employee: string;
  dept: string;
  tasksCompleted: number;
  score: number;
  efficiency: number;
}

const INITIAL_DATA: ProductivityItem[] = [
  { id: 'EMP-001', employee: 'Tom Bradley', dept: 'Production', tasksCompleted: 42, score: 96, efficiency: 94 },
  { id: 'EMP-002', employee: 'Alice Kim', dept: 'Quality', tasksCompleted: 35, score: 98, efficiency: 97 },
  { id: 'EMP-003', employee: 'Mark Rahman', dept: 'Maintenance', tasksCompleted: 18, score: 89, efficiency: 86 },
  { id: 'EMP-004', employee: 'Sara Liu', dept: 'Warehouse', tasksCompleted: 58, score: 91, efficiency: 92 },
  { id: 'EMP-005', employee: 'Chris Okafor', dept: 'Production', tasksCompleted: 24, score: 84, efficiency: 81 },
];

const deptAverages = [
  { name: 'Production', Score: 92 },
  { name: 'Warehouse', Score: 88 },
  { name: 'Maintenance', Score: 91 },
  { name: 'Quality', Score: 96 },
];

export function ProductivityPage({ user }: { user: User }) {
  const [data, setData] = useState<ProductivityItem[]>(INITIAL_DATA);

  const handleLogTask = (id: string) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        toast.success(`Logged task completion for ${item.employee}`);
        const nextScore = Math.min(item.score + 1, 100);
        return {
          ...item,
          tasksCompleted: item.tasksCompleted + 1,
          score: nextScore,
          efficiency: Math.min(item.efficiency + 1, 100)
        };
      }
      return item;
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />Productivity Tracking
          </h1>
          <p className="text-sm text-muted-foreground">Track employee performance ratings, task completions and OEE efficiencies</p>
        </div>
        <button
          onClick={() => {
            toast.success('Efficiency analytics sheet exported');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Download className="h-4 w-4" /> Export Stats
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Personnel Performance Roster</h2>

          <div className="divide-y divide-border">
            {data.map(item => (
              <div key={item.id} className="py-3.5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs font-bold text-foreground">{item.employee}</p>
                  <p className="text-[10px] text-muted-foreground">{item.dept} · Tasks Completed: {item.tasksCompleted}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] block text-muted-foreground uppercase">Efficiency</span>
                    <span className="text-xs font-semibold text-foreground">{item.efficiency}%</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] block text-muted-foreground uppercase">Rating Score</span>
                    <span className={`text-xs font-bold ${item.score >= 90 ? 'text-emerald-500' : 'text-primary'}`}>
                      {item.score}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleLogTask(item.id)}
                    className="p-1 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors"
                    title="Log Task Completed"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">Department Performance</h2>
            <p className="text-xs text-muted-foreground">Average OEE rating benchmarks</p>
          </div>

          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAverages}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="Score" fill="#1E40AF" radius={[3, 3, 0, 0]} name="OEE Score Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-muted/40 border border-border p-3.5 rounded-xl flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Quality team holds the highest average benchmark OEE rating at <span className="font-bold text-foreground">96%</span> due to optimized checklist processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
