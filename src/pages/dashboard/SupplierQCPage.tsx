import { useState } from 'react';
import { Building2, Award, Download, ClipboardList, CheckCircle2, XCircle, Search, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface SupplierLot {
  id: string;
  supplier: string;
  material: string;
  qty: number;
  date: string;
  status: string; // Passed | Rejected | In Review
  score: number;
}

const INITIAL_LOTS: SupplierLot[] = [
  { id: 'LOT-9921', supplier: 'SteelPro Industries', material: 'Structural Bar Stock', qty: 2500, date: '2026-06-01', status: 'In Review', score: 92 },
  { id: 'LOT-9922', supplier: 'Apex Electricals', material: 'M12 Induction Sensors', qty: 500, date: '2026-05-30', status: 'Passed', score: 98 },
  { id: 'LOT-9923', supplier: 'HydraForce Logistics', material: 'High-Pressure Seal Kits', qty: 1200, date: '2026-05-28', status: 'Passed', score: 95 },
  { id: 'LOT-9924', supplier: 'SteelPro Industries', material: 'Hot Rolled Sheet Plates', qty: 150, date: '2026-05-25', status: 'Rejected', score: 78 },
  { id: 'LOT-9925', supplier: 'Vanguard Castings', material: 'Pump Housing Castings', qty: 350, date: '2026-06-02', status: 'In Review', score: 85 },
];

const acceptanceTrend = [
  { month: 'Jan', rate: 95.8 },
  { month: 'Feb', rate: 96.2 },
  { month: 'Mar', rate: 94.9 },
  { month: 'Apr', rate: 97.1 },
  { month: 'May', rate: 96.8 },
  { month: 'Jun', rate: 98.2 },
];

export function SupplierQCPage({ user }: { user: User }) {
  const [lots, setLots] = useState<SupplierLot[]>(INITIAL_LOTS);
  const [search, setSearch] = useState('');

  const handleRelease = (lotId: string) => {
    setLots(prev => prev.map(lot => {
      if (lot.id === lotId) {
        toast.success(`Lot ${lotId} released to inventory successfully`);
        return { ...lot, status: 'Passed' };
      }
      return lot;
    }));
  };

  const handleReject = (lotId: string) => {
    setLots(prev => prev.map(lot => {
      if (lot.id === lotId) {
        toast.error(`Lot ${lotId} rejected. Action recorded in NCR queue.`);
        return { ...lot, status: 'Rejected' };
      }
      return lot;
    }));
  };

  const filtered = lots.filter(lot =>
    lot.supplier.toLowerCase().includes(search.toLowerCase()) ||
    lot.material.toLowerCase().includes(search.toLowerCase()) ||
    lot.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Supplier QC</h1>
          <p className="text-sm text-muted-foreground">Manage incoming material Quality Control and supplier performance metrics</p>
        </div>
        <button
          onClick={() => {
            toast.info('Generating raw supplier ratings spreadsheet...');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors text-foreground bg-card"
        >
          <Download className="h-4 w-4" /> Export Lots Log
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lots Checked MTD', value: `${lots.length}`, detail: 'All suppliers', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Lot Acceptance Rate', value: '96.2%', detail: 'Target: 95%', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Pending Inspections', value: `${lots.filter(l => l.status === 'In Review').length}`, detail: 'On hold in receiving', icon: Building2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Defect Lots Found', value: `${lots.filter(l => l.status === 'Rejected').length}`, detail: 'NCRs generated', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lots List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <h2 className="text-sm font-bold text-foreground">Incoming Cargo Inspection</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lots/supplier..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No supplier quality lots match your filters.
              </div>
            ) : (
              filtered.map(lot => (
                <div key={lot.id} className="py-3.5 flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-mono">
                        {lot.id}
                      </span>
                      <p className="text-xs font-bold text-foreground">{lot.supplier}</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {lot.material} · Quantity: {lot.qty.toLocaleString()} units
                    </p>
                    <p className="text-[10px] text-muted-foreground">Date Received: {lot.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] block text-muted-foreground">Lot Score</span>
                      <span className={`text-xs font-bold ${lot.score >= 90 ? 'text-emerald-600' : lot.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                        {lot.score}%
                      </span>
                    </div>

                    <StatusBadge
                      variant={
                        lot.status === 'Passed' ? 'success' :
                        lot.status === 'Rejected' ? 'error' :
                        'warning'
                      }
                      size="sm"
                    >
                      {lot.status}
                    </StatusBadge>

                    {lot.status === 'In Review' && (
                      <div className="flex gap-1.5 ml-1">
                        <button
                          onClick={() => handleRelease(lot.id)}
                          className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-colors"
                          title="Release Lot"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(lot.id)}
                          className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                          title="Reject Lot"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Acceptance Trend Graph */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">Supplier Quality Index</h2>
            <p className="text-xs text-muted-foreground">Overall supplier acceptance rate MTD</p>
          </div>

          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={acceptanceTrend}>
                <defs>
                  <linearGradient id="acceptColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="rate" stroke="#10B981" fill="url(#acceptColor)" strokeWidth={2} name="Acceptance Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-muted/40 border border-border p-3.5 rounded-xl flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Pro-Tip:</span> SteelPro Casting lines show improved dimensional conformance ratios (+4.2%) compared to last month after the certification SOP upgrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
