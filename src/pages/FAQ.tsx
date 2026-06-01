import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { FAQ_ITEMS } from '@/constants';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Implementation', 'Integration', 'Technical', 'Security', 'Support', 'Pricing', 'Features'];

export default function FAQ() {
  useScrollTop();
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = FAQ_ITEMS.filter(item => {
    const matchSearch = !search || item.question.toLowerCase().includes(search.toLowerCase()) || item.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border py-16">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              Help Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Frequently Asked <span className="text-gradient-blue">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Find answers to the most common questions about the TrillionIndustries platform.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}>{cat}</button>
            ))}
          </div>

          {/* FAQ List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground font-semibold">No results found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(item => (
                <div key={item.id} className={cn(
                  'border rounded-xl overflow-hidden transition-all',
                  open === item.id ? 'border-primary/40 bg-primary/5' : 'border-border bg-card hover:border-primary/20'
                )}>
                  <button onClick={() => setOpen(open === item.id ? null : item.id)}
                    className="flex items-center justify-between w-full px-6 py-4 text-left">
                    <span className="font-semibold text-sm text-foreground pr-4">{item.question}</span>
                    <ChevronDown className={cn('h-4.5 w-4.5 text-muted-foreground shrink-0 transition-transform', open === item.id && 'rotate-180 text-primary')} />
                  </button>
                  {open === item.id && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <h3 className="font-bold text-foreground mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">Our support team is available 24/7 for enterprise clients.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
