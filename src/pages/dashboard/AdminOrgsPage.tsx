import { useState, useMemo } from 'react';
import { Building2, Plus, Search, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

// Initial organization data
const INITIAL_ORGS = [
  { id: 'ORG-001', name: 'Titan Manufacturing Inc.', plan: 'Enterprise', users: 284, mrr: '$12,400', health: 98, status: 'Active', location: 'Detroit, MI' },
  { id: 'ORG-002', name: 'Precision Parts Co.', plan: 'Professional', users: 42, mrr: '$2,800', health: 94, status: 'Active', location: 'Chicago, IL' },
  { id: 'ORG-003', name: 'Global Fabricators Ltd.', plan: 'Enterprise', users: 156, mrr: '$8,200', health: 91, status: 'Active', location: 'Houston, TX' },
  { id: 'ORG-004', name: 'NovaMech Systems', plan: 'Starter', users: 8, mrr: '$0', health: 72, status: 'Trial', location: 'Austin, TX' },
  { id: 'ORG-005', name: 'Atlas Industrial Corp.', plan: 'Professional', users: 67, mrr: '$0', health: 0, status: 'Suspended', location: 'Cleveland, OH' },
];

// Helper: Convert MRR string to number
const mrrToNumber = (mrr: string) => parseInt(mrr.replace(/[^0-9]/g, ''), 10) || 0;

export function AdminOrgsPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [organizations, setOrganizations] = useState(INITIAL_ORGS);
  const [impersonatingOrg, setImpersonatingOrg] = useState<string | null>(null);

  // Compute KPIs dynamically
  const kpis = useMemo(() => {
    const totalOrgs = organizations.length;
    const activeUsers = organizations
      .filter(org => org.status === 'Active')
      .reduce((sum, org) => sum + org.users, 0);
    const totalMRR = organizations
      .filter(org => org.status !== 'Suspended')
      .reduce((sum, org) => sum + mrrToNumber(org.mrr), 0);
    return { totalOrgs, activeUsers, totalMRR };
  }, [organizations]);

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.id.toLowerCase().includes(search.toLowerCase())
  );

  // --- Action Handlers ---
  const handleImpersonate = (orgName: string) => {
    setImpersonatingOrg(orgName);
    toast.info(`Impersonating ${orgName} — Admin session active`, { duration: 5000 });
    // In a real app, you would redirect or set auth context
  };

  const handleSuspend = (orgId: string) => {
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId && org.status !== 'Suspended'
          ? { ...org, status: 'Suspended', mrr: '$0', health: 0 }
          : org
      )
    );
    toast.warning(`Organization ${orgId} has been suspended`);
  };

  const handleReactivate = (orgId: string) => {
    const original = INITIAL_ORGS.find(o => o.id === orgId);
    if (original) {
      setOrganizations(prev =>
        prev.map(org =>
          org.id === orgId
            ? { ...org, status: 'Active', mrr: original.mrr, health: original.health }
            : org
        )
      );
      toast.success(`Organization ${orgId} reactivated`);
    }
  };

  const handleKPIClick = (label: string, value: string | number) => {
    toast.info(`${label}: ${value} — Click to view detailed breakdown`);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header with impersonation indicator */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Monitoring
            {impersonatingOrg && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[11px] font-semibold">
                Impersonating: {impersonatingOrg}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user.name} · {user.company} · All organizations on the TrillionIndustries platform
          </p>
        </div>
        {/* Optional: Add a refresh button */}
        <button
          onClick={() => {
            setOrganizations(INITIAL_ORGS);
            setImpersonatingOrg(null);
            toast.success('Organization list refreshed');
          }}
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* KPI Cards - clickable */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Organizations', value: kpis.totalOrgs, icon: Building2, color: 'text-blue-500' },
          { label: 'Active Users', value: kpis.activeUsers.toLocaleString(), icon: Users, color: 'text-emerald-500' },
          { label: 'Total MRR', value: `$${(kpis.totalMRR / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-orange-500' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              onClick={() => handleKPIClick(kpi.label, kpi.value)}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Organizations Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <h3 className="font-semibold text-foreground text-sm">Organizations</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {['ID', 'Organization', 'Plan', 'Users', 'MRR', 'Health', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrgs.map(org => (
                <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{org.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{org.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      org.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                      org.plan === 'Professional' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{org.users}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{org.mrr}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${org.health > 80 ? 'bg-emerald-500' : org.health > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${org.health}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{org.health || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      variant={org.status === 'Active' ? 'success' : org.status === 'Trial' ? 'warning' : 'error'}
                      size="sm"
                    >
                      {org.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleImpersonate(org.name)}
                        className="text-xs text-primary hover:underline"
                      >
                        Impersonate
                      </button>
                      {org.status === 'Suspended' ? (
                        <button
                          onClick={() => handleReactivate(org.id)}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(org.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrgs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No organizations match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}