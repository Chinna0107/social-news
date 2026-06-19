import { useEffect, useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, X, CheckCircle2, HelpCircle, GraduationCap, Clock } from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:5000/api/admin/quizzes";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correct: 0 }]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const url = new URL(API);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", "20");
      if (statusFilter !== "all") url.searchParams.append("status", statusFilter);
      const res = await fetch(url.toString(), { headers: headers() });
      const data = await res.json();
      setQuizzes(data.quizzes || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuizzes(); }, [page, statusFilter]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setStatus("draft");
    setTimeLimit(15);
    setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);
    setEditingQuiz(null);
  };

  const handleOpenModal = (quiz?: any) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setTitle(quiz.title);
      setDescription(quiz.description || "");
      setStatus(quiz.status);
      setTimeLimit(quiz.timeLimit || quiz.time_limit || 15);
      setQuestions(quiz.questions?.length ? quiz.questions : [{ question: "", options: ["", "", "", ""], correct: 0 }]);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const method = editingQuiz ? "PUT" : "POST";
      const url = editingQuiz ? `${API}/${editingQuiz.id}` : API;
      const res = await fetch(url, {
        method, headers: headers(),
        body: JSON.stringify({ title, description, status, timeLimit, questions }),
      });
      if (res.ok) { setModalOpen(false); loadQuizzes(); }
      else alert("Failed to save quiz");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this quiz?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
    loadQuizzes();
  };

  const updateQuestion = (qIndex: number, field: string, value: any, optIndex?: number) => {
    const updated = [...questions];
    if (field === "question") updated[qIndex].question = value;
    if (field === "correct") updated[qIndex].correct = value;
    if (field === "option" && optIndex !== undefined) updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Quiz Management</h1>
          <p className="text-sm text-foreground/60">Create and manage educational quizzes.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-secondary/90 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> Create Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Quizzes", value: total, icon: BookOpen, color: "text-secondary" },
          { label: "Active", value: quizzes.filter(q => q.status === "active").length, icon: CheckCircle2, color: "text-success" },
          { label: "Drafts", value: quizzes.filter(q => q.status === "draft").length, icon: Pencil, color: "text-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-foreground/50">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-xs font-bold uppercase tracking-widest">{s.label}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-secondary">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-xl border shadow-sm w-max">
        {["all", "active", "draft"].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === s ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No quizzes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <motion.div whileHover={{ y: -2 }} key={quiz.id} className="bg-white rounded-xl border shadow-sm p-5 flex flex-col hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-secondary text-lg leading-tight">{quiz.title}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider ${quiz.status === "active" ? "bg-success/10 text-success" : "bg-slate-100 text-slate-500"}`}>
                  {quiz.status}
                </span>
              </div>
              <p className="text-sm text-foreground/60 mb-4 line-clamp-2">{quiz.description}</p>
              <div className="mt-auto pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                    <HelpCircle className="w-3.5 h-3.5" /> {quiz.total_questions || quiz.questions?.length || 0} Questions
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimit || quiz.time_limit || 0} min
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(quiz)} className="p-1.5 bg-slate-100 text-secondary hover:bg-slate-200 rounded-md transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(quiz.id)} className="p-1.5 bg-red-50 text-destructive hover:bg-red-100 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Showing {quizzes.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-lg font-bold text-secondary">{editingQuiz ? "Edit Quiz" : "Create Quiz"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-foreground/50 hover:text-secondary bg-white p-1 rounded-md border shadow-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" placeholder="Quiz title" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Time Limit (minutes)</label>
                  <input type="number" min={1} max={180} value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" placeholder="e.g. 15" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/20" rows={2} placeholder="Brief description" />
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-secondary">Questions</h3>
                  <button onClick={() => setQuestions([...questions, { question: "", options: ["", "", "", ""], correct: 0 }])}
                    className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-secondary px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    <Plus className="w-3 h-3" /> Add Question
                  </button>
                </div>
                <div className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-50 border rounded-xl p-4 relative">
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Q{qIndex + 1}/{questions.length}</span>
                        <button onClick={() => questions.length > 1 && setQuestions(questions.filter((_, i) => i !== qIndex))}
                          className="text-destructive hover:bg-red-100 p-1 rounded transition-colors disabled:opacity-30">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-3 pr-20">
                        <div>
                          <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest mb-1 block">Question</label>
                          <input value={q.question} onChange={e => updateQuestion(qIndex, "question", e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="Enter question..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input type="radio" name={`correct-${qIndex}`} checked={q.correct === oi}
                                onChange={() => updateQuestion(qIndex, "correct", oi)} className="w-4 h-4 text-secondary" />
                              <input value={opt} onChange={e => updateQuestion(qIndex, "option", e.target.value, oi)}
                                className={`w-full border rounded-lg px-3 py-1.5 text-sm outline-none ${q.correct === oi ? "border-success bg-success/5" : ""}`}
                                placeholder={`Option ${String.fromCharCode(65 + oi)}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg font-semibold text-sm border bg-white hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 rounded-lg font-semibold text-sm bg-secondary text-white hover:bg-secondary/90 shadow-md transition-all">Save Quiz</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
