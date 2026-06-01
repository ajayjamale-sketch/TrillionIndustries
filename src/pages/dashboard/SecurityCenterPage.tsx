import { useState } from 'react';
import { Lock, Shield, RefreshCw, Key, Power, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

const SECURITY_METRICS = [
  { label: 'Security Score', value: '98/100' },
  { label: 'Active Sessions', value: '1,842' },
  { label: 'API Keys Active', value: '24' },
  { label: 'Failed Logins (24h)', value: '127' },
];

interface APIKey {
  id: string;
  name: string;
  scope: 'Read-only' | 'Read/Write' | 'Admin Access';
  created: string;
  status: 'Active' | 'Revoked';
}

const INITIAL_KEYS: APIKey[] = [
  { id: 'AK-9883', name: 'IIoT Telemetry Gateway', scope: 'Read/Write', created: '2026-01-15', status: 'Active' },
  { id: 'AK-2211', name: 'ERP Finance Link', scope: 'Admin Access', created: '2026-03-22', status: 'Active' },
  { id: 'AK-4040', name: 'Warehouse Dispatch Hook', scope: 'Read-only', created: '2026-05-10', status: 'Active' },
  { id: 'AK-1102', name: 'External HR Sync Service', scope: 'Read/Write', created: '2025-11-04', status: 'Revoked' }
];

export function SecurityCenterPage({ user }: { user: User }) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(INITIAL_KEYS);
  const [sessionsCount, setSessionsCount] = useState(1842);

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => 
      prev.map(key => key.id === id ? { ...key, status: 'Revoked' } : key)
    );
    toast.warning(`API Key ${id} has been revoked.`);
  };

  const handleCreateKey = () => {
    const newKey: APIKey = {
      id: `AK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `External Client Hook #${apiKeys.length + 1}`,
      scope: 'Read-only',
      created: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success(`New API key ${newKey.id} generated!`);
  };

  const handleTerminateSuspicious = () => {
    toast.warning('All suspicious active sessions terminated.');
    setSessionsCount(1838); // simulate terminating 4 suspicious sessions
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Security Center
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Platform compliance audits, active sessions, and credential management.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Shield className="h-3.5 w-3.5" /> SOC2 Type II Certified
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SECURITY_METRICS.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-foreground">
              {m.label === 'Active Sessions' ? sessionsCount.toLocaleString() : m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Layout Content Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        
        {/* Compliance Audits */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm border-b border-border pb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Security Checks & Audits
          </h3>
          
          <button 
            onClick={() => toast.success('Platform security scan completed successfully.')}
            className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-brand"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Run Security Audit Scan
          </button>

          <div className="space-y-3.5 pt-1">
            {[
              { check: 'SSL Certificate Integrity', status: 'Pass' },
              { check: 'Database AES-256 Encryption', status: 'Pass' },
              { check: 'API Rate Limiting Shield', status: 'Pass' },
              { check: 'MFA Enforcement Status', status: 'Warning' },
              { check: 'Daily Backup Auditing', status: 'Pass' },
            ].map(c => (
              <div key={c.check} className="flex items-center justify-between p-3 border border-border rounded-xl text-xs bg-muted/20">
                <p className="font-medium text-foreground">{c.check}</p>
                <StatusBadge variant={c.status === 'Pass' ? 'success' : 'warning'} size="sm">
                  {c.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>

        {/* API Credential Keys */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Key className="h-4 w-4 text-amber-500" />
              API Credential Access
            </h3>
            <button 
              onClick={handleCreateKey}
              className="text-xs text-primary font-semibold hover:underline"
            >
              + Create Key
            </button>
          </div>

          <div className="divide-y divide-border">
            {apiKeys.map(key => (
              <div key={key.id} className="py-3 flex items-start justify-between text-xs gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-foreground truncate max-w-[150px]">{key.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">({key.id})</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Scope: {key.scope} · Issued: {key.created}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge variant={key.status === 'Active' ? 'success' : 'muted'} size="sm">
                    {key.status}
                  </StatusBadge>
                  {key.status === 'Active' && (
                    <button 
                      onClick={() => handleRevokeKey(key.id)}
                      className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      title="Revoke Key"
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions control */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm border-b border-border pb-3 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-blue-500" />
            Sessions Management
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            There are currently <span className="font-semibold text-foreground">{sessionsCount.toLocaleString()}</span> active web, mobile, or daemon sessions running across organizations.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Web UI', count: 1421 },
              { label: 'Mobile App', count: 284 },
              { label: 'API Links', count: 137 }
            ].map(item => (
              <div key={item.label} className="bg-muted/40 border border-border rounded-xl p-3 text-center">
                <span className="text-sm font-bold text-foreground">{item.count}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                4 active sessions have been flagged with high-frequency login cycles from mismatched geolocation IPs.
              </p>
            </div>
            <button 
              onClick={handleTerminateSuspicious}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              Terminate suspicious sessions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
