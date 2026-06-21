import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Image, Upload, Loader2, Megaphone, Users, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  collected: number;
  entry_fee?: number;
  tag: string;
  status: string;
  created_at: string;
}

interface Participant {
  joined_at: string;
  id: string;
  name: string;
  email: string;
  student_id: string;
  phone: string;
}

const STATUS_OPTIONS = ["active", "inactive", "completed"];
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/admin/campaigns";
const UPLOAD_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/media/upload";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });
const emptyForm = { title: "", description: "", image: "", goal: "", entry_fee: "", tag: "", status: "active" };

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

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filterStatus) params.set("status", filterStatus);
    const r = await fetch(`${API}?${params}`, { headers: headers() });
    const data = await r.json();
    setCampaigns(data.campaigns || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(f => ({ ...f, image: url }));
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;
    await fetch(url, {
      method,
      headers: headers(),
      body: JSON.stringify({ ...form, goal: parseFloat(form.goal as string), entry_fee: parseFloat(form.entry_fee as string) || 0 }),
    });
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setSaving(false);
    load();
  };

  const edit = (c: Campaign) => {
    setForm({ title: c.title, description: c.description || "", image: c.image || "", goal: String(c.goal), entry_fee: String(c.entry_fee || 0), tag: c.tag || "", status: c.status });
    setEditId(c.id);
    setShowForm(true);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
    load();
  };

  const viewParticipants = async (c: Campaign) => {
    setViewingCampaign(c);
    setParticipantsLoading(true);
    try {
      const res = await fetch(`${API}/${c.id}/participants`, { headers: headers() });
      if (res.ok) {
        setParticipants(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const exportParticipantsPDF = () => {
    if (!viewingCampaign || participants.length === 0) return;
    const doc = new jsPDF();
    doc.text(`Participants: ${viewingCampaign.title}`, 14, 15);
    const tableColumn = ["Name", "Email", "Phone", "Student ID", "Joined At"];
    const tableRows = participants.map(p => [
      p.name, p.email, p.phone || "-", p.student_id || "-", new Date(p.joined_at).toLocaleDateString()
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`participants_${viewingCampaign.id}.pdf`);
  };

  const exportParticipantsExcel = () => {
    if (!viewingCampaign || participants.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(participants.map(p => ({
      Name: p.name,
      Email: p.email,
      Phone: p.phone || "",
      "Student ID": p.student_id || "",
      "Joined At": new Date(p.joined_at).toLocaleDateString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, `participants_${viewingCampaign.id}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Campaign Management</h1>
          <p className="text-sm text-foreground/60">Create and manage social impact campaigns.</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="bg-secondary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-secondary/90 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="p-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-lg font-bold text-secondary">{editId ? "Edit Campaign" : "New Campaign"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={save} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Campaign Image</label>
                <div className="flex items-start gap-4">
                  {form.image ? (
                    <div className="relative shrink-0">
                      <img src={form.image} alt="preview" className="w-28 h-20 rounded-xl object-cover border shadow-sm" />
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, image: "" }))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-20 rounded-xl border-2 border-dashed border-border bg-slate-50 flex items-center justify-center shrink-0">
                      <Image className="w-6 h-6 text-slate-300" />
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

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Campaign title" className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Goal (₹) *</label>
                  <input required type="number" min="0" step="0.01" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                    placeholder="100000" className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Entry Fee (₹)</label>
                  <input type="number" min="0" step="0.01" value={form.entry_fee} onChange={e => setForm(f => ({ ...f, entry_fee: e.target.value }))}
                    placeholder="0 for free" className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Tag</label>
                  <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                    placeholder="e.g. Environment, Education" className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
                </div>
                {editId && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the campaign's purpose and goals..."
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 resize-none" />
                </div>
              </div>
            </form>

            <div className="p-4 border-t bg-slate-50 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl font-semibold text-sm border bg-white hover:bg-slate-100 transition-colors">Cancel</button>
              <button
                onClick={save as any}
                disabled={saving || uploading || !form.title}
                className="px-5 py-2 rounded-xl font-semibold text-sm bg-secondary text-white hover:bg-secondary/90 shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Update" : "Create"} Campaign
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Participants Modal */}
      <AnimatePresence>
        {viewingCampaign && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 flex justify-between items-center border-b bg-slate-50">
                <div>
                  <h2 className="text-lg font-bold text-secondary">Participants</h2>
                  <p className="text-xs text-muted-foreground">{viewingCampaign.title}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={exportParticipantsPDF} className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                  <button onClick={exportParticipantsExcel} className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors">
                    <Download className="w-3 h-3" /> Excel
                  </button>
                  <button onClick={() => setViewingCampaign(null)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors ml-2">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-0">
                {participantsLoading ? (
                  <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-secondary" /></div>
                ) : participants.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No participants yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 sticky top-0 text-xs text-foreground/60">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Name</th>
                        <th className="px-6 py-3 font-semibold">Contact</th>
                        <th className="px-6 py-3 font-semibold">Student ID</th>
                        <th className="px-6 py-3 font-semibold">Joined At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {participants.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium">{p.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span>{p.email}</span>
                              <span className="text-xs text-muted-foreground">{p.phone || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono">{p.student_id || '-'}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(p.joined_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["", ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize transition-all ${filterStatus === s ? "bg-secondary text-white border-secondary" : "bg-white text-foreground/60 hover:border-secondary/40"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed p-12 text-center text-foreground/50">
          <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">No campaigns found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map(c => {
            const pct = c.goal > 0 ? Math.min(Math.round((c.collected / c.goal) * 100), 100) : 0;
            return (
              <motion.div key={c.id} whileHover={{ y: -3 }} className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-lg transition-all">
                {/* Image */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {c.image ? (
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Megaphone className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full capitalize shadow-sm ${c.status === "active" ? "bg-green-500 text-white" : "bg-slate-700 text-white"}`}>
                      {c.status}
                    </span>
                  </div>
                  {c.tag && (
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold bg-white/90 text-secondary px-2 py-1 rounded-full">{c.tag}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-secondary text-sm line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-foreground/60 line-clamp-2">{c.description}</p>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-foreground/50 mb-1">
                      <span>{c.entry_fee && Number(c.entry_fee) > 0 ? `Entry: ₹${Number(c.entry_fee)}` : "Free to Join"}</span>
                      <span>{pct}% of ₹{parseFloat(String(c.goal)).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-destructive h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={() => viewParticipants(c)} className="flex-1 flex items-center justify-center gap-1.5 border rounded-xl py-2 text-xs font-semibold hover:bg-slate-50 transition-colors">
                      <Users className="w-3 h-3" /> Participants
                    </button>
                    <button onClick={() => edit(c)} className="flex items-center justify-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => remove(c.id)} className="p-2 border rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-foreground/50">
        <span>Showing {campaigns.length} of {total}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-xl font-semibold hover:bg-slate-50 disabled:opacity-40">Prev</button>
          <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-xl font-semibold hover:bg-slate-50 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
