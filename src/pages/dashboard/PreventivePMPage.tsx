import { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface ChecklistItem {
  id: string;
  task: string;
  checked: boolean;
}

interface PMChecklist {
  id: string;
  asset: string;
  program: string;
  due: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  items: ChecklistItem[];
}

const INITIAL_PM_CHECKS: PMChecklist[] = [
  {
    id: 'PM-CL-901',
    asset: 'CNC Milling Center #1',
    program: 'Quarterly Lubrication & Seal Service',
    due: '2026-06-05',
    status: 'In Progress',
    items: [
      { id: '1', task: 'Drain and refill spindle cooling unit oil reservoirs.', checked: true },
      { id: '2', task: 'Check pneumatic pressure valves for leak bubbles.', checked: false },
      { id: '3', task: 'Inspect axis lead screws and apply lithium grease grease.', checked: true },
      { id: '4', task: 'Verify safety door microswitch triggers.', checked: false },
    ]
  },
  {
    id: 'PM-CL-902',
    asset: 'Hydraulic Press',
    program: 'Monthly Safety & Pressure Check',
    due: '2026-06-12',
    status: 'Pending',
    items: [
      { id: '1', task: 'Test emergency stop buttons and safety light curtains.', checked: false },
      { id: '2', task: 'Verify hydraulic cylinder seals for oil seepage.', checked: false },
      { id: '3', task: 'Log pressure regulator settings (Target: 180 Bar).', checked: false }
    ]
  }
];

export function PreventivePMPage({ user }: { user: User }) {
  const [checklists, setChecklists] = useState<PMChecklist[]>(INITIAL_PM_CHECKS);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const active = checklists[selectedIdx];

  const handleToggleItem = (itemId: string) => {
    setChecklists(prev => prev.map((cl, idx) => {
      if (idx === selectedIdx) {
        const updatedItems = cl.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        const allDone = updatedItems.every(i => i.checked);
        return {
          ...cl,
          items: updatedItems,
          status: allDone ? 'Completed' : 'In Progress'
        };
      }
      return cl;
    }));
  };

  const handleCompleteChecklist = () => {
    if (!active) return;
    setChecklists(prev => prev.map((cl, idx) => {
      if (idx === selectedIdx) {
        toast.success(`Preventive PM task completed for ${cl.asset}`);
        return {
          ...cl,
          status: 'Completed',
          items: cl.items.map(i => ({ ...i, checked: true }))
        };
      }
      return cl;
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />Preventive PM
        </h1>
        <p className="text-sm text-muted-foreground">Log Standard Operating Procedure (SOP) safety checksheets and grease checks</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Checksheets Selector */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase">PM Checksheets</h2>
          <div className="space-y-2">
            {checklists.map((cl, i) => (
              <div
                key={cl.id}
                onClick={() => setSelectedIdx(i)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedIdx === i ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground font-semibold">{cl.id}</span>
                  <StatusBadge variant={cl.status === 'Completed' ? 'success' : cl.status === 'In Progress' ? 'warning' : 'default'} size="sm">
                    {cl.status}
                  </StatusBadge>
                </div>
                <p className="text-xs font-bold text-foreground">{cl.asset}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{cl.program}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Checklist Items */}
        <div className="lg:col-span-2">
          {active ? (
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="flex justify-between items-start border-b border-border/40 pb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{active.asset}</h3>
                  <p className="text-xs text-muted-foreground">{active.program}</p>
                </div>
                {active.status !== 'Completed' && (
                  <button
                    onClick={handleCompleteChecklist}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                  >
                    Mark All Done
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {active.items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => active.status !== 'Completed' && handleToggleItem(item.id)}
                    className={`p-3 border border-border rounded-xl flex items-start gap-3 transition-colors ${
                      active.status !== 'Completed' ? 'cursor-pointer hover:bg-muted/40' : ''
                    }`}
                  >
                    {item.checked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>Roster Target date: {active.due}</span>
                <span>
                  {active.items.filter(i => i.checked).length} of {active.items.length} checklist points verified
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center bg-card border border-border p-8 rounded-xl text-muted-foreground">
              Select a checksheet from the checklist sidebar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
