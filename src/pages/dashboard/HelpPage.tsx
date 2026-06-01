import { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, ExternalLink, BookOpen, Video, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const HELP_TOPICS = [
  {
    category: 'Getting Started',
    icon: BookOpen,
    articles: [
      { title: 'Platform Overview & Navigation Guide', readTime: '5 min', popular: true },
      { title: 'Setting Up Your Organization & Plants', readTime: '8 min', popular: true },
      { title: 'Configuring User Roles & Permissions (RBAC)', readTime: '6 min' },
      { title: 'Dashboard Customization & Widgets', readTime: '4 min' },
    ]
  },
  {
    category: 'Production Management',
    icon: BookOpen,
    articles: [
      { title: 'Creating & Managing Work Orders', readTime: '6 min', popular: true },
      { title: 'Shop Floor Monitoring Setup', readTime: '7 min' },
      { title: 'Understanding OEE Calculations', readTime: '5 min' },
      { title: 'Batch Processing & Quality Checks', readTime: '4 min' },
    ]
  },
  {
    category: 'Procurement & Vendors',
    icon: BookOpen,
    articles: [
      { title: 'Managing the Full Procurement Lifecycle', readTime: '9 min' },
      { title: 'RFQ Process: Creating & Comparing Quotes', readTime: '7 min' },
      { title: 'Vendor Performance Scoring System', readTime: '5 min' },
    ]
  },
];

const FAQS = [
  { q: 'How do I reset my password or set up SSO?', a: 'You can reset your password via the login page\'s "Forgot Password" link, or contact your enterprise admin to configure SSO through the User Access management settings.' },
  { q: 'Can I integrate TrillionIndustries with my existing ERP system?', a: 'Yes, TrillionIndustries supports integration with SAP, Oracle ERP, Microsoft Dynamics, and other major ERP platforms via our REST API and pre-built connectors.' },
  { q: 'How does the AI Copilot get access to my data?', a: 'The AI Copilot only accesses data within your organization\'s tenant. It operates within your security boundary and complies with your role-based permissions.' },
  { q: 'What file formats are supported for imports?', a: 'We support CSV, Excel (.xlsx), and XML for most data imports including inventory, employee data, and product catalogs.' },
];

export function HelpPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><HelpCircle className="h-5 w-5" />Help Center</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Documentation, guides, and support resources</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles, guides, FAQs..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen, label: 'Documentation', desc: 'Comprehensive guides', action: 'Browse docs' },
          { icon: Video, label: 'Video Tutorials', desc: 'Step-by-step walkthroughs', action: 'Watch videos' },
          { icon: MessageSquare, label: 'Live Support', desc: 'Chat with our team', action: 'Start chat' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => toast.info(`Opening ${item.label}`)}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:bg-muted/20 transition-all">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              <p className="text-xs text-primary mt-2 font-medium flex items-center gap-1">{item.action} <ExternalLink className="h-3 w-3" /></p>
            </button>
          );
        })}
      </div>

      {/* Help Topics */}
      <div className="space-y-4">
        {HELP_TOPICS.map(topic => (
          <div key={topic.category} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm">{topic.category}</h3>
            </div>
            <div className="divide-y divide-border">
              {topic.articles.map(article => (
                <button key={article.title} onClick={() => toast.info(`Opening: ${article.title}`)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left">
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm text-foreground">{article.title}</span>
                  {article.popular && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 font-semibold">Popular</span>}
                  <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-border">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left gap-4">
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                {openFAQ === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>
              {openFAQ === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
