import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const OFFICES = [
  { city: 'Detroit', country: 'USA', address: '1 Industrial Plaza, Detroit, MI 48201', phone: '+1 800 555 1234', timezone: 'EST (UTC-5)' },
  { city: 'London', country: 'UK', address: '200 Factory Square, London EC2A 4BX', phone: '+44 20 7946 0101', timezone: 'GMT (UTC+0)' },
  { city: 'Mumbai', country: 'India', address: '45 Industrial Park, BKC, Mumbai 400051', phone: '+91 22 6600 1234', timezone: 'IST (UTC+5:30)' },
];

export default function Contact() {
  useScrollTop();
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim() || form.message.length < 20) e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! Our team will respond within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              Get in Touch
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Talk to our <span className="text-gradient-blue">industrial experts</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're exploring the platform, need a custom implementation, or have a support question — our team is here to help.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'info@trillionindustries.com', href: 'mailto:info@trillionindustries.com' },
                  { icon: Phone, label: 'Phone', value: '+1 800 555 1234', href: 'tel:+18005551234' },
                  { icon: Clock, label: 'Support Hours', value: '24/7 for Enterprise clients', href: null },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Offices */}
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-4">Global Offices</h3>
                <div className="space-y-4">
                  {OFFICES.map(office => (
                    <div key={office.city} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm text-foreground">{office.city}, {office.country}</span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">{office.address}</p>
                      <p className="text-xs text-muted-foreground ml-6 mt-1">{office.timezone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-7">
                {sent ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Message received!</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Thank you for reaching out. Our team will respond to <strong>{form.email}</strong> within 24 hours.
                    </p>
                    <button onClick={() => { setSent(false); setForm({ name: '', email: '', company: '', phone: '', subject: '', message: '' }); }}
                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 mb-6">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-bold text-foreground">Send us a message</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: 'name', label: 'Full Name', placeholder: 'John Smith', type: 'text' },
                          { key: 'email', label: 'Work Email', placeholder: 'you@company.com', type: 'email' },
                          { key: 'company', label: 'Company', placeholder: 'Company name', type: 'text' },
                          { key: 'phone', label: 'Phone (optional)', placeholder: '+1 555 000 0000', type: 'tel' },
                        ].map(field => (
                          <div key={field.key} className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.label}</label>
                            <input
                              type={field.type} value={form[field.key as keyof typeof form]}
                              onChange={set(field.key)} placeholder={field.placeholder}
                              className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                                errors[field.key] ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20 focus:border-primary'
                              }`}
                            />
                            {errors[field.key] && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors[field.key]}</p>}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</label>
                        <select value={form.subject} onChange={set('subject')}
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${errors.subject ? 'border-destructive' : 'border-input focus:ring-primary/20 focus:border-primary'}`}>
                          <option value="">Select a subject...</option>
                          {['Request a Demo', 'Sales Inquiry', 'Technical Support', 'Implementation Help', 'Partnership', 'Billing', 'Other'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        {errors.subject && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.subject}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Message</label>
                        <textarea
                          value={form.message} onChange={set('message')} rows={4}
                          placeholder="Tell us about your requirements, operations size, or any questions you have..."
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all resize-none ${errors.message ? 'border-destructive' : 'border-input focus:ring-primary/20 focus:border-primary'}`}
                        />
                        {errors.message && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{errors.message}</p>}
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-brand disabled:opacity-60">
                        {loading ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Sending...</> : <><Send className="h-4.5 w-4.5" /> Send Message</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
