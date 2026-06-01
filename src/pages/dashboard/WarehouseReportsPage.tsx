import { BarChart3, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { User } from '@/types';

const movementData = [
  { week: 'W1', in: 840, out: 720 }, { week: 'W2', in: 620, out: 680 },
  { week: 'W3', in: 920, out: 800 }, { week: 'W4', in: 740, out: 760 },
];

export function WarehouseReportsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Warehouse Reports</h1><p className="text-sm text-muted-foreground">Inventory and movement analytics</p></div>
        <button onClick={() => toast.success('Generating warehouse report')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Total SKUs', value: '4,821' }, { label: 'Inventory Value', value: '$2.1M' }, { label: 'Turnover Rate', value: '8.4x' }, { label: 'Stockout Events (MTD)', value: '2' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Material Movement — Weekly (Goods In vs Out)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={movementData} barGap={4}>
            <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="in" fill="#1E40AF" radius={[3, 3, 0, 0]} name="Goods In" />
            <Bar dataKey="out" fill="#F97316" radius={[3, 3, 0, 0]} name="Goods Out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
