import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Newspaper, Download, Image as ImageIcon, MessageSquare, ExternalLink } from 'lucide-react';
import factoryBg from '@/assets/factory-bg.jpg';

const RELEASES = [
  { date: 'Oct 15, 2026', title: 'TrillionIndustries Announces $300M Series C to Accelerate Autonomous Factory Vision', category: 'Funding' },
  { date: 'Sep 02, 2026', title: 'New Digital Twin Technology Deployed Across 50 Global Automotive Plants', category: 'Product' },
  { date: 'Jul 18, 2026', title: 'TrillionIndustries Named "Leader" in Gartner Magic Quadrant for MES', category: 'Award' },
];

const NEWS = [
  { publisher: 'TechCrunch', title: 'The startup bringing AI to legacy manufacturing just raised $300M', link: '#' },
  { publisher: 'Wall Street Journal', title: 'How Detroit\'s TrillionIndustries is reshaping the global supply chain', link: '#' },
  { publisher: 'Forbes', title: 'Top 50 AI Innovators of 2026: TrillionIndustries takes the lead', link: '#' },
];

export default function Press() {
  useScrollTop();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        
        {/* Section 1: Hero */}
        <section className="relative py-24 overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-muted/30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              Press & <span className="text-gradient-blue">Media</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              Get the latest news, announcements, and media resources from TrillionIndustries.
            </p>
            <div className="flex justify-center pt-4 gap-4">
              <a href="#press-releases" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand">
                Read Announcements
              </a>
              <a href="#media-kit" className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Download Media Kit
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Press Releases */}
        <section id="press-releases" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-extrabold text-foreground">Latest Press Releases</h2>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {RELEASES.map((release, i) => (
                <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{release.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold uppercase">{release.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{release.title}</h3>
                  </div>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Media Kit */}
        <section id="media-kit" className="py-20 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-foreground">Media Kit & Assets</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Download official TrillionIndustries logos, brand guidelines, and product screenshots.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Brand Logos</h3>
                <p className="text-sm text-muted-foreground mb-2">SVG and PNG formats in dark and light variations.</p>
                <button className="text-sm font-bold text-primary flex items-center gap-2 mt-auto">
                  <Download className="h-4 w-4" /> Download .ZIP
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Newspaper className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Brand Guidelines</h3>
                <p className="text-sm text-muted-foreground mb-2">Rules for using our brand identity and typography.</p>
                <button className="text-sm font-bold text-primary flex items-center gap-2 mt-auto">
                  <Download className="h-4 w-4" /> Download .PDF
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Product Assets</h3>
                <p className="text-sm text-muted-foreground mb-2">High-resolution screenshots and dashboard mockups.</p>
                <button className="text-sm font-bold text-primary flex items-center gap-2 mt-auto">
                  <Download className="h-4 w-4" /> Download .ZIP
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: In the News */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-foreground mb-12 text-center">In The News</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {NEWS.map((item, i) => (
                <a key={i} href={item.link} className="block p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors group">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">{item.publisher}</p>
                  <h3 className="text-lg font-bold text-foreground mb-6 leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="flex items-center text-primary text-sm font-bold gap-2 mt-auto">
                    Read Article <ExternalLink className="h-4 w-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="gradient-hero py-24">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Transform your operations</h2>
            <p className="text-gray-300 text-lg">Join the world's most innovative manufacturers running on TrillionIndustries.</p>
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
