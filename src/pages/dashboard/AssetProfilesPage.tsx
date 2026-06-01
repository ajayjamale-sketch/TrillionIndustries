import { useState } from 'react';
import { FileText, Wrench, ShieldCheck, Heart, AlertOctagon, History, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface LifecycleLog {
  date: string;
  type: 'Preventive PM' | 'Breakdown Corrective' | 'Calibration';
  technician: string;
  remarks: string;
}

interface AssetProfile {
  id: string;
  name: string;
  location: string;
  status: string;
  installDate: string;
  mtbf: string;
  mttr: string;
  components: string[];
  historyLogs: LifecycleLog[];
}

const MACHINE_PROFILES: AssetProfile[] = [
  {
    id: 'AST-001',
    name: 'CNC Milling Center #1',
    location: 'Line A, Bay 1',
    status: 'Operational',
    installDate: '2023-04-10',
    mtbf: '240 hrs',
    mttr: '2.4 hrs',
    components: ['Spindle Motor VF-4', 'Coolant Pump Model C', 'XYZ Lead Screws'],
    historyLogs: [
      { date: '2026-05-15', type: 'Preventive PM', technician: 'James W.', remarks: 'Replaced spindle seals and topped off hydraulic fluids. Standard PM Checklist complete.' },
      { date: '2026-04-02', type: 'Calibration', technician: 'Alice K.', remarks: 'X-axis alignment recalibrated to within 0.002mm limits.' },
      { date: '2026-03-10', type: 'Breakdown Corrective', technician: 'Tom B.', remarks: 'Fixed coolant flow blockage. Cleaned nozzle valves.' }
    ]
  },
  {
    id: 'AST-002',
    name: 'CNC Lathe #2',
    location: 'Line A, Bay 3',
    status: 'Operational',
    installDate: '2024-02-15',
    mtbf: '320 hrs',
    mttr: '1.8 hrs',
    components: ['Chuck Assembly QTN', 'Turret Tool Indexer', 'Belt Drive System'],
    historyLogs: [
      { date: '2026-05-01', type: 'Preventive PM', technician: 'James W.', remarks: 'Belt tension checks passed. Hydraulic filter replaced.' }
    ]
  }
];

export function AssetProfilesPage({ user }: { user: User }) {
  const [profiles, setProfiles] = useState<AssetProfile[]>(MACHINE_PROFILES);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const active = profiles[selectedIdx];

  const handleAddLog = () => {
    const newLog: LifecycleLog = {
      date: new Date().toISOString().slice(0, 10),
      type: 'Preventive PM',
      technician: user.name,
      remarks: 'Inspected parameters. Systems running within standard thresholds.'
    };

    setProfiles(prev => prev.map((prof, i) => {
      if (i === selectedIdx) {
        toast.success(`Lifecycle compliance entry logged for ${prof.name}`);
        return {
          ...prof,
          historyLogs: [newLog, ...prof.historyLogs]
        };
      }
      return prof;
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">Asset Profiles</h1>
        <p className="text-sm text-muted-foreground">Drill down into individual machinery maintenance histories and lifecycle logs</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Selector Sidebar */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered Profiles</h2>
          <div className="space-y-2">
            {profiles.map((prof, i) => (
              <div
                key={prof.id}
                onClick={() => setSelectedIdx(i)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedIdx === i ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted text-foreground'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{prof.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{prof.id} · {prof.location}</p>
                </div>
                <ArrowRight className="h-4 w-4 opacity-60" />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Details Sheet */}
        <div className="lg:col-span-2 space-y-6">
          {active ? (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded border border-border">
                      {active.id}
                    </span>
                    <span className="text-xs text-muted-foreground">{active.location}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{active.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge variant={active.status === 'Operational' ? 'success' : 'default'} size="sm">
                    {active.status}
                  </StatusBadge>
                  <button
                    onClick={handleAddLog}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Log PM Check
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Mean Time Between Failures</span>
                  <p className="text-base font-bold text-foreground mt-1">{active.mtbf}</p>
                </div>
                <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Mean Time To Repair</span>
                  <p className="text-base font-bold text-foreground mt-1">{active.mttr}</p>
                </div>
                <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Installation Date</span>
                  <p className="text-xs font-bold text-foreground mt-2">{active.installDate}</p>
                </div>
              </div>

              {/* Components list */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase mb-2">Installed Components Checklist</h3>
                <div className="flex flex-wrap gap-2">
                  {active.components.map(c => (
                    <span key={c} className="text-[10px] bg-muted border border-border px-2.5 py-1 rounded text-muted-foreground font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timelines */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Lifecycle Maintenance Timelines
                </h3>

                <div className="space-y-3">
                  {active.historyLogs.map((log, i) => (
                    <div key={i} className="p-3 border border-border bg-muted/20 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.type === 'Breakdown Corrective' ? 'bg-red-500/10 text-red-600' :
                            log.type === 'Calibration' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-xs font-semibold text-foreground">Tech: {log.technician}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{log.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{log.remarks}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-card border border-border p-8 rounded-xl text-muted-foreground">
              Select an asset from the directory list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
