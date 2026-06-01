import { useState } from 'react';
import { Building2, Plus, Search, Users, TrendingUp } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const ORGS = [
  { id: 'ORG-001', name: 'Titan Manufacturing Inc.', plan: 'Enterprise', users: 284, mrr: '$12,400', health: 98, status: 'Active', location: 'Detroit, MI' },
  { id: 'ORG-002', name: 'Precision Parts Co.', plan: 'Professional', users: 42, mrr: '$2,800', health: 94, status: 'Active', location: 'Chicago, IL' },
  { id: 'ORG-003', name: 'Global Fabricators Ltd.', plan: 'Enterprise', users: 156, mrr: '$8,200', health: 91, status: 'Active', location: 'Houston, TX' },
  { id: 'ORG-004', name: 'NovaMech Systems', plan: 'Starter', users: 8, mrr: '$0', health: 72, status: 'Trial', location: 'Austin, TX' },
  { id: 'ORG-005', name: 'Atlas Industrial Corp.', plan: 'Professional', users: 67, mrr: '$0', health: 0, status: 'Suspended', location: 'Cleveland, OH' },
];

export function AdminOrgsPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const filtered = ORGS.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Building2 className="h-5 w-5" />Organization Monitoring</h1><p className="text-sm text-muted-foreground">All organizations on the TrillionIndustries platform</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Organizations', value: '290' }, { label: 'Active Users', value: '2,450' }, { label: 'Total MRR', value: '$760K' }].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Organizations</h3>
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none w-44" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr>{['ID', 'Organization', 'Plan', 'Users', 'MRR', 'Health', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(org => (
                <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{org.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{org.name}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${org.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : org.plan === 'Professional' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>{org.plan}</span></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{org.users}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{org.mrr}</td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${org.health > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${org.health}%` }} /></div><span className="text-xs text-muted-foreground">{org.health || '—'}</span></div></td>
                  <td className="px-5 py-3.5"><StatusBadge variant={org.status === 'Active' ? 'success' : org.status === 'Trial' ? 'warning' : 'error'} size="sm">{org.status}</StatusBadge></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2">
                    <button onClick={() => toast.info(`Impersonating ${org.name}`)} className="text-xs text-primary hover:underline">Impersonate</button>
                    {org.status === 'Suspended' ? <button onClick={() => toast.success(`${org.name} reactivated`)} className="text-xs text-emerald-600 hover:underline">Reactivate</button> : <button onClick={() => toast.warning(`${org.name} suspended`)} className="text-xs text-red-500 hover:underline">Suspend</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
