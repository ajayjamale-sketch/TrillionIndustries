import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PRICING_PLANS } from '@/constants';

export function PricingSection() {
  const { isAuthenticated } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-primary rounded-sm" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Pricing</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  Scale as your operations grow
                </h2>
              </div>
            </div>
            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted border border-border self-start sm:self-auto">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  !isAnnual ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  isAnnual ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-3 ml-4 pl-4 border-l-2 border-border">
            No hidden fees. No long-term lock-in. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid lg:grid-cols-3 gap-5">
          {PRICING_PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-card rounded-xl flex flex-col transition-all duration-200 overflow-hidden ${
                plan.highlighted
                  ? 'border-2 border-primary shadow-brand-lg'
                  : 'border border-border hover:border-primary/40 hover:shadow-md'
              }`}
            >
              {/* Top accent bar for highlighted */}
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              )}

              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                  plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}>
                  <Star className="h-3 w-3 fill-current" />
                  {plan.badge}
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Plan Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-black text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-foreground">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Billed ${plan.annualPrice * 12}/year
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        · Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/yr
                      </span>
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  to={isAuthenticated ? "/payment" : "/register"}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold text-sm transition-all mb-6 ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-brand'
                      : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary'
                  }`}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Divider */}
                <div className="border-t border-border mb-5" />

                {/* Features */}
                <div className="space-y-2.5 flex-1">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${plan.highlighted ? 'bg-primary/10 border border-primary/20' : 'bg-muted border border-border'}`}>
                        <Check className={`h-2.5 w-2.5 ${plan.highlighted ? 'text-primary' : 'text-emerald-500'}`} />
                      </div>
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise footer */}
        <div className="mt-8 p-5 rounded-xl border border-dashed border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-accent" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Need a custom plan?</p>
              <p className="text-xs text-muted-foreground">Enterprise and government procurement available with custom SLAs and dedicated support.</p>
            </div>
          </div>
          <Link to="/contact" className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:border-primary bg-card text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap">
            Talk to Sales <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
