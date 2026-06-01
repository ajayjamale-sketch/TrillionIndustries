import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { PricingSection } from '@/components/features/landing/PricingSection';
import { FAQSection } from '@/components/features/landing/FAQSection';
import { Check, ArrowRight, Phone, Building2, Users, Globe } from 'lucide-react';

export default function Pricing() {
  useScrollTop();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              Transparent Pricing
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Plans for every <span className="text-gradient-blue">industrial operation</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              No hidden fees. No long-term commitments. Full feature access from day one.
            </p>
          </div>
        </div>

        <PricingSection />

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-extrabold text-foreground text-center mb-10">What's included</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-8 text-sm font-medium text-muted-foreground w-1/3">Feature</th>
                  {['Starter', 'Professional', 'Enterprise'].map(plan => (
                    <th key={plan} className={`py-3 px-4 text-sm font-bold text-center ${plan === 'Professional' ? 'text-primary' : 'text-foreground'}`}>{plan}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Users', '50', '500', 'Unlimited'],
                  ['Plants', '1', '10', 'Unlimited'],
                  ['MES & Production', '✓', '✓', '✓'],
                  ['Supply Chain', '✓', '✓', '✓'],
                  ['Procurement', '✓', '✓', '✓'],
                  ['Inventory & WMS', '✓', '✓', '✓'],
                  ['Asset Management', '—', '✓', '✓'],
                  ['Workforce Management', '—', '✓', '✓'],
                  ['IIoT Sensors', '—', '500', 'Unlimited'],
                  ['AI Analytics', '—', '✓', '✓'],
                  ['B2B Marketplace', '—', '✓', '✓'],
                  ['Finance & Compliance', '—', '—', '✓'],
                  ['ERP Integration', '—', '—', '✓'],
                  ['Custom Reports', '—', '✓', '✓'],
                  ['API Access', '—', '✓', '✓'],
                  ['White Label', '—', '—', '✓'],
                  ['Support', 'Email', 'Priority + CSM', '24/7 Dedicated'],
                  ['SLA', '99.5%', '99.9%', 'Custom'],
                ].map(([feature, ...plans]) => (
                  <tr key={feature} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="py-3 pr-8 text-sm text-foreground">{feature}</td>
                    {plans.map((val, i) => (
                      <td key={i} className={`py-3 px-4 text-center text-sm ${i === 1 ? 'bg-primary/5' : ''}`}>
                        {val === '✓' ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : val === '—' ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="font-medium text-foreground">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: Building2, title: 'Volume Discounts', desc: 'Special pricing for organizations with 10+ plants or 1,000+ users. Contact our enterprise sales team.' },
              { icon: Globe, title: 'Government & NGOs', desc: 'Special programs for government industrial authorities and non-profit manufacturing organizations.' },
              { icon: Users, title: 'Reseller Program', desc: 'Partner with us to resell and implement TrillionIndustries. Revenue share and co-marketing available.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    <Link to="/contact" className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <FAQSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
