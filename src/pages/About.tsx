import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Factory, Target, Users, Globe, Award, TrendingUp, ArrowRight, Linkedin, Twitter } from 'lucide-react';
import factoryBg from '@/assets/factory-bg.jpg';

const TEAM = [
  { name: 'Arjun Mehta', role: 'CEO & Co-Founder', bio: 'Ex-Siemens VP of Digital Industries. 20+ years building industrial software.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
  { name: 'Sarah Chen', role: 'CTO & Co-Founder', bio: 'Former Google Cloud architect. Led IIoT platform at ABB for 8 years.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
  { name: 'Marcus Weber', role: 'CPO', bio: 'Veteran SAP product lead. Expert in industrial ERP and workflow automation.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  { name: 'Priya Nair', role: 'VP of Engineering', bio: 'AWS Principal Engineer. Architected real-time data systems for Rockwell.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80' },
  { name: 'James Okonkwo', role: 'VP of Sales', bio: 'Built sales orgs at Oracle and Infor. Specialist in enterprise industrial SaaS.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
  { name: 'Elena Volkov', role: 'VP of Customer Success', bio: '15+ years implementing MES and WMS solutions at Fortune 500 manufacturers.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
];

const MILESTONES = [
  { year: '2019', event: 'TrillionIndustries founded in Detroit, MI with $8M seed round' },
  { year: '2020', event: 'Launched MES and Supply Chain modules. First 50 enterprise clients' },
  { year: '2021', event: 'Series A ($45M). Expanded to IIoT and AI Analytics. 500 clients' },
  { year: '2022', event: 'Global expansion to 60 countries. B2B Marketplace launched' },
  { year: '2023', event: 'Series B ($120M). 1,200 enterprise clients. ISO 27001 certified' },
  { year: '2024', event: 'Launched AI Factory Copilot. Crossed $100M ARR milestone' },
  { year: '2025', event: '2,400+ enterprise clients. $250M ARR. Expanding to 180+ countries' },
  { year: '2026', event: 'Series C ($300M). Digital Twin technology and autonomous factory monitoring' },
];

export default function About() {
  useScrollTop();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img src={factoryBg} alt="" className="w-full h-full object-cover opacity-20 dark:opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              Our Story
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight max-w-3xl mx-auto">
              Building the operating system for
              <span className="text-gradient-blue"> industrial enterprise</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              We founded TrillionIndustries with one mission: give every manufacturer — from mid-size plants to global enterprises — access to the same digital infrastructure that powers the world's most efficient factories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand">
                Join Us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-y border-border bg-muted/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, value: '2,400+', label: 'Enterprise Clients', color: 'text-blue-500' },
                { icon: Globe, value: '180+', label: 'Countries', color: 'text-emerald-500' },
                { icon: TrendingUp, value: '$250M+', label: 'Annual Revenue', color: 'text-orange-500' },
                { icon: Award, value: '47+', label: 'Industry Awards', color: 'text-purple-500' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                    <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-10">
            {[
              { icon: Target, title: 'Our Mission', color: 'bg-blue-500/10 text-blue-500', text: 'To democratize access to world-class industrial software infrastructure, enabling every manufacturer to compete in the global digital economy — regardless of size or technical maturity. We believe that operational excellence should not be the exclusive privilege of enterprises with billion-dollar IT budgets.' },
              { icon: Factory, title: 'Our Vision', color: 'bg-orange-500/10 text-orange-500', text: "To power the world's industrial backbone — a connected, intelligent, sustainable network of factories, supply chains, and enterprises that produces goods efficiently, safely, and responsibly. We envision a future where every factory is smart, every supply chain is transparent, and every industrial worker is empowered by technology." },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-8 space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground">{item.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-muted/30 border-y border-border py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-foreground text-center mb-12">Our Journey</h2>
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{m.year.slice(2)}</span>
                    </div>
                    {i < MILESTONES.length - 1 && <div className="flex-1 w-0.5 bg-border mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-xs font-semibold text-primary mb-1">{m.year}</p>
                    <p className="text-sm text-foreground">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-foreground mb-3">Leadership Team</h2>
            <p className="text-muted-foreground">Built by veterans of the world's leading industrial technology companies.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4 mb-3">
                  <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-border" />
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{member.name}</h3>
                    <p className="text-xs text-primary font-medium">{member.role}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-3.5 w-3.5" /></button>
                      <button className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="gradient-hero py-16">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Join our mission</h2>
            <p className="text-gray-400">We're hiring exceptional engineers, product managers, and sales professionals to help build the industrial OS of the future.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">View Open Roles <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
