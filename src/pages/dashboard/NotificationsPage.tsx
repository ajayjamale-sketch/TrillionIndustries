import { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const ALL_NOTIFICATIONS = [
  { id: 1, type: 'error', title: 'Machine #A204 Alert', msg: 'Vibration sensor reading above safe threshold — immediate inspection recommended', time: '5m ago', category: 'IIoT', read: false },
  { id: 2, type: 'warning', title: 'Low Stock Alert', msg: 'Bearing housing SKU BRG-4401 is below reorder point (currently 42 units, minimum 50)', time: '12m ago', category: 'Inventory', read: false },
  { id: 3, type: 'success', title: 'PO-7821 Approved', msg: 'Purchase order to SteelPro Ltd. for $48,200 has been approved and sent', time: '28m ago', category: 'Procurement', read: false },
  { id: 4, type: 'info', title: 'Maintenance Due', msg: 'Hydraulic Press Line B — scheduled preventive maintenance due today at 14:00', time: '1h ago', category: 'Maintenance', read: true },
  { id: 5, type: 'success', title: 'Work Order Completed', msg: 'WO-4423 Bearing Housing batch fully completed — 750 units quality approved', time: '2h ago', category: 'Production', read: true },
  { id: 6, type: 'info', title: 'New Vendor Registration', msg: 'Global Fasteners Inc. has completed onboarding and is awaiting approval', time: '3h ago', category: 'Procurement', read: true },
  { id: 7, type: 'warning', title: 'Quality Defect Report', msg: 'NCR-441 raised for surface finish defect in Steel Shaft batch BT-4421', time: '4h ago', category: 'Quality', read: true },
  { id: 8, type: 'info', title: 'Shift Change Report', msg: 'Evening shift handover complete — 1,810 employees checked in for night operations', time: '8h ago', category: 'Workforce', read: true },
];

const CATEGORIES = ['All', 'IIoT', 'Inventory', 'Procurement', 'Maintenance', 'Production', 'Quality', 'Workforce'];

export function NotificationsPage({ user }: { user: User }) {
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = notifications
    .filter(n => filter === 'All' || n.category === filter)
    .filter(n => typeFilter === 'all' || (typeFilter === 'unread' ? !n.read : n.read));

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const dismiss = (id: number) => {
    setNotifications(p => p.filter(n => n.id !== id));
    toast.info('Notification dismissed');
  };

  const markRead = (id: number) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && <span className="text-xs font-bold bg-accent text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Stay updated on all platform activities</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            <CheckCircle2 className="h-4 w-4" />Mark All Read
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1.5">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${typeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === cat ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="font-medium text-muted-foreground">No notifications found</p>
          </div>
        ) : filtered.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'error' ? 'bg-red-500/10' : n.type === 'warning' ? 'bg-amber-500/10' : n.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
              {n.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                n.type === 'error' || n.type === 'warning' ? <AlertTriangle className={`h-4 w-4 ${n.type === 'error' ? 'text-red-500' : 'text-amber-500'}`} /> :
                <Info className="h-4 w-4 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.msg}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{n.category}</span>
                <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
              className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
