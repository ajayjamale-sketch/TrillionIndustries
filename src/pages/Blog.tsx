import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Search, Clock, ArrowRight, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/constants';

const CATEGORIES = ['All', 'Manufacturing', 'Supply Chain', 'IIoT', 'Procurement', 'Quality', 'AI & Analytics'];

export default function Blog() {
  useScrollTop();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = BLOG_POSTS.filter(post => {
    const matchesSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                Industrial Insights & Expertise
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                The TrillionIndustries <span className="text-gradient-blue">Knowledge Hub</span>
              </h1>
              <p className="text-muted-foreground">Expert insights on manufacturing, supply chain, IIoT, and industrial operations.</p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}>
                <Tag className="h-3.5 w-3.5" /> {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-foreground font-semibold">No articles found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search term or category</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="group block mb-10">
                  <div className="grid lg:grid-cols-2 gap-8 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all">
                    <img src={featured.image} alt={featured.title} className="w-full h-64 lg:h-full object-cover" />
                    <div className="p-7 flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{featured.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">{featured.title}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">By <strong className="text-foreground">{featured.author}</strong> · {featured.date}</div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-primary">Read Article <ArrowRight className="h-3.5 w-3.5" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <div className="relative overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-secondary/80 backdrop-blur text-white text-xs font-semibold">{post.category}</span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {post.readTime} · {post.date}
                      </div>
                      <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-border">
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary">Read <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
