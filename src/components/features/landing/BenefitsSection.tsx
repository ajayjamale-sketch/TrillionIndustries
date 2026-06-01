import { TrendingUp, Clock, DollarSign, Shield, Zap, Globe, BarChart, Users } from 'lucide-react';

const BENEFITS = [
  { icon: TrendingUp, title: 'Increase Production Efficiency', stat: '+34%', statLabel: 'avg. production gain', desc: 'Optimized scheduling and real-time shop floor monitoring eliminate bottlenecks and maximize throughput.', color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/8' },
  { icon: Clock, title: 'Reduce Downtime', stat: '60%', statLabel: 'downtime reduction', desc: 'Predictive maintenance algorithms detect equipment failures before they occur, keeping production lines running.', color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/8' },
  { icon: DollarSign, title: 'Cut Procurement Costs', stat: '22%', statLabel: 'cost savings', desc: 'Automated vendor comparison, dynamic pricing intelligence, and smart contract management drive significant savings.', color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/8' },
  { icon: Shield, title: 'Ensure Full Compliance', stat: '100%', statLabel: 'audit readiness', desc: 'Automated compliance tracking, real-time audit trails, and regulatory reporting keep your enterprise always audit-ready.', color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/8' },
  { icon: Zap, title: 'Accelerate Decisions', stat: '10×', statLabel: 'faster insights', desc: 'Data-powered dashboards surface critical KPIs and recommendations in real-time — not end-of-month reports.', color: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/8' },
  { icon: Globe, title: 'Scale Globally', stat: '180+', statLabel: 'countries supported', desc: 'Multi-plant, multi-currency, multi-language support with local compliance modules for every major market.', color: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/8' },
  { icon: BarChart, title: 'Demand Forecasting', stat: '94%', statLabel: 'forecast accuracy', desc: 'Machine learning demand forecasting integrates historical data, market signals, and supply chain events.', color: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/8' },
  { icon: Users, title: 'Optimize Workforce', stat: '28%', statLabel: 'productivity uplift', desc: 'Skills-based shift planning, real-time productivity tracking, and compliance management maximize workforce ROI.', color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/8' },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-emerald-500 rounded-sm" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Measurable ROI</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  Results from<br />day one of deployment
                </h2>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed pl-4 border-l-2 border-border">
            Every module delivers measurable operational improvements. Our customers average an 18-month payback period with documented ROI across every function.
          </p>
        </div>

        {/* Benefits Grid — 4 col, clean card style with left border accent */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={`group relative bg-card border ${benefit.border} rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden`}
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${benefit.bg.replace('/8', '')} rounded-l-xl opacity-80`} />

                {/* Stat */}
                <div className={`text-3xl font-black mb-0.5 ${benefit.color}`}>
                  {benefit.stat}
                </div>
                <p className="text-[11px] font-medium text-muted-foreground mb-4 uppercase tracking-wide">{benefit.statLabel}</p>

                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg ${benefit.bg} border ${benefit.border} flex items-center justify-center mb-3`}>
                  <Icon className={`h-4 w-4 ${benefit.color}`} />
                </div>

                <h3 className="font-bold text-sm text-foreground mb-2 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
