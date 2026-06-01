import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Scale, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the TrillionIndustries platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all of these Terms, you may not access or use the Service.

These Terms apply to all users of the Service, including enterprise administrators, individual users, vendors, and any other persons who access the Service.`,
  },
  {
    title: '2. Description of Service',
    content: `TrillionIndustries provides an AI-powered industrial operating platform that includes:

• Manufacturing Execution System (MES)
• Supply Chain and Procurement Management
• Inventory and Warehouse Management
• Asset and Equipment Management
• Workforce Management
• Industrial IoT Integration
• Quality Management System
• Business Intelligence and AI Analytics
• B2B Industrial Marketplace
• Finance and Compliance Management

We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.`,
  },
  {
    title: '3. Account Registration and Security',
    content: `To use the Service, you must create an account. You are responsible for:

• Providing accurate and complete registration information
• Maintaining the security of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized access

You must be at least 18 years old and have authority to bind your organization to these Terms. Enterprise accounts are managed under a separate Enterprise Agreement.`,
  },
  {
    title: '4. Subscription and Payment Terms',
    content: `Access to the Service requires payment of applicable subscription fees:

• Fees are billed in advance on a monthly or annual basis
• Annual subscriptions are non-refundable except as required by law
• Monthly subscriptions may be cancelled with 30 days notice
• Prices are subject to change with 60 days advance notice
• Overdue accounts may result in service suspension
• All fees are exclusive of applicable taxes

Enterprise pricing and payment terms are governed by your Enterprise Agreement.`,
  },
  {
    title: '5. Acceptable Use Policy',
    content: `You agree not to use the Service to:

• Violate any applicable laws or regulations
• Infringe on any third-party intellectual property rights
• Upload viruses, malware, or malicious code
• Attempt to gain unauthorized access to our systems
• Reverse engineer or decompile any portion of the platform
• Use the Service to compete with TrillionIndustries
• Harass, abuse, or harm other users

Violation of these policies may result in immediate account termination.`,
  },
  {
    title: '6. Data and Intellectual Property',
    content: `Ownership and rights to data and intellectual property:

• You retain all rights to your operational data entered into the platform
• TrillionIndustries retains all rights to the platform software and technology
• You grant us a limited license to process your data to provide the Service
• We may use aggregated, anonymized data for service improvement
• You may not copy, distribute, or create derivative works of our platform

Upon termination, you may export your data within 30 days. After this period, data may be deleted.`,
  },
  {
    title: '7. Service Level Agreement (SLA)',
    content: `We commit to the following service levels:

• Starter Plan: 99.5% monthly uptime guarantee
• Professional Plan: 99.9% monthly uptime guarantee
• Enterprise Plan: Custom SLA as specified in Enterprise Agreement

Scheduled maintenance windows are excluded from uptime calculations. In case of SLA breach, service credits may be applied. Enterprise clients with custom SLAs are governed by their Enterprise Agreement.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law:

• TrillionIndustries shall not be liable for indirect, incidental, or consequential damages
• Our total liability shall not exceed the fees paid in the 12 months preceding the claim
• We are not liable for production losses, downtime, or business interruption claims
• Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you

These limitations apply regardless of the legal theory on which a claim is based.`,
  },
  {
    title: '9. Governing Law and Disputes',
    content: `These Terms shall be governed by the laws of the State of Michigan, USA, without regard to conflict of law provisions.

Any disputes arising under these Terms shall be resolved through:
1. Good faith negotiation between the parties
2. Mediation if negotiation fails (within 30 days)
3. Binding arbitration under AAA Commercial Rules

Enterprise clients may have alternative dispute resolution processes specified in their Enterprise Agreement.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. When we make changes:

• We will provide at least 30 days notice via email or platform notification
• Continued use of the Service after the effective date constitutes acceptance
• Material changes will require explicit re-acknowledgment for enterprise clients
• Previous versions of the Terms are available upon request

If you do not agree to the updated Terms, you must stop using the Service before the effective date.`,
  },
];

export default function Terms() {
  useScrollTop();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="max-w-3xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Scale className="h-3.5 w-3.5" /> Legal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last updated: June 1, 2026</p>
            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Please read these Terms carefully before using the TrillionIndustries platform. These terms constitute a legally binding agreement between you and TrillionIndustries Inc.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          {SECTIONS.map(section => (
            <div key={section.title} className="bg-card border border-border rounded-2xl p-7">
              <h2 className="font-bold text-foreground text-lg mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.content.split('\n').map((line, i) => (
                  <p key={i} className={`text-sm text-muted-foreground leading-relaxed ${line.startsWith('•') || /^\d\./.test(line) ? 'ml-4' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about these Terms? Contact our legal team at{' '}
              <a href="mailto:legal@trillionindustries.com" className="text-primary hover:underline font-medium">
                legal@trillionindustries.com
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
