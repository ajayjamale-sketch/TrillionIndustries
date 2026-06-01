import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Factory, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth, DEMO_USERS, ROLE_LABELS } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useScrollTop } from '@/hooks/useScrollTop';

export default function Login() {
  useScrollTop();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const handleDemoLogin = async (email: string) => {
    const user = DEMO_USERS[email];
    if (user) {
      setForm({ email, password: user.password });
      try {
        await login(email, user.password);
        toast.success(`Welcome back, ${user.user.name}`);
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to login with demo credentials');
      }
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to TrillionIndustries.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden">
      {/* Left Visual - Demo Credentials */}
      <div className="hidden lg:flex flex-col flex-1 bg-muted/30 border-r border-border p-12 relative overflow-hidden h-full">
        <div className="relative z-10 w-full max-w-xl mx-auto h-full flex flex-col overflow-hidden">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-brand-lg mb-6">
              <Factory className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-3">Quick Access Demo</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Select a persona below to instantly bypass the login screen and explore the platform from different role perspectives.
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
            {Object.entries(DEMO_USERS).map(([email, data]) => (
              <button
                key={email}
                type="button"
                onClick={() => handleDemoLogin(email)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-md transition-all text-left group"
              >
                <img src={data.user.avatar} alt={data.user.name} className="w-12 h-12 rounded-full object-cover border border-border group-hover:border-primary/50 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-foreground truncate">{data.user.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                      {ROLE_LABELS[data.user.role as keyof typeof ROLE_LABELS]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="truncate">{email}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>Pass: {data.password}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-16 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <Factory className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Trillion<span className="text-primary">Industries</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Sign in to your account</h1>
            <p className="text-muted-foreground text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Work Email</label>
              <input
                type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.email && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Signing in...</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
