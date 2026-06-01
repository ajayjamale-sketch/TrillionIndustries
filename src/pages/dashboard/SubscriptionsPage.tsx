import { CreditCard, CheckCircle2, TrendingUp } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const PLANS = [
  { plan: 'Enterprise', orgs: 82, mrr: '$596K', features: 'All modules + AI + Priority support', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  { plan: 'Professional', orgs: 124, mrr: '$124K', features: 'Core modules + AI Basic', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { plan: 'Starter', orgs: 84, mrr: '$40K', features: 'Basic modules only', color: 'bg-muted text-muted-foreground border-border' },
];

const RECENT_SUBS = [
  { org: 'NovaMech Systems', action: 'Trial Started', plan: 'Starter → Professional', date: 'Jun 2', value: '$2,800/mo' },
  { org: 'Delta Industrial', action: 'Upgraded', plan: 'Professional → Enterprise', date: 'Jun 1', value: '+$9,600/mo' },
  { org: 'SupraTech Ltd.', action: 'Renewed', plan: 'Enterprise', date: 'Jun 1', value: '$12,400/mo' },
  { org: 'MicroParts Co.', action: 'Cancelled', plan: 'Starter', date: 'May 31', value: '-$480/mo' },
];

export function SubscriptionsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><CreditCard className="h-5 w-5" />Subscription Management</h1><p className="text-sm text-muted-foreground">Platform subscription plans and billing</p></div>
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map(p => (
          <div key={p.plan} className={`border rounded-xl p-5 ${p.color.split(' ').slice(-1)[0]}`}>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.color.split(' ').slice(0, -1).join(' ')} border mb-3 inline-block`}>{p.plan}</span>
            <p className="text-2xl font-bold text-foreground">{p.orgs} <span className="text-sm font-normal text-muted-foreground">orgs</span></p>
            <p className="text-lg font-semibold text-primary mt-1">{p.mrr}/mo</p>
            <p className="text-xs text-muted-foreground mt-2">{p.features}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-foreground text-sm">Recent Subscription Events</h3></div>
        <div className="divide-y divide-border">
          {RECENT_SUBS.map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <div className={`w-2 h-2 rounded-full shrink-0 ${s.action === 'Upgraded' || s.action === 'Trial Started' ? 'bg-emerald-500' : s.action === 'Renewed' ? 'bg-blue-500' : 'bg-red-500'}`} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{s.org} — {s.action}</p>
                <p className="text-[11px] text-muted-foreground">{s.plan} · {s.date}</p>
              </div>
              <span className={`text-xs font-bold ${s.action === 'Cancelled' ? 'text-red-500' : 'text-emerald-500'}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
