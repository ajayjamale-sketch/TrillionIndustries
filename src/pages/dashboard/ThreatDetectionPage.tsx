import { useState } from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Play, Power, Trash2, Globe, Search, RefreshCw } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface ThreatEvent {
  id: string;
  type: string;
  ip: string;
  location: string;
  target: string;
  time: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Blocked' | 'Monitoring' | 'Investigating' | 'Allowed';
}

const INITIAL_THREATS: ThreatEvent[] = [
  { id: 'THR-001', type: 'Brute Force Attack', ip: '185.220.101.4', location: 'Netherlands (NL)', target: 'admin@trillion.com', time: '5 min ago', severity: 'Critical', status: 'Blocked' },
  { id: 'THR-002', type: 'SQL Injection Attempt', ip: '92.118.160.12', location: 'Russia (RU)', target: '/api/v1/auth/login', time: '12 min ago', severity: 'High', status: 'Blocked' },
  { id: 'THR-003', type: 'Unusual API Burst', ip: '45.132.227.18', location: 'Germany (DE)', target: 'AK-9883 (API key)', time: '42 min ago', severity: 'Medium', status: 'Monitoring' },
  { id: 'THR-004', type: 'Mass File Access Attempt', ip: '102.165.33.201', location: 'Nigeria (NG)', target: 'Reports Storage', time: '2 hours ago', severity: 'High', status: 'Blocked' },
  { id: 'THR-005', type: 'Multiple Failed Logins', ip: '172.16.8.94', location: 'United States (US)', target: 'procure_ops@trillion.com', time: '4 hours ago', severity: 'Low', status: 'Investigating' }
];

export function ThreatDetectionPage({ user }: { user: User }) {
  const [threats, setThreats] = useState<ThreatEvent[]>(INITIAL_THREATS);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [rateLimiting, setRateLimiting] = useState(true);
  const [geoBlocking, setGeoBlocking] = useState(false);

  const filteredThreats = threats.filter(t => {
    const matchSearch = t.type.toLowerCase().includes(search.toLowerCase()) || 
                        t.ip.toLowerCase().includes(search.toLowerCase()) ||
                        t.location.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'All' || t.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const handleBlockIP = (ip: string) => {
    toast.success(`IP Address ${ip} has been permanently added to the firewall blocklist.`);
    setThreats(prev => prev.map(t => t.ip === ip ? { ...t, status: 'Blocked' } : t));
  };

  const handleResolve = (id: string) => {
    toast.success(`Threat Event ${id} marked as resolved.`);
    setThreats(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Threat Detection Center
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time threat monitoring and active intrusion prevention.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live Threat Feed
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Blocked Attacks</p>
          <p className="text-2xl font-bold text-foreground">8,421</p>
          <span className="text-[10px] text-emerald-500 font-semibold">+142 in last 24h</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Active Threat Severity</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-sm font-bold text-foreground">Moderate</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Normal operations mode</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">IP Blocklist Count</p>
          <p className="text-2xl font-bold text-foreground">1,204</p>
          <span className="text-[10px] text-muted-foreground">Synchronized globally</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Rate Limit Violations</p>
          <p className="text-2xl font-bold text-foreground">84</p>
          <span className="text-[10px] text-red-400 font-semibold">+8 in last hour</span>
        </div>
      </div>

      {/* Control Panel & Active Threat feed */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left Col: Security Rules Controls */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 h-fit">
          <h3 className="font-semibold text-foreground text-sm border-b border-border pb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Intrusion Prevention Rules
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Enforce Global MFA</p>
                <p className="text-[10px] text-muted-foreground">Enforce authentication verification on all logins</p>
              </div>
              <button 
                onClick={() => { setMfaEnforced(!mfaEnforced); toast.success(`MFA Enforcement: ${!mfaEnforced ? 'Enabled' : 'Disabled'}`); }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${mfaEnforced ? 'bg-primary' : 'bg-muted border border-border'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${mfaEnforced ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">API Rate Limiting</p>
                <p className="text-[10px] text-muted-foreground">Block clients making more than 100 requests/min</p>
              </div>
              <button 
                onClick={() => { setRateLimiting(!rateLimiting); toast.success(`API Rate Limiting: ${!rateLimiting ? 'Enabled' : 'Disabled'}`); }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${rateLimiting ? 'bg-primary' : 'bg-muted border border-border'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${rateLimiting ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Geographic IP Blocking</p>
                <p className="text-[10px] text-muted-foreground">Deny entry to traffic originating from high-risk countries</p>
              </div>
              <button 
                onClick={() => { setGeoBlocking(!geoBlocking); toast.warning(`Geo IP Blocking: ${!geoBlocking ? 'Activated' : 'Deactivated'}`); }}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${geoBlocking ? 'bg-primary' : 'bg-muted border border-border'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${geoBlocking ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => toast.success('Firewall rule sets refreshed')} 
              className="w-full py-2 bg-muted hover:bg-muted/70 text-foreground border border-border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Synchronize Rules
            </button>
          </div>
        </div>

        {/* Right Col: Threat Event Log Grid */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/20">
              <h3 className="font-semibold text-foreground text-sm">Threat Event Log</h3>
              
              {/* Filter inputs */}
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search source IP or event..."
                    className="pl-8 pr-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none w-full sm:w-44"
                  />
                </div>
                <select
                  value={severityFilter}
                  onChange={e => setSeverityFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-border">
              {filteredThreats.length > 0 ? (
                filteredThreats.map(t => (
                  <div key={t.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      t.severity === 'Critical' || t.severity === 'High' ? 'bg-red-500/10' : t.severity === 'Medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        t.severity === 'Critical' || t.severity === 'High' ? 'text-red-500' : t.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">{t.type}</p>
                        <span className="text-[10px] text-muted-foreground font-mono bg-muted border border-border px-1.5 py-0.5 rounded">{t.id}</span>
                        <StatusBadge variant={t.status === 'Blocked' ? 'success' : t.status === 'Monitoring' ? 'default' : 'warning'} size="sm">
                          {t.status}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 items-center">
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {t.ip} ({t.location})</span>
                        <span>Target: <span className="font-medium text-foreground">{t.target}</span></span>
                        <span>{t.time}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {t.status !== 'Blocked' && (
                        <button 
                          onClick={() => handleBlockIP(t.ip)} 
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          title="Block IP Address"
                        >
                          Block
                        </button>
                      )}
                      <button 
                        onClick={() => handleResolve(t.id)} 
                        className="px-2 py-1 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg text-xs font-semibold transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <ShieldCheck className="h-10 w-10 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-foreground">No threats detected</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Firewall is operational and all scans report clear.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
