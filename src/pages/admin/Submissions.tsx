import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Eye, X, Download, Paperclip, BookOpen, ClipboardList, Award } from "lucide-react";

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/admin";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

export default function AdminSubmissions() {
  const [tab, setTab] = useState<"tasks" | "quizzes">("tasks");

  const [taskSubs, setTaskSubs] = useState<any[]>([]);
  const [quizSubs, setQuizSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [lightbox, setLightbox] = useState("");

  const toArray = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.submissions)) return data.submissions;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const loadTaskSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/submissions`, { headers: headers() });
      const data = await res.json();
      setTaskSubs(toArray(data));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadQuizSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/quiz-submissions`, { headers: headers() });
      const data = await res.json();
      setQuizSubs(toArray(data));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === "tasks") loadTaskSubmissions();
    else loadQuizSubmissions();
  }, [tab]);

  const handleTaskAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(true);
    try {
      const res = await fetch(`${BASE}/submissions/${id}/${action}`, {
        method: "PUT", headers: headers(),
      });
      if (res.ok) {
        setSelected(null);
        loadTaskSubmissions();
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const taskStatusColor: Record<string, string> = {
    SUBMITTED: "bg-blue-100 text-blue-700",
    APPROVED: "bg-success/10 text-success",
    REJECTED: "bg-destructive/10 text-destructive",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
  };

  const scoreColor = (score: number) => score >= 80 ? "text-success" : score >= 50 ? "text-amber-600" : "text-destructive";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Submissions</h1>
        <p className="text-sm text-foreground/60">Review task submissions and quiz results.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1.5 rounded-xl border shadow-sm w-max">
        <button onClick={() => setTab("tasks")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === "tasks" ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
          <ClipboardList className="w-4 h-4" /> Task Submissions
        </button>
        <button onClick={() => setTab("quizzes")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === "quizzes" ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
          <BookOpen className="w-4 h-4" /> Quiz Results
        </button>
      </div>

      {/* Stats row */}
      {tab === "tasks" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: taskSubs.length, color: "text-secondary" },
            { label: "Submitted", value: taskSubs.filter(s => s.status === "SUBMITTED").length, color: "text-blue-600" },
            { label: "Approved", value: taskSubs.filter(s => s.status === "APPROVED").length, color: "text-success" },
            { label: "Rejected", value: taskSubs.filter(s => s.status === "REJECTED").length, color: "text-destructive" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border shadow-sm p-4">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total Attempts", value: quizSubs.length, color: "text-secondary" },
            { label: "Passed (≥70%)", value: quizSubs.filter(s => (s.score || 0) >= 70).length, color: "text-success" },
            { label: "Failed (<70%)", value: quizSubs.filter(s => (s.score || 0) < 70).length, color: "text-destructive" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border shadow-sm p-4">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {tab === "tasks" ? (
              taskSubs.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed p-12 text-center text-foreground/50">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">No task submissions yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-muted-foreground font-semibold border-b">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Task</th>
                        <th className="px-5 py-3">Submitted</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {taskSubs.map(sub => (
                        <tr key={sub.id || sub._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-semibold text-secondary">{sub.user_name || sub.student?.name || "—"}</p>
                              <p className="text-xs text-muted-foreground">{sub.user_email || sub.student?.email || ""}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-medium">
                            <div className="flex items-center gap-2">
                              {sub.submission_image && (
                                <img src={sub.submission_image} alt="" onClick={() => setLightbox(sub.submission_image)} className="w-8 h-8 rounded-lg object-cover border shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity" />
                              )}
                              {sub.task_title || sub.task?.title || "—"}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{sub.submitted_at || sub.submittedAt || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${taskStatusColor[sub.status] || "bg-slate-100 text-slate-500"}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button onClick={() => setSelected({ ...sub, type: "task" })}
                              className="p-1.5 bg-slate-100 text-secondary hover:bg-secondary hover:text-white rounded-md transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              quizSubs.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed p-12 text-center text-foreground/50">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">No quiz results yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-muted-foreground font-semibold border-b">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Quiz</th>
                        <th className="px-5 py-3">Score</th>
                        <th className="px-5 py-3">Result</th>
                        <th className="px-5 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {quizSubs.map(sub => (
                        <tr key={sub.id || sub._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-semibold text-secondary">{sub.user_name || sub.student?.name || "—"}</p>
                              <p className="text-xs text-muted-foreground">{sub.user_email || sub.student?.email || ""}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-medium">{sub.quiz_title || sub.quiz?.title || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`text-lg font-extrabold ${scoreColor(sub.score || 0)}`}>{sub.score ?? "—"}%</span>
                          </td>
                          <td className="px-5 py-3">
                            {(sub.score || 0) >= 70 ? (
                              <span className="flex items-center gap-1 text-success text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Passed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-destructive text-xs font-bold">
                                <XCircle className="w-4 h-4" /> Failed
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{sub.completed_at || sub.submittedAt || sub.createdAt || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Task Submission Detail Drawer */}
      <AnimatePresence>
        {selected?.type === "task" && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">

              <div className="p-6 border-b flex items-start justify-between shrink-0 bg-slate-50">
                <div>
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">Task Submission</p>
                  <h2 className="text-lg font-extrabold text-secondary">{selected.task_title || selected.task?.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{selected.user_name || selected.student?.name}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex gap-3">
                  <div className="flex-1 bg-secondary/5 rounded-xl p-4 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${taskStatusColor[selected.status] || "bg-slate-100 text-slate-500"}`}>
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-4 text-center border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Points</p>
                    <p className="font-extrabold text-secondary flex items-center justify-center gap-1">
                      <Award className="w-4 h-4" /> {selected.task_points || selected.task?.points || selected.points || "—"}
                    </p>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-4 text-center border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Submitted</p>
                    <p className="text-xs font-semibold text-secondary">{selected.submitted_at || selected.submittedAt || selected.createdAt || "—"}</p>
                  </div>
                </div>

                {(selected.submission_note || selected.note) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Student Note</p>
                    <p className="text-sm text-blue-800 leading-relaxed">{selected.submission_note || selected.note}</p>
                  </div>
                )}

                {(selected.submission_image) && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      Submission Image
                    </p>
                    <img
                      src={selected.submission_image}
                      alt="Submission"
                      onClick={() => setLightbox(selected.submission_image)}
                      className="w-full rounded-xl object-cover max-h-72 border shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}

                {(() => {
                  const rawFiles = selected.submission_files;
                  const files = rawFiles
                    ? (typeof rawFiles === 'string' ? JSON.parse(rawFiles) : rawFiles)
                    : selected.files || [];
                  return files.length > 0 ? (
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5" /> Attachments ({files.length})
                      </p>
                      <div className="space-y-2">
                        {files.map((f: any, i: number) => (
                          <a key={i} href={typeof f === 'string' ? `${(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000')}/${f}` : (f.url || f)} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-secondary">
                            <Download className="w-4 h-4" /> {typeof f === 'string' ? f.split('/').pop() : (f.name || `File ${i + 1}`)}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {selected.status === "SUBMITTED" && (
                <div className="p-6 border-t shrink-0 flex gap-3">
                  <button onClick={() => handleTaskAction(selected.id || selected._id, "reject")}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors disabled:opacity-50">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => handleTaskAction(selected.id || selected._id, "approve")}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-success text-white hover:bg-success/90 transition-colors disabled:opacity-50">
                    {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve
                  </button>
                </div>
              )}

              {selected.status === "APPROVED" && (
                <div className="p-6 border-t shrink-0">
                  <div className="flex items-center justify-center gap-2 text-success font-bold py-2">
                    <CheckCircle2 className="w-5 h-5" /> Approved — Points Awarded
                  </div>
                </div>
              )}

              {selected.status === "REJECTED" && (
                <div className="p-6 border-t shrink-0">
                  <div className="flex items-center justify-center gap-2 text-destructive font-bold py-2">
                    <XCircle className="w-5 h-5" /> Submission Rejected
                  </div>
                </div>
              )}
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
    </div>
  );
}
