import { useParams, Link } from "react-router-dom";
import { getArticleById, getArticlesByCategory } from "@/utils/mockData";
import { NewsCard } from "@/components/news/NewsCard";
import { Clock, User, Share2 } from "lucide-react";

export default function ArticlePage() {
  const { articleId } = useParams();
  const article = getArticleById(articleId || "");

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

  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      
      {/* Main Article Content */}
      <div className="lg:w-2/3 flex flex-col">
        <div className="mb-6">
          <Link to={`/category/${article.category}`} className="text-xs font-bold text-destructive uppercase tracking-widest hover:underline mb-2 inline-block">
            {article.category} NEWS
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-foreground/70 font-medium leading-relaxed mb-6">
            {article.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border mb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                <User className="w-4 h-4" /> {article.author}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                <Clock className="w-4 h-4" /> {article.date}
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors bg-slate-100 px-4 py-2 rounded-full">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-md">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-foreground/80 leading-loose">
          <p className="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-1 first-letter:float-left">
            {article.content}
          </p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <h3 className="text-2xl font-bold text-secondary mt-8 mb-4">A Deeper Look</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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

    </div>
  );
}
