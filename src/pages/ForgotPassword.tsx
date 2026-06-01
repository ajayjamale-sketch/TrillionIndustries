import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, AlertCircle, Loader2, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useScrollTop } from '@/hooks/useScrollTop';

export default function ForgotPassword() {
  useScrollTop();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success('Password reset email sent!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
            <Factory className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">Trillion<span className="text-primary">Industries</span></span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-xl font-extrabold text-foreground mb-2">Reset your password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your work email and we'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Work Email</label>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@company.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                      error ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'
                    }`}
                  />
                  {error && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand disabled:opacity-60"
                >
                  {loading ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Sending...</> : 'Send Reset Instructions'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
              <p className="text-sm text-muted-foreground">
                We've sent password reset instructions to <strong className="text-foreground">{email}</strong>.
                Check your email and follow the link.
              </p>
              <p className="text-xs text-muted-foreground">Didn't receive it? Check spam or{' '}
                <button onClick={() => setSent(false)} className="text-primary hover:underline">try again</button>.
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-border text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
