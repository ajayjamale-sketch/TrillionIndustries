import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Cpu, Plus, Search, Activity, Thermometer, Wind, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Sensor {
  id: string;
  name: string;
  asset: string;
  metricType: 'Temperature' | 'Vibration' | 'Pressure';
  value: string;
  health: number;
  status: 'Online' | 'Offline';
}

const INITIAL_SENSORS: Sensor[] = [
  { id: 'SEN-881', name: 'Spindle Temperature Monitor', asset: 'CNC Milling Center #1', metricType: 'Temperature', value: '42.5°C', health: 98, status: 'Online' },
  { id: 'SEN-882', name: 'Main Bearing Vibration Sensor', asset: 'CNC Lathe #2', metricType: 'Vibration', value: '1.8 mm/s', health: 94, status: 'Online' },
  { id: 'SEN-883', name: 'Hydraulic Seals Pressure Node', asset: 'Hydraulic Press', metricType: 'Pressure', value: '185 Bar', health: 89, status: 'Online' },
];

export function IIoTSensorsPage({ user }: { user: User }) {
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [telemetry, setTelemetry] = useState<{ time: string; val: number }[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [asset, setAsset] = useState('');
  const [metricType, setMetricType] = useState<'Temperature' | 'Vibration' | 'Pressure'>('Temperature');

  // Simulate real-time logs
  useEffect(() => {
    const data = [];
    const baseTime = Date.now();
    for (let i = 10; i >= 0; i--) {
      const time = new Date(baseTime - i * 5000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      data.push({ time, val: Math.round(35 + Math.random() * 15) });
    }
    setTelemetry(data);

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTelemetry(prev => [...prev.slice(1), { time, val: Math.round(35 + Math.random() * 15) }]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !asset.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    const val = metricType === 'Temperature' ? '32.0°C' : metricType === 'Pressure' ? '120 Bar' : '0.5 mm/s';

    const newSensor: Sensor = {
      id: `SEN-${880 + sensors.length + 1}`,
      name,
      asset,
      metricType,
      value: val,
      health: 100,
      status: 'Online'
    };

    setSensors([...sensors, newSensor]);
    setShowNew(false);
    toast.success(`Registered sensor: ${newSensor.id}`);

    // Reset Form
    setName('');
    setAsset('');
  };

  const handleToggleStatus = (id: string) => {
    setSensors(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Online' ? 'Offline' : 'Online';
        toast.info(`Sensor ${id} switched to ${nextStatus}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const filtered = sensors.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.asset.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />IIoT Sensors
          </h1>
          <p className="text-sm text-muted-foreground">Monitor real-time machinery vibration, temperature and telemetry pressure</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Register Sensor
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sensor Directory */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-foreground">Sensors Network</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sensors..."
                className="pl-8 pr-3 py-1 bg-muted border border-border text-xs rounded-lg outline-none w-32 focus:w-40 transition-all"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filtered.map(s => (
              <div key={s.id} className="py-3.5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    s.metricType === 'Temperature' ? 'bg-orange-500/10 text-orange-500' :
                    s.metricType === 'Pressure' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {s.metricType === 'Temperature' ? <Thermometer className="h-4 w-4" /> :
                     s.metricType === 'Pressure' ? <Wind className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.25 rounded font-semibold">{s.id}</span>
                      <p className="text-xs font-bold text-foreground">{s.name}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Asset: {s.asset}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] block text-muted-foreground">Live Telemetry</span>
                    <span className="text-xs font-bold text-foreground font-mono">{s.value}</span>
                  </div>

                  <StatusBadge variant={s.status === 'Online' ? 'success' : 'default'} size="sm">
                    {s.status}
                  </StatusBadge>

                  <button
                    onClick={() => handleToggleStatus(s.id)}
                    className="text-[10px] text-primary hover:underline font-semibold"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time telemetry feed */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" /> Live Telemetry Feed
            </h2>
            <p className="text-xs text-muted-foreground">CNC Milling Center Spindle Temperature (°C)</p>
          </div>

          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[30, 60]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="val" stroke="#F97316" fill="rgba(249, 115, 22, 0.1)" strokeWidth={2} name="Temp" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Register Sensor Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Register IIoT Sensor</h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Sensor Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spindle Vibration Sensor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Connected Machinery *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC Milling Center #1"
                  value={asset}
                  onChange={e => setAsset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Metric Type</label>
                <select
                  value={metricType}
                  onChange={e => setMetricType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                >
                  <option value="Temperature">Temperature</option>
                  <option value="Vibration">Vibration</option>
                  <option value="Pressure">Pressure</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Register Sensor
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
