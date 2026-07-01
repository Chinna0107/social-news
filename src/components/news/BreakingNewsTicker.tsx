import { useEffect, useState } from "react";
import { BREAKING_NEWS_STORAGE_KEY, mockBreakingNews } from "@/utils/mockData";

export function BreakingNewsTicker() {
  const [headlines, setHeadlines] = useState(mockBreakingNews);

  useEffect(() => {
    const loadBreakingNews = () => {
      try {
        const stored = localStorage.getItem(BREAKING_NEWS_STORAGE_KEY);
        if (!stored) {
          setHeadlines(mockBreakingNews);
          return;
        }
        const parsed = JSON.parse(stored);
        const validHeadlines = Array.isArray(parsed)
          ? parsed.filter(item => typeof item === "string" && item.trim())
          : [];
        setHeadlines(validHeadlines.length ? validHeadlines : mockBreakingNews);
      } catch (error) {
        console.error("Failed to load breaking news ticker", error);
        setHeadlines(mockBreakingNews);
      }
    };

    loadBreakingNews();
    window.addEventListener("storage", loadBreakingNews);
    return () => window.removeEventListener("storage", loadBreakingNews);
  }, []);

  return (
    <div className="flex bg-secondary border-b border-white/10 text-white overflow-hidden relative h-10 items-center">
      <div className="absolute left-0 top-0 bottom-0 z-10 bg-destructive px-2 md:px-4 flex items-center font-bold text-xs md:text-sm tracking-wider shadow-[4px_0_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
        BREAKING NEWS
      </div>
      <div className="w-full pl-32 md:pl-44 overflow-hidden flex items-center h-full">
        <div className="whitespace-nowrap animate-ticker flex gap-12 text-sm font-medium">
          {headlines.map((news, idx) => (
            <span key={idx} className="flex items-center gap-12">
              <span>{news}</span>
              <span className="w-2 h-2 rounded-full bg-destructive inline-block"></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
