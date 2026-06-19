import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, ClipboardList, Clock, Award, Upload, Image, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/admin/tasks";
const token = () => localStorage.getItem("token");
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const PRIORITIES = ["Low", "Medium", "High"];

const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/media/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [points, setPoints] = useState(100);
  const [dueDate, setDueDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const url = new URL(API);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", "20");
      if (priorityFilter !== "all") url.searchParams.append("priority", priorityFilter);
      const res = await fetch(url.toString(), { headers: authHeaders() });
      const data = await res.json();
      setTasks(data.tasks || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, [page, priorityFilter]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setInstructions("");
    setPriority("Medium"); setPoints(100); setDueDate(""); setImageUrl("");
    setEditingTask(null);
  };

  const handleOpenModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title); setDescription(task.description || "");
      setInstructions(task.instructions || ""); setPriority(task.priority || "Medium");
      setPoints(task.points || 100); setDueDate(task.dueDate || task.due_date || "");
      setImageUrl(task.image || task.imageUrl || "");
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required");
    try {
      const method = editingTask ? "PUT" : "POST";
      const url = editingTask ? `${API}/${editingTask.id}` : API;
      const res = await fetch(url, {
        method, headers: authHeaders(),
        body: JSON.stringify({ title, description, instructions, priority, points, dueDate, imageUrl }),
      });
      if (res.ok) { setModalOpen(false); loadTasks(); }
      else alert("Failed to save task");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
    loadTasks();
  };

  const priorityColor: Record<string, string> = {
    High: "bg-destructive/10 text-destructive",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Task Management</h1>
          <p className="text-sm text-foreground/60">Create and assign tasks to students.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-secondary/90 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, color: "text-secondary" },
          { label: "High Priority", value: tasks.filter(t => t.priority === "High").length, color: "text-destructive" },
          { label: "Medium", value: tasks.filter(t => t.priority === "Medium").length, color: "text-amber-600" },
          { label: "Low", value: tasks.filter(t => t.priority === "Low").length, color: "text-slate-500" },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-xl border shadow-sm">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-white p-2 rounded-xl border shadow-sm w-max">
        {["all", ...PRIORITIES].map(p => (
          <button key={p} onClick={() => { setPriorityFilter(p); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${priorityFilter === p ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
            {p}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">No tasks found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <motion.div whileHover={{ x: 2 }} key={task.id} className="bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-all">
              {task.image || task.imageUrl ? (
                <img src={task.image || task.imageUrl} alt={task.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-secondary">{task.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priorityColor[task.priority] || "bg-slate-100 text-slate-500"}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-foreground/60 line-clamp-1 mb-2">{task.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {task.points} pts</span>
                  {(task.dueDate || task.due_date) && (
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Due {task.dueDate || task.due_date}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleOpenModal(task)} className="p-1.5 bg-slate-100 text-secondary hover:bg-slate-200 rounded-md transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(task.id)} className="p-1.5 bg-red-50 text-destructive hover:bg-red-100 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Showing {tasks.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-lg font-bold text-secondary">{editingTask ? "Edit Task" : "Create Task"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-foreground/50 hover:text-secondary bg-white p-1 rounded-md border shadow-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Task Image (Cloudinary)</label>
                <div className="flex items-start gap-4">
                  {imageUrl ? (
                    <div className="relative shrink-0">
                      <img src={imageUrl} alt="preview" className="w-24 h-24 rounded-xl object-cover border" />
                      <button onClick={() => setImageUrl("")} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border bg-slate-50 flex items-center justify-center shrink-0">
                      <Image className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-xl cursor-pointer bg-slate-50 hover:bg-secondary/5 hover:border-secondary transition-colors">
                      {uploading ? (
                        <><Loader2 className="w-5 h-5 text-secondary animate-spin mb-1" /><span className="text-xs font-semibold text-secondary">Uploading...</span></>
                      ) : (
                        <><Upload className="w-5 h-5 text-slate-400 mb-1" /><span className="text-xs font-semibold text-muted-foreground">Click to upload</span><span className="text-[10px] text-muted-foreground">PNG, JPG up to 10MB</span></>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" placeholder="Task title" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20">
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Points</label>
                  <input type="number" min={0} value={points} onChange={e => setPoints(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20 resize-none" placeholder="Short description" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Instructions</label>
                  <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20 resize-none" placeholder="Detailed instructions for students..." />
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg font-semibold text-sm border bg-white hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={uploading} className="px-5 py-2 rounded-lg font-semibold text-sm bg-secondary text-white hover:bg-secondary/90 shadow-md transition-all disabled:opacity-60">
                Save Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
