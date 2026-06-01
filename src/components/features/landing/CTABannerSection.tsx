import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import factoryBg from '@/assets/factory-bg.jpg';
import { useAuth } from '@/hooks/useAuth';

const STATS = [
  { value: '2,400+', label: 'Enterprise clients globally' },
  { value: '34%', label: 'Avg production efficiency gain' },
  { value: '$2.8T', label: 'Operations managed on platform' },
  { value: '30 days', label: 'Average time to ROI' },
];

const CHECKS = [
  'Dedicated implementation team',
  'Data migration assistance',
  '24/7 enterprise support',
  'Custom training program',
];

export function CTABannerSection() {
  const { isAuthenticated } = useAuth();
  return (
    <section className="py-0 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={factoryBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1220]/97 via-[#0c1220]/88 to-[#1E40AF]/70" />
        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,64,175,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(30,64,175,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/15 text-white text-xs font-semibold tracking-wider uppercase">
              30-Day Free Trial · No Credit Card
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.08] tracking-tight mb-3">
                Ready to digitize your<br />
                <span className="text-[#F97316]">industrial operations?</span>
              </h2>
              <div className="w-12 h-1 bg-[#F97316] rounded-sm" />
            </div>

            <p className="text-gray-300 text-base leading-relaxed max-w-md">
              Join 2,400+ enterprises. See why leading manufacturers choose TrillionIndustries to power their operational transformation.
            </p>

            {/* Feature checks */}
            <div className="grid grid-cols-2 gap-2">
              {CHECKS.map(c => (
                <div key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-gray-300">{c}</span>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <Link
                to="/payment"
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-[#0c1220] font-black text-sm hover:bg-gray-100 transition-all hover:translate-y-[-1px] shadow-xl"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-[#0c1220] font-black text-sm hover:bg-gray-100 transition-all hover:translate-y-[-1px] shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
              <Link
                to="/contact"
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/8 border border-white/15 text-white font-semibold text-sm hover:bg-white/15 transition-all"
              >
                <Phone className="h-4 w-4" />
                Talk to an Expert
              </Link>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="relative p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
              >
                {/* Corner brackets */}
                {i === 0 && <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#F97316]/60" />}
                {i === 1 && <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#F97316]/60" />}
                {i === 2 && <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#F97316]/60" />}
                {i === 3 && <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#F97316]/60" />}
                <p className="text-3xl font-black text-white mb-1.5">{stat.value}</p>
                <p className="text-xs text-gray-400 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}

