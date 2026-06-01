import { Star, Building2 } from 'lucide-react';
import { TESTIMONIALS } from '@/constants';

const COMPANIES = ['Bharat Steel', 'Apex Auto', 'Pacific Mfg', 'West Africa Industrial', 'Nordic Metals', 'Gulf Industries', 'Sunrise Chemicals', 'Atlas Engineering'];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-accent rounded-sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Client Outcomes</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                What enterprise clients say
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl ml-4 pl-4 border-l-2 border-border">
            2,400+ enterprises worldwide have transformed their industrial operations with TrillionIndustries.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-14">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed text-sm mb-5 flex-1">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-border shrink-0"
                />
                <div>
                  <p className="font-bold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-xs font-semibold text-primary">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company logos strip */}
        <div className="pt-10 border-t border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-6 text-center">Trusted by industrial enterprises worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {COMPANIES.map(company => (
              <div key={company} className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-card border border-border">
                <Building2 className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-wide text-center leading-tight">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
