import { useState } from 'react';
import { History, Download, Search, Calendar, Filter, UserCheck, ShieldAlert, Database, Info } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: string;
  severity: 'Info' | 'Warning' | 'Error';
  ip: string;
}

const INITIAL_LOGS: AuditLog[] = [
  { id: 'LOG-4091', timestamp: '2026-06-01 15:02:11', actor: 'Alex Johnson', role: 'Enterprise Admin', action: 'Modified Departments Config', module: 'Departments', severity: 'Warning', ip: '192.168.1.45' },
  { id: 'LOG-4090', timestamp: '2026-06-01 14:58:32', actor: 'Tom Bradley', role: 'CNC Operator', action: 'B2B Catalog Purchase - Direct Order', module: 'B2B Marketplace', severity: 'Info', ip: '10.0.4.11' },
  { id: 'LOG-4089', timestamp: '2026-06-01 14:12:05', actor: 'Sara Liu', role: 'Warehouse Operator', action: 'Dispatched Batch #B229', module: 'Warehouse', severity: 'Info', ip: '10.0.12.18' },
  { id: 'LOG-4088', timestamp: '2026-06-01 13:44:19', actor: 'SYSTEM_DAEMON', role: 'Daemon Service', action: 'Failed DB Sync - Connection Timed Out', module: 'Database Core', severity: 'Error', ip: 'localhost' },
  { id: 'LOG-4087', timestamp: '2026-06-01 13:01:50', actor: 'Diego Martinez', role: 'Production Line Sup', action: 'Authorized Work Order WO-4421', module: 'Production', severity: 'Info', ip: '192.168.10.84' },
  { id: 'LOG-4086', timestamp: '2026-06-01 12:20:01', actor: 'Alex Johnson', role: 'Enterprise Admin', action: 'Revoked API credentials key AK-8832', module: 'Security Access', severity: 'Warning', ip: '192.168.1.45' },
  { id: 'LOG-4085', timestamp: '2026-06-01 11:15:30', actor: 'SYSTEM_FIREWALL', role: 'SOC System', action: 'Blocked Malicious IP 185.220.101.4', module: 'Threat Detection', severity: 'Warning', ip: '127.0.0.1' }
];

export function AuditLogsPage({ user }: { user: User }) {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filteredLogs = logs.filter(l => {
    const matchSearch = l.actor.toLowerCase().includes(search.toLowerCase()) ||
                        l.action.toLowerCase().includes(search.toLowerCase()) ||
                        l.id.toLowerCase().includes(search.toLowerCase()) ||
                        l.ip.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'All' || l.module === moduleFilter;
    const matchSeverity = severityFilter === 'All' || l.severity === severityFilter;
    return matchSearch && matchModule && matchSeverity;
  });

  const handleExport = (format: 'CSV' | 'JSON') => {
    toast.success(`Audit logs successfully exported as ${format} (${filteredLogs.length} logs).`);
  };

  const getSeverityIcon = (sev: 'Info' | 'Warning' | 'Error') => {
    if (sev === 'Error') return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (sev === 'Warning') return <Info className="h-4 w-4 text-amber-500" />;
    return <UserCheck className="h-4 w-4 text-blue-500" />;
  };

  const uniqueModules = ['All', ...Array.from(new Set(logs.map(l => l.module)))];

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Platform Audit Trail
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Immutable audit record logs of user and system events.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold hover:bg-muted text-foreground transition-colors"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Explorer Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Actor, Event, ID, or IP..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Module:</span>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none"
            >
              {uniqueModules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table Area */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3.5 font-medium">Log ID</th>
                <th className="text-left px-5 py-3.5 font-medium">Timestamp</th>
                <th className="text-left px-5 py-3.5 font-medium">Actor</th>
                <th className="text-left px-5 py-3.5 font-medium">Action/Event</th>
                <th className="text-left px-5 py-3.5 font-medium">Resource/Module</th>
                <th className="text-left px-5 py-3.5 font-medium">Severity</th>
                <th className="text-left px-5 py-3.5 font-medium">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{log.id}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-foreground">{log.actor}</p>
                      <p className="text-[10px] text-muted-foreground">{log.role}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-foreground font-medium max-w-xs truncate" title={log.action}>
                      {log.action}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Database className="h-3.5 w-3.5 text-muted-foreground/60" /> {log.module}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {getSeverityIcon(log.severity)}
                        <span className={`text-xs font-semibold ${
                          log.severity === 'Error' ? 'text-red-500' : log.severity === 'Warning' ? 'text-amber-500' : 'text-blue-500'
                        }`}>
                          {log.severity}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{log.ip}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    <History className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">No audit logs found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Try widening your filters or input search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
