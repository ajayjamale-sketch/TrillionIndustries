import { useState } from 'react';
import { Lock, AlertOctagon, CheckCircle2, Shield, History, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const THREATS = [
  { id: 'THR-001', type: 'Brute Force Attempt', ip: '192.168.44.21', target: 'admin@titan.com', time: '10 min ago', severity: 'High', status: 'Blocked' },
  { id: 'THR-002', type: 'Unusual API Activity', ip: '10.0.8.114', target: 'API Key AK-221', time: '1h ago', severity: 'Medium', status: 'Monitoring' },
  { id: 'THR-003', type: 'Failed Login x12', ip: '172.16.0.44', target: 'procurement@global.com', time: '3h ago', severity: 'Low', status: 'Resolved' },
];

const SECURITY_METRICS = [
  { label: 'Security Score', value: '98/100' }, { label: 'Failed Logins (24h)', value: '127' },
  { label: 'Active Sessions', value: '1,842' }, { label: 'API Keys Issued', value: '284' },
];

export function SecurityCenterPage({ user }: { user: User }) {
  const [tab, setTab] = useState<'threats' | 'sessions' | 'audit'>('threats');
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Lock className="h-5 w-5" />Security Center</h1><p className="text-sm text-muted-foreground">Platform threat detection and security monitoring</p></div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Shield className="h-3.5 w-3.5" />SOC2 Certified · ISO 27001
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SECURITY_METRICS.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">{m.label}</p><p className="text-2xl font-bold text-foreground">{m.value}</p></div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          {[['threats', 'Threat Events'], ['sessions', 'Active Sessions'], ['audit', 'Security Audit']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{label}</button>
          ))}
        </div>
        {tab === 'threats' && (
          <div className="divide-y divide-border">
            {THREATS.map(t => (
              <div key={t.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.severity === 'High' ? 'bg-red-500/10' : t.severity === 'Medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                  <AlertOctagon className={`h-4 w-4 ${t.severity === 'High' ? 'text-red-500' : t.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.type}</p>
                  <p className="text-xs text-muted-foreground">IP: {t.ip} · Target: {t.target} · {t.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${t.severity === 'High' ? 'text-red-500' : t.severity === 'Medium' ? 'text-amber-500' : 'text-muted-foreground'}`}>{t.severity}</span>
                  <StatusBadge variant={t.status === 'Blocked' || t.status === 'Resolved' ? 'success' : 'warning'} size="sm">{t.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'sessions' && (
          <div className="p-5">
            <p className="text-sm text-muted-foreground mb-4">1,842 active sessions across 290 organizations</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[{ label: 'Web Sessions', value: '1,421' }, { label: 'Mobile Sessions', value: '284' }, { label: 'API Sessions', value: '137' }].map(s => (
                <div key={s.label} className="bg-muted/50 rounded-xl p-4 text-center"><p className="text-lg font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              ))}
            </div>
            <button onClick={() => toast.warning('All suspicious sessions terminated')} className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Terminate All Suspicious Sessions</button>
          </div>
        )}
        {tab === 'audit' && (
          <div className="p-5 space-y-3">
            <button onClick={() => toast.success('Security audit initiated')} className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Shield className="h-4 w-4" />Run Full Security Audit</button>
            {[
              { check: 'SSL Certificate Valid', status: 'Pass' }, { check: 'Database Encryption', status: 'Pass' },
              { check: 'API Rate Limiting', status: 'Pass' }, { check: 'MFA Enforcement', status: 'Warning' },
              { check: 'Backup Integrity', status: 'Pass' }, { check: 'OWASP Top 10 Scan', status: 'Pass' },
            ].map(c => (
              <div key={c.check} className="flex items-center justify-between p-3 border border-border rounded-xl">
                <p className="text-sm text-foreground">{c.check}</p>
                <StatusBadge variant={c.status === 'Pass' ? 'success' : 'warning'} size="sm">{c.status}</StatusBadge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
