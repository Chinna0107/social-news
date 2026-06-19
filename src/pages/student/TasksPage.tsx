import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { studentApi } from "@/utils/api";
import {
  CheckCircle2, Circle, Clock, Send, Award,
  ChevronRight, X, Calendar, FileText, Paperclip,
  Image, Loader2, ArrowRight
} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  points: number;
  dueDate?: string;
  instructions?: string;
  image?: string;
  attachments?: { name: string; url: string }[];
  submittedNote?: string;
  approvedNote?: string;
  submissionImage?: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STATUS_TABS = ["ALL", "PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED"];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:     { label: "Pending",     color: "text-slate-500",  bg: "bg-slate-100",   icon: Circle },
  IN_PROGRESS: { label: "In Progress", color: "text-amber-600",  bg: "bg-amber-100",   icon: Clock },
  SUBMITTED:   { label: "Submitted",   color: "text-blue-600",   bg: "bg-blue-100",    icon: Send },
  APPROVED:    { label: "Approved",    color: "text-success",    bg: "bg-success/10",  icon: CheckCircle2 },
};

const priorityConfig: Record<string, string> = {
  High:   "bg-destructive/10 text-destructive",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-slate-100 text-slate-500",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selected, setSelected] = useState<Task | null>(null);

  // submission state
  const [showSubmit, setShowSubmit] = useState(false);
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [lightbox, setLightbox] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    studentApi.tasks()
      .then(data => {
        // Backend returns assignment_status from the JOIN, map it to status
        const mapped = (Array.isArray(data) ? data : []).map((t: any) => ({
          ...t,
          _id: t._id || t.id,
          status: t.assignment_status || 'PENDING',
          submittedNote: t.submission_note,
          submissionImage: t.submission_image,
          dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined,
        }));
        setTasks(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "ALL" ? tasks : tasks.filter(t => t.status === activeTab);
  const counts = STATUS_TABS.reduce((acc, s) => {
    acc[s] = s === "ALL" ? tasks.length : tasks.filter(t => t.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const openDrawer = (task: Task) => {
    setSelected(task);
    setShowSubmit(false);
    setNote("");
    setImageFile(null);
    setImagePreview("");
    setSubmitDone(false);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selected || (!note.trim() && !imageFile)) return;
    setSubmitting(true);
    try {
      let uploadedImageUrl = "";

      // Upload image to backend → Cloudinary
      if (imageFile) {
        setUploading(true);
        const form = new FormData();
        form.append("file", imageFile);
        const token = localStorage.getItem("token");
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/media/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await res.json();
        uploadedImageUrl = data.url || "";
        setUploading(false);
      }

      // Submit task
      const formData = new FormData();
      formData.append("note", note);
      if (uploadedImageUrl) formData.append("imageUrl", uploadedImageUrl);
      await studentApi.submitTask(selected._id, formData);

      // Update local state
      setTasks(prev => prev.map(t =>
        t._id === selected._id ? { ...t, status: "SUBMITTED", submittedNote: note, submissionImage: uploadedImageUrl } : t
      ));
      setSelected(prev => prev ? { ...prev, status: "SUBMITTED", submittedNote: note, submissionImage: uploadedImageUrl } : prev);
      setSubmitDone(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <>
      <motion.div
        initial="hidden" animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Tasks</h1>
          <p className="text-muted-foreground mt-1">Complete assignments to earn impact points and level up.</p>
        </motion.div>

        {/* Stats strip */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className="rounded-2xl border p-4 flex items-center gap-3 bg-white shadow-sm">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-secondary">{counts[key] ?? 0}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeTab === tab
                  ? "bg-secondary text-white border-secondary shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:border-secondary/40"
              }`}
            >
              {tab.replace("_", " ")}{counts[tab] > 0 && <span className="ml-1 opacity-70">({counts[tab]})</span>}
            </button>
          ))}
        </motion.div>

        {/* Task List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div variants={fadeUp} className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map(task => {
                const cfg = statusConfig[task.status];
                const Icon = cfg?.icon || Circle;
                return (
                  <motion.div
                    key={task._id} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                    className="bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => openDrawer(task)}
                  >
                    {task.image ? (
                      <img src={task.image} alt={task.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border" />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg?.bg}`}>
                        <Icon className={`w-5 h-5 ${cfg?.color}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-base text-secondary group-hover:text-destructive transition-colors">{task.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priorityConfig[task.priority] || "bg-slate-100 text-slate-500"}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{task.description}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold text-secondary bg-secondary/5 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Award className="w-3 h-3" /> +{task.points} Points
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${cfg?.bg} ${cfg?.color}`}>{cfg?.label}</span>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Due {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={e => { e.stopPropagation(); openDrawer(task); }}
                      className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shrink-0 ${
                        task.status === "PENDING" || task.status === "IN_PROGRESS"
                          ? "bg-secondary text-white hover:bg-destructive"
                          : task.status === "APPROVED"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-slate-100 text-secondary hover:bg-secondary hover:text-white"
                      }`}
                    >
                      {task.status === "PENDING" ? "Start" : task.status === "IN_PROGRESS" ? "Submit" : "View"}
                      <ChevronRight className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Circle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No tasks in this category</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Task Detail / Submit Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between p-6 border-b shrink-0">
                <div className="flex-1 pr-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priorityConfig[selected.priority]}`}>
                      {selected.priority}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusConfig[selected.status]?.bg} ${statusConfig[selected.status]?.color}`}>
                      {statusConfig[selected.status]?.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-secondary leading-tight">{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">

                {!showSubmit ? (
                  <>
                    {/* Points & Due */}
                    <div className="flex gap-3">
                      <div className="flex-1 bg-secondary/5 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-secondary">+{selected.points}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Impact Points</p>
                      </div>
                      {selected.dueDate && (
                        <div className="flex-1 bg-slate-50 rounded-2xl p-4 text-center border">
                          <p className="text-sm font-extrabold text-secondary">{selected.dueDate}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Due Date</p>
                        </div>
                      )}
                    </div>

                    {/* Task image from admin */}
                    {selected.image && (
                      <img src={selected.image} alt={selected.title} onClick={() => setLightbox(selected.image!)} className="w-full rounded-2xl object-cover max-h-48 border cursor-zoom-in hover:opacity-90 transition-opacity" />
                    )}

                    {/* Description */}
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                      <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
                    </div>

                    {/* Instructions */}
                    {selected.instructions && (
                      <div className="bg-slate-50 rounded-2xl p-4 border">
                        <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Instructions
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">{selected.instructions}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {selected.attachments && selected.attachments.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5" /> Attachments
                        </p>
                        {selected.attachments.map(a => (
                          <a key={a.name} href={a.url} className="flex items-center gap-2 text-sm text-secondary hover:text-destructive transition-colors font-medium">
                            <Paperclip className="w-4 h-4" /> {a.name}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Submitted note + image */}
                    {selected.status === "SUBMITTED" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Your Submission</p>
                        {selected.submittedNote && <p className="text-sm text-blue-800">{selected.submittedNote}</p>}
                        {selected.submissionImage && (
                          <img src={selected.submissionImage} alt="Submission" onClick={() => setLightbox(selected.submissionImage!)} className="w-full rounded-xl object-cover max-h-48 border border-blue-200 cursor-zoom-in hover:opacity-90 transition-opacity" />
                        )}
                      </div>
                    )}

                    {/* Approved note */}
                    {selected.status === "APPROVED" && selected.approvedNote && (
                      <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
                        <p className="text-xs font-bold text-success uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reviewer Feedback
                        </p>
                        <p className="text-sm text-success">{selected.approvedNote}</p>
                      </div>
                    )}
                  </>
                ) : (
                  /* ── Submission Form ── */
                  submitDone ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                      </motion.div>
                      <h3 className="text-2xl font-extrabold text-secondary mb-2">Submitted!</h3>
                      <p className="text-sm text-muted-foreground">Awaiting review. You'll earn <span className="font-bold text-secondary">+{selected.points} pts</span> once approved.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Task</p>
                        <p className="font-semibold text-secondary">{selected.title}</p>
                      </div>

                      {/* Description field */}
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">
                          Description / Notes <span className="text-destructive">*</span>
                        </label>
                        <textarea
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          placeholder="Describe what you did, key highlights, challenges faced..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">{note.length} / 1000</p>
                      </div>

                      {/* Image upload */}
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">
                          Submission Image
                        </label>
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="preview" onClick={() => setLightbox(imagePreview)} className="w-full rounded-2xl object-cover max-h-52 border cursor-zoom-in hover:opacity-90 transition-opacity" />
                            <button
                              type="button"
                              onClick={() => { setImageFile(null); setImagePreview(""); }}
                              className="absolute top-2 right-2 w-7 h-7 bg-destructive text-white rounded-full flex items-center justify-center shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-secondary rounded-2xl cursor-pointer bg-slate-50 hover:bg-secondary/5 transition-colors">
                            <Image className="w-7 h-7 text-muted-foreground mb-1" />
                            <p className="text-sm font-semibold text-muted-foreground">Click to upload image</p>
                            <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG up to 10MB</p>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                          </label>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t shrink-0 space-y-3">
                {!showSubmit ? (
                  <>
                    {(selected.status === "PENDING" || selected.status === "IN_PROGRESS") && (
                      <button
                        onClick={() => setShowSubmit(true)}
                        className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-destructive transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        <Send className="w-4 h-4" /> Submit Task <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {selected.status === "APPROVED" && (
                      <div className="flex items-center justify-center gap-2 text-success font-bold py-2">
                        <CheckCircle2 className="w-5 h-5" /> Task Completed — Points Awarded!
                      </div>
                    )}
                    <button onClick={() => setSelected(null)} className="w-full bg-slate-100 text-secondary py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm">
                      Close
                    </button>
                  </>
                ) : submitDone ? (
                  <button onClick={() => setSelected(null)} className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-secondary/90 transition-colors">
                    Done
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSubmit(false)}
                      className="flex-1 bg-slate-100 text-secondary py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || (!note.trim() && !imageFile)}
                      className="flex-1 bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-destructive transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? "Uploading..." : "Submitting..."}</>
                      ) : (
                        <><Send className="w-4 h-4" /> Submit</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox("")}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button onClick={() => setLightbox("")} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              src={lightbox}
              alt="Full view"
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
