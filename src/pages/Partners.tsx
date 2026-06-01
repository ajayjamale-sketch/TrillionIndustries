import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Handshake, Code2, Rocket, Network, CheckCircle2 } from 'lucide-react';
import factoryBg from '@/assets/factory-bg.jpg';

export default function Partners() {
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
              The TrillionIndustries <span className="text-gradient-blue">Partner Ecosystem</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              Join forces with us to deliver world-class AI and industrial automation solutions to manufacturers around the globe.
            </p>
            <div className="flex flex-wrap justify-center pt-4 gap-4">
              <a href="#partner-programs" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand">
                Explore Programs <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Apply to be a Partner
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Partner Programs */}
        <section id="partner-programs" className="py-20 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-foreground">Choose Your Path</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">We offer flexible partnership models designed for system integrators, technology vendors, and consultants.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <Code2 className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Technology Partners</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">Build integrations, connect your hardware, or develop software extensions on top of the TrillionIndustries API.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dedicated API support</li>
                  <li className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Co-marketing opportunities</li>
                  <li className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Listing in the App Directory</li>
                </ul>
                <Link to="/contact" className="text-primary font-bold text-sm hover:underline">Apply as a Tech Partner &rarr;</Link>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                  <Handshake className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Solution Partners</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">Implement TrillionIndustries for your clients, manage change, and build custom automated workflows.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Lucrative revenue sharing</li>
                  <li className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Comprehensive sales training</li>
                  <li className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Priority technical support</li>
                </ul>
                <Link to="/contact" className="text-primary font-bold text-sm hover:underline">Apply as a Solution Partner &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Featured Partners */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-foreground mb-12">Trusted by Industry Leaders</h2>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {['SAP', 'Oracle', 'Siemens', 'Rockwell Automation', 'AWS', 'Microsoft Azure'].map(partner => (
                <span key={partner} className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{partner}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Benefits */}
        <section className="py-20 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-foreground">Why Partner With Us?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-bold text-lg text-foreground mb-2">Accelerate Growth</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Expand your total addressable market by offering the most modern industrial AI platform.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-emerald-500" />
                </div>
                <h4 className="font-bold text-lg text-foreground mb-2">Deep Integrations</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Our robust API and webhooks make it trivial to integrate existing hardware and software.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-orange-500" />
                </div>
                <h4 className="font-bold text-lg text-foreground mb-2">Dedicated Support</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Get direct access to our partner engineering team and joint marketing resources.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="gradient-hero py-24">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Join the ecosystem</h2>
            <p className="text-gray-300 text-lg">See the platform your clients will love. Sign up for a free trial to explore TrillionIndustries.</p>
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
