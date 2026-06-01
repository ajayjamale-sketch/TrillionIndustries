import { useState } from 'react';
import { Building2, Plus, Users, Globe, Settings, Network } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const ORGANIZATIONS = [
  { id: 'ORG-001', name: 'Trillion Industries LLC', region: 'North America', subsidiaries: 4, employees: 3450, revenue: '$1.2B', status: 'Active' },
  { id: 'ORG-002', name: 'Trillion Europe GmbH', region: 'Europe', subsidiaries: 2, employees: 1240, revenue: '$450M', status: 'Active' },
  { id: 'ORG-003', name: 'Trillion APAC Ltd', region: 'Asia Pacific', subsidiaries: 3, employees: 2100, revenue: '$890M', status: 'Active' },
];

export function OrganizationsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Organization Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage enterprise hierarchy, subsidiaries, and regional offices</p>
        </div>
        <button onClick={() => toast.success('Add new organization wizard opened')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />
          Add Organization
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORGANIZATIONS.map(org => (
          <div key={org.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer" onClick={() => toast.info(`Opening ${org.name}`)}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <StatusBadge variant={org.status === 'Active' ? 'success' : 'warning'} size="sm">{org.status}</StatusBadge>
            </div>
            
            <h3 className="font-bold text-foreground text-sm mb-1">{org.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
              <Globe className="h-3 w-3" />
              {org.region}
            </p>
            
            <div className="space-y-1.5 text-xs text-muted-foreground mt-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1"><Network className="h-3 w-3" /> Subsidiaries</span>
                <span className="font-semibold text-foreground">{org.subsidiaries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Employees</span>
                <span className="font-semibold text-foreground">{org.employees}</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                <span>Annual Revenue</span>
                <span className="font-semibold text-foreground">{org.revenue}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5">
              <button onClick={e => { e.stopPropagation(); toast.info(`Opening ${org.name} details`); }} className="flex-1 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
                View Details
              </button>
              <button onClick={e => { e.stopPropagation(); toast.info(`Editing ${org.name}`); }} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
