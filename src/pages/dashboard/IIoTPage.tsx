import { useState, useEffect } from 'react';
import { 
  Cpu, Activity, AlertTriangle, CheckCircle2, Clock, 
  Plus, Settings, Zap, ArrowRight, Play, Pause, X, RefreshCw, 
  Thermometer, ShieldAlert, BarChart3, Database, Radio
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Sensor {
  id: string;
  name: string;
  machine: string;
  type: 'Temperature' | 'Vibration' | 'Pressure' | 'Flow';
  value: number;
  unit: string;
  threshold: number;
  status: 'Online' | 'Alert' | 'Offline';
}

const INITIAL_SENSORS: Sensor[] = [
  { id: 'SEN-101', name: 'Temp Probe T1', machine: 'Hydraulic Press A', type: 'Temperature', value: 72.4, unit: '°C', threshold: 85, status: 'Online' },
  { id: 'SEN-102', name: 'Vibe Guard V1', machine: 'Hydraulic Press A', type: 'Vibration', value: 4.8, unit: 'mm/s', threshold: 4.5, status: 'Alert' },
  { id: 'SEN-103', name: 'Pressure Gauge P1', machine: 'CNC Lathe B1', type: 'Pressure', value: 4.2, unit: 'bar', threshold: 5.5, status: 'Online' },
  { id: 'SEN-104', name: 'Flow Sensor F1', machine: 'Injection Molder D', type: 'Flow', value: 28.5, unit: 'L/min', threshold: 35, status: 'Online' },
  { id: 'SEN-105', name: 'Temp Sensor T2', machine: 'Air Compressor E2', type: 'Temperature', value: 68.1, unit: '°C', threshold: 80, status: 'Online' },
  { id: 'SEN-106', name: 'Vibe Sensor V2', machine: 'CNC Lathe B1', type: 'Vibration', value: 1.2, unit: 'mm/s', threshold: 4.0, status: 'Online' },
  { id: 'SEN-107', name: 'Pressure Gauge P2', machine: 'Air Compressor E2', type: 'Pressure', value: 8.4, unit: 'bar', threshold: 10.0, status: 'Online' },
  { id: 'SEN-108', name: 'Flow Meter F2', machine: 'Conveyor Line C', type: 'Flow', value: 0.0, unit: 'L/min', threshold: 10, status: 'Offline' },
];

const INITIAL_TELEMETRY = [
  { time: '14:30:00', temperature: 72.4, vibration: 2.1, pressure: 4.2 },
  { time: '14:30:05', temperature: 72.8, vibration: 2.3, pressure: 4.1 },
  { time: '14:30:10', temperature: 73.1, vibration: 3.8, pressure: 4.3 },
  { time: '14:30:15', temperature: 73.5, vibration: 4.8, pressure: 4.2 },
  { time: '14:30:20', temperature: 72.9, vibration: 3.2, pressure: 4.1 },
  { time: '14:30:25', temperature: 72.2, vibration: 2.5, pressure: 4.2 },
];

export function IIoTPage({ user }: { user: User }) {
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [isSimulating, setIsSimulating] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  // Add Sensor form state
  const [sName, setSName] = useState('');
  const [sMachine, setSMachine] = useState('Hydraulic Press A');
  const [sType, setSType] = useState<'Temperature' | 'Vibration' | 'Pressure' | 'Flow'>('Temperature');
  const [sThreshold, setSThreshold] = useState(80);
  const [sUnit, setSUnit] = useState('°C');

  // Rules form state
  const [ruleThreshold, setRuleThreshold] = useState(0);

  const openAddModal = () => {
    setSName('');
    setSMachine('Hydraulic Press A');
    setSType('Temperature');
    setSThreshold(80);
    setSUnit('°C');
    setIsAddModalOpen(true);
  };

  // Live simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // 1. Simulate telemetry graphs
      setTelemetry(prev => {
        const nextTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const last = prev[prev.length - 1];
        
        // Random walks
        const newTemp = Math.round((last.temperature + (Math.random() - 0.5) * 1.2) * 10) / 10;
        const newVibe = Math.round(Math.max(0.5, last.vibration + (Math.random() - 0.5) * 0.8) * 10) / 10;
        const newPress = Math.round(Math.max(1, last.pressure + (Math.random() - 0.5) * 0.4) * 10) / 10;

        const updated = [...prev.slice(1), { time: nextTime, temperature: newTemp, vibration: newVibe, pressure: newPress }];
        return updated;
      });

      // 2. Simulate random fluctuations on sensors
      setSensors(prev =>
        prev.map(s => {
          if (s.status === 'Offline') return s;
          
          let change = (Math.random() - 0.5) * (s.type === 'Temperature' ? 1.5 : s.type === 'Vibration' ? 0.6 : 0.2);
          let newVal = Math.round(Math.max(0, s.value + change) * 10) / 10;
          let newStatus: 'Online' | 'Alert' = newVal >= s.threshold ? 'Alert' : 'Online';
          
          return { ...s, value: newVal, status: newStatus };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleCreateSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) {
      toast.error('Please enter a sensor description');
      return;
    }
    const newSensor: Sensor = {
      id: `SEN-${100 + sensors.length + 1}`,
      name: sName,
      machine: sMachine,
      type: sType,
      value: sType === 'Temperature' ? 65 : sType === 'Vibration' ? 1.5 : sType === 'Pressure' ? 3.5 : 20,
      unit: sUnit || (sType === 'Temperature' ? '°C' : sType === 'Vibration' ? 'mm/s' : sType === 'Pressure' ? 'bar' : 'L/min'),
      threshold: sThreshold,
      status: 'Online'
    };
    setSensors(prev => [...prev, newSensor]);
    setIsAddModalOpen(false);
    toast.success(`Registered Sensor ${newSensor.id} on plant network`);
  };

  const handleUpdateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSensor) return;

    setSensors(prev =>
      prev.map(s =>
        s.id === selectedSensor.id
          ? { ...s, threshold: ruleThreshold, status: s.value >= ruleThreshold ? 'Alert' : 'Online' }
          : s
      )
    );
    setIsRulesModalOpen(false);
    toast.success(`Alarm threshold for ${selectedSensor.id} updated to ${ruleThreshold} ${selectedSensor.unit}`);
  };

  const handlePing = (id: string) => {
    toast.info(`Pinged device ${id}... Connection stable (RTT: 14ms)`);
  };

  const handleResetTelemetry = () => {
    setSensors(INITIAL_SENSORS);
    setTelemetry(INITIAL_TELEMETRY);
    toast.success('IIoT network sensors recalibrated');
  };

  const filteredSensors = sensors.filter(s => {
    const matchesFilter = filter === 'All' || s.type === filter;
    return matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-500" />
            IIoT Central Monitoring
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time edge telemetry and industrial device configurations</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
          >
            <Plus className="h-4 w-4" />
            Register Sensor
          </button>
          <button 
            type="button"
            onClick={handleResetTelemetry}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
            title="Recalibrate Sensors"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Network Alert Banner */}
      {sensors.filter(s => s.status === 'Alert').length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <span className="font-semibold">Threshold Violations Detected:</span> {sensors.filter(s => s.status === 'Alert').length} sensor alarms active. High values registered on {sensors.filter(s => s.status === 'Alert').map(s => s.machine).join(', ')}.
          </p>
          <button 
            type="button" 
            onClick={() => {
              setSensors(prev => prev.map(s => s.status === 'Alert' ? { ...s, threshold: s.threshold + 5 } : s));
              toast.success('Muted alerts: threshold rules slightly expanded');
            }} 
            className="ml-auto shrink-0 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
          >
            Acknowledge Alerts
          </button>
        </div>
      )}

      {/* Grid Status KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sensors Registered', value: `${sensors.length}`, change: `${sensors.filter(s => s.status === 'Online').length} Online`, icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Network Health', value: '99.8%', change: 'Low latency (15ms)', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Alarms', value: `${sensors.filter(s => s.status === 'Alert').length}`, change: 'Needs monitoring', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Data Points/Sec', value: '1,424', change: 'Live MQTT feed', icon: Radio, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
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

      {/* Main Charts & Floor plan status */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Industrial Telemetry Stream</h3>
              <p className="text-xs text-muted-foreground">Dynamic sensors feedback comparison</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold transition-colors"
            >
              {isSimulating ? (
                <>
                  <Pause className="h-3 w-3 text-red-500" />
                  Pause Stream
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-emerald-500" />
                  Resume Stream
                </>
              )}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={telemetry}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="temperature" stroke="#3B82F6" strokeWidth={2} dot={false} name="Probe T1 (°C)" />
              <Line type="monotone" dataKey="vibration" stroke="#F59E0B" strokeWidth={2} dot={false} name="Vibe V1 (mm/s)" />
              <Line type="monotone" dataKey="pressure" stroke="#10B981" strokeWidth={2} dot={false} name="Pressure P1 (bar)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Floorplan Layout Status */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Plant Layout Topology</h3>
          <div className="grid grid-cols-2 gap-3 h-[210px] items-stretch">
            <div className="border border-border/80 rounded-xl p-3 bg-muted/10 flex flex-col justify-between hover:border-primary/20 transition-all cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Block A</span>
              <div>
                <p className="text-sm font-bold text-foreground">Heavy Press</p>
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  1 Alert Active
                </p>
              </div>
            </div>
            <div className="border border-border/80 rounded-xl p-3 bg-muted/10 flex flex-col justify-between hover:border-primary/20 transition-all cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Block B</span>
              <div>
                <p className="text-sm font-bold text-foreground">CNC Lathes</p>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  All Sensors OK
                </p>
              </div>
            </div>
            <div className="border border-border/80 rounded-xl p-3 bg-muted/10 flex flex-col justify-between hover:border-primary/20 transition-all cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Block C</span>
              <div>
                <p className="text-sm font-bold text-foreground">Conveyor Line</p>
                <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  1 Offline Device
                </p>
              </div>
            </div>
            <div className="border border-border/80 rounded-xl p-3 bg-muted/10 flex flex-col justify-between hover:border-primary/20 transition-all cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Block D</span>
              <div>
                <p className="text-sm font-bold text-foreground">Molding Unit</p>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  All Sensors OK
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensors List Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex gap-1.5">
            {['All', 'Temperature', 'Vibration', 'Pressure', 'Flow'].map(t => (
              <button 
                key={t} 
                type="button"
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Sensor ID</th>
                <th className="text-left px-5 py-3 font-medium">Sensor Name</th>
                <th className="text-left px-5 py-3 font-medium">Machine Location</th>
                <th className="text-left px-5 py-3 font-medium">Live Reading</th>
                <th className="text-left px-5 py-3 font-medium">Alarm Threshold</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSensors.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground font-semibold">{s.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{s.name}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.machine}</td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className={`font-mono font-bold ${s.status === 'Alert' ? 'text-red-500 animate-pulse' : s.status === 'Offline' ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {s.value} {s.unit}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {s.threshold} {s.unit}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={s.status === 'Online' ? 'success' : s.status === 'Offline' ? 'warning' : 'error'} size="sm">
                      {s.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => handlePing(s.id)}
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        Ping
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSelectedSensor(s);
                          setRuleThreshold(s.threshold);
                          setIsRulesModalOpen(true);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline font-semibold"
                      >
                        Threshold
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Sensor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Register Industrial IoT Sensor</h2>
            <form onSubmit={handleCreateSensor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Sensor Description Name *</label>
                <input
                  type="text"
                  value={sName}
                  onChange={e => setSName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Temperature Probe T3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Machine *</label>
                  <select
                    value={sMachine}
                    onChange={e => setSMachine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Hydraulic Press A">Hydraulic Press A</option>
                    <option value="CNC Lathe B1">CNC Lathe B1</option>
                    <option value="Conveyor Line C">Conveyor Line C</option>
                    <option value="Injection Molder D">Injection Molder D</option>
                    <option value="Air Compressor E2">Air Compressor E2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Sensor Type</label>
                  <select
                    value={sType}
                    onChange={e => setSType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary font-semibold"
                  >
                    <option value="Temperature">Temperature</option>
                    <option value="Vibration">Vibration</option>
                    <option value="Pressure">Pressure</option>
                    <option value="Flow">Flow</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Alarm Threshold *</label>
                  <input
                    type="number"
                    value={sThreshold}
                    onChange={e => setSThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Unit Symbol</label>
                  <input
                    type="text"
                    value={sUnit}
                    onChange={e => setSUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. °C, bar, L/min"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Register Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Threshold Modal */}
      {isRulesModalOpen && selectedSensor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsRulesModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-1">Edit Threshold Rules</h2>
            <p className="text-xs text-muted-foreground mb-4">Device: {selectedSensor.name} ({selectedSensor.id})</p>
            <form onSubmit={handleUpdateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Alarm Trigger Level ({selectedSensor.unit}) *</label>
                <input
                  type="number"
                  value={ruleThreshold}
                  onChange={e => setRuleThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsRulesModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
