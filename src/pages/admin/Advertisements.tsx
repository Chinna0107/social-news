import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, MapPin, Phone, Tag, Loader2, Upload, Image } from "lucide-react";
import { motion } from "framer-motion";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${BASE}/admin/advertisements`;
const MEDIA_UPLOAD = `${BASE}/media/upload`;

const token = () => localStorage.getItem("token");
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const CATEGORIES = [
  "Services", "Real Estate", "Hotels", "Hospitals", "Function హాల్స్",
  "Packers & Movers", "Travelers", "Job Notifications", "Shopping", "Epaper",
];

const empty = { title: "", category: "Services", description: "", location: "", phone: "", image: "", is_active: true };

export default function AdminAdvertisements() {
  const [ads, setAds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const safeAds = Array.isArray(ads) ? ads : [];

  const load = async () => {
    setLoading(true);
    try {
      const url = new URL(API);
      if (filterCat !== "all") url.searchParams.set("category", filterCat);
      const res = await fetch(url.toString(), { headers: authHeaders() });
      const data = await res.json();
      const list = Array.isArray(data) ? data
        : Array.isArray(data.advertisements) ? data.advertisements
        : Array.isArray(data.data) ? data.data : [];
      setAds(list);
      setTotal(data.total ?? list.length);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterCat]);

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (ad: any) => {
    setForm({ title: ad.title, category: ad.category, description: ad.description || "", location: ad.location || "", phone: ad.phone || "", image: ad.image || "", is_active: ad.is_active });
    setEditId(ad.id);
    setShowForm(true);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(MEDIA_UPLOAD, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm(f => ({ ...f, image: data.url }));
    } catch { alert("Image upload failed"); }
    finally { setUploading(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/${editId}` : API;
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); load(); }
      else alert("Failed to save");
    } finally { setSaving(false); }
  };

  const toggle = async (id: string) => {
    await fetch(`${API}/${id}/toggle`, { method: "PATCH", headers: authHeaders() });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Advertisements</h1>
          <p className="text-sm text-foreground/60">Manage public advertisement listings.</p>
        </div>
        <button onClick={openCreate} className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-secondary/90 shadow-sm transition-all text-sm">
          <Plus className="w-4 h-4" /> Add Advertisement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, color: "text-secondary" },
          { label: "Active", value: safeAds.filter(a => a.is_active).length, color: "text-green-600" },
          { label: "Inactive", value: safeAds.filter(a => !a.is_active).length, color: "text-slate-500" },
          { label: "Categories", value: new Set(safeAds.map(a => a.category)).size, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-xl border shadow-sm">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded-xl border shadow-sm">
        {["all", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCat === c ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-lg font-bold text-secondary">{editId ? "Edit Advertisement" : "New Advertisement"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 border rounded-md hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Image</label>
                <div className="flex items-start gap-4">
                  {form.image ? (
                    <div className="relative shrink-0">
                      <img src={form.image} alt="preview" className="w-24 h-24 rounded-xl object-cover border" />
                      <button type="button" onClick={() => setForm(f => ({ ...f, image: "" }))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border bg-slate-50 flex items-center justify-center shrink-0">
                      <Image className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-xl cursor-pointer bg-slate-50 hover:bg-secondary/5 hover:border-secondary transition-colors">
                    {uploading
                      ? <><Loader2 className="w-5 h-5 text-secondary animate-spin mb-1" /><span className="text-xs font-semibold text-secondary">Uploading...</span></>
                      : <><Upload className="w-5 h-5 text-slate-400 mb-1" /><span className="text-xs font-semibold text-muted-foreground">Click to upload</span></>
                    }
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" placeholder="Business / Ad title" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" placeholder="City / Region" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Active</label>
                  <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    className="flex items-center gap-1 text-sm font-semibold">
                    {form.is_active
                      ? <ToggleRight className="w-6 h-6 text-green-600" />
                      : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                    {form.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20 resize-none"
                    placeholder="Short description of the advertisement..." />
                </div>
              </div>
            </form>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg font-semibold text-sm border bg-white hover:bg-slate-100">Cancel</button>
              <button onClick={save} disabled={saving || uploading}
                className="px-5 py-2 rounded-lg font-semibold text-sm bg-secondary text-white hover:bg-secondary/90 shadow-md disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
        </div>
      ) : safeAds.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed p-12 text-center text-foreground/50">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">No advertisements found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {safeAds.map(ad => (
            <motion.div whileHover={{ y: -2 }} key={ad.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all">
              {ad.image ? (
                <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {ad.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ad.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {ad.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="font-bold text-secondary mb-1">{ad.title}</h3>
                <p className="text-xs text-foreground/60 line-clamp-2 mb-3">{ad.description}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-3">
                  {ad.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ad.location}</span>}
                  {ad.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {ad.phone}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggle(ad.id)}
                    className="flex-1 flex items-center justify-center gap-1 border rounded-lg py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors">
                    {ad.is_active ? <ToggleRight className="w-3.5 h-3.5 text-green-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    {ad.is_active ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => openEdit(ad)} className="p-1.5 border rounded-lg hover:bg-slate-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(ad.id)} className="p-1.5 border rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
