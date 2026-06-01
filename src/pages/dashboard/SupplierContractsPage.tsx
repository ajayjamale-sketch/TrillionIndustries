import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Briefcase, X, FileText, CheckCircle2, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface Contract {
  id: string;
  buyer: string;
  type: string;
  value: string;
  start: string;
  end: string;
  status: 'Active' | 'Pending Renewal' | 'Expired';
}

const INITIAL_CONTRACTS: Contract[] = [
  { id: 'SC-001', buyer: 'Trillion Industries Corp', type: 'Annual Framework', value: '$285K', start: 'Jan 2026', end: 'Dec 2026', status: 'Active' },
  { id: 'SC-002', buyer: 'Precision Parts Co.', type: 'Spot Contract', value: '$48K', start: 'May 2026', end: 'Aug 2026', status: 'Active' },
  { id: 'SC-003', buyer: 'Atlas Industrial', type: 'Annual Framework', value: '$120K', start: 'Mar 2026', end: 'Feb 2027', status: 'Pending Renewal' },
];

export function SupplierContractsPage({ user }: { user: User }) {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const handleRenew = (id: string) => {
    setContracts(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'Active', end: 'Feb 2028' } : c)
    );
    toast.success(`Renewal for ${id} signed and activated successfully!`);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Contract Management
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">View and manage your active framework agreements and supply terms.</p>
      </div>

      <div className="space-y-3">
        {contracts.map(c => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex items-center justify-between gap-4 flex-wrap animate-fade-in">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                <span className="text-xs text-muted-foreground">· {c.type}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{c.buyer}</p>
              <p className="text-xs text-muted-foreground">{c.start} – {c.end} · <span className="font-semibold text-foreground">{c.value}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={c.status === 'Active' ? 'success' : 'warning'} size="sm">{c.status}</StatusBadge>
              <button 
                onClick={() => setSelectedContract(c)} 
                className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
              >
                View
              </button>
              {c.status === 'Pending Renewal' && (
                <button 
                  onClick={() => handleRenew(c.id)} 
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-brand"
                >
                  Sign Renewal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setSelectedContract(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Framework Agreement Contract</h2>
            
            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex justify-between"><span>Agreement ID</span><span className="font-semibold text-foreground font-mono">{selectedContract.id}</span></div>
                <div className="flex justify-between"><span>Client Entity</span><span className="font-semibold text-foreground">{selectedContract.buyer}</span></div>
                <div className="flex justify-between"><span>Contract Scope</span><span className="font-semibold text-foreground">{selectedContract.type}</span></div>
                <div className="flex justify-between"><span>Committed Value</span><span className="font-semibold text-foreground font-bold">{selectedContract.value}</span></div>
              </div>

              <div className="text-xs space-y-2">
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Agreement Validity</h4>
                <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Start: {selectedContract.start} — End: {selectedContract.end}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-muted-foreground font-medium">Compliance Standing</span>
                <StatusBadge variant={selectedContract.status === 'Active' ? 'success' : 'warning'} size="sm">
                  {selectedContract.status}
                </StatusBadge>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              {selectedContract.status === 'Pending Renewal' && (
                <button 
                  onClick={() => { handleRenew(selectedContract.id); setSelectedContract(null); }}
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-brand"
                >
                  Renew Now
                </button>
              )}
              <button onClick={() => setSelectedContract(null)} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
