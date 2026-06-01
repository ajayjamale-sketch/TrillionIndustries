import { useState } from 'react';
import { Settings, User as UserIcon, Bell, Shield, Palette, Globe, Save, Loader2, Moon, Sun, Check } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { useThemeContext } from '@/components/features/ThemeProvider';

export function DashboardSettingsPage({ user }: { user: User }) {
  const { theme, toggleTheme } = useThemeContext();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true, browser: true, production: true, procurement: true,
    maintenance: true, quality: false, inventory: true, weekly: true,
  });
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone || '', location: user.location || '', timezone: 'America/Detroit' });

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Settings className="h-5 w-5" />Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and platform preferences</p>
      </div>

      <div className="flex gap-1.5 bg-card border border-border rounded-xl p-1.5">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon className="h-4 w-4" /><span className="hidden sm:block">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <h3 className="font-bold text-foreground">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Work Email', key: 'email', type: 'email' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Location', key: 'location', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{field.label}</label>
                  <input type={field.type} value={(profile as any)[field.key]}
                    onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <h3 className="font-bold text-foreground">Notification Preferences</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Channels</p>
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive alerts and updates via email' },
                { key: 'browser', label: 'Browser Notifications', desc: 'Show desktop push notifications' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full transition-colors ${(notifications as any)[item.key] ? 'bg-primary' : 'bg-muted border border-border'}`}>
                    <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${(notifications as any)[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Modules</p>
              {[
                { key: 'production', label: 'Production Alerts' },
                { key: 'procurement', label: 'Procurement Updates' },
                { key: 'maintenance', label: 'Maintenance Alerts' },
                { key: 'quality', label: 'Quality Defects' },
                { key: 'inventory', label: 'Low Stock Alerts' },
                { key: 'weekly', label: 'Weekly Summary Email' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2.5 px-3 rounded-xl border border-border">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <button onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full transition-colors ${(notifications as any)[item.key] ? 'bg-primary' : 'bg-muted border border-border'}`}>
                    <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${(notifications as any)[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-5">
            <h3 className="font-bold text-foreground">Appearance & Display</h3>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Color Mode</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean, bright interface' },
                  { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Easier on the eyes at night' },
                ].map(mode => {
                  const Icon = mode.icon;
                  const isActive = theme === mode.id;
                  return (
                    <button key={mode.id} onClick={() => !isActive && toggleTheme()}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{mode.label}</p>
                        <p className="text-xs text-muted-foreground">{mode.desc}</p>
                      </div>
                      {isActive && <Check className="h-4 w-4 text-primary ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Language & Region</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Language</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>German</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Timezone</label>
                  <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
                    <option value="America/Detroit">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">GMT/BST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <h3 className="font-bold text-foreground">Security & Privacy</h3>
            <div className="space-y-3">
              <div className="p-4 border border-border rounded-xl">
                <p className="text-sm font-semibold text-foreground mb-1">Change Password</p>
                <p className="text-xs text-muted-foreground mb-3">Last changed 45 days ago</p>
                <div className="space-y-2">
                  {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                    <input key={label} type="password" placeholder={label}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  ))}
                </div>
                <button onClick={() => toast.success('Password changed successfully')}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                  Update Password
                </button>
              </div>
              <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <button onClick={() => toast.info('2FA setup wizard opening')}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">Enable 2FA</button>
              </div>
              <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Active Sessions</p>
                  <p className="text-xs text-muted-foreground">2 devices logged in</p>
                </div>
                <button onClick={() => toast.success('All other sessions signed out')}
                  className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Sign Out Others</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-border flex justify-end">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-brand">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
