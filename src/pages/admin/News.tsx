import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Plus, Search, X, Image as ImageIcon, Loader2, Upload } from "lucide-react";

interface News {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
  content?: string;
}

const CATEGORIES = ["ap", "ts", "national", "international", "cinema", "sports", "business"];
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (editNews) setEditNews({ ...editNews, image: url });
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
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
    }
  };

  const openAdd = () => {
    setEditNews({
      title: "",
      category: CATEGORIES[0],
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
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
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
                  <td className="px-4 py-3"><span className="bg-slate-100 text-secondary text-[10px] font-bold px-2 py-0.5 rounded capitalize">{n.category}</span></td>
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                      onClick={() => setEditNews({ ...editNews, image: "" })}
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
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Content</label>
              <textarea value={editNews.content || ""} onChange={e => setEditNews({ ...editNews, content: e.target.value })} rows={5}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none" />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button type="submit" disabled={uploading} className="flex-1 bg-secondary text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-60">
                {isAdding ? "Create News" : "Save Changes"}
              </button>
              <button type="button" onClick={() => { setEditNews(null); setIsAdding(false); }} className="px-6 border rounded-lg text-sm font-semibold">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
