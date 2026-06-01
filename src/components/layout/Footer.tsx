import { Link } from 'react-router-dom';
import { Factory, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Successfully subscribed to TrillionIndustries newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
                <Factory className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Trillion<span className="text-blue-400">Industries</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The next-generation AI-powered industrial operating platform. Digitize, optimize, and scale your manufacturing and enterprise operations.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium text-white mb-2">Subscribe to our newsletter</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Manufacturing (MES)', href: '/features#mes' },
                { label: 'Supply Chain', href: '/features#supply-chain' },
                { label: 'Procurement', href: '/features#procurement' },
                { label: 'Inventory & Warehouse', href: '/features#inventory' },
                { label: 'Asset Management', href: '/features#assets' },
                { label: 'IIoT Integration', href: '/features#iiot' },
                { label: 'Quality Management', href: '/features#quality' },
                { label: 'Business Intelligence', href: '/features#bi' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Careers', href: '/careers' },
                { label: 'Blog', href: '/blog' },
                { label: 'Press', href: '/press' },
                { label: 'Partners', href: '/partners' },
                { label: 'Contact', href: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gray-500" />
                <span>1 Industrial Plaza, Detroit, MI 48201, USA</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-gray-500" />
                <a href="tel:+18005551234" className="hover:text-white transition-colors">+1 800 555 1234</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-gray-500" />
                <a href="mailto:info@trillionindustries.com" className="hover:text-white transition-colors">info@trillionindustries.com</a>
              </li>
            </ul>
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">SOC 2 • ISO 27001 • GDPR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2026 TrillionIndustries, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/faq" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
