import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { BLOG_POSTS } from '@/constants';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPost() {
  useScrollTop();
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">Article not found</h1>
            <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = BLOG_POSTS.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/80 text-white text-xs font-semibold mb-3">{post.category}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">{post.title}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button onClick={() => toast.success('Article bookmarked!')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                <Bookmark className="h-3.5 w-3.5" /> Save
              </button>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-foreground space-y-5">
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">{post.excerpt}</p>

            <h2 className="text-xl font-bold text-foreground mt-8">The Industrial Transformation Imperative</h2>
            <p className="text-muted-foreground leading-relaxed">
              The global manufacturing landscape is undergoing a fundamental transformation. Enterprises that embrace digital technologies — from AI-powered analytics to real-time IIoT monitoring — are pulling away from competitors still relying on paper-based systems and disconnected tools. The question is no longer whether to digitize, but how fast.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Modern industrial platforms like TrillionIndustries are enabling manufacturers to connect every element of their operations — from raw material procurement to finished goods delivery — on a single unified platform. The result is unprecedented visibility, efficiency, and competitive advantage.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8">Key Drivers of Industrial Digital Transformation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Three macro forces are accelerating industrial digitization: increasing cost pressures, growing supply chain complexity, and rising customer expectations for delivery speed and quality. Each of these forces creates both challenges and opportunities for manufacturers willing to embrace technology.
            </p>

            <div className="bg-muted/50 border border-border rounded-xl p-5 my-6">
              <p className="font-semibold text-foreground mb-2">Key Insight</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "Organizations that achieve best-in-class operational performance consistently share one characteristic: they have replaced fragmented, siloed systems with integrated digital platforms that provide a single source of truth across all operational functions."
              </p>
            </div>

            <h2 className="text-xl font-bold text-foreground mt-8">Implementation Considerations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Successful implementation requires more than technology selection. Organizations must address change management, data migration, integration with legacy systems, and workforce training. The most successful deployments follow a phased approach, starting with the highest-impact modules and expanding systematically.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our data from 2,400+ enterprise deployments shows that organizations that start with Manufacturing Execution and Inventory Management modules achieve the fastest ROI — typically within 6-8 months of go-live.
            </p>
          </article>

          {/* Back + Related */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            {related.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-5">Related Articles</h3>
                <div className="grid sm:grid-cols-3 gap-5">
                  {related.map(r => (
                    <Link key={r.id} to={`/blog/${r.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
                      <img src={r.image} alt={r.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="p-4">
                        <p className="text-xs text-primary font-medium mb-1">{r.category}</p>
                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
