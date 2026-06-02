import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Factory, AlertCircle, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useScrollTop } from '@/hooks/useScrollTop';

const ROLES = [
  { value: 'enterprise_admin', label: 'Enterprise Admin / Owner' },
  { value: 'production_manager', label: 'Production Manager' },
  { value: 'procurement_manager', label: 'Procurement Manager' },
  { value: 'warehouse_manager', label: 'Warehouse Manager' },
  { value: 'maintenance_engineer', label: 'Maintenance Engineer' },
  { value: 'supplier', label: 'Supplier / Vendor' },
  { value: 'finance_officer', label: 'Finance & Compliance Officer' },
];

export default function Register() {
  useScrollTop();
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid work email required';
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.role) e.role = 'Please select your role';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (!agreed) e.agreed = 'Please accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await register({ name: form.name, email: form.email, company: form.company, role: form.role, password: form.password });
    toast.success('Account created! Welcome to TrillionIndustries.');
    navigate('/dashboard');
  };

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  })();

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Left Visual */}
      <div className="hidden lg:flex flex-col flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden h-screen sticky top-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-sm space-y-6">
          <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-brand-lg">
            <Factory className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Start your 30-day free trial</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Full platform access. No credit card required. Implementation support included.
          </p>
          <div className="space-y-3">
            {[
              'Full access to all 12 modules',
              'Dedicated implementation support',
              'Data migration assistance',
              'No credit card required',
              'Cancel anytime',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-emerald-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-16 min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <Factory className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Trillion<span className="text-primary">Industries</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground text-sm">Start your 30-day free trial — no credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text" value={form.name} onChange={set('name')} placeholder="John Smith"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.name && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Work Email</label>
              <input
                type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.email && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.email}</p>}
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <input
                type="text" value={form.company} onChange={set('company')} placeholder="Acme Manufacturing Inc."
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.company ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.company && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.company}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Your Role</label>
              <select
                value={form.role} onChange={set('role')}
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${errors.role ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
              >
                <option value="">Select your role...</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              {errors.role && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.role}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-amber-400' : strength <= 3 ? 'bg-blue-400' : 'bg-emerald-400' : 'bg-muted'}`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.confirm ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
              />
              {errors.confirm && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <div className="relative mt-0.5">
                  <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })); }} className="sr-only" />
                  <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-primary border-primary' : 'border-input'}`}>
                    {agreed && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreed && <p className="flex items-center gap-1 text-xs text-destructive mt-1"><AlertCircle className="h-3.5 w-3.5" />{errors.agreed}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Creating account...</> : 'Create Free Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
