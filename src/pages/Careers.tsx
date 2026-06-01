import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Heart, Zap, Globe, Coffee, BookOpen, GraduationCap, Users, Plus } from 'lucide-react';
import factoryBg from '@/assets/factory-bg.jpg';

const VALUES = [
  { icon: Zap, title: 'Impact First', desc: 'We build tools that run the physical world. Your code will power factories globally.' },
  { icon: Users, title: 'Extreme Ownership', desc: 'No red tape. If you see a problem, you have the authority to fix it.' },
  { icon: Globe, title: 'Remote First', desc: 'Work from anywhere in the world. We care about output, not where you sit.' },
];

const PERKS = [
  { icon: Heart, title: 'Premium Healthcare', desc: '100% covered premiums for you and your dependents.' },
  { icon: Coffee, title: 'Wellness Stipend', desc: '$200/month for gym, massage, or mental health apps.' },
  { icon: BookOpen, title: 'Learning Budget', desc: '$2,000/year for courses, conferences, and books.' },
  { icon: GraduationCap, title: 'Student Loan Help', desc: 'We contribute towards your student loan payments.' },
];

const ROLES = [
  { team: 'Engineering', title: 'Senior Full Stack Engineer', location: 'Remote (US/Canada)', type: 'Full-time' },
  { team: 'Engineering', title: 'Machine Learning Engineer (IIoT)', location: 'Remote (Europe)', type: 'Full-time' },
  { team: 'Product', title: 'Group Product Manager', location: 'Remote (Global)', type: 'Full-time' },
  { team: 'Sales', title: 'Enterprise Account Executive', location: 'Detroit, MI / Remote', type: 'Full-time' },
];

export default function Careers() {
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight max-w-3xl mx-auto">
              Help us build the <span className="text-gradient-blue">industrial future</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              Join a team of engineers, designers, and industry veterans transforming how the world makes things.
            </p>
            <div className="flex justify-center pt-4">
              <a href="#open-roles" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand">
                View Open Roles <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Culture & Values */}
        <section className="py-20 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-foreground">Our Culture</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">We are an engineering-driven company that values deep work, radical candor, and shipping fast.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {VALUES.map(val => {
                const Icon = val.icon;
                return (
                  <div key={val.title} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{val.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Perks & Benefits */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Benefits & Perks</h2>
              <p className="text-muted-foreground max-w-2xl">We take care of our team so they can focus on doing their best work.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PERKS.map(perk => {
                const Icon = perk.icon;
                return (
                  <div key={perk.title} className="bg-muted/30 border border-border rounded-2xl p-6">
                    <Icon className="h-6 w-6 text-emerald-500 mb-4" />
                    <h4 className="font-bold text-foreground mb-2">{perk.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{perk.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Open Roles */}
        <section id="open-roles" className="py-20 bg-muted/20 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-foreground">Open Positions</h2>
              <p className="text-muted-foreground mt-4">Don't see a fit? Reach out anyway. We're always looking for exceptional talent.</p>
            </div>
            <div className="space-y-4">
              {ROLES.map((role, i) => (
                <div key={i} className="group bg-card border border-border hover:border-primary/50 hover:shadow-md rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">{role.team}</span>
                    <h3 className="text-lg font-bold text-foreground mb-1">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.location} • {role.type}</p>
                  </div>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="gradient-hero py-24">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Experience our platform</h2>
            <p className="text-gray-300 text-lg">Curious what you'll be building? Start a free trial and explore the TrillionIndustries operating system today.</p>
            <div className="flex justify-center pt-4">
              <Link to={isAuthenticated ? "/payment" : "/register"} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-xl hover:-translate-y-0.5">
                Start Free Trial <ArrowRight className="h-5 w-5" />
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
