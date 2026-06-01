import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import factoryBg from '@/assets/factory-bg.jpg';

export interface FeaturePageProps {
  title: string;
  subtitle: string;
  heroDescription: string;
  capabilities: {
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
  benefits: {
    metric: string;
    label: string;
    icon: React.ElementType;
  }[];
  workflows: {
    title: string;
    description: string;
  }[];
  ctaText?: string;
}

export function FeaturePageTemplate({
  title,
  subtitle,
  heroDescription,
  capabilities,
  benefits,
  workflows,
  ctaText = "Start Free Trial"
}: FeaturePageProps) {
  useScrollTop();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        
        {/* Section 1: Hero */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img src={factoryBg} alt="" className="w-full h-full object-cover opacity-20 dark:opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              Module Overview
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight max-w-4xl mx-auto">
              {title} <br className="hidden sm:block" />
              <span className="text-gradient-blue">{subtitle}</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              {heroDescription}
            </p>
            <div className="flex justify-center pt-4">
              <Link to={isAuthenticated ? "/payment" : "/register"} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all shadow-brand hover:-translate-y-0.5">
                {ctaText} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Core Capabilities */}
        <section className="py-24 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-foreground">Core Capabilities</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Everything you need to run this part of your business at scale.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-colors group flex gap-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Icon className="h-7 w-7 text-blue-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{cap.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{cap.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Benefits & Metrics */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {benefits.map((ben, i) => {
                const Icon = ben.icon;
                return (
                  <div key={i} className="text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="text-5xl font-black text-foreground mb-2">{ben.metric}</div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{ben.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Workflow/Case Study */}
        <section className="py-24 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-foreground mb-6">How it works</h2>
                <p className="text-lg text-muted-foreground mb-8">TrillionIndustries connects seamlessly with your existing infrastructure to automate these processes end-to-end.</p>
                <div className="space-y-6">
                  {workflows.map((wf, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg mb-1">{wf.title}</h4>
                        <p className="text-muted-foreground">{wf.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card p-2 aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
                <div className="relative z-10 w-3/4 h-3/4 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center animate-pulse">
                  <div className="w-1/2 h-1/2 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center">
                    <div className="w-1/4 h-1/4 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="gradient-hero py-24">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to modernize?</h2>
            <p className="text-gray-300 text-lg">Join the world's most innovative manufacturers running on TrillionIndustries.</p>
            <div className="flex justify-center pt-4">
              <Link to={isAuthenticated ? "/payment" : "/register"} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-xl hover:-translate-y-0.5">
                {ctaText} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
