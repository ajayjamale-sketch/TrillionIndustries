import { useState, useMemo } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, ExternalLink, BookOpen, Video, MessageSquare, X } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const HELP_TOPICS = [
  {
    category: 'Getting Started',
    icon: BookOpen,
    articles: [
      { title: 'Platform Overview & Navigation Guide', readTime: '5 min', popular: true, path: '/docs/getting-started/overview' },
      { title: 'Setting Up Your Organization & Plants', readTime: '8 min', popular: true, path: '/docs/getting-started/setup' },
      { title: 'Configuring User Roles & Permissions (RBAC)', readTime: '6 min', path: '/docs/getting-started/rbac' },
      { title: 'Dashboard Customization & Widgets', readTime: '4 min', path: '/docs/getting-started/dashboard' },
    ]
  },
  {
    category: 'Production Management',
    icon: BookOpen,
    articles: [
      { title: 'Creating & Managing Work Orders', readTime: '6 min', popular: true, path: '/docs/production/work-orders' },
      { title: 'Shop Floor Monitoring Setup', readTime: '7 min', path: '/docs/production/shop-floor' },
      { title: 'Understanding OEE Calculations', readTime: '5 min', path: '/docs/production/oee' },
      { title: 'Batch Processing & Quality Checks', readTime: '4 min', path: '/docs/production/batch' },
    ]
  },
  {
    category: 'Procurement & Vendors',
    icon: BookOpen,
    articles: [
      { title: 'Managing the Full Procurement Lifecycle', readTime: '9 min', path: '/docs/procurement/lifecycle' },
      { title: 'RFQ Process: Creating & Comparing Quotes', readTime: '7 min', path: '/docs/procurement/rfq' },
      { title: 'Vendor Performance Scoring System', readTime: '5 min', path: '/docs/procurement/vendor-score' },
    ]
  },
];

const FAQS = [
  { q: 'How do I reset my password or set up SSO?', a: 'You can reset your password via the login page\'s "Forgot Password" link, or contact your enterprise admin to configure SSO through the User Access management settings.' },
  { q: 'Can I integrate TrillionIndustries with my existing ERP system?', a: 'Yes, TrillionIndustries supports integration with SAP, Oracle ERP, Microsoft Dynamics, and other major ERP platforms via our REST API and pre-built connectors.' },
  { q: 'How does the AI Copilot get access to my data?', a: 'The AI Copilot only accesses data within your organization\'s tenant. It operates within your security boundary and complies with your role-based permissions.' },
  { q: 'What file formats are supported for imports?', a: 'We support CSV, Excel (.xlsx), and XML for most data imports including inventory, employee data, and product catalogs.' },
];

// Modal component
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">{children}</div>
      </div>
    </div>
  );
}

export function HelpPage({ user }: { user: User }) {
  const [search, setSearch] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Filter articles based on search
  const filteredTopics = useMemo(() => {
    if (!search.trim()) return HELP_TOPICS;
    const lowerSearch = search.toLowerCase();
    return HELP_TOPICS.map(topic => ({
      ...topic,
      articles: topic.articles.filter(article =>
        article.title.toLowerCase().includes(lowerSearch)
      )
    })).filter(topic => topic.articles.length > 0);
  }, [search]);

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return FAQS;
    const lowerSearch = search.toLowerCase();
    return FAQS.filter(faq =>
      faq.q.toLowerCase().includes(lowerSearch) ||
      faq.a.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  // Action handlers
  const openDocumentation = () => {
    window.open('https://docs.trillionindustries.com', '_blank');
    toast.success('Opening documentation portal');
  };

  const openVideoTutorials = () => {
    setShowVideoModal(true);
  };

  const openLiveChat = () => {
    setShowChatModal(true);
  };

  const openArticle = (title: string, path: string) => {
    // Simulate opening a help article - in real app, navigate to the doc page
    window.open(`https://docs.trillionindustries.com${path}`, '_blank');
    toast.info(`Opening: ${title}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Modals */}
      {showVideoModal && (
        <Modal title="Video Tutorials" onClose={() => setShowVideoModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Step-by-step walkthroughs for key features:</p>
            <div className="space-y-2">
              {['Platform Overview (5:23)', 'Work Order Management (8:12)', 'OEE Dashboard Explained (4:45)'].map(video => (
                <button
                  key={video}
                  onClick={() => {
                    toast.info(`Playing: ${video}`);
                    setShowVideoModal(false);
                  }}
                  className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors flex items-center gap-3"
                >
                  <Video className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{video}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">More videos available in our YouTube channel.</p>
          </div>
        </Modal>
      )}

      {showChatModal && (
        <Modal title="Live Support" onClose={() => setShowChatModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Connect with support</p>
                <p className="text-xs text-muted-foreground">Average response time: &lt; 2 minutes</p>
              </div>
            </div>
            <textarea
              placeholder="Describe your issue..."
              className="w-full p-3 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
              rows={3}
            />
            <button
              onClick={() => {
                toast.success('Message sent! A support agent will respond shortly.');
                setShowChatModal(false);
              }}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start Chat
            </button>
            <p className="text-xs text-center text-muted-foreground">Available 24/7 for Enterprise customers.</p>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Help Center
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {user.name} · {user.company} · Documentation, guides, and support resources
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search help articles, guides, FAQs..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: BookOpen, label: 'Documentation', desc: 'Comprehensive guides', action: openDocumentation, actionLabel: 'Browse docs' },
          { icon: Video, label: 'Video Tutorials', desc: 'Step-by-step walkthroughs', action: openVideoTutorials, actionLabel: 'Watch videos' },
          { icon: MessageSquare, label: 'Live Support', desc: 'Chat with our team', action: openLiveChat, actionLabel: 'Start chat' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:bg-muted/20 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              <p className="text-xs text-primary mt-2 font-medium flex items-center gap-1">
                {item.actionLabel} <ExternalLink className="h-3 w-3" />
              </p>
            </button>
          );
        })}
      </div>

      {/* Help Topics (filtered) */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-4">
          {filteredTopics.map(topic => (
            <div key={topic.category} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">{topic.category}</h3>
              </div>
              <div className="divide-y divide-border">
                {topic.articles.map(article => (
                  <button
                    key={article.title}
                    onClick={() => openArticle(article.title, article.path)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
                  >
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-sm text-foreground">{article.title}</span>
                    {article.popular && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 font-semibold">Popular</span>
                    )}
                    <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No articles match your search.</p>
        </div>
      )}

      {/* FAQ Section (filtered) */}
      {filteredFaqs.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-border">
            {filteredFaqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left gap-4"
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  {openFAQ === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
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
      )}
    </div>
  );
}