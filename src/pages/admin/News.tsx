import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Plus, Search, X, Image as ImageIcon, Loader2, Upload, Stamp } from "lucide-react";
import { BREAKING_NEWS_STORAGE_KEY, mockBreakingNews } from "@/utils/mockData";

interface News {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
  content?: string;
}

const CATEGORIES = [
  { value: "science", label: "Science" },
  { value: "ts", label: "Telangana" },
  { value: "national", label: "National" },
  { value: "international", label: "International" },
  { value: "cinema", label: "Cinema" },
  { value: "sports", label: "Sports" },
  { value: "business", label: "Business" },
];
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/admin/news";
const UPLOAD_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/media/upload";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

/** Composite logo watermark onto image using canvas, returns data URL */
async function applyLogoWatermark(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        // Logo at bottom-right, 20% of image width, slight padding
        const logoW = img.width * 0.2;
        const logoH = (logo.height / logo.width) * logoW;
        const padding = img.width * 0.02;
        ctx.globalAlpha = 0.85;
        ctx.drawImage(logo, img.width - logoW - padding, img.height - logoH - padding, logoW, logoH);
        ctx.globalAlpha = 1;
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      logo.onerror = () => reject(new Error("Logo load failed"));
      logo.src = "/logo.png";
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = imageUrl;
  });
}

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editNews, setEditNews] = useState<Partial<News> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applyingWatermark, setApplyingWatermark] = useState(false);
  const [watermarkApplied, setWatermarkApplied] = useState(false);
  const [breakingNews, setBreakingNews] = useState<string[]>(mockBreakingNews);
  const [breakingDraft, setBreakingDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (filterCategory) params.set("category", filterCategory);

      const r = await fetch(`${API}?${params}`, { headers: headers() });
      if (r.ok) {
        const data = await r.json();
        setNews(data.news || []);
        setTotal(data.total || 0);
      } else {
        // Fallback or empty state if API not ready
        setNews([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, filterCategory]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BREAKING_NEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setBreakingNews(parsed.filter(item => typeof item === "string" && item.trim()));
        }
      }
    } catch (error) {
      console.error("Failed to load breaking news", error);
    }
  }, []);

  const persistBreakingNews = (items: string[]) => {
    setBreakingNews(items);
    localStorage.setItem(BREAKING_NEWS_STORAGE_KEY, JSON.stringify(items));
  };

  const addBreakingNews = (e: React.FormEvent) => {
    e.preventDefault();
    const nextItem = breakingDraft.trim();
    if (!nextItem) return;
    persistBreakingNews([nextItem, ...breakingNews]);
    setBreakingDraft("");
  };

  const removeBreakingNews = (index: number) => {
    persistBreakingNews(breakingNews.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setWatermarkApplied(false);
    try {
      const url = await uploadToCloudinary(file);
      if (editNews) setEditNews({ ...editNews, image: url });
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleApplyWatermark = async () => {
    if (!editNews?.image) return;
    setApplyingWatermark(true);
    try {
      const watermarkedBase64 = await applyLogoWatermark(editNews.image);

      // Convert base64 to File object
      const res = await fetch(watermarkedBase64);
      const blob = await res.blob();
      const file = new File([blob], "watermarked_image.jpg", { type: "image/jpeg" });

      // Upload to Cloudinary/server
      const uploadedUrl = await uploadToCloudinary(file);

      setEditNews({ ...editNews, image: uploadedUrl });
      setWatermarkApplied(true);
    } catch (e) {
      alert("Could not apply watermark and upload. Make sure the image is accessible.");
      console.error(e);
    } finally {
      setApplyingWatermark(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(); };

  const remove = async (id: string) => {
    if (!confirm("Delete this news article?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNews) return;
    setSaving(true);
    try {
      if (isAdding) {
        await fetch(API, { method: "POST", headers: headers(), body: JSON.stringify(editNews) });
      } else {
        await fetch(`${API}/${editNews.id}`, { method: "PUT", headers: headers(), body: JSON.stringify(editNews) });
      }
      setEditNews(null);
      setIsAdding(false);
      load();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditNews({
      title: "",
      category: CATEGORIES[0].value,
      image: "",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: ""
    });
    setIsAdding(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">News Management</h1>
          <span className="text-sm text-foreground/50 font-semibold">{total.toLocaleString()} total articles</span>
        </div>
        <button onClick={openAdd} className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add News
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title..."
              className="pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 w-56" />
          </div>
          <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold">Search</button>
        </form>
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 capitalize">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-secondary">Breaking News Ticker</h2>
            <p className="text-xs text-foreground/50 font-semibold">Add headlines here to show them in the public breaking news bar.</p>
          </div>
          <form onSubmit={addBreakingNews} className="flex gap-2 w-full md:w-auto">
            <input
              value={breakingDraft}
              onChange={e => setBreakingDraft(e.target.value)}
              placeholder="Add breaking news headline..."
              className="flex-1 md:w-80 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
            <button type="submit" className="bg-destructive text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
        </div>
        <div className="divide-y divide-border/50 border rounded-lg overflow-hidden">
          {breakingNews.length === 0 ? (
            <div className="px-4 py-3 text-sm text-foreground/40">No breaking headlines added.</div>
          ) : breakingNews.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-50/60">
              <p className="text-sm font-medium text-secondary">{item}</p>
              <button onClick={() => removeBreakingNews(index)} className="p-1.5 border rounded hover:bg-red-50 text-red-500 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
              <tr>{["Article", "Category", "Date", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-sm text-foreground/40">Loading...</td></tr>
              ) : news.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-sm text-foreground/40">No news found. Create one to get started!</td></tr>
              ) : news.map(n => (
                <tr key={n.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        {n.image ? (
                          <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-secondary text-sm line-clamp-1">{n.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="bg-slate-100 text-secondary text-[10px] font-bold px-2 py-0.5 rounded capitalize">{CATEGORIES.find(c => c.value === n.category)?.label || n.category}</span></td>
                  <td className="px-4 py-3 text-xs text-foreground/50">{n.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditNews(n); setIsAdding(false); }} className="p-1.5 border rounded hover:bg-slate-50"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => remove(n.id)} className="p-1.5 border rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-foreground/50">
          <span>Showing {news.length} of {total.toLocaleString()}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editNews && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={saveEdit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-secondary text-xl">{isAdding ? "Add News" : "Edit News"}</h2>
              <button type="button" onClick={() => { setEditNews(null); setIsAdding(false); }}><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Title</label>
              <input type="text" value={editNews.title || ""} onChange={e => setEditNews({ ...editNews, title: e.target.value })} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Category</label>
                <select value={editNews.category || ""} onChange={e => setEditNews({ ...editNews, category: e.target.value })} required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 capitalize">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Date</label>
                <input type="text" value={editNews.date || ""} onChange={e => setEditNews({ ...editNews, date: e.target.value })} required placeholder="e.g. June 20, 2026"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Image Upload</label>
              <div className="flex items-start gap-4">
                {editNews.image ? (
                  <div className="relative shrink-0">
                    <img src={editNews.image} alt="preview" className="w-28 h-20 rounded-xl object-cover border shadow-sm" />
                    <button
                      type="button"
                      onClick={() => { setEditNews({ ...editNews, image: "" }); setWatermarkApplied(false); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-20 rounded-xl border-2 border-dashed border-border bg-slate-50 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  </div>
                )}
                <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-xl cursor-pointer bg-slate-50 hover:bg-secondary/5 hover:border-secondary transition-colors">
                  {uploading ? (
                    <><Loader2 className="w-5 h-5 text-secondary animate-spin mb-1" /><span className="text-xs font-semibold text-secondary">Uploading...</span></>
                  ) : (
                    <><Upload className="w-5 h-5 text-slate-400 mb-1" /><span className="text-xs font-semibold text-muted-foreground">Click to upload</span><span className="text-[10px] text-muted-foreground">PNG, JPG up to 10MB</span></>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {/* Watermark Button */}
              {editNews.image && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleApplyWatermark}
                    disabled={applyingWatermark || watermarkApplied}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border transition-all ${watermarkApplied
                        ? "bg-success/10 text-success border-success/30 cursor-default"
                        : "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20"
                      } disabled:opacity-60`}
                  >
                    {applyingWatermark ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying Logo...</>
                    ) : watermarkApplied ? (
                      <><Stamp className="w-3.5 h-3.5" /> Logo Applied ✓</>
                    ) : (
                      <><Stamp className="w-3.5 h-3.5" /> Add Logo Watermark (Bottom Right)</>
                    )}
                  </button>
                  {watermarkApplied && (
                    <span className="text-[10px] text-muted-foreground">Logo placed at bottom-right of image</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Content</label>
              <textarea value={editNews.content || ""} onChange={e => setEditNews({ ...editNews, content: e.target.value })} rows={5}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none" />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button type="submit" disabled={uploading || saving} className="flex-1 bg-secondary text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : (isAdding ? "Create News" : "Save Changes")}
              </button>
              <button type="button" onClick={() => { setEditNews(null); setIsAdding(false); }} className="px-6 border rounded-lg text-sm font-semibold">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
