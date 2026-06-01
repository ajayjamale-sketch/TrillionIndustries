import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, X, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

interface Order {
  id: string;
  name: string;
  hrs: number;
  pct: number;
  qty?: number;
  date?: string;
}

interface ScheduleLine {
  line: string;
  capacity: number;
  orders: Order[];
}

interface CalendarItem {
  date: string;
  title: string;
  line: string;
  shift: string;
  qty: number;
  color: string;
  orderId: string;
}

const INITIAL_CALENDAR_ITEMS: CalendarItem[] = [
  { date: 'Jun 2', title: 'Steel Shaft Assembly', line: 'Line A', shift: 'Day', qty: 500, color: 'bg-blue-500', orderId: 'WO-4421' },
  { date: 'Jun 2', title: 'Hydraulic Cylinder', line: 'Line B', shift: 'Day', qty: 200, color: 'bg-emerald-500', orderId: 'WO-4422' },
  { date: 'Jun 3', title: 'Pump Impeller', line: 'Line A', shift: 'Day', qty: 300, color: 'bg-orange-500', orderId: 'WO-4424' },
  { date: 'Jun 3', title: 'Valve Assembly', line: 'Line D', shift: 'Evening', qty: 400, color: 'bg-purple-500', orderId: 'WO-4425' },
];

const INITIAL_SCHEDULE_BOARD: ScheduleLine[] = [
  { line: 'Line A', capacity: 360, orders: [{ id: 'WO-4421', name: 'Steel Shaft Assembly', hrs: 6, pct: 60, qty: 500, date: 'Jun 2' }, { id: 'WO-4424', name: 'Pump Impeller', hrs: 2.5, pct: 25, qty: 300, date: 'Jun 3' }] },
  { line: 'Line B', capacity: 200, orders: [{ id: 'WO-4422', name: 'Hydraulic Cylinder', hrs: 8, pct: 80, qty: 200, date: 'Jun 2' }] },
  { line: 'Line C', capacity: 250, orders: [] },
  { line: 'Line D', capacity: 200, orders: [{ id: 'WO-4425', name: 'Valve Assembly', hrs: 5, pct: 50, qty: 400, date: 'Jun 3' }] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ProductionPlanningPage({ user }: { user: User }) {
  const [view, setView] = useState<'calendar' | 'board' | 'capacity'>('board');
  const [board, setBoard] = useState<ScheduleLine[]>(INITIAL_SCHEDULE_BOARD);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>(INITIAL_CALENDAR_ITEMS);
  
  // Week navigation state
  const [weekOffset, setWeekOffset] = useState(0);
  const baseDates = [2, 3, 4, 5, 6, 7, 8].map(d => d + weekOffset * 7);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>('Line A');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItemLine, setSelectedItemLine] = useState<string>('');

  // Form states
  const [form, setForm] = useState({
    id: '',
    name: '',
    hrs: 4,
    pct: 40,
    qty: 100,
    date: 'Jun 2',
    shift: 'Day',
    color: 'bg-blue-500'
  });

  const generateWoId = () => {
    let count = 4426;
    board.forEach(l => {
      l.orders.forEach(o => {
        const num = parseInt(o.id.replace('WO-', ''));
        if (num >= count) count = num + 1;
      });
    });
    return `WO-${count}`;
  };

  const handleOpenAdd = (lineName: string) => {
    setSelectedLine(lineName);
    setForm({
      id: generateWoId(),
      name: '',
      hrs: 4,
      pct: 40,
      qty: 250,
      date: 'Jun 2',
      shift: 'Day',
      color: 'bg-blue-500'
    });
    setShowAddModal(true);
  };

  const handleSaveWO = () => {
    if (!form.name.trim()) {
      toast.error('Please enter a product description');
      return;
    }

    const newOrder: Order = {
      id: form.id,
      name: form.name,
      hrs: Number(form.hrs),
      pct: Number(form.pct),
      qty: Number(form.qty),
      date: form.date,
    };

    // Update Schedule Board State
    setBoard(prev => prev.map(l => {
      if (l.line === selectedLine) {
        return {
          ...l,
          orders: [...l.orders, newOrder]
        };
      }
      return l;
    }));

    // Update Calendar Items State
    const newCalItem: CalendarItem = {
      date: form.date,
      title: form.name,
      line: selectedLine,
      shift: form.shift,
      qty: Number(form.qty),
      color: form.color,
      orderId: form.id
    };
    setCalendarItems(prev => [...prev, newCalItem]);

    setShowAddModal(false);
    toast.success(`Work order ${form.id} assigned to ${selectedLine}`);
  };

  const handleEditWO = () => {
    if (!selectedOrder) return;
    
    // Update Schedule Board State
    setBoard(prev => prev.map(l => {
      if (l.line === selectedItemLine) {
        return {
          ...l,
          orders: l.orders.map(o => o.id === selectedOrder.id ? selectedOrder : o)
        };
      }
      return l;
    }));

    // Update Calendar Item Details
    setCalendarItems(prev => prev.map(c => {
      if (c.orderId === selectedOrder.id) {
        return {
          ...c,
          title: selectedOrder.name,
          qty: selectedOrder.qty || c.qty,
          date: selectedOrder.date || c.date
        };
      }
      return c;
    }));

    setSelectedOrder(null);
    toast.success(`Work order ${selectedOrder.id} updated successfully`);
  };

  const handleDeleteWO = (orderId: string, lineName: string) => {
    setBoard(prev => prev.map(l => {
      if (l.line === lineName) {
        return {
          ...l,
          orders: l.orders.filter(o => o.id !== orderId)
        };
      }
      return l;
    }));

    setCalendarItems(prev => prev.filter(c => c.orderId !== orderId));
    setSelectedOrder(null);
    toast.success(`Work order ${orderId} unassigned`);
  };

  const handleOpenDetail = (orderId: string, lineName: string) => {
    const line = board.find(l => l.line === lineName);
    const order = line?.orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setSelectedItemLine(lineName);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Production Planning</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Scheduling board and capacity planning</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
            {[
              ['board', 'Schedule Board'],
              ['calendar', 'Calendar'],
              ['capacity', 'Capacity']
            ].map(([id, label]) => (
              <button 
                key={id} 
                type="button"
                onClick={() => setView(id as any)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button 
            type="button"
            onClick={() => handleOpenAdd('Line A')} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
          >
            <Plus className="h-4 w-4" />New Plan
          </button>
        </div>
      </div>

      {view === 'board' && (
        <div className="space-y-3">
          {board.map(line => (
            <div key={line.line} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground text-sm">{line.line}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 border border-border rounded-lg">Capacity: {line.capacity} units/day</span>
                </div>
                <button 
                  type="button"
                  onClick={() => handleOpenAdd(line.line)} 
                  className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                >
                  <Plus className="h-3 w-3" />Assign WO
                </button>
              </div>
              {line.orders.length === 0 ? (
                <div 
                  onClick={() => handleOpenAdd(line.line)}
                  className="h-14 border-2 border-dashed border-border hover:border-primary/30 rounded-xl flex items-center justify-center text-xs text-muted-foreground cursor-pointer transition-colors"
                >
                  No work orders assigned — click to schedule
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {line.orders.map(wo => (
                    <div 
                      key={wo.id} 
                      onClick={() => handleOpenDetail(wo.id, line.line)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/45 hover:shadow-sm cursor-pointer transition-all"
                    >
                      <div className="w-1.5 h-8 rounded-full bg-primary shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{wo.id}</p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{wo.name} · {wo.hrs}h · {wo.pct}%</p>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="flex h-14 w-28 border-2 border-dashed border-border rounded-xl flex-col items-center justify-center text-xs text-muted-foreground cursor-pointer hover:border-primary/30 hover:text-foreground transition-colors" 
                    onClick={() => handleOpenAdd(line.line)}
                  >
                    <Plus className="h-4 w-4 mb-0.5" />
                    <span>Assign</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setWeekOffset(p => p - 1)} 
                className="p-1.5 rounded-lg hover:bg-muted border border-border transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-foreground px-2 py-1 bg-background border border-border rounded-lg">
                June {baseDates[0]} – {baseDates[6]}, 2026
              </span>
              <button 
                type="button"
                onClick={() => setWeekOffset(p => p + 1)} 
                className="p-1.5 rounded-lg hover:bg-muted border border-border transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {weekOffset !== 0 && (
              <button onClick={() => setWeekOffset(0)} className="text-xs text-primary font-semibold hover:underline">Reset to current week</button>
            )}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {DAYS.map((day, i) => {
              const currentDateStr = `Jun ${baseDates[i]}`;
              const items = calendarItems.filter(c => c.date === currentDateStr);
              return (
                <div key={day} className="bg-card">
                  <div className="p-3 border-b border-border text-center bg-muted/10">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{day}</p>
                    <p className="text-sm font-black text-foreground mt-0.5">{baseDates[i]}</p>
                  </div>
                  <div className="p-2 min-h-[140px] space-y-1 bg-background">
                    {items.map((item, j) => (
                      <div 
                        key={j} 
                        onClick={() => handleOpenDetail(item.orderId, item.line)}
                        className={`${item.color} text-white text-[11px] font-medium p-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm`}
                      >
                        <p className="font-bold truncate">{item.orderId}</p>
                        <p className="truncate opacity-95">{item.title}</p>
                        <p className="text-[9px] opacity-75 mt-0.5 font-mono">{item.line} · {item.shift}</p>
                      </div>
                    ))}
                    <div 
                      onClick={() => {
                        handleOpenAdd('Line A');
                        setForm(p => ({ ...p, date: currentDateStr }));
                      }}
                      className="opacity-0 hover:opacity-100 h-8 border border-dashed border-border hover:border-primary/30 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground cursor-pointer transition-all"
                    >
                      + Schedule
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'capacity' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary animate-pulse" /> Capacity Utilization — This Week
          </h3>
          <div className="space-y-4">
            {board.map(line => {
              const used = line.orders.reduce((acc, o) => acc + o.pct, 0);
              return (
                <div key={line.line} className="bg-muted/15 border border-border rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">{line.line}</span>
                    <span className={`font-black ${used > 85 ? 'text-red-500' : used > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>{used}% utilized</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${used > 85 ? 'bg-red-500' : used > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${used}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium pt-1">
                    <span>{line.orders.length} active work order(s)</span>
                    <span>Daily Capacity Limit: {line.capacity} units</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Work Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Schedule Work Order to {selectedLine}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Work Order ID</label>
                <input value={form.id} readOnly className="w-full px-3 py-2 rounded-xl border border-border bg-muted text-sm font-mono text-muted-foreground focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Product Description *</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                  placeholder="e.g. Steel Shaft Assembly"
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Date</label>
                  <select 
                    value={form.date} 
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map(d => <option key={d} value={`Jun ${d}`}>{`Jun ${d}`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Shift</label>
                  <select 
                    value={form.shift} 
                    onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                  >
                    {['Day', 'Evening', 'Night'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Required Qty</label>
                  <input 
                    type="number" 
                    value={form.qty} 
                    onChange={e => setForm(p => ({ ...p, qty: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Hours Est.</label>
                  <input 
                    type="number" 
                    value={form.hrs} 
                    onChange={e => setForm(p => ({ ...p, hrs: Number(e.target.value), pct: Number(e.target.value) * 10 }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Color Tag</label>
                <div className="flex gap-2">
                  {['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-rose-500'].map(c => (
                    <button 
                      key={c} 
                      type="button" 
                      onClick={() => setForm(p => ({ ...p, color: c }))} 
                      className={`w-6 h-6 rounded-full ${c} border-2 ${form.color === c ? 'border-foreground scale-110' : 'border-transparent'} transition-all`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button type="button" onClick={handleSaveWO} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Schedule Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/View Work Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground bg-background px-2 py-0.5 border border-border rounded-lg">{selectedOrder.id}</span>
                <span className="text-xs font-semibold text-muted-foreground">Work Order Details</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Product Description</label>
                <input 
                  type="text" 
                  value={selectedOrder.name} 
                  onChange={e => setSelectedOrder({ ...selectedOrder, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Shift Scheduled</label>
                  <select 
                    value={selectedOrder.date || 'Jun 2'} 
                    onChange={e => setSelectedOrder({ ...selectedOrder, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map(d => <option key={d} value={`Jun ${d}`}>{`Jun ${d}`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Scheduled Hrs</label>
                  <input 
                    type="number" 
                    value={selectedOrder.hrs} 
                    onChange={e => setSelectedOrder({ ...selectedOrder, hrs: Number(e.target.value), pct: Number(e.target.value) * 10 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Quantity to Produce</label>
                <input 
                  type="number" 
                  value={selectedOrder.qty || 100} 
                  onChange={e => setSelectedOrder({ ...selectedOrder, qty: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => handleDeleteWO(selectedOrder.id, selectedItemLine)} 
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Unassign
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Close</button>
                <button type="button" onClick={handleEditWO} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

