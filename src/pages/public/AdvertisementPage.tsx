import { useMemo, useState, useEffect } from "react";
import { advertisementCategories, mockAdvertisements } from "@/utils/mockData";
import { MapPin, Phone, Search, Tag } from "lucide-react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/advertisements";

export default function AdvertisementPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${API}?active=true`);
        if (res.ok) {
          const data = await res.json();
          const list = data.advertisements || data || [];
          setAds(list.length > 0 ? list : mockAdvertisements);
        } else {
          setAds(mockAdvertisements);
        }
      } catch {
        setAds(mockAdvertisements);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const categories = useMemo(() => {
    const fromApi = [...new Set(ads.map((a: any) => a.category))];
    return fromApi.length > 0 ? fromApi : advertisementCategories;
  }, [ads]);

  const filteredAds = useMemo(() => {
    const searchText = submittedQuery.trim().toLowerCase();
    return ads.filter(ad => {
      const matchesCategory = selectedCategory === "All" || ad.category === selectedCategory;
      const matchesSearch = !searchText || [ad.title, ad.category, ad.description, ad.location]
        .some(v => v?.toLowerCase().includes(searchText));
      return matchesCategory && matchesSearch;
    });
  }, [ads, selectedCategory, submittedQuery]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSubmittedQuery(query); };

  if (loading) return <div className="p-20 text-center text-foreground/50 font-bold">Loading advertisements...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b-4 border-primary pb-5">
        <p className="text-xs font-black text-destructive uppercase tracking-widest mb-2">Directory</p>
        <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">Advertisement</h1>
        <p className="text-foreground/60 mt-2 max-w-3xl">
          Browse local advertisements, business listings, job updates, shopping offers, and e-paper services.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-slate-50 border border-border rounded-lg p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search advertisements..."
            className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white" />
        </div>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
          className="border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
          <Search className="w-4 h-4" /> Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map(c => (
          <button key={c} onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
              selectedCategory === c ? "bg-destructive text-white border-destructive" : "bg-white text-secondary border-border hover:border-secondary/40"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {filteredAds.length === 0 ? (
        <div className="py-14 text-center text-foreground/50 font-semibold border border-dashed border-border rounded-lg">
          No advertisements found for your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <article key={ad.id || ad._id} className="border border-border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-destructive mb-2">
                  <Tag className="w-3 h-3" /> {ad.category}
                </span>
                <h2 className="text-lg font-black text-secondary mb-2">{ad.title}</h2>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{ad.description}</p>
                <div className="flex flex-col gap-2 text-xs font-semibold text-foreground/60">
                  {ad.location && <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {ad.location}</span>}
                  {ad.phone && (
                    <a href={`tel:${ad.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-destructive">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {ad.phone}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
