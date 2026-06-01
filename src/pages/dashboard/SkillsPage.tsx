import { Award, Plus, CheckCircle2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface EmployeeSkill {
  name: string;
  dept: string;
  skills: { name: string; level: string; cert: boolean }[];
}

const INITIAL_SKILLS: EmployeeSkill[] = [
  { name: 'Tom Bradley', dept: 'Production', skills: [{ name: 'CNC Operation', level: 'Expert', cert: true }, { name: 'Quality Control', level: 'Intermediate', cert: false }, { name: 'Lean Manufacturing', level: 'Beginner', cert: false }] },
  { name: 'Alice Kim', dept: 'Quality', skills: [{ name: 'Quality Inspection', level: 'Expert', cert: true }, { name: 'QMS/ISO 9001', level: 'Expert', cert: true }, { name: 'CAPA Management', level: 'Intermediate', cert: true }] },
  { name: 'James Williams', dept: 'Maintenance', skills: [{ name: 'PLC Programming', level: 'Expert', cert: true }, { name: 'Hydraulic Systems', level: 'Expert', cert: false }, { name: 'Predictive Maintenance', level: 'Intermediate', cert: true }] },
];

const LEVEL_COLORS: Record<string, string> = { 
  Expert: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 
  Intermediate: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
  Beginner: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
};

export function SkillsPage({ user }: { user: User }) {
  const [skillMatrix, setSkillMatrix] = useState<EmployeeSkill[]>(INITIAL_SKILLS);
  const [search, setSearch] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  
  // Form state
  const [targetEmployee, setTargetEmployee] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [hasCert, setHasCert] = useState(false);

  const handleAddSkillToEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmployee.trim() || !newSkillName.trim()) {
      toast.error('Please enter all required fields');
      return;
    }

    setSkillMatrix(prev => {
      let found = false;
      const updated = prev.map(emp => {
        if (emp.name.toLowerCase() === targetEmployee.toLowerCase()) {
          found = true;
          return {
            ...emp,
            skills: [...emp.skills, { name: newSkillName, level: newSkillLevel, cert: hasCert }]
          };
        }
        return emp;
      });

      if (!found) {
        // If employee not in list, add them as a new row
        return [...prev, {
          name: targetEmployee,
          dept: 'Production',
          skills: [{ name: newSkillName, level: newSkillLevel, cert: hasCert }]
        }];
      }
      return updated;
    });

    toast.success(`Skill "${newSkillName}" registered for ${targetEmployee}`);
    setShowAddSkill(false);
    setNewSkillName('');
    setHasCert(false);
  };

  const filtered = skillMatrix.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />Skill Matrix
          </h1>
          <p className="text-sm text-muted-foreground">Track employee core competencies, experience levels, and tags</p>
        </div>
        <button 
          onClick={() => setShowAddSkill(true)} 
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />Register Competency
        </button>
      </div>

      {/* Search / Filter */}
      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by employee name or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(emp => (
          <div key={emp.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {getInitials(emp.name)}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{emp.name}</p>
                <p className="text-xs text-muted-foreground">{emp.dept}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {emp.skills.map(skill => (
                <div 
                  key={skill.name} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${
                    skill.cert ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'
                  }`}
                >
                  {skill.cert && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                  <span className="text-foreground">{skill.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${LEVEL_COLORS[skill.level]}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
              <button 
                onClick={() => {
                  setTargetEmployee(emp.name);
                  setShowAddSkill(true);
                }} 
                className="px-3 py-2 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
              >
                + Add Skill
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Add Competency Log</h3>
              <button onClick={() => setShowAddSkill(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSkillToEmp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Employee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tom Bradley"
                  value={targetEmployee}
                  onChange={e => setTargetEmployee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Skill Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC Calibration"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">Skill Level</label>
                  <select
                    value={newSkillLevel}
                    onChange={e => setNewSkillLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end pb-1.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={hasCert} 
                      onChange={e => setHasCert(e.target.checked)} 
                      className="rounded border-border text-primary focus:ring-0" 
                    />
                    Is Certified
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Register Skill
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
