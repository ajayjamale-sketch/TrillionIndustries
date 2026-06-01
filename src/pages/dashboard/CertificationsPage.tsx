import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Plus, Search, Calendar, UserCheck, CheckCircle2, AlertTriangle, X, Download } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Certification {
  id: string;
  name: string;
  employee: string;
  dept: string;
  issued: string;
  expires: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
}

const INITIAL_CERTS: Certification[] = [
  { id: 'CERT-301', name: 'AWS D1.1 Welder Qualification', employee: 'Chris Okafor', dept: 'Production', issued: '2025-09-15', expires: '2026-09-15', status: 'Valid' },
  { id: 'CERT-302', name: 'OSHA 30-Hour General Industry', employee: 'Tom Bradley', dept: 'Production', issued: '2024-01-20', expires: '2027-01-20', status: 'Valid' },
  { id: 'CERT-303', name: 'Forklift Operator License Class I-V', employee: 'Sara Liu', dept: 'Warehouse', issued: '2025-06-05', expires: '2026-06-05', status: 'Expiring Soon' },
  { id: 'CERT-304', name: 'NFPA 70E Electrical Safety Standard', employee: 'James Williams', dept: 'Maintenance', issued: '2023-09-12', expires: '2024-09-12', status: 'Expired' },
];

export function CertificationsPage({ user }: { user: User }) {
  const [certs, setCerts] = useState<Certification[]>(INITIAL_CERTS);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [employee, setEmployee] = useState('');
  const [dept, setDept] = useState('Production');
  const [issued, setIssued] = useState('');
  const [expires, setExpires] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !employee.trim() || !issued || !expires) {
      toast.error('Please enter all required fields');
      return;
    }

    const expDate = new Date(expires);
    const today = new Date();
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    let status: 'Valid' | 'Expiring Soon' | 'Expired' = 'Valid';
    if (diffDays <= 0) {
      status = 'Expired';
    } else if (diffDays <= 30) {
      status = 'Expiring Soon';
    }

    const newCert: Certification = {
      id: `CERT-${300 + certs.length + 1}`,
      name,
      employee,
      dept,
      issued,
      expires,
      status
    };

    setCerts([...certs, newCert]);
    setShowNew(false);
    toast.success(`Certification added: ${newCert.id}`);

    // Reset Form
    setName('');
    setEmployee('');
    setIssued('');
    setExpires('');
  };

  const handleRenew = (id: string) => {
    setCerts(prev => prev.map(c => {
      if (c.id === id) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const expiresStr = nextYear.toISOString().slice(0, 10);
        toast.success(`Certification ${id} renewed successfully!`);
        return {
          ...c,
          status: 'Valid',
          issued: new Date().toISOString().slice(0, 10),
          expires: expiresStr
        };
      }
      return c;
    }));
  };

  const filtered = certs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.employee.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />Certifications
          </h1>
          <p className="text-sm text-muted-foreground">Manage welder qualifications, OSHA compliance and vehicle licenses</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Register Certificate
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Valid', value: certs.filter(c => c.status === 'Valid').length, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Expiring Soon', value: certs.filter(c => c.status === 'Expiring Soon').length, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Expired Licenses', value: certs.filter(c => c.status === 'Expired').length, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border border-border/20`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, certificate title or employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Certifications Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['ID', 'Certificate Type', 'Employee', 'Department', 'Issued', 'Expires', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted-foreground">No certifications matching query.</td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground font-semibold">{c.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{c.name}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.employee}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.dept}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.issued}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{c.expires}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={c.status === 'Valid' ? 'success' : c.status === 'Expiring Soon' ? 'warning' : 'error'} size="sm">
                        {c.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="flex gap-2">
                        {c.status !== 'Valid' && (
                          <button
                            onClick={() => handleRenew(c.id)}
                            className="text-primary hover:underline font-bold"
                          >
                            Renew License
                          </button>
                        )}
                        <button
                          onClick={() => toast.info(`File details for ${c.id}: Certified on ${c.issued}`)}
                          className="text-muted-foreground hover:text-foreground hover:underline font-semibold"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showNew && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Register Certification</h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Certification Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS D1.1 Welding Standard"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Employee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chris Okafor"
                    value={employee}
                    onChange={e => setEmployee(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Production">Production</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Quality">Quality</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={issued}
                    onChange={e => setIssued(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase block mb-1">Expiration Date *</label>
                  <input
                    type="date"
                    required
                    value={expires}
                    onChange={e => setExpires(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
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
                  Register
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
