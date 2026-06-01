import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useAuth } from '@/hooks/useAuth';
import { FEATURES_LIST } from '@/constants';
import {
  Factory, Network, ShoppingCart, Package, Wrench, Users,
  Cpu, ShieldCheck, BarChart3, Store, DollarSign, Lock,
  ArrowRight, CheckCircle2
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Factory, Network, ShoppingCart, Package, Wrench, Users,
  Cpu, ShieldCheck, BarChart3, Store, DollarSign, Lock,
};

const CATEGORY_GROUPS = ['Core', 'Operations', 'Intelligence', 'Commerce', 'Security'];

// Default commerce features to use if FEATURES_LIST has none for 'Commerce'
const DEFAULT_COMMERCE_FEATURES = [
  {
    id: 'commerce-b2b',
    title: 'B2B Marketplace',
    description: 'Connect with verified industrial buyers and suppliers. List products, manage RFQs, and automate procurement workflows.',
    icon: 'Store',
    category: 'Commerce',
    highlights: ['Product catalog management', 'Automated RFQ responses', 'Supplier scoring & reviews']
  },
  {
    id: 'commerce-procurement',
    title: 'Smart Procurement',
    description: 'AI-driven sourcing and purchase order automation. Reduce costs with smart vendor recommendations.',
    icon: 'ShoppingCart',
    category: 'Commerce',
    highlights: ['Purchase order automation', 'Vendor performance analytics', 'Contract lifecycle management']
  },
  {
    id: 'commerce-invoicing',
    title: 'Digital Invoicing & Payments',
    description: 'End-to-end invoicing, payment reconciliation, and financial controls integrated with your ERP.',
    icon: 'DollarSign',
    category: 'Commerce',
    highlights: ['Automated invoice generation', 'Multi-currency support', 'Secure payment gateway']
  }
];

export default function Features() {
  useScrollTop();
  const { isAuthenticated } = useAuth();

  // Helper to get features for a category, falling back to defaults for Commerce
  const getFeaturesForCategory = (category: string) => {
    const features = FEATURES_LIST.filter(f => f.category === category);
    if (category === 'Commerce' && features.length === 0) {
      return DEFAULT_COMMERCE_FEATURES;
    }
    return features;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="bg-muted/30 border-b border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              12 Integrated Modules
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              The complete industrial
              <br />
              <span className="text-gradient-blue">operating platform</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Every module you need to digitize, automate, and optimize your entire industrial enterprise — on one unified, AI-powered platform.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to={isAuthenticated ? "/payment" : "/register"} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Groups */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {CATEGORY_GROUPS.map(category => {
            const features = getFeaturesForCategory(category);
            // Skip rendering if no features (shouldn't happen for Commerce now)
            if (features.length === 0) return null;
            return (
              <div key={category} id={features[0]?.id}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-border" />
                  <span className="px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground uppercase tracking-wider">{category}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map(feature => {
                    const Icon = ICON_MAP[feature.icon] || Factory;
                    // Use feature.highlights if present, otherwise fallback to standard list
                    const highlights = feature.highlights || [
                      'Real-time monitoring and alerts',
                      'AI-powered automation',
                      'ERP & system integration',
                      'Role-based access control',
                    ];
                    return (
                      <div key={feature.id} id={feature.id} className="group bg-card border border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-brand transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:border-primary transition-colors">
                          <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <h3 className="font-bold text-foreground mb-3 text-lg">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5">{feature.description}</p>
                        <ul className="space-y-2">
                          {highlights.slice(0, 4).map(sub => (
                            <li key={sub} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="border-t border-border bg-muted/30 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-2xl font-extrabold text-foreground">Ready to see it in action?</h2>
            <p className="text-muted-foreground">Get a personalized demo from our industrial experts.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to={isAuthenticated ? "/payment" : "/register"} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}