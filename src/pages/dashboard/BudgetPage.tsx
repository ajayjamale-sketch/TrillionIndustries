import { useState } from 'react';
import { DollarSign, Plus, Edit, Save, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const BUDGETS = [
  { dept: 'Production', allocated: 1200000, spent: 980000, remaining: 220000 },
  { dept: 'Procurement', allocated: 800000, spent: 720000, remaining: 80000 },
  { dept: 'Maintenance', allocated: 250000, spent: 198000, remaining: 52000 },
  { dept: 'HR & Workforce', allocated: 450000, spent: 412000, remaining: 38000 },
  { dept: 'Quality', allocated: 180000, spent: 142000, remaining: 38000 },
  { dept: 'IT & Systems', allocated: 120000, spent: 88000, remaining: 32000 },
];

export function BudgetPage({ user }: { user: User }) {
  const total = BUDGETS.reduce((a, b) => a + b.allocated, 0);
  const spent = BUDGETS.reduce((a, b) => a + b.spent, 0);
  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><DollarSign className="h-5 w-5" />Budget Management</h1><p className="text-sm text-muted-foreground">FY 2026 budget allocation and utilization</p></div>
        <button onClick={() => toast.success('Budget amendment request sent')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Budget Amendment</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Budget (FY)', value: `$${(total / 1000000).toFixed(2)}M` }, { label: 'Spent to Date', value: `$${(spent / 1000000).toFixed(2)}M` }, { label: 'Remaining', value: `$${((total - spent) / 1000000).toFixed(2)}M` }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm">Department Budget Utilization</h3>
        {BUDGETS.map(b => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          return (
            <div key={b.dept}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-foreground">{b.dept}</span>
                <span className="text-xs text-muted-foreground">${b.spent.toLocaleString()} / ${b.allocated.toLocaleString()} <span className={`font-bold ml-1 ${b.remaining < 50000 ? 'text-red-500' : 'text-emerald-500'}`}>(${b.remaining.toLocaleString()} left)</span></span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                <span>{pct}% utilized</span>
                <button onClick={() => toast.info(`Viewing ${b.dept} budget breakdown`)} className="text-primary hover:underline">View Details</button>
              </div>
            </div>
          );
        })}
        <button onClick={() => toast.success('Full budget report generated')} className="w-full py-2.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">Generate Full Budget Report</button>
      </div>
    </div>
  );
}
