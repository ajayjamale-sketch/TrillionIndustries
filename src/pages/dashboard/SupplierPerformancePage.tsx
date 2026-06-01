import { useState } from 'react';
import { Star, Award, CheckCircle2, Clock, ShieldCheck, Download, Calendar, BarChart3 } from 'lucide-react';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

interface QualityAudit {
  id: string;
  date: string;
  score: number;
  result: 'Excellent' | 'Good' | 'Needs Improvement';
  auditor: string;
}

const AUDITS: QualityAudit[] = [
  { id: 'AUD-882', date: 'May 12, 2026', score: 95, result: 'Excellent', auditor: 'Trillion QA Operations' },
  { id: 'AUD-641', date: 'Nov 04, 2025', score: 93, result: 'Excellent', auditor: 'Trillion QA Operations' },
  { id: 'AUD-330', date: 'May 20, 2025', score: 91, result: 'Good', auditor: 'External Quality Audit' }
];

export function SupplierPerformancePage({ user }: { user: User }) {
  const [audits] = useState<QualityAudit[]>(AUDITS);

  const handleDownloadCertificate = () => {
    toast.success('Preferred Supplier Status Certificate downloaded (PDF). Valid through Dec 2026.');
  };

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Supplier Performance Scorecard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your quality metrics, response times, and audit rankings.</p>
        </div>
        <button 
          onClick={handleDownloadCertificate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Download className="h-4 w-4" /> Download Certificate
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Rating Score', value: '94/100', subtitle: 'Preferred Status', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'On-Time Delivery Rate', value: '96%', subtitle: 'Target: >95%', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Defect Rate (PPM)', value: '0.4%', subtitle: 'Target: <1.0%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Average Response Time', value: '1.8 hours', subtitle: 'Target: <4 hours', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Audit History logs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Quality Audits & Evaluations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Audit ID</th>
                <th className="text-left px-5 py-3 font-medium">Evaluation Date</th>
                <th className="text-left px-5 py-3 font-medium">Auditor</th>
                <th className="text-left px-5 py-3 font-medium">Quality Score</th>
                <th className="text-left px-5 py-3 font-medium">Rating Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {audits.map(audit => (
                <tr key={audit.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{audit.id}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" /> {audit.date}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium text-foreground">{audit.auditor}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{audit.score} / 100</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={audit.result === 'Excellent' ? 'success' : 'default'} size="sm">
                      {audit.result}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
