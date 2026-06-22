import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, X, Search, Trash2, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/enquiries";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700 border-red-200",
  in_progress: "bg-yellow-100 text-yellow-700 border-yellow-200",
  responded: "bg-blue-100 text-blue-700 border-blue-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [selected, setSelected] = useState<any | null>(null);
  const [replyNote, setReplyNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filterStatus !== "all") params.set("status", filterStatus);
      
      const [r, s] = await Promise.all([
        fetch(`${API}?${params}`, { headers: headers() }),
        fetch(`${API}/stats`, { headers: headers() }),
      ]);
      const data = await r.json();
      const statsData = await s.json();
      setEnquiries(data.enquiries || []);
      setTotal(data.total || 0);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page, filterStatus]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/${id}/status`, { method: "PATCH", headers: headers(), body: JSON.stringify({ status }) });
    loadData();
  };

  const handleOpenModal = (enquiry: any) => {
    setSelected(enquiry);
    setReplyNote(enquiry.admin_note || "");
    setSelectedStatus(enquiry.status);
  };

  const saveReply = async () => {
    if (!selected) return;
    setSaving(true);
    
    try {
      // Update status via the correct PATCH endpoint
      await fetch(`${API}/${selected.id}/status`, { 
        method: "PATCH", 
        headers: headers(), 
        body: JSON.stringify({ status: selectedStatus }) 
      });

      // Update admin note if provided (this also sets status to 'responded' on backend,
      // but we already explicitly set status above)
      if (replyNote.trim()) {
        await fetch(`${API}/${selected.id}/reply`, { 
          method: "PATCH", 
          headers: headers(), 
          body: JSON.stringify({ reply: replyNote }) 
        });
      }

      // If a note was saved, the backend auto-sets status to 'responded'.
      // Re-apply the user's chosen status to ensure it takes precedence.
      if (replyNote.trim() && selectedStatus !== "responded") {
        await fetch(`${API}/${selected.id}/status`, { 
          method: "PATCH", 
          headers: headers(), 
          body: JSON.stringify({ status: selectedStatus }) 
        });
      }
      
      setSelected(null);
      loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
    loadData();
  };

  const filteredEnquiries = enquiries.filter(e => 
    search === "" || 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.email.toLowerCase().includes(search.toLowerCase()) || 
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Enquiry Management</h1>
          <p className="text-sm text-foreground/60">Handle incoming messages and support requests.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search enquiries..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary/20 shadow-sm w-full sm:w-64"
          />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">Total</span>
            <h3 className="text-2xl font-extrabold text-secondary">{parseInt(stats.total) || 0}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm border-b-4 border-b-red-500">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Open</span>
            <h3 className="text-2xl font-extrabold text-red-600">{parseInt(stats.open) || 0}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm border-b-4 border-b-yellow-500">
            <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">In Progress</span>
            <h3 className="text-2xl font-extrabold text-yellow-600">{parseInt(stats.in_progress) || 0}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm border-b-4 border-b-green-500">
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Resolved</span>
            <h3 className="text-2xl font-extrabold text-green-600">{parseInt(stats.resolved) || 0}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm border-b-4 border-b-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Closed</span>
            <h3 className="text-2xl font-extrabold text-slate-600">{parseInt(stats.closed) || 0}</h3>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 bg-white p-2 rounded-xl border shadow-sm w-max">
        {["all", "open", "in_progress", "responded", "resolved", "closed"].map(s => (
          <button 
            key={s} 
            onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              filterStatus === s ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-secondary border-t-transparent rounded-full mx-auto"></div></td></tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-foreground/50 font-semibold">No enquiries found.</td></tr>
              ) : filteredEnquiries.map((e, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={e.id} 
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <p className="font-bold text-secondary text-xs">{e.name}</p>
                    <p className="text-[10px] text-foreground/50">{e.email}</p>
                    {e.phone && <p className="text-[10px] text-foreground/40">{e.phone}</p>}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-semibold text-secondary max-w-[180px] truncate">{e.subject || '—'}</p>
                    {e.admin_note && <p className="text-[9px] text-foreground/40 flex items-center gap-1 mt-0.5"><CheckCircle className="w-3 h-3 text-success" /> Note added</p>}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-foreground/60 max-w-[250px] truncate">{e.message || '—'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <select 
                      value={e.status} 
                      onChange={ev => updateStatus(e.id, ev.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border capitalize outline-none cursor-pointer ${STATUS_COLORS[e.status]}`}
                    >
                      {["open", "in_progress", "responded", "resolved", "closed"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-xs text-foreground/50">
                    {new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(e)}
                        className="p-1.5 bg-slate-100 text-secondary hover:bg-slate-200 rounded-md transition-colors shadow-sm flex items-center gap-1.5 px-2"
                      >
                        <Eye className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">View</span>
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 bg-red-50 text-destructive hover:bg-red-100 rounded-md transition-colors shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">Showing {filteredEnquiries.length} of {total}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border rounded text-xs font-semibold disabled:opacity-50">Prev</button>
              <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border rounded text-xs font-semibold disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Enquiry Details</h2>
              <button onClick={() => setSelected(null)} className="text-foreground/50 hover:text-secondary bg-white p-1 rounded-md border shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div className="bg-slate-50 border rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-secondary">{selected.name}</p>
                    <p className="text-xs text-foreground/50">{selected.email}</p>
                    {selected.phone && <p className="text-xs text-foreground/40 mt-0.5">{selected.phone}</p>}
                  </div>
                  <span className="text-[10px] font-black text-foreground/40 bg-white border px-2 py-1 rounded shadow-sm">
                    {new Date(selected.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-secondary mb-2 border-b pb-2">Subject: {selected.subject || '—'}</h4>
                <p className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-secondary">Update Status:</label>
                  <select 
                    value={selectedStatus} 
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 capitalize"
                  >
                    {["open", "in_progress", "responded", "resolved", "closed"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary block">Internal Note / Response record:</label>
                  <textarea 
                    value={replyNote} 
                    onChange={e => setReplyNote(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary/20 outline-none bg-yellow-50/30" 
                    placeholder="Record your response or internal notes here..." 
                    rows={4} 
                  />
                  <p className="text-[10px] text-foreground/40">These notes are only visible to admins.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-5 py-2 rounded-lg font-semibold text-sm border bg-white hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={saveReply} disabled={saving} className="px-5 py-2 rounded-lg font-semibold text-sm bg-secondary text-white hover:bg-secondary/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
