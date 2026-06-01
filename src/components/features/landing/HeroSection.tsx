import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, TrendingUp, Factory, Shield, Zap, ChevronRight, LogIn, ChevronDown } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.jpg';
import { useAuth, DEMO_USERS, ROLE_LABELS } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STATS = [
  { value: '2,400+', label: 'Enterprise Clients', icon: Factory },
  { value: '34%', label: 'Avg Production Gain', icon: TrendingUp },
  { value: '99.9%', label: 'Platform Uptime', icon: Shield },
  { value: '< 30 days', label: 'Time to Deploy', icon: Zap },
];

export function HeroSection() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email: string) => {
    const user = DEMO_USERS[email];
    if (user) {
      try {
        await login(email, user.password);
        toast.success(`Welcome back, ${user.user.name}`);
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to login with demo credentials');
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-background">
      {/* Blueprint grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,64,175,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,64,175,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,64,175,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,64,175,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-700/10 rounded-full blur-[100px]" />
      </div>

      {/* Left accent rail */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-600 to-transparent opacity-60 hidden xl:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="flex flex-col items-center text-center gap-14 lg:gap-20">
          {/* ── Top copy ── */}
          <div className="space-y-8 animate-fade-in max-w-3xl flex flex-col items-center">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600/15 border border-blue-600/30 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Industrial Platform
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Shield className="h-3 w-3" />
                SOC 2 · ISO 27001
              </div>
            </div>

            {/* Headline — bold structural type, no gradient */}
            <div className="space-y-2 flex flex-col items-center">
              <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-black text-foreground leading-[1.05] tracking-tight">
                The Operating System<br />
                for <span className="text-[#F97316]">Industrial</span><br />
                Enterprise
              </h1>
              <div className="w-16 h-1 bg-[#F97316] rounded-sm mt-4" />
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[600px]">
              Unify manufacturing, supply chain, procurement, workforce, and operations on one platform. Built for factories running at industrial scale.
            </p>

            {/* Feature checklist */}
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
              {[
                'Real-time shop floor & production monitoring',
                'Predictive maintenance via IIoT sensor integration',
                'Automated procurement & vendor management',
              ].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-4 h-4 rounded-sm bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 relative z-20">
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-900/40 transition-all hover:translate-y-[-1px] active:translate-y-0 border border-blue-500/40"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-sm border border-border transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Login Demo
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 text-left">Demo Accounts</div>
                  {Object.entries(DEMO_USERS).map(([email, data]) => (
                     <button key={email} onClick={() => handleDemoLogin(email)} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
                       <img src={data.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-foreground truncate">{data.user.name}</p>
                         <p className="text-xs text-muted-foreground truncate">{ROLE_LABELS[data.user.role as keyof typeof ROLE_LABELS]}</p>
                       </div>
                     </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Client logos strip */}
            <div className="pt-6 border-t border-border w-full mt-6">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Trusted by industry leaders</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                {['Bharat Steel', 'Atlas Industrial', 'Pacific Mfg', 'Gulf Industries', 'Nordic Metals'].map(c => (
                  <span key={c} className="text-xs font-semibold text-muted-foreground tracking-wide">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Dashboard preview ── */}
          <div className="relative animate-slide-up w-full max-w-5xl" style={{ animationDelay: '0.15s' }}>
            {/* Corner brackets — industrial aesthetic */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#F97316]/60 rounded-tl-sm" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#F97316]/60 rounded-br-sm" />

            <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl shadow-black/20 dark:shadow-black/60">
              <img
                src={heroDashboard}
                alt="TrillionIndustries Platform Dashboard"
                className="w-full object-cover aspect-video"
              />
              {/* Overlay gradient + live metrics */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Production Rate', value: '98.4%', color: 'text-emerald-400' },
                    { label: 'Active Orders', value: '1,247', color: 'text-blue-400' },
                    { label: 'Equipment Health', value: '96.2%', color: 'text-orange-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-2">
                      <p className="text-[10px] text-gray-400 mb-0.5">{item.label}</p>
                      <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
              </div>
            </div>

            {/* Floating info chip */}
            <div className="absolute -top-5 -right-2 sm:-right-6 bg-background border border-border rounded-xl p-3 shadow-xl hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">+34% Efficiency</p>
                <p className="text-[10px] text-muted-foreground">vs industry avg.</p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 sm:-left-6 bg-background border border-border rounded-xl p-3 shadow-xl hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                <Factory className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">847 Sensors</p>
                <p className="text-[10px] text-muted-foreground">IIoT connected</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="mt-20 lg:mt-24 pt-8 border-t border-border w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {STATS.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0 group-hover:border-blue-600/40 transition-colors">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-foreground leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
