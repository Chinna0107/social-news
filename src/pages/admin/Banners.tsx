import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image, Loader2 } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
  position: string;
  is_active: boolean;
  created_at: string;
}

const POSITIONS = ["header", "sidebar", "footer", "popup", "inline"];
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/banners";
const token = () => localStorage.getItem("token");

const empty = { title: "", image: "", link: "", position: "header" };

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterPos, setFilterPos] = useState("");

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token()}` };

  const load = async () => {
    setLoading(true);
    const r = await fetch(API, { headers });
    const data = await r.json();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/${editId}` : API;
      await fetch(url, { method, headers, body: JSON.stringify(form) });
      setForm(empty); setEditId(null); setShowForm(false); load();
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id: number) => {
    await fetch(`${API}/${id}/toggle`, { method: "PATCH", headers });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers });
    load();
  };

  const edit = (b: Banner) => {
    setForm({ title: b.title, image: b.image, link: b.link, position: b.position });
    setEditId(b.id); setShowForm(true);
  };

  const filtered = filterPos ? banners.filter(b => b.position === filterPos) : banners;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Banner Management</h1>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl border shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full font-bold text-secondary">{editId ? "Edit Banner" : "New Banner"}</h2>
          <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
          <input required placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
          <input placeholder="Link URL" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20">
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="col-span-full flex gap-3">
            <button type="submit" disabled={saving} className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-center min-w-[100px] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editId ? "Update" : "Create")}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterPos("")} className={`px-3 py-1 rounded-full text-xs font-semibold border ${!filterPos ? "bg-secondary text-white" : "bg-white"}`}>All</button>
        {POSITIONS.map(p => (
          <button key={p} onClick={() => setFilterPos(p)} className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${filterPos === p ? "bg-secondary text-white" : "bg-white"}`}>{p}</button>
        ))}
      </div>

      {loading ? <p className="text-sm text-foreground/50">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {b.image ? (
                <img src={b.image} alt={b.title} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-slate-100 flex items-center justify-center"><Image className="w-8 h-8 text-slate-300" /></div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-secondary text-sm">{b.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {b.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 capitalize mb-1">Position: {b.position}</p>
                {b.link && <a href={b.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{b.link}</a>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => toggle(b.id)} className="flex-1 flex items-center justify-center gap-1 border rounded-lg py-1.5 text-xs font-semibold hover:bg-slate-50">
                    {b.is_active ? <ToggleRight className="w-3.5 h-3.5 text-green-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    {b.is_active ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => edit(b)} className="p-1.5 border rounded-lg hover:bg-slate-50"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(b.id)} className="p-1.5 border rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="col-span-full text-sm text-foreground/50 text-center py-8">No banners found.</p>}
        </div>
      )}
    </div>
  );
}
