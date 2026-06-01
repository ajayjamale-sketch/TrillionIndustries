import { useState } from 'react';
import { Shield, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const ROLES = ['Enterprise Admin', 'Production Manager', 'Procurement Manager', 'Warehouse Manager', 'Maintenance Engineer', 'Quality Manager', 'Finance Officer', 'Supplier'];
const PERMISSIONS = [
  { module: 'Production', actions: ['View', 'Create', 'Edit', 'Delete', 'Approve'] },
  { module: 'Procurement', actions: ['View', 'Create', 'Edit', 'Delete', 'Approve'] },
  { module: 'Inventory', actions: ['View', 'Create', 'Edit', 'Delete', 'Approve'] },
  { module: 'Finance', actions: ['View', 'Create', 'Edit', 'Delete', 'Approve'] },
  { module: 'Analytics', actions: ['View', 'Create', 'Edit', 'Delete', 'Approve'] },
];

const MATRIX: Record<string, Record<string, boolean[]>> = {
  'Enterprise Admin': { Production: [true, true, true, true, true], Procurement: [true, true, true, true, true], Inventory: [true, true, true, true, true], Finance: [true, true, true, true, true], Analytics: [true, true, true, true, true] },
  'Production Manager': { Production: [true, true, true, false, true], Procurement: [true, false, false, false, false], Inventory: [true, false, false, false, false], Finance: [true, false, false, false, false], Analytics: [true, false, false, false, false] },
  'Procurement Manager': { Production: [true, false, false, false, false], Procurement: [true, true, true, false, true], Inventory: [true, false, false, false, false], Finance: [true, false, false, false, false], Analytics: [true, false, false, false, false] },
  'Finance Officer': { Production: [true, false, false, false, false], Procurement: [true, false, false, false, false], Inventory: [true, false, false, false, false], Finance: [true, true, true, false, true], Analytics: [true, true, false, false, false] },
};

export function AccessControlPage({ user }: { user: User }) {
  const [selectedRole, setSelectedRole] = useState('Enterprise Admin');

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Shield className="h-5 w-5" />Access Control (RBAC)</h1><p className="text-sm text-muted-foreground mt-0.5">Manage role-based permissions across all modules</p></div>
      <div className="grid lg:grid-cols-4 gap-5">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roles</p></div>
          <div className="divide-y divide-border">
            {ROLES.map(role => (
              <button key={role} onClick={() => setSelectedRole(role)}
                className={`w-full px-4 py-3 text-xs text-left font-medium transition-colors ${selectedRole === role ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>{role}</button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <p className="font-semibold text-foreground text-sm">Permissions Matrix — {selectedRole}</p>
            <button onClick={() => toast.success('Permissions saved')} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Save Changes</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="text-left px-5 py-3 font-medium">Module</th>{['View', 'Create', 'Edit', 'Delete', 'Approve'].map(a => <th key={a} className="text-center px-3 py-3 font-medium">{a}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {PERMISSIONS.map(p => {
                  const perms = MATRIX[selectedRole]?.[p.module] || [false, false, false, false, false];
                  return (
                    <tr key={p.module} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-xs font-medium text-foreground">{p.module}</td>
                      {perms.map((allowed, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          <button onClick={() => toast.info(`Toggling ${p.actions[i]} for ${p.module}`)}
                            className={`w-5 h-5 rounded flex items-center justify-center mx-auto transition-colors ${allowed ? 'bg-emerald-500/20 hover:bg-emerald-500/30' : 'bg-muted hover:bg-muted/70'}`}>
                            {allowed ? <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> : <X className="h-3 w-3 text-muted-foreground" />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
