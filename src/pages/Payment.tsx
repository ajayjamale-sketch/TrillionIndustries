import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Factory, Check, ArrowRight, ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useScrollTop } from '@/hooks/useScrollTop';

export default function Payment() {
  useScrollTop();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({ name: '', cardNumber: '', expiry: '', cvc: '', zip: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name on card is required';
    if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Valid card number is required';
    if (!form.expiry.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) e.expiry = 'MM/YY required';
    if (!form.cvc.trim() || form.cvc.length < 3) e.cvc = 'Valid CVC required';
    if (!form.zip.trim()) e.zip = 'Billing ZIP required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful! Your subscription is active.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Left Visual */}
      <div className="hidden lg:flex flex-col flex-1 bg-muted/30 items-center justify-center p-12 relative overflow-hidden h-screen sticky top-0 border-r border-border">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        <div className="relative max-w-sm w-full space-y-6">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
              <Factory className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-foreground">TrillionIndustries</span>
          </Link>
          
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-foreground border-b border-border pb-3">Order Summary</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Professional Plan (Annual)</span>
              <span className="font-bold text-foreground">$11,880</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Implementation Fee</span>
              <span className="font-bold text-foreground">Waived</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Taxes</span>
              <span className="font-bold text-foreground">Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-bold text-foreground">Total due today</span>
              <span className="font-black text-xl text-foreground">$11,880</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <span className="font-medium">Bank-level 256-bit SSL encryption. We do not store your full card details.</span>
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
            <span className="font-black tracking-tight text-foreground">TrillionIndustries</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">Complete Payment</h1>
            <p className="text-sm text-muted-foreground font-medium">Enter your payment details to upgrade your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5">Name on Card</label>
              <input
                type="text"
                value={form.name}
                onChange={e => { setForm(prev => ({ ...prev, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-primary focus:ring-primary/20'} bg-background text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                placeholder="Jane Doe"
              />
              {errors.name && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={e => { setForm(prev => ({ ...prev, cardNumber: e.target.value })); if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' })); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.cardNumber ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-primary focus:ring-primary/20'} bg-background text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              {errors.cardNumber && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={e => { setForm(prev => ({ ...prev, expiry: e.target.value })); if (errors.expiry) setErrors(prev => ({ ...prev, expiry: '' })); }}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.expiry ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-primary focus:ring-primary/20'} bg-background text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                  placeholder="12/25"
                />
                {errors.expiry && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.expiry}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5">CVC</label>
                <input
                  type="text"
                  value={form.cvc}
                  onChange={e => { setForm(prev => ({ ...prev, cvc: e.target.value })); if (errors.cvc) setErrors(prev => ({ ...prev, cvc: '' })); }}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.cvc ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-primary focus:ring-primary/20'} bg-background text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvc && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.cvc}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5">Billing ZIP / Postal Code</label>
              <input
                type="text"
                value={form.zip}
                onChange={e => { setForm(prev => ({ ...prev, zip: e.target.value })); if (errors.zip) setErrors(prev => ({ ...prev, zip: '' })); }}
                className={`w-full px-4 py-3 rounded-xl border ${errors.zip ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-primary focus:ring-primary/20'} bg-background text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                placeholder="90210"
              />
              {errors.zip && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.zip}</p>}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-brand hover:translate-y-[-1px] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Pay $11,880
                </>
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-4 font-medium">
              By confirming your subscription, you allow TrillionIndustries to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
