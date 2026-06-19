import { useParams, Link } from "react-router-dom";
import { getArticlesByCategory, mockCategories } from "@/utils/mockData";
import { NewsCard } from "@/components/news/NewsCard";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = mockCategories.find(c => c.id === categoryId);
  const articles = getArticlesByCategory(categoryId || "");

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-black text-secondary mb-4">Category Not Found</h1>
        <p className="text-foreground/60 mb-8">The news category you are looking for does not exist.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b-4 border-primary pb-4 mb-4">
        <h1 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">{category.label} NEWS</h1>
        <p className="text-foreground/60 mt-2">Latest updates and stories from {category.label}.</p>
      </div>

      {articles.length === 0 ? (
        <div className="py-12 text-center text-foreground/50 font-medium">
          No articles found for this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {articles.map((article, idx) => (
            <div key={article.id} className={idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
              <NewsCard 
                {...article} 
                variant={idx === 0 ? "hero" : "standard"} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
