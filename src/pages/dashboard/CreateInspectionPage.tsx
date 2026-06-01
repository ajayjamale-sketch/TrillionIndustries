import { useState } from 'react';
import { ClipboardCheck, Calendar, UserCheck, Settings, Plus, ListTodo, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface ScheduledInspection {
  id: string;
  product: string;
  batch: string;
  inspector: string;
  date: string;
  type: string;
  aql: string;
  scope: string[];
}

const INITIAL_QUEUE: ScheduledInspection[] = [
  { id: 'INS-1204', product: 'Pump Impeller Segment', batch: 'BT-4424', inspector: 'Sara Lee', date: '2026-06-05', type: 'First Article', aql: '1.0', scope: ['Visual', 'Dimensional'] },
  { id: 'INS-1205', product: 'Hydraulic Cylinder Cap', batch: 'BT-4425', inspector: 'Tom Brown', date: '2026-06-07', type: 'In-Process', aql: '1.5', scope: ['Visual', 'Dimensional', 'Pressure'] },
];

export function CreateInspectionPage({ user }: { user: User }) {
  const [queue, setQueue] = useState<ScheduledInspection[]>(INITIAL_QUEUE);

  // Form State
  const [product, setProduct] = useState('');
  const [batch, setBatch] = useState('');
  const [inspector, setInspector] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('In-Process');
  const [aql, setAql] = useState('1.5');

  // Scope checkboxes
  const [visual, setVisual] = useState(true);
  const [dimensional, setDimensional] = useState(true);
  const [pressure, setPressure] = useState(false);
  const [electrical, setElectrical] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim() || !batch.trim() || !inspector.trim() || !date) {
      toast.error('Please enter all required fields');
      return;
    }

    const scope: string[] = [];
    if (visual) scope.push('Visual');
    if (dimensional) scope.push('Dimensional');
    if (pressure) scope.push('Pressure');
    if (electrical) scope.push('Electrical');

    const newInsp: ScheduledInspection = {
      id: `INS-${1200 + queue.length + 5}`,
      product,
      batch,
      inspector,
      date,
      type,
      aql,
      scope
    };

    setQueue([...queue, newInsp]);
    toast.success(`Inspection scheduled: ${newInsp.id}`);

    // Reset Form
    setProduct('');
    setBatch('');
    setInspector('');
    setDate('');
    setType('In-Process');
    setAql('1.5');
    setVisual(true);
    setDimensional(true);
    setPressure(false);
    setElectrical(false);
  };

  const handleCancelInspection = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    toast.info(`Scheduled inspection ${id} canceled`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">Create Inspection</h1>
        <p className="text-sm text-muted-foreground">Schedule new quality control protocols and dispatch inspectors</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" /> Setup Inspection Parameters
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steel Shaft Component"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Batch Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BT-4426"
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Assigned Inspector *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Kim"
                  value={inspector}
                  onChange={e => setInspector(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Target Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">Inspection Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                >
                  <option value="In-Process">In-Process Check</option>
                  <option value="Final Inspection">Final Inspection</option>
                  <option value="Incoming QC">Incoming Supplier QC</option>
                  <option value="First Article">First Article</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase block mb-1.5">AQL Level Limit</label>
                <select
                  value={aql}
                  onChange={e => setAql(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                >
                  <option value="0.65">AQL 0.65 (High Precision)</option>
                  <option value="1.0">AQL 1.0 (Standard)</option>
                  <option value="1.5">AQL 1.5 (General)</option>
                  <option value="2.5">AQL 2.5 (Loose)</option>
                </select>
              </div>
            </div>

            {/* Scope Checklist */}
            <div className="border-t border-border pt-4">
              <label className="text-xs font-semibold text-foreground uppercase block mb-3">Inspection Scope Checks</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={visual} onChange={e => setVisual(e.target.checked)} className="rounded border-border text-primary focus:ring-0" />
                  Visual Finish
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={dimensional} onChange={e => setDimensional(e.target.checked)} className="rounded border-border text-primary focus:ring-0" />
                  Dimensional Specs
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={pressure} onChange={e => setPressure(e.target.checked)} className="rounded border-border text-primary focus:ring-0" />
                  Pressure / Leak
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={electrical} onChange={e => setElectrical(e.target.checked)} className="rounded border-border text-primary focus:ring-0" />
                  Electrical/Ohms
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-brand"
              >
                Schedule & Dispatch
              </button>
            </div>
          </form>
        </div>

        {/* Upcoming queue */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-primary" /> Upcoming Queue
          </h2>

          <div className="space-y-3">
            {queue.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No upcoming inspections scheduled.
              </div>
            ) : (
              queue.map(item => (
                <div key={item.id} className="p-3 border border-border bg-muted/20 rounded-xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground font-semibold">{item.id}</span>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                      AQL {item.aql}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-snug">{item.product}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Batch: {item.batch} · Inspector: {item.inspector}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.scope.map(s => (
                      <span key={s} className="text-[9px] bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-border">
                    <span className="text-[10px] text-muted-foreground">Target: {item.date}</span>
                    <button
                      onClick={() => handleCancelInspection(item.id)}
                      className="text-[10px] text-red-500 hover:underline font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
