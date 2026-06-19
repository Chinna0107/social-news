import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Eye, MousePointer, BarChart2 } from "lucide-react";

interface AdUnit {
  id: number;
  label: string;
  slot: string;
  client_id: string;
  ad_format: string;
  position: string;
  custom_html: string;
  impressions: number;
  clicks: number;
  ctr: number;
  is_active: boolean;
  created_at: string;
}

interface Stats {
  total_impressions: string;
  total_clicks: string;
  ctr: string;
  total_units: string;
  active_units: string;
}

const FORMATS = ["auto", "rectangle", "horizontal", "vertical", "in-article", "in-feed"];
const POSITIONS = ["sidebar", "header", "footer", "inline", "popup"];
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/adsense";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const empty = { label: "", slot: "", client_id: "", ad_format: "auto", position: "sidebar", custom_html: "" };

export default function AdminAdsense() {
  const [units, setUnits] = useState<AdUnit[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([
      fetch(API, { headers: headers() }),
      fetch(`${API}/stats`, { headers: headers() }),
    ]);
    setUnits(await r.json());
    setStats(await s.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;
    await fetch(url, { method, headers: headers(), body: JSON.stringify(form) });
    setForm(empty); setEditId(null); setShowForm(false); load();
  };

  const toggle = async (id: number) => {
    await fetch(`${API}/${id}/toggle`, { method: "PATCH", headers: headers() });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this ad unit?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
    load();
  };

  const edit = (u: AdUnit) => {
    setForm({ label: u.label, slot: u.slot, client_id: u.client_id, ad_format: u.ad_format, position: u.position, custom_html: u.custom_html || "" });
    setEditId(u.id); setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Google AdSense Management</h1>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Ad Unit
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Units", value: stats.total_units, icon: BarChart2 },
            { label: "Active", value: stats.active_units, icon: BarChart2 },
            { label: "Impressions", value: Number(stats.total_impressions).toLocaleString(), icon: Eye },
            { label: "Clicks", value: Number(stats.total_clicks).toLocaleString(), icon: MousePointer },
            { label: "CTR", value: `${stats.ctr}%`, icon: BarChart2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border shadow-sm p-4">
              <Icon className="w-4 h-4 mb-2 text-secondary/60" />
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{label}</p>
              <p className="text-xl font-extrabold text-secondary">{value}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl border shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full font-bold text-secondary">{editId ? "Edit Ad Unit" : "New Ad Unit"}</h2>
          {[
            { key: "label", placeholder: "Label (e.g. Sidebar Leaderboard)" },
            { key: "slot", placeholder: "Ad Slot ID" },
            { key: "client_id", placeholder: "AdSense Client ID (ca-pub-xxx)" },
          ].map(({ key, placeholder }) => (
            <input key={key} placeholder={placeholder} value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
          ))}
          <select value={form.ad_format} onChange={e => setForm({ ...form, ad_format: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20">
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20">
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <textarea rows={3} placeholder="Custom HTML (optional)" value={form.custom_html}
            onChange={e => setForm({ ...form, custom_html: e.target.value })}
            className="col-span-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-mono" />
          <div className="col-span-full flex gap-3">
            <button type="submit" className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-semibold">{editId ? "Update" : "Create"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-sm text-foreground/50">Loading...</p> : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
              <tr>{["Label", "Slot", "Format", "Position", "Impressions", "Clicks", "CTR", "Status", "Actions"].map(h =>
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {units.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-secondary text-xs">{u.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/50">{u.slot || "—"}</td>
                  <td className="px-4 py-3 text-xs capitalize">{u.ad_format}</td>
                  <td className="px-4 py-3 text-xs capitalize">{u.position}</td>
                  <td className="px-4 py-3 text-xs">{u.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{u.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{u.ctr}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {u.is_active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => toggle(u.id)} title="Toggle" className="p-1.5 border rounded hover:bg-slate-50">
                      {u.is_active ? <ToggleRight className="w-3.5 h-3.5 text-green-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => edit(u)} className="p-1.5 border rounded hover:bg-slate-50"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(u.id)} className="p-1.5 border rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
              {units.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-sm text-foreground/40">No ad units found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
