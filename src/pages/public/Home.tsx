import { mockArticles, getArticlesByCategory } from "@/utils/mockData";
import { NewsCard } from "@/components/news/NewsCard";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ContactSection } from "@/components/news/ContactSection";

export default function Home() {
  const topStory = mockArticles[0];
  const latestNews = mockArticles.slice(1, 5);
  
  const apNews = getArticlesByCategory("ap").slice(0, 4);
  const tsNews = getArticlesByCategory("ts").slice(0, 4);
  const nationalNews = getArticlesByCategory("national").slice(0, 4);
  const internationalNews = getArticlesByCategory("international").slice(0, 4);
  const cinemaNews = getArticlesByCategory("cinema").slice(0, 4);
  const sportsNews = getArticlesByCategory("sports").slice(0, 4);
  const businessNews = getArticlesByCategory("business").slice(0, 4);

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
      
      <ContactSection />

    </div>
  );
}
