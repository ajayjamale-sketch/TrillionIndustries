import { Award, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';

const SKILLS = [
  { name: 'Tom Bradley', dept: 'Production', skills: [{ name: 'CNC Operation', level: 'Expert', cert: true }, { name: 'Quality Control', level: 'Intermediate', cert: false }, { name: 'Lean Manufacturing', level: 'Beginner', cert: false }] },
  { name: 'Alice Kim', dept: 'Quality', skills: [{ name: 'Quality Inspection', level: 'Expert', cert: true }, { name: 'QMS/ISO 9001', level: 'Expert', cert: true }, { name: 'CAPA Management', level: 'Intermediate', cert: true }] },
  { name: 'James Williams', dept: 'Maintenance', skills: [{ name: 'PLC Programming', level: 'Expert', cert: true }, { name: 'Hydraulic Systems', level: 'Expert', cert: false }, { name: 'Predictive Maintenance', level: 'Intermediate', cert: true }] },
];

const LEVEL_COLORS: Record<string, string> = { Expert: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', Intermediate: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', Beginner: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };

export function SkillsPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Award className="h-5 w-5" />Skill Matrix & Certifications</h1><p className="text-sm text-muted-foreground">Track workforce competencies and qualifications</p></div>
        <button onClick={() => toast.success('Adding skill entry')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"><Plus className="h-4 w-4" />Add Skill</button>
      </div>
      <div className="space-y-4">
        {SKILLS.map(emp => (
          <div key={emp.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{getInitials(emp.name)}</div>
              <div><p className="text-sm font-bold text-foreground">{emp.name}</p><p className="text-xs text-muted-foreground">{emp.dept}</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {emp.skills.map(skill => (
                <div key={skill.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${skill.cert ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'}`}>
                  {skill.cert && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                  <span className="text-foreground">{skill.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${LEVEL_COLORS[skill.level]}`}>{skill.level}</span>
                </div>
              ))}
              <button onClick={() => toast.info(`Adding skill for ${emp.name}`)} className="px-3 py-2 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">+ Add Skill</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
