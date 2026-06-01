import { useState } from 'react';
import {
  Shield, AlertOctagon, CheckSquare, TrendingDown, Plus, Download, Search,
  ArrowRight, RefreshCw, ClipboardList, Target, FileText, BarChart3,
  AlertTriangle, CheckCircle2, Clock, Eye, X, Edit
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Inspection {
  id: string;
  product: string;
  batch: string;
  date: string;
  inspector: string;
  pass: number;
  fail: number;
  status: string;
}

interface NCR {
  id: string;
  title: string;
  severity: string;
  raised: string;
  status: string;
  assigned: string;
}

interface CAPA {
  id: string;
  ncr: string;
  title: string;
  owner: string;
  due: string;
  completion: number;
  status: string;
}

const INITIAL_INSPECTIONS: Inspection[] = [
  { id: 'INS-1201', product: 'Steel Shaft Assembly', batch: 'BT-4421', date: 'Jun 2', inspector: 'T. Brown', pass: 472, fail: 28, status: 'Completed' },
  { id: 'INS-1202', product: 'Hydraulic Cylinder', batch: 'BT-4422', date: 'Jun 3', inspector: 'A. Kim', pass: 0, fail: 0, status: 'In Progress' },
  { id: 'INS-1203', product: 'Bearing Housing', batch: 'BT-4423', date: 'Jun 4', inspector: 'M. Raj', pass: 748, fail: 2, status: 'Completed' },
  { id: 'INS-1204', product: 'Pump Impeller', batch: 'BT-4424', date: 'Jun 5', inspector: 'S. Lee', pass: 0, fail: 0, status: 'Scheduled' },
];

const INITIAL_NCR_LIST: NCR[] = [
  { id: 'NCR-441', title: 'Surface finish defect — Steel Shaft', severity: 'Major', raised: 'Jun 1', status: 'Open', assigned: 'T. Brown' },
  { id: 'NCR-442', title: 'Dimensional non-conformance — Bearing', severity: 'Minor', raised: 'May 30', status: 'Under Review', assigned: 'A. Kim' },
  { id: 'NCR-443', title: 'Material certification missing', severity: 'Critical', raised: 'May 28', status: 'CAPA Raised', assigned: 'M. Raj' },
  { id: 'NCR-444', title: 'Weld porosity in valve body', severity: 'Major', raised: 'May 25', status: 'Closed', assigned: 'S. Lee' },
];

const INITIAL_CAPAS: CAPA[] = [
  { id: 'CAPA-221', ncr: 'NCR-443', title: 'Supplier material certification process update', owner: 'M. Raj', due: 'Jun 15', completion: 65, status: 'In Progress' },
  { id: 'CAPA-222', ncr: 'NCR-441', title: 'Updated surface inspection SOP for Line A', owner: 'T. Brown', due: 'Jun 10', completion: 40, status: 'In Progress' },
  { id: 'CAPA-223', ncr: 'NCR-444', title: 'Weld parameter calibration and operator re-training', owner: 'S. Lee', due: 'May 31', completion: 100, status: 'Closed' },
];

const defectData = [
  { week: 'W1', defects: 42, target: 30 },
  { week: 'W2', defects: 38, target: 30 },
  { week: 'W3', defects: 29, target: 30 },
  { week: 'W4', defects: 24, target: 30 },
  { week: 'W5', defects: 31, target: 30 },
  { week: 'W6', defects: 18, target: 30 },
];

export function QualityDashboard({ user }: { user: User }) {
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [ncrs, setNcrs] = useState<NCR[]>(INITIAL_NCR_LIST);
  const [capas, setCapas] = useState<CAPA[]>(INITIAL_CAPAS);

  const [tab, setTab] = useState<'inspections' | 'ncr' | 'capa'>('inspections');
  const [search, setSearch] = useState('');

  // Modals state
  const [isInspModalOpen, setIsInspModalOpen] = useState(false);
  const [isCapaModalOpen, setIsCapaModalOpen] = useState(false);

  // Inspection Form State
  const [inspProduct, setInspProduct] = useState('');
  const [inspBatch, setInspBatch] = useState('');
  const [inspInspector, setInspInspector] = useState('');
  const [inspPass, setInspPass] = useState(0);
  const [inspFail, setInspFail] = useState(0);
  const [inspStatus, setInspStatus] = useState('Scheduled');

  // CAPA Form State
  const [capaNCR, setCapaNCR] = useState('');
  const [capaTitle, setCapaTitle] = useState('');
  const [capaOwner, setCapaOwner] = useState('');
  const [capaDue, setCapaDue] = useState('');

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspProduct.trim() || !inspBatch.trim() || !inspInspector.trim()) {
      toast.error('Please enter all required fields');
      return;
    }
    const newInsp: Inspection = {
      id: `INS-${1200 + inspections.length + 1}`,
      product: inspProduct,
      batch: inspBatch,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      inspector: inspInspector,
      pass: inspPass,
      fail: inspFail,
      status: inspStatus
    };
    setInspections(prev => [newInsp, ...prev]);
    setIsInspModalOpen(false);
    toast.success(`Inspection scheduled: ${newInsp.id}`);
  };

  const handleCreateCAPA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaTitle.trim() || !capaOwner.trim() || !capaDue.trim()) {
      toast.error('Please enter all required fields');
      return;
    }
    const newCAPA: CAPA = {
      id: `CAPA-${220 + capas.length + 1}`,
      ncr: capaNCR || 'N/A',
      title: capaTitle,
      owner: capaOwner,
      due: capaDue,
      completion: 0,
      status: 'In Progress'
    };
    setCapas(prev => [...prev, newCAPA]);
    setIsCapaModalOpen(false);
    toast.success(`CAPA ${newCAPA.id} generated`);
  };

  const handleRaiseCAPAFromNCR = (ncrId: string, title: string) => {
    setNcrs(prev =>
      prev.map(n => n.id === ncrId ? { ...n, status: 'CAPA Raised' } : n)
    );
    // Create new CAPA record
    const newCAPA: CAPA = {
      id: `CAPA-${220 + capas.length + 1}`,
      ncr: ncrId,
      title: `Corrective action: resolve ${title}`,
      owner: 'Quality Lead',
      due: new Date(Date.now() + 86400000 * 7).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completion: 10,
      status: 'In Progress'
    };
    setCapas(prev => [...prev, newCAPA]);
    toast.success(`CAPA raised from ${ncrId}`);
  };

  const handleCloseCAPA = (id: string) => {
    setCapas(prev =>
      prev.map(c => {
        if (c.id === id) {
          toast.success(`CAPA ${c.id} closed`);
          
          // If related to an NCR, close the NCR too!
          if (c.ncr.startsWith('NCR-')) {
            setNcrs(old => old.map(n => n.id === c.ncr ? { ...n, status: 'Closed' } : n));
          }
          
          return { ...c, completion: 100, status: 'Closed' };
        }
        return c;
      })
    );
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ inspections, ncrs, capas }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Quality scorecard exported');
  };

  const filteredInspections = inspections.filter(i => 
    i.product.toLowerCase().includes(search.toLowerCase()) || i.batch.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNCRs = ncrs.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) || n.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCAPAs = capas.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Quality Management Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => {
              setInspProduct('');
              setInspBatch('');
              setInspInspector('');
              setInspPass(0);
              setInspFail(0);
              setInspStatus('Scheduled');
              setIsInspModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
          >
            <Plus className="h-4 w-4" />New Inspection
          </button>
          <button 
            type="button"
            onClick={handleExport}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Quality Score', value: '97.2%', change: '+0.4%', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Open NCRs', value: `${ncrs.filter(n => n.status !== 'Closed').length}`, change: 'Requires review', icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Inspections Today', value: `${inspections.length}`, change: 'Running audits', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Defect Rate', value: '1.8%', change: '-0.6% vs last month', icon: TrendingDown, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => toast.info(`Viewing ${m.label}`)}>
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

      {/* Defect Trend */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Defect Trend — Weekly</h3>
            <p className="text-xs text-muted-foreground">Defects vs 30-unit target threshold</p>
          </div>
          <button type="button" onClick={() => toast.info('Viewing full defect analytics')} className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
            Full Analysis <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={defectData}>
            <defs>
              <linearGradient id="defectGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="defects" stroke="#EF4444" fill="url(#defectGrad)" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} name="Defects" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex gap-2">
            {[['inspections', 'Inspections'], ['ncr', 'NCR Tracker'], ['capa', 'CAPA Management']].map(([id, label]) => (
              <button 
                key={id} 
                type="button"
                onClick={() => { setTab(id as any); setSearch(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-40" 
            />
          </div>
        </div>

        {tab === 'inspections' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">ID</th>
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-left px-5 py-3 font-medium">Batch</th>
                  <th className="text-left px-5 py-3 font-medium">Inspector</th>
                  <th className="text-left px-5 py-3 font-medium">Pass/Fail</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInspections.map(ins => (
                  <tr key={ins.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{ins.id}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{ins.product}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.batch}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.inspector}</td>
                    <td className="px-5 py-3.5 text-xs">
                      {ins.status === 'Completed' ? (
                        <span><span className="text-emerald-600 font-semibold">{ins.pass}</span> / <span className="text-red-500 font-semibold">{ins.fail}</span></span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{ins.date}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={ins.status === 'Completed' ? 'success' : ins.status === 'In Progress' ? 'default' : 'warning'} size="sm">{ins.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <button type="button" onClick={() => toast.info(`Viewing ${ins.id}`)} className="text-xs text-primary hover:underline font-semibold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'ncr' && (
          <div className="divide-y divide-border">
            {filteredNCRs.map(ncr => (
              <div key={ncr.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ncr.severity === 'Critical' ? 'bg-red-500/10' : ncr.severity === 'Major' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                  <AlertOctagon className={`h-4 w-4 ${ncr.severity === 'Critical' ? 'text-red-500' : ncr.severity === 'Major' ? 'text-amber-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{ncr.title}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ncr.severity === 'Critical' ? 'bg-red-500/10 text-red-600' : ncr.severity === 'Major' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>{ncr.severity}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{ncr.id} · Assigned: {ncr.assigned} · Raised: {ncr.raised}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge variant={ncr.status === 'Closed' ? 'success' : ncr.status === 'CAPA Raised' ? 'warning' : 'error'} size="sm">{ncr.status}</StatusBadge>
                  <button type="button" onClick={() => toast.info(`Opening ${ncr.id}`)} className="text-xs text-primary hover:underline font-semibold">Detail</button>
                  {ncr.status === 'Open' && (
                    <button 
                      type="button"
                      onClick={() => handleRaiseCAPAFromNCR(ncr.id, ncr.title)} 
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      Raise CAPA
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'capa' && (
          <div className="p-5 space-y-3">
            {filteredCAPAs.map(capa => (
              <div key={capa.id} className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{capa.id}</span>
                      <span className="text-xs text-muted-foreground">→ {capa.ncr}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{capa.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Owner: {capa.owner} · Due: {capa.due}</p>
                  </div>
                  <StatusBadge variant={capa.status === 'Closed' ? 'success' : 'default'} size="sm">{capa.status}</StatusBadge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${capa.completion === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${capa.completion}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground w-8">{capa.completion}%</span>
                  <div className="flex items-center gap-2.5">
                    {capa.status !== 'Closed' && (
                      <button 
                        type="button" 
                        onClick={() => handleCloseCAPA(capa.id)} 
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                      >
                        Close CAPA
                      </button>
                    )}
                    <button type="button" onClick={() => toast.info(`Viewing ${capa.id}`)} className="text-xs text-primary hover:underline font-semibold">View</button>
                  </div>
                </div>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => {
                setCapaNCR('');
                setCapaTitle('');
                setCapaOwner('');
                setCapaDue('');
                setIsCapaModalOpen(true);
              }}
              className="w-full py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />Create New CAPA
            </button>
          </div>
        )}
      </div>

      {/* Inspection Modal */}
      {isInspModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsInspModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Schedule QA Inspection</h2>
            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Product Description *</label>
                <input
                  type="text"
                  value={inspProduct}
                  onChange={e => setInspProduct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Hydraulic Cylinder"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Batch Code *</label>
                  <input
                    type="text"
                    value={inspBatch}
                    onChange={e => setInspBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. BT-4422"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Inspector *</label>
                  <input
                    type="text"
                    value={inspInspector}
                    onChange={e => setInspInspector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. A. Kim"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Pass Count</label>
                  <input
                    type="number"
                    value={inspPass}
                    onChange={e => setInspPass(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Fail Count</label>
                  <input
                    type="number"
                    value={inspFail}
                    onChange={e => setInspFail(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                  <select
                    value={inspStatus}
                    onChange={e => setInspStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary font-semibold"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsInspModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAPA Modal */}
      {isCapaModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button type="button" onClick={() => setIsCapaModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Create CAPA Task</h2>
            <form onSubmit={handleCreateCAPA} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">NCR Reference</label>
                  <input
                    type="text"
                    value={capaNCR}
                    onChange={e => setCapaNCR(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. NCR-441"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Due Date *</label>
                  <input
                    type="text"
                    value={capaDue}
                    onChange={e => setCapaDue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Jun 15"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Corrective Action Title *</label>
                <input
                  type="text"
                  value={capaTitle}
                  onChange={e => setCapaTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Recalibrate weld parameters"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Task Owner *</label>
                <input
                  type="text"
                  value={capaOwner}
                  onChange={e => setCapaOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. M. Raj"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCapaModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
