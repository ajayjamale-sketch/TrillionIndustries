import { Building2, Plus, Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { useState } from 'react';

export function SupplierProfilePage({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: user.company || 'ACME Parts Co.', category: 'Industrial Components', gst: 'GST-123456789', address: '1400 Industrial Blvd, Cleveland, OH 44101', contact: user.phone || '+1 (555) 789-0123', website: 'www.acmeparts.com', description: 'Leading manufacturer and distributor of precision industrial components serving automotive and heavy manufacturing sectors.' });

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Building2 className="h-5 w-5" />Company Profile</h1><p className="text-sm text-muted-foreground">Manage your supplier profile and business information</p></div>
        <button onClick={() => { if (editing) { toast.success('Profile updated successfully'); } setEditing(v => !v); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${editing ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'} shadow-brand`}>
          {editing ? <><Save className="h-4 w-4" />Save Changes</> : <><Edit className="h-4 w-4" />Edit Profile</>}
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-border">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"><Building2 className="h-8 w-8 text-primary" /></div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.category}</p>
            <div className="flex items-center gap-2 mt-1"><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">Verified Supplier</span><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Score: 94</span></div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { label: 'Company Name', key: 'name' }, { label: 'Business Category', key: 'category' },
            { label: 'GST/Tax Number', key: 'gst' }, { label: 'Website', key: 'website' },
            { label: 'Contact Number', key: 'contact' }, { label: 'Business Address', key: 'address' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">{f.label}</label>
              {editing ? (
                <input value={(profile as any)[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              ) : (
                <p className="text-sm font-medium text-foreground">{(profile as any)[f.key]}</p>
              )}
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Business Description</label>
            {editing ? (
              <textarea value={profile.description} onChange={e => setProfile(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none resize-none" />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
