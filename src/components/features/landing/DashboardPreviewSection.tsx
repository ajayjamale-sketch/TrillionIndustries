import { useState } from 'react';
import { TrendingUp, Package, Cpu, AlertCircle, CheckCircle2, Activity, BarChart2 } from 'lucide-react';

const METRICS = [
  { label: 'Production Rate', value: '98.4%', trend: '+2.1%', up: true },
  { label: 'Orders Active', value: '1,247', trend: '+14', up: true },
  { label: 'Stock Alerts', value: '3', trend: '-8', up: false },
  { label: 'Equipment Health', value: '96.2%', trend: '+0.8%', up: true },
];

const PRODUCTION_DATA = [65, 72, 68, 78, 85, 82, 91, 88, 94, 96, 98, 95];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WORK_ORDERS = [
  { id: 'WO-4421', product: 'Steel Shaft Assembly', line: 'Line A', progress: 78, done: false },
  { id: 'WO-4422', product: 'Hydraulic Cylinder', line: 'Line B', progress: 45, done: false },
  { id: 'WO-4423', product: 'Bearing Housing', line: 'Line C', progress: 100, done: true },
  { id: 'WO-4424', product: 'Pump Impeller', line: 'Line A', progress: 12, done: false },
];

const maxVal = Math.max(...PRODUCTION_DATA);

export function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<'production' | 'inventory' | 'assets'>('production');

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-primary rounded-sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Live Platform</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                Complete visibility across<br className="hidden sm:block" /> all operations
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl ml-4 pl-4 border-l-2 border-border">
            Purpose-built dashboards for every industrial function — from shop floor operations to boardroom analytics.
          </p>
        </div>

        {/* Mock Dashboard */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
          {/* Browser bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/50">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground font-mono">
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                </div>
                app.trillionindustries.com/dashboard
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            {/* Module Tabs */}
            <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
              {[
                { id: 'production', label: 'Production', icon: BarChart2 },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'assets', label: 'IIoT & Assets', icon: Cpu },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-brand'
                        : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {METRICS.map(m => (
                <div key={m.label} className="bg-muted/40 border border-border rounded-lg p-3.5">
                  <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wide font-medium">{m.label}</p>
                  <p className="text-lg font-black text-foreground">{m.value}</p>
                  <p className={`text-[11px] font-semibold mt-0.5 ${m.up ? 'text-emerald-500' : 'text-red-400'}`}>
                    {m.trend} vs last week
                  </p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Bar chart */}
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-foreground">Production Efficiency</h4>
                  <span className="text-xs text-muted-foreground">Last 12 months</span>
                </div>
                <div className="flex items-end gap-1 h-24">
                  {PRODUCTION_DATA.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full rounded-sm bg-primary/60 hover:bg-primary transition-colors cursor-pointer"
                        style={{ height: `${(val / maxVal) * 100}%` }}
                        title={`${MONTHS[i]}: ${val}%`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {MONTHS.filter((_, i) => i % 3 === 0).map(m => (
                    <span key={m} className="text-[10px] text-muted-foreground">{m}</span>
                  ))}
                </div>
              </div>

              {/* Work orders */}
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-foreground">Active Work Orders</h4>
                  <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                </div>
                <div className="space-y-2.5">
                  {WORK_ORDERS.map(wo => (
                    <div key={wo.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-muted-foreground">{wo.id}</span>
                          <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">{wo.product}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {wo.done ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-amber-400" />
                          )}
                          <span className={`text-[11px] font-bold ${wo.done ? 'text-emerald-500' : 'text-amber-400'}`}>
                            {wo.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${wo.done ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${wo.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
