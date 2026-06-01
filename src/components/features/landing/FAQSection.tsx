import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQ_ITEMS } from '@/constants';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Implementation', 'Integration', 'Technical', 'Security', 'Pricing', 'Features'];

export function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-primary rounded-sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                Frequently asked questions
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-sm ml-4 pl-4 border-l-2 border-border">
            Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-primary font-semibold hover:underline">Contact our team</Link>.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          {filtered.map(item => (
            <div
              key={item.id}
              className={cn(
                'border rounded-xl overflow-hidden transition-all duration-200',
                open === item.id ? 'border-primary/40 bg-primary/5' : 'border-border bg-card hover:border-primary/20'
              )}
            >
              <button
                onClick={() => setOpen(open === item.id ? null : item.id)}
                className="flex items-center justify-between w-full px-5 py-4 text-left min-h-[54px]"
              >
                <span className="font-semibold text-sm text-foreground pr-4 leading-snug">{item.question}</span>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
                  open === item.id && 'rotate-180 text-primary'
                )} />
              </button>
              {open === item.id && (
                <div className="px-5 pb-5 animate-fade-in border-t border-border/60 pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded bg-muted border border-border text-xs text-muted-foreground font-medium">
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-foreground font-medium">Still have questions? Our enterprise team is ready to help.</p>
          </div>
          <Link to="/contact" className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
