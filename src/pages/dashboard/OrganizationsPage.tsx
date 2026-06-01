import { useState } from 'react';
import { Building2, Plus, Users, Globe, Settings, Network, Trash2, X } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Organization {
  id: string;
  name: string;
  region: string;
  subsidiaries: number;
  employees: number;
  revenue: string;
  status: string;
}

const INITIAL_ORGANIZATIONS: Organization[] = [
  { id: 'ORG-001', name: 'Trillion Industries LLC', region: 'North America', subsidiaries: 4, employees: 3450, revenue: '$1.2B', status: 'Active' },
  { id: 'ORG-002', name: 'Trillion Europe GmbH', region: 'Europe', subsidiaries: 2, employees: 1240, revenue: '$450M', status: 'Active' },
  { id: 'ORG-003', name: 'Trillion APAC Ltd', region: 'Asia Pacific', subsidiaries: 3, employees: 2100, revenue: '$890M', status: 'Active' },
];

export function OrganizationsPage({ user }: { user: User }) {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [region, setRegion] = useState('North America');
  const [subsidiaries, setSubsidiaries] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [revenue, setRevenue] = useState('');
  const [status, setStatus] = useState('Active');

  const openAddModal = () => {
    setEditingOrg(null);
    setName('');
    setRegion('North America');
    setSubsidiaries(0);
    setEmployees(0);
    setRevenue('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (org: Organization) => {
    setEditingOrg(org);
    setName(org.name);
    setRegion(org.region);
    setSubsidiaries(org.subsidiaries);
    setEmployees(org.employees);
    setRevenue(org.revenue);
    setStatus(org.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !revenue.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingOrg) {
      setOrganizations(prev =>
        prev.map(org =>
          org.id === editingOrg.id
            ? { ...org, name, region, subsidiaries, employees, revenue, status }
            : org
        )
      );
      toast.success('Organization updated successfully');
    } else {
      const newOrg: Organization = {
        id: `ORG-00${organizations.length + 1}`,
        name,
        region,
        subsidiaries,
        employees,
        revenue,
        status,
      };
      setOrganizations(prev => [...prev, newOrg]);
      toast.success('Organization added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setOrganizations(prev => prev.filter(org => org.id !== itemToDelete));
      toast.success('Organization deleted successfully');
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Organization Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage enterprise hierarchy, subsidiaries, and regional offices</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
          <Plus className="h-4 w-4" />
          Add Organization
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map(org => (
          <div key={org.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all relative group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={org.status === 'Active' ? 'success' : 'warning'} size="sm">{org.status}</StatusBadge>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(org.id); }}
                  className="p-1.5 rounded-lg border border-border text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Organization"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
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
              <button onClick={() => openEditModal(org)} className="flex-1 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors font-medium">
                Edit Details
              </button>
              <button onClick={() => openEditModal(org)} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">{editingOrg ? 'Edit Organization' : 'Add Organization'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Organization Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Trillion Global Ltd"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Region</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Middle East & Africa">Middle East & Africa</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Subsidiaries</label>
                  <input
                    type="number"
                    value={subsidiaries}
                    onChange={e => setSubsidiaries(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Employees</label>
                  <input
                    type="number"
                    value={employees}
                    onChange={e => setEmployees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Revenue *</label>
                  <input
                    type="text"
                    value={revenue}
                    onChange={e => setRevenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. $100M"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Organization"
        description="Are you sure you want to delete this organization? This action cannot be undone."
      />
    </div>
  );
}
