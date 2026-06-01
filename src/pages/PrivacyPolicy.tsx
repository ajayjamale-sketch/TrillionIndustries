import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';

const SECTIONS = [
  {
    id: '1',
    title: '1. Information We Collect',
    icon: Database,
    content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact our support team. This includes:

• Account information: name, email address, company name, job title, and password
• Usage data: how you interact with our platform, features accessed, and actions taken
• Device and technical data: IP address, browser type, operating system, and device identifiers
• Communication data: support tickets, chat logs, and email correspondence
• Industrial operational data: production records, inventory data, procurement information, and other data you enter into our platform`,
  },
  {
    id: '2',
    title: '2. How We Use Your Information',
    icon: Eye,
    content: `We use the information we collect to provide, maintain, and improve our services:

• To provide and operate the TrillionIndustries platform
• To process transactions and send related information
• To send technical notices, updates, security alerts, and support messages
• To respond to comments, questions, and requests
• To monitor and analyze trends, usage, and activities in connection with our services
• To detect, investigate, and prevent fraudulent transactions and other illegal activities
• To comply with legal obligations and enforce our agreements`,
  },
  {
    id: '3',
    title: '3. Data Storage and Security',
    icon: Lock,
    content: `TrillionIndustries implements enterprise-grade security measures to protect your data:

• Data encryption at rest using AES-256 and in transit using TLS 1.3
• SOC 2 Type II certified security controls
• ISO 27001 certified information security management
• Regular third-party security audits and penetration testing
• Multi-factor authentication and role-based access control
• Data centers located in SOC 2 compliant facilities in the US, EU, and APAC
• Regular backups with point-in-time recovery capabilities`,
  },
  {
    id: '4',
    title: '4. Data Sharing and Disclosure',
    icon: Globe,
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With service providers who assist us in operating the platform (under strict confidentiality agreements)
• With your consent or at your direction
• In response to legal process or government requests
• To protect our rights, privacy, safety, or property
• In connection with a merger, acquisition, or sale of assets (with advance notice)
• In aggregated or de-identified form that cannot reasonably be used to identify you`,
  },
  {
    id: '5',
    title: '5. Your Rights and Choices',
    icon: Shield,
    content: `Depending on your location, you may have the following rights regarding your data:

• Access: Request a copy of the personal information we hold about you
• Rectification: Request correction of inaccurate or incomplete information
• Erasure: Request deletion of your personal information
• Data portability: Request transfer of your data in a machine-readable format
• Opt-out: Opt out of marketing communications at any time
• GDPR compliance: EU residents have additional rights under the General Data Protection Regulation

To exercise these rights, contact us at privacy@trillionindustries.com`,
  },
  {
    id: '6',
    title: '6. Industrial Data Ownership',
    icon: Database,
    content: `You retain full ownership of all operational data you input into the TrillionIndustries platform:

• Production records, schedules, and work orders
• Inventory and warehouse data
• Procurement records and vendor information
• Equipment and maintenance data
• Workforce and HR data
• Financial records and reports

We process this data solely to provide services to you and never use it to build competitive intelligence or share it with other customers.`,
  },
  {
    id: '7',
    title: '7. Cookies and Tracking',
    icon: Eye,
    content: `We use cookies and similar tracking technologies to collect information about your use of our services:

• Essential cookies: Required for the platform to function properly
• Analytics cookies: Help us understand how users interact with our platform
• Preference cookies: Remember your settings and preferences

You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect platform functionality.`,
  },
  {
    id: '8',
    title: '8. Contact Us',
    icon: Mail,
    content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

• Email: privacy@trillionindustries.com
• Mail: Privacy Team, TrillionIndustries Inc., 1 Industrial Plaza, Detroit, MI 48201, USA
• Phone: +1 800 555 1234

We will respond to all privacy inquiries within 30 days. For GDPR-related requests, we have a designated Data Protection Officer (DPO) who can be reached at dpo@trillionindustries.com`,
  },
];

export default function PrivacyPolicy() {
  useScrollTop();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="max-w-3xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Shield className="h-3.5 w-3.5" /> Legal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: June 1, 2026</p>
            <p className="text-muted-foreground leading-relaxed">
              TrillionIndustries Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our industrial operating platform.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-card border border-border rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h2 className="font-bold text-foreground text-lg">{section.title}</h2>
                </div>
                <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className={`text-sm text-muted-foreground leading-relaxed ${line.startsWith('•') ? 'ml-4' : ''} ${line === '' ? 'mb-0 h-2' : 'mb-1.5'}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions? Contact our privacy team at{' '}
              <a href="mailto:privacy@trillionindustries.com" className="text-primary hover:underline font-medium">
                privacy@trillionindustries.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
