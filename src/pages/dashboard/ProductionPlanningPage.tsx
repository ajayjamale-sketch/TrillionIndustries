import { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const CALENDAR_ITEMS = [
  { date: 'Jun 2', title: 'WO-4421 Steel Shaft', line: 'Line A', shift: 'Day', qty: 500, color: 'bg-blue-500' },
  { date: 'Jun 2', title: 'WO-4422 Hydraulic Cyl.', line: 'Line B', shift: 'Day', qty: 200, color: 'bg-emerald-500' },
  { date: 'Jun 3', title: 'WO-4424 Pump Impeller', line: 'Line A', shift: 'Day', qty: 300, color: 'bg-orange-500' },
  { date: 'Jun 3', title: 'WO-4425 Valve Assy', line: 'Line D', shift: 'Evening', qty: 400, color: 'bg-purple-500' },
  { date: 'Jun 4', title: 'WO-4426 Gear Housing', line: 'Line C', shift: 'Day', qty: 250, color: 'bg-blue-500' },
  { date: 'Jun 5', title: 'WO-4427 Bearing Cap', line: 'Line B', shift: 'Day', qty: 600, color: 'bg-emerald-500' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATES = [2, 3, 4, 5, 6, 7, 8];

const SCHEDULE_BOARD = [
  { line: 'Line A', capacity: 360, orders: [{ id: 'WO-4421', name: 'Steel Shaft', hrs: 6, pct: 60 }, { id: 'WO-4424', name: 'Pump Impeller', hrs: 2.5, pct: 25 }] },
  { line: 'Line B', capacity: 200, orders: [{ id: 'WO-4422', name: 'Hydraulic Cyl.', hrs: 8, pct: 80 }] },
  { line: 'Line C', capacity: 250, orders: [] },
  { line: 'Line D', capacity: 200, orders: [{ id: 'WO-4425', name: 'Valve Assembly', hrs: 5, pct: 50 }] },
];

export function ProductionPlanningPage({ user }: { user: User }) {
  const [view, setView] = useState<'calendar' | 'board' | 'capacity'>('board');
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Production Planning</h1><p className="text-sm text-muted-foreground mt-0.5">Scheduling board and capacity planning</p></div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
            {[['board', 'Schedule Board'], ['calendar', 'Calendar'], ['capacity', 'Capacity']].map(([id, label]) => (
              <button key={id} onClick={() => setView(id as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{label}</button>
            ))}
          </div>
          <button onClick={() => toast.success('New production plan created')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />New Plan</button>
        </div>
      </div>

      {view === 'board' && (
        <div className="space-y-3">
          {SCHEDULE_BOARD.map(line => (
            <div key={line.line} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">{line.line}</span>
                  <span className="text-xs text-muted-foreground">Capacity: {line.capacity} units/day</span>
                </div>
                <button onClick={() => toast.success(`New work order assigned to ${line.line}`)} className="flex items-center gap-1 text-xs text-primary hover:underline"><Plus className="h-3 w-3" />Assign WO</button>
              </div>
              {line.orders.length === 0 ? (
                <div className="h-12 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground">No work orders assigned — drag to schedule</div>
              ) : (
                <div className="flex gap-2">
                  {line.orders.map(wo => (
                    <div key={wo.id} onClick={() => toast.info(`Opening ${wo.id}`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
                      <div className="w-2 h-8 rounded-full bg-primary shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{wo.id}</p>
                        <p className="text-[11px] text-muted-foreground">{wo.name} · {wo.hrs}h · {wo.pct}%</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex-1 h-12 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground cursor-pointer hover:border-primary/30 transition-colors" onClick={() => toast.info('Assigning work order')}>+ Add</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info('Previous week')} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm font-bold text-foreground">June 2 – 8, 2026</span>
              <button onClick={() => toast.info('Next week')} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {DAYS.map((day, i) => (
              <div key={day} className="bg-card">
                <div className="p-3 border-b border-border text-center">
                  <p className="text-xs text-muted-foreground">{day}</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{DATES[i]}</p>
                </div>
                <div className="p-2 min-h-[120px] space-y-1">
                  {CALENDAR_ITEMS.filter(c => c.date === `Jun ${DATES[i]}`).map((item, j) => (
                    <div key={j} onClick={() => toast.info(`Opening ${item.title}`)}
                      className={`${item.color} text-white text-[11px] font-medium px-2 py-1 rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}>
                      <p className="truncate">{item.title}</p>
                      <p className="opacity-80">{item.line}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'capacity' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Capacity Utilization — This Week</h3>
          {SCHEDULE_BOARD.map(line => {
            const used = line.orders.reduce((acc, o) => acc + o.pct, 0);
            return (
              <div key={line.line}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground">{line.line}</span>
                  <span className={`font-bold ${used > 80 ? 'text-emerald-500' : used > 50 ? 'text-amber-500' : 'text-red-500'}`}>{used}% utilized</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${used > 80 ? 'bg-emerald-500' : used > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${used}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{line.orders.length} work order(s) · {line.capacity} unit capacity</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
