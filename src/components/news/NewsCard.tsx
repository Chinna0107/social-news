import { Link } from "react-router-dom";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  date: string;
  category: string;
  variant?: "hero" | "standard" | "compact";
}

export function NewsCard({ id, title, excerpt, image, date, category, variant = "standard" }: NewsCardProps) {
  if (variant === "hero") {
    return (
      <Link to={`/article/${id}`} className="group block relative overflow-hidden rounded-lg">
        <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          <img src={image} alt={title} className="w-full h-full object-contain news-image-hover" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-24">
          <span className="news-body-text text-xs font-bold text-destructive bg-white px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">
            {category}
          </span>
          <h2 className="news-heading text-white text-3xl leading-tight group-hover:text-red-200 transition-colors mb-2">
            {title}
          </h2>
          <p className="news-body-text text-white/80 text-sm">{date}</p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/article/${id}`} className="group flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
        <div className="w-24 h-24 shrink-0 overflow-hidden rounded bg-slate-50 flex items-center justify-center border border-border/50">
          <img src={image} alt={title} className="w-full h-full object-contain news-image-hover" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="news-heading text-sm text-secondary group-hover:text-destructive transition-colors line-clamp-3 mb-1">
            {title}
          </h3>
          <p className="news-body-text text-xs text-foreground/60">{date}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${id}`} className="group block">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg mb-3 bg-slate-50 flex items-center justify-center border border-border/50">
        <img src={image} alt={title} className="w-full h-full object-contain news-image-hover" />
      </div>
      <span className="news-body-text text-[10px] font-bold text-destructive uppercase tracking-widest mb-1 block">
        {category}
      </span>
      <h3 className="news-heading text-lg text-secondary group-hover:text-destructive transition-colors line-clamp-2 mb-2">
        {title}
      </h3>
      {excerpt && <p className="news-body-text text-sm text-foreground/70 line-clamp-2 mb-2">{excerpt}</p>}
      <p className="news-body-text text-xs text-foreground/50">{date}</p>
    </Link>
  );
}
