import { useState } from 'react';
import { TrendingUp, Package, Cpu, AlertCircle, CheckCircle2, Activity, BarChart2 } from 'lucide-react';

type TabType = 'production' | 'inventory' | 'assets';

interface Metric {
  label: string;
  value: string;
  trend: string;
  up: boolean;
}

interface ListItem {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  done: boolean;
}

interface ChartData {
  title: string;
  subtitle: string;
  data: number[];
  labels: string[];
}

const TAB_DATA: Record<
  TabType,
  {
    metrics: Metric[];
    chart: ChartData;
    list: {
      title: string;
      items: ListItem[];
    };
  }
> = {
  production: {
    metrics: [
      { label: 'Production Rate', value: '98.4%', trend: '+2.1%', up: true },
      { label: 'Orders Active', value: '1,247', trend: '+14', up: true },
      { label: 'Stock Alerts', value: '3', trend: '-8', up: false },
      { label: 'Equipment Health', value: '96.2%', trend: '+0.8%', up: true },
    ],
    chart: {
      title: 'Production Efficiency',
      subtitle: 'Last 12 months',
      data: [65, 72, 68, 78, 85, 82, 91, 88, 94, 96, 98, 95],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    list: {
      title: 'Active Work Orders',
      items: [
        { id: 'WO-4421', title: 'Steel Shaft Assembly', subtitle: 'Line A', progress: 78, done: false },
        { id: 'WO-4422', title: 'Hydraulic Cylinder', subtitle: 'Line B', progress: 45, done: false },
        { id: 'WO-4423', title: 'Bearing Housing', subtitle: 'Line C', progress: 100, done: true },
        { id: 'WO-4424', title: 'Pump Impeller', subtitle: 'Line A', progress: 12, done: false },
      ],
    },
  },
  inventory: {
    metrics: [
      { label: 'Warehouse Capacity', value: '82.4%', trend: '+4.2%', up: true },
      { label: 'SKUs Monitored', value: '4,850', trend: '+120', up: true },
      { label: 'Critical Stock Alerts', value: '12', trend: '-4', up: false },
      { label: 'Daily Dispatched', value: '189 Tons', trend: '+12%', up: true },
    ],
    chart: {
      title: 'Stock Levels by Category',
      subtitle: 'Current allocation (%)',
      data: [85, 62, 45, 90, 75, 58, 68, 82, 70, 64, 88, 79],
      labels: ['Steel', 'Alum', 'Fast', 'Hydr', 'Copp', 'Paint', 'Tubing', 'Alloys', 'Resins', 'Glass', 'Plastics', 'Rubber'],
    },
    list: {
      title: 'Restock Requests',
      items: [
        { id: 'REQ-8891', title: 'Stainless Steel Sheet 2mm', subtitle: 'Awaiting Approval', progress: 30, done: false },
        { id: 'REQ-8892', title: 'Hydraulic Valves 12V', subtitle: 'In Transit', progress: 75, done: false },
        { id: 'REQ-8893', title: 'Hex Bolts M12 Grade 8.8', subtitle: 'Received', progress: 100, done: true },
        { id: 'REQ-8894', title: 'Industrial Paint Primer', subtitle: 'Draft', progress: 10, done: false },
      ],
    },
  },
  assets: {
    metrics: [
      { label: 'Overall OEE', value: '87.5%', trend: '+1.8%', up: true },
      { label: 'Total Active Sensors', value: '3,412', trend: '+45', up: true },
      { label: 'Anomalies Detected', value: '2', trend: '0', up: true },
      { label: 'Scheduled Maintenance', value: '4', trend: '-2', up: false },
    ],
    chart: {
      title: 'Machine Vibration Levels',
      subtitle: 'Frequency response (Hz)',
      data: [30, 42, 38, 48, 55, 60, 75, 82, 90, 95, 102, 110],
      labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
    },
    list: {
      title: 'Critical Machinery Status',
      items: [
        { id: 'CNC-01', title: '5-Axis CNC Mill', subtitle: 'Running / Normal', progress: 95, done: true },
        { id: 'PRS-04', title: '150-Ton Hydraulic Press', subtitle: 'High Temperature Alert', progress: 72, done: false },
        { id: 'ROB-12', title: 'Robotic Welding Arm', subtitle: 'Calibration Due', progress: 60, done: false },
        { id: 'CMP-02', title: 'Air Compressor Main', subtitle: 'Running / Normal', progress: 100, done: true },
      ],
    },
  },
};

export function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<TabType>('production');
  const currentData = TAB_DATA[activeTab];
  const maxVal = Math.max(...currentData.chart.data);

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
              <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
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
                    onClick={() => setActiveTab(tab.id as TabType)}
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
              {currentData.metrics.map(m => (
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
                  <h4 className="text-sm font-bold text-foreground">{currentData.chart.title}</h4>
                  <span className="text-xs text-muted-foreground">{currentData.chart.subtitle}</span>
                </div>
                <div className="flex items-end gap-1 h-24">
                  {currentData.chart.data.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full rounded-sm bg-primary/60 hover:bg-primary transition-colors cursor-pointer"
                        style={{ height: `${(val / maxVal) * 100}%` }}
                        title={`${currentData.chart.labels[i]}: ${val}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {currentData.chart.labels.filter((_, i) => i % 3 === 0).map(m => (
                    <span key={m} className="text-[10px] text-muted-foreground">{m}</span>
                  ))}
                </div>
              </div>

              {/* Work orders / List */}
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-foreground">{currentData.list.title}</h4>
                  <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                </div>
                <div className="space-y-2.5">
                  {currentData.list.items.map(item => (
                    <div key={item.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">{item.id}</span>
                          <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                          <span className="text-[10px] text-muted-foreground truncate">({item.subtitle})</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.done ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-amber-400" />
                          )}
                          <span className={`text-[11px] font-bold ${item.done ? 'text-emerald-500' : 'text-amber-400'}`}>
                            {item.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${item.done ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${item.progress}%` }}
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
