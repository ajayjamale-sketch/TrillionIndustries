import { useState } from 'react';
import { Building2, Plus, Search, Star, TrendingUp, Eye, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const VENDORS = [
  { id: 'VEN-001', name: 'SteelPro Ltd.', category: 'Raw Materials', contact: 'Mike Donovan', email: 'm.donovan@steelpro.com', score: 94, onTime: '96%', orders: 48, spend: '$1.2M', status: 'Preferred' },
  { id: 'VEN-002', name: 'Hydraulic Systems Inc.', category: 'MRO', contact: 'Jane Cooper', email: 'j.cooper@hydrosys.com', score: 87, onTime: '89%', orders: 22, spend: '$840K', status: 'Active' },
  { id: 'VEN-003', name: 'Global Bearings', category: 'Components', contact: 'Peter Lau', email: 'p.lau@globalbearings.com', score: 91, onTime: '93%', orders: 35, spend: '$620K', status: 'Active' },
  { id: 'VEN-004', name: 'FastenTech Corp.', category: 'Hardware', contact: 'Amy Singh', email: 'a.singh@fastentech.com', score: 78, onTime: '82%', orders: 64, spend: '$410K', status: 'Under Review' },
  { id: 'VEN-005', name: 'Polymer World', category: 'Raw Materials', contact: 'Carlos Ruiz', email: 'c.ruiz@polyworld.com', score: 85, onTime: '88%', orders: 18, spend: '$290K', status: 'Active' },
];

export function VendorsPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const filtered = VENDORS.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground">Vendor Management</h1><p className="text-sm text-muted-foreground">{VENDORS.length} registered vendors</p></div>
        <button onClick={() => toast.success('New vendor registration started')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Vendor</button>
      </div>
      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." className="pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none w-full" /></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(v => (
          <div key={v.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
              <div className="flex items-center gap-1.5">
                <StatusBadge variant={v.status === 'Preferred' ? 'success' : v.status === 'Active' ? 'default' : 'warning'} size="sm">{v.status}</StatusBadge>
              </div>
            </div>
            <p className="font-bold text-foreground text-sm mb-0.5">{v.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{v.category} · {v.contact}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div><p className="text-muted-foreground">Perf. Score</p><p className={`font-bold text-base ${v.score >= 90 ? 'text-emerald-500' : v.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{v.score}</p></div>
              <div><p className="text-muted-foreground">On-Time</p><p className="font-bold text-foreground">{v.onTime}</p></div>
              <div><p className="text-muted-foreground">Orders (YTD)</p><p className="font-bold text-foreground">{v.orders}</p></div>
              <div><p className="text-muted-foreground">Annual Spend</p><p className="font-bold text-foreground">{v.spend}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.info(`Viewing ${v.name} profile`)} className="flex-1 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1"><Eye className="h-3 w-3" />Profile</button>
              <button onClick={() => toast.info(`Creating PO for ${v.name}`)} className="flex-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">New PO</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
