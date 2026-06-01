import { useState } from 'react';
import { Check, ChevronRight, UserPlus, Building2, Cog, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const STEPS = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Register Your Enterprise',
    description: 'Create your organization, configure plants, add departments, and set up your team with role-based access controls.',
    details: ['Multi-plant and multi-company setup', 'Department hierarchy configuration', 'User invitation and RBAC policies', 'SSO with your identity provider'],
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    accent: '#1E40AF',
  },
  {
    id: 2,
    icon: Building2,
    title: 'Connect Operations',
    description: 'Integrate your IIoT sensors, ERP systems, and configure your supply chain, procurement, and inventory workflows.',
    details: ['IIoT sensor and machine connectivity', 'ERP / legacy system integration', 'Supplier and vendor onboarding', 'Warehouse and inventory mapping'],
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    accent: '#F97316',
  },
  {
    id: 3,
    icon: Cog,
    title: 'Automate & Execute',
    description: 'Set up automated workflows for production scheduling, procurement approvals, maintenance alerts, and quality checks.',
    details: ['Automated production scheduling', 'Smart procurement approval flows', 'Predictive maintenance triggers', 'Quality checkpoint automation'],
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    accent: '#10B981',
  },
  {
    id: 4,
    icon: BarChart3,
    title: 'Analyze & Scale',
    description: 'Access data-driven insights, monitor KPIs in real-time, and use predictive analytics to continuously improve performance.',
    details: ['Real-time KPI dashboards', 'Demand forecasting engine', 'Cost and efficiency analysis', 'Automated executive reporting'],
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    accent: '#8B5CF6',
  },
];

export function WorkflowSection() {
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-accent rounded-sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Implementation</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                Deployed in under 30 days
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl ml-4 pl-4 border-l-2 border-border">
            Our implementation team guides you through every step — from initial setup to full-scale production deployment with dedicated project management.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Steps List — 2 cols on desktop */}
          <div className="lg:col-span-2 space-y-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeStep === i;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? `${s.bg} ${s.border}`
                      : 'bg-card border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Step number */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-black border ${
                      isActive ? `${s.bg} ${s.border} ${s.color}` : 'bg-muted border-border text-muted-foreground'
                    }`}>
                      {String(s.id).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold leading-snug ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.title}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform shrink-0 ${isActive ? `${s.color} rotate-90` : 'text-muted-foreground'}`} />
                  </div>
                  {isActive && (
                    <div className="mt-3 pl-12">
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-border" style={{ borderTopWidth: 3, borderTopColor: step.accent }}>
                <div className={`w-11 h-11 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center shrink-0`}>
                  {(() => { const Icon = step.icon; return <Icon className={`h-5 w-5 ${step.color}`} />; })()}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Phase {step.id} of 4</p>
                  <h4 className="font-black text-foreground text-base">{step.title}</h4>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-black text-foreground">{(activeStep + 1) * 25}%</p>
                  <p className="text-[10px] text-muted-foreground">Complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 pt-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(activeStep + 1) * 25}%`, background: step.accent }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="p-6 grid sm:grid-cols-2 gap-2.5">
                {step.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${step.accent}20`, border: `1px solid ${step.accent}30` }}>
                      <Check className="h-3 w-3" style={{ color: step.accent }} />
                    </div>
                    <span className="text-sm text-foreground leading-snug">{d}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                {activeStep < STEPS.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(i => i + 1)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Next: {STEPS[activeStep + 1].title} <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to={isAuthenticated ? "/payment" : "/register"}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Start Your Implementation <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
