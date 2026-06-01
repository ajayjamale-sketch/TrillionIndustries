import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Camera, Save, Loader2, CheckCircle2, AlertCircle, User, Building2, Phone, MapPin, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  enterprise_admin: 'Enterprise Admin',
  production_manager: 'Production Manager',
  procurement_manager: 'Procurement Manager',
  warehouse_manager: 'Warehouse Manager',
  maintenance_engineer: 'Maintenance Engineer',
  supplier: 'Supplier / Vendor',
  finance_officer: 'Finance Officer',
  super_admin: 'Super Admin',
};

export default function Profile() {
  useScrollTop();
  const { user, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    department: user?.department || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [saved, setSaved] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    await updateProfile(form);
    setSaved(true);
    toast.success('Profile updated successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">User Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-28 gradient-brand relative" />

          {/* Avatar */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-card shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-primary ring-4 ring-card flex items-center justify-center text-2xl font-black text-primary-foreground shadow-lg">
                    {getInitials(user.name)}
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-secondary border-2 border-card flex items-center justify-center hover:bg-primary transition-colors">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-primary" /> Personal Information
          </h3>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', icon: User, placeholder: 'Your full name' },
                { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'work@company.com' },
                { key: 'company', label: 'Company', icon: Building2, placeholder: 'Company name' },
                { key: 'department', label: 'Department', icon: Building2, placeholder: 'e.g. Operations' },
                { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 555 000 0000' },
                { key: 'location', label: 'Location', icon: MapPin, placeholder: 'City, Country' },
              ].map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={field.key === 'email' ? 'email' : 'text'}
                        value={form[field.key as keyof typeof form]}
                        onChange={set(field.key)}
                        placeholder={field.placeholder}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand disabled:opacity-60"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : saved ? (
                  <><CheckCircle2 className="h-4 w-4" /> Saved!</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Changes</>
                )}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
