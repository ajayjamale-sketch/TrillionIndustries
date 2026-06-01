import { useState } from 'react';
import { Download, FileText, BarChart3, Calendar, Filter, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const REPORT_TYPES = [
  { id: 'prod', name: 'Production Summary', desc: 'Daily/weekly/monthly production output, OEE, defects', module: 'Production', formats: ['PDF', 'Excel', 'CSV'] },
  { id: 'proc', name: 'Procurement Analysis', desc: 'Purchase orders, vendor performance, spend analysis', module: 'Procurement', formats: ['PDF', 'Excel'] },
  { id: 'inv', name: 'Inventory Report', desc: 'Stock levels, movements, low stock alerts, valuations', module: 'Inventory', formats: ['PDF', 'Excel', 'CSV'] },
  { id: 'maint', name: 'Maintenance Report', desc: 'PM completion rates, breakdown history, MTTR/MTBF', module: 'Maintenance', formats: ['PDF', 'Excel'] },
  { id: 'fin', name: 'Financial P&L', desc: 'Revenue, expenses, profit margins, budget variances', module: 'Finance', formats: ['PDF', 'Excel'] },
  { id: 'qual', name: 'Quality Report', desc: 'Defect rates, NCRs, CAPA status, inspection results', module: 'Quality', formats: ['PDF', 'Excel', 'CSV'] },
  { id: 'work', name: 'Workforce Report', desc: 'Attendance, productivity, shift utilization, skills', module: 'Workforce', formats: ['PDF', 'Excel'] },
  { id: 'exec', name: 'Executive Dashboard Export', desc: 'Complete enterprise KPI summary for leadership', module: 'Analytics', formats: ['PDF', 'PowerPoint'] },
];

const RECENT_EXPORTS = [
  { name: 'Production Summary — May 2026', module: 'Production', format: 'PDF', size: '2.4 MB', date: 'Jun 1, 2026', status: 'Ready' },
  { name: 'Procurement Analysis Q2', module: 'Procurement', format: 'Excel', size: '1.8 MB', date: 'Jun 1, 2026', status: 'Ready' },
  { name: 'Inventory Report — Jun 2', module: 'Inventory', format: 'CSV', size: '840 KB', date: 'Jun 2, 2026', status: 'Ready' },
  { name: 'Financial P&L May 2026', module: 'Finance', format: 'PDF', size: '3.1 MB', date: 'May 31, 2026', status: 'Ready' },
];

export function ReportsPage({ user }: { user: User }) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [period, setPeriod] = useState('monthly');
  const [selectedModule, setSelectedModule] = useState('All');

  const generateReport = async (reportId: string, reportName: string) => {
    setGenerating(reportId);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(null);
    toast.success(`${reportName} generated and ready to download`);
  };

  const filteredReports = REPORT_TYPES.filter(r => selectedModule === 'All' || r.module === selectedModule);
  const modules = ['All', ...Array.from(new Set(REPORT_TYPES.map(r => r.module)))];

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Download className="h-5 w-5" />Reports & Exports</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Generate and download enterprise reports in multiple formats</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-1">
          {['daily', 'weekly', 'monthly', 'quarterly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {modules.map(m => (
            <button key={m} onClick={() => setSelectedModule(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedModule === m ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{report.name}</p>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{report.module}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {report.formats.map(fmt => (
                  <span key={fmt} className="text-[11px] px-2 py-1 rounded-lg bg-muted font-medium text-muted-foreground">{fmt}</span>
                ))}
              </div>
              <button onClick={() => generateReport(report.id, report.name)}
                disabled={generating === report.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                {generating === report.id ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating...</> : <><Download className="h-3.5 w-3.5" />Generate</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Exports */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Recent Exports</h3>
        </div>
        <div className="divide-y divide-border">
          {RECENT_EXPORTS.map((exp, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{exp.name}</p>
                <p className="text-[11px] text-muted-foreground">{exp.format} · {exp.size} · {exp.date}</p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{exp.module}</span>
              <button onClick={() => toast.success(`Downloading ${exp.name}`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
                <Download className="h-3 w-3" />Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
