import { useState, useEffect } from "react";
import { NewsCard } from "@/components/news/NewsCard";
import { Link } from "react-router-dom";
import { ChevronRight, PlayCircle } from "lucide-react";
import { ContactSection } from "@/components/news/ContactSection";

// Fallback mock data in case API fails
import { mockArticles as fallbackMock } from "@/utils/mockData";

export default function Home() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/news";
        const res = await fetch(API);
        if (res.ok) {
          const data = await res.json();
          setAllNews(data.news || []);
        } else {
          setAllNews(fallbackMock);
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
        setAllNews(fallbackMock);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getCat = (cat: string) => allNews.filter(n => n.category.toLowerCase() === cat.toLowerCase());

  const topStory = allNews.length > 0 ? allNews[0] : null;
  const latestNews = allNews.slice(1, 5);
  
  const apNews = getCat("ap").slice(0, 4);
  const tsNews = getCat("ts").slice(0, 4);
  const nationalNews = getCat("national").slice(0, 4);
  const internationalNews = getCat("international").slice(0, 4);
  const cinemaNews = getCat("cinema").slice(0, 4);
  const sportsNews = getCat("sports").slice(0, 4);
  const businessNews = getCat("business").slice(0, 4);

  if (loading) {
    return <div className="p-20 text-center text-foreground/50 font-bold">Loading latest news...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Top Story & Latest News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {topStory && (
            <NewsCard 
              id={topStory.id}
              title={topStory.title}
              image={topStory.image}
              date={topStory.date}
              category={topStory.category}
              variant="hero"
            />
          )}
        </div>
        <div className="bg-slate-50 border border-border p-4 rounded-lg flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b-2 border-secondary pb-2">
             <h2 className="text-xl font-black text-secondary">LATEST NEWS</h2>
             <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {latestNews.map(article => (
              <NewsCard 
                key={article.id}
                id={article.id}
                title={article.title}
                image={article.image}
                date={article.date}
                category={article.category}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* AP & TS Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
            <h2 className="text-xl md:text-2xl font-black text-primary">ANDHRA PRADESH</h2>
            <Link to="/category/ap" className="text-sm font-bold text-destructive flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {apNews.map(article => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
            <h2 className="text-xl md:text-2xl font-black text-primary">TELANGANA</h2>
            <Link to="/category/ts" className="text-sm font-bold text-destructive flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tsNews.map(article => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </section>
      </div>

      {/* National & International */}
      <section className="bg-slate-50 p-6 rounded-xl border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
              <h2 className="text-xl md:text-2xl font-black text-primary">NATIONAL</h2>
              <Link to="/category/national" className="text-sm font-bold text-destructive flex items-center hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {nationalNews.map(article => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
              <h2 className="text-xl md:text-2xl font-black text-primary">INTERNATIONAL</h2>
              <Link to="/category/international" className="text-sm font-bold text-destructive flex items-center hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {internationalNews.map(article => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cinema */}
      <section className="bg-slate-900 text-white p-6 rounded-xl -mx-4 md:-mx-6 shadow-lg">
        <div className="flex justify-between items-end mb-6 border-b-2 border-white/20 pb-2">
          <h2 className="text-xl md:text-2xl font-black text-white">CINEMA</h2>
          <Link to="/category/cinema" className="text-sm font-bold text-destructive flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cinemaNews.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group block">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg mb-3">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover news-image-hover" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-destructive transition-colors line-clamp-2 mb-2">
                {article.title}
              </h3>
              <p className="text-xs text-white/50">{article.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sports & Business Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
            <h2 className="text-xl md:text-2xl font-black text-primary">SPORTS</h2>
            <Link to="/category/sports" className="text-sm font-bold text-destructive flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sportsNews.map(article => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4 border-b-2 border-primary pb-2">
            <h2 className="text-xl md:text-2xl font-black text-primary">BUSINESS</h2>
            <Link to="/category/business" className="text-sm font-bold text-destructive flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {businessNews.map(article => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </section>
      </div>

      <hr className="border-border" />

      {/* Featured Video Section */}
      <section className="bg-white p-6 md:p-10 rounded-2xl border shadow-sm">
        <div className="flex justify-between items-end mb-8 border-b-2 border-primary pb-2">
          <div className="flex items-center gap-3">
            <PlayCircle className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl md:text-3xl font-black text-primary">FEATURED VIDEO</h2>
          </div>
        </div>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-xl group">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0" 
            title="Featured Video" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </section>
      
      <ContactSection />

    </div>
  );
}
