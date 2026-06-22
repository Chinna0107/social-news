import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticleById, getArticlesByCategory } from "@/utils/mockData";
import { NewsCard } from "@/components/news/NewsCard";
import { Clock, User, Share2, X } from "lucide-react";

export default function ArticlePage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
        const res = await fetch(`${API}/news/${articleId}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
          // Fetch related articles from same category
          const relRes = await fetch(`${API}/news?category=${data.category}`);
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedArticles((relData.news || []).filter((a: any) => a.id !== articleId).slice(0, 3));
          }
        } else {
          // Fallback to mock data
          const mockArticle = getArticleById(articleId || "");
          setArticle(mockArticle);
          if (mockArticle) {
            setRelatedArticles(getArticlesByCategory(mockArticle.category).filter(a => a.id !== mockArticle.id).slice(0, 3));
          }
        }
      } catch {
        const mockArticle = getArticleById(articleId || "");
        setArticle(mockArticle);
        if (mockArticle) {
          setRelatedArticles(getArticlesByCategory(mockArticle.category).filter(a => a.id !== mockArticle.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (loading) {
    return <div className="p-20 text-center text-foreground/50 font-bold">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-black text-secondary mb-4">Article Not Found</h1>
        <p className="text-foreground/60 mb-8">The news article you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      
      {/* Main Article Content */}
      <div className="lg:w-2/3 flex flex-col">
        <div className="mb-6">
          <Link to={`/category/${article.category}`} className="text-xs font-bold text-destructive uppercase tracking-widest hover:underline mb-2 inline-block">
            {article.category} NEWS
          </Link>
          <h1 className="news-heading text-3xl md:text-5xl text-secondary leading-tight mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="news-subheading text-lg text-foreground/70 leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border mb-8">
            <div className="flex items-center gap-6">
              {article.author && (
                <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                  <User className="w-4 h-4" /> {article.author}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                <Clock className="w-4 h-4" /> {article.date}
              </div>
            </div>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: window.location.href,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors bg-slate-100 px-4 py-2 rounded-full"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {article.image && (
          <div 
            className="w-full rounded-xl overflow-hidden mb-8 shadow-md cursor-pointer group relative bg-slate-50 flex items-center justify-center border border-border/50"
            onClick={() => setIsImageOpen(true)}
          >
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto max-h-[500px] object-contain group-hover:scale-[1.01] transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm transition-opacity duration-300">
                  Click to Expand
               </span>
            </div>
          </div>
        )}

        <div className="news-body-text prose prose-lg max-w-none text-foreground/80 leading-loose">
          <p className="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-1 first-letter:float-left">
            {article.content}
          </p>
        </div>
      </div>

      {/* Sidebar - Related News */}
      <div className="lg:w-1/3">
        <div className="sticky top-24">
          <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
            <h2 className="text-xl font-black text-primary">RELATED NEWS</h2>
          </div>
          <div className="flex flex-col gap-6">
            {relatedArticles.map(related => (
              <NewsCard 
                key={related.id} 
                {...related} 
                variant="compact"
              />
            ))}
          </div>

          <div className="mt-10 bg-slate-50 p-6 rounded-xl border border-border text-center">
            <h3 className="font-bold text-lg text-secondary mb-2">Subscribe for Updates</h3>
            <p className="text-sm text-foreground/60 mb-4">Get the latest {article.category} news delivered directly to your inbox.</p>
            <input type="email" placeholder="Email Address" className="w-full px-4 py-2 rounded border border-border mb-3 focus:outline-none focus:border-primary" />
            <button className="w-full bg-destructive text-white font-bold py-2 rounded hover:bg-destructive/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageOpen && article?.image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setIsImageOpen(false)}>
          <button 
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            onClick={() => setIsImageOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={article.image} 
            alt={article.title} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

