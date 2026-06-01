import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useThemeContext } from '@/components/features/ThemeProvider';
import {
  Bell, Shield, Moon, Sun, Globe, Database, Key, Trash2,
  Save, Loader2, Check, ChevronRight, Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TABS = ['General', 'Notifications', 'Security', 'Integrations', 'Danger Zone'];

export default function Settings() {
  useScrollTop();
  const { user } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General');
  const [saving, setSaving] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true, productionAlerts: true, maintenanceAlerts: true,
    procurementAlerts: false, weeklyReport: true, systemUpdates: true,
  });

  const [general, setGeneral] = useState({
    language: 'en', timezone: 'America/Detroit', dateFormat: 'MM/DD/YYYY', currency: 'USD',
  });

  if (!user) { navigate('/login'); return null; }

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved successfully!');
  };

  const toggle = (k: keyof typeof notifSettings) =>
    setNotifSettings(p => ({ ...p, [k]: !p[k] }));

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn('relative w-10 h-5.5 rounded-full transition-colors', on ? 'bg-primary' : 'bg-muted')}
    >
      <span className={cn('absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences and platform configuration</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden sm:block w-44 shrink-0">
            <nav className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-primary/10 text-primary'
                      : tab === 'Danger Zone'
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Mobile tab selector */}
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
              className="sm:hidden w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {TABS.map(t => <option key={t}>{t}</option>)}
            </select>

            {activeTab === 'General' && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-primary" /> General Preferences
                </h3>

                {/* Theme */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="h-4.5 w-4.5 text-primary" /> : <Sun className="h-4.5 w-4.5 text-primary" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">Appearance</p>
                      <p className="text-xs text-muted-foreground">Currently {theme} mode</p>
                    </div>
                  </div>
                  <button onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                    <Monitor className="h-3.5 w-3.5" />
                    {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                  </button>
                </div>

                {[
                  { key: 'language', label: 'Language', options: [{ v: 'en', l: 'English' }, { v: 'de', l: 'German' }, { v: 'fr', l: 'French' }, { v: 'es', l: 'Spanish' }] },
                  { key: 'timezone', label: 'Timezone', options: [{ v: 'America/Detroit', l: 'Eastern Time' }, { v: 'America/Chicago', l: 'Central Time' }, { v: 'Europe/London', l: 'GMT / UTC' }, { v: 'Asia/Kolkata', l: 'India Standard Time' }] },
                  { key: 'dateFormat', label: 'Date Format', options: [{ v: 'MM/DD/YYYY', l: 'MM/DD/YYYY' }, { v: 'DD/MM/YYYY', l: 'DD/MM/YYYY' }, { v: 'YYYY-MM-DD', l: 'YYYY-MM-DD' }] },
                  { key: 'currency', label: 'Currency', options: [{ v: 'USD', l: 'USD ($)' }, { v: 'EUR', l: 'EUR (€)' }, { v: 'GBP', l: 'GBP (£)' }, { v: 'INR', l: 'INR (₹)' }] },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between">
                    <label className="text-sm text-foreground">{s.label}</label>
                    <select
                      value={general[s.key as keyof typeof general]}
                      onChange={e => setGeneral(p => ({ ...p, [s.key]: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {s.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}

                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand disabled:opacity-60">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Preferences</>}
                </button>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Bell className="h-4.5 w-4.5 text-primary" /> Notification Preferences
                </h3>
                {Object.entries({
                  emailAlerts: { label: 'Email Alerts', desc: 'Receive critical alerts via email' },
                  productionAlerts: { label: 'Production Alerts', desc: 'Work order status and production line alerts' },
                  maintenanceAlerts: { label: 'Maintenance Alerts', desc: 'Equipment maintenance and breakdown notifications' },
                  procurementAlerts: { label: 'Procurement Alerts', desc: 'PO approvals and procurement workflow updates' },
                  weeklyReport: { label: 'Weekly Report', desc: 'Receive weekly performance summary report' },
                  systemUpdates: { label: 'System Updates', desc: 'Platform updates and new feature announcements' },
                }).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{v.label}</p>
                      <p className="text-xs text-muted-foreground">{v.desc}</p>
                    </div>
                    <Toggle on={notifSettings[k as keyof typeof notifSettings]} onChange={() => toggle(k as keyof typeof notifSettings)} />
                  </div>
                ))}
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Check className="h-4 w-4" /> Update Preferences</>}
                </button>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4.5 w-4.5 text-primary" /> Security Settings
                </h3>
                {[
                  { label: 'Change Password', desc: 'Update your account password', icon: Key },
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', icon: Shield },
                  { label: 'Active Sessions', desc: 'Manage devices logged into your account', icon: Monitor },
                  { label: 'API Keys', desc: 'Manage API access tokens', icon: Database },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label}
                      onClick={() => toast.info(`${item.label} coming soon`)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'Danger Zone' && (
              <div className="bg-card border border-red-200 dark:border-red-800/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Trash2 className="h-4.5 w-4.5" /> Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground">These actions are irreversible. Please proceed with caution.</p>
                <div className="space-y-3">
                  {[
                    { label: 'Delete All Data', desc: 'Permanently delete all platform data for your organization' },
                    { label: 'Deactivate Account', desc: 'Disable your account and revoke all access' },
                    { label: 'Delete Account', desc: 'Permanently delete your account and all associated data' },
                  ].map(a => (
                    <div key={a.label} className="flex items-center justify-between p-4 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50/50 dark:bg-red-900/10">
                      <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">{a.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                      </div>
                      <button
                        onClick={() => toast.error('This action requires enterprise admin approval')}
                        className="px-3 py-1.5 rounded-lg border border-red-400 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        {a.label.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
