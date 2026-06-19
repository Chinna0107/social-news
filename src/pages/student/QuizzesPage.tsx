import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { studentApi } from "@/utils/api";
import { BookOpen, Lock, CheckCircle, Clock, X, Award, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  _id: string;
  id?: string;
  title: string;
  description: string;
  questions: number;
  score: number | null;
  status: string;
  timeLimit: number;
  questionList: QuizQuestion[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const statusStyle: Record<string, { bg: string; icon: any; color: string; label: string }> = {
  COMPLETED:   { bg: "bg-success/10",    icon: CheckCircle, color: "text-success",    label: "Completed" },
  IN_PROGRESS: { bg: "bg-amber-100",     icon: Clock,       color: "text-amber-600",  label: "In Progress" },
  PENDING:     { bg: "bg-secondary/10",  icon: BookOpen,    color: "text-secondary",  label: "Not Started" },
  LOCKED:      { bg: "bg-slate-200",     icon: Lock,        color: "text-slate-400",  label: "Locked" },
};

export default function QuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/user") ? "/user" : "/student";
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewQuiz, setReviewQuiz] = useState<Quiz | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    studentApi.quizzes()
      .then((data: any) => setQuizzes(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (quiz: Quiz) => {
    if (quiz.status === "LOCKED") return;
    if (quiz.status === "COMPLETED") {
      setReviewLoading(true);
      setReviewQuiz(quiz); // open modal immediately with basic info
      try {
        const full = await studentApi.quiz(quiz._id || quiz.id!);
        const ql = Array.isArray(full?.questionList) ? full.questionList
          : Array.isArray(full?.questions) ? full.questions : [];
        setReviewQuiz({ ...quiz, ...full, questionList: ql });
      } catch { /* show empty state */ }
      finally { setReviewLoading(false); }
      return;
    }
    navigate(`${basePath}/quizzes/${quiz._id || quiz.id}/participate`);
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
          <h1 className="text-3xl font-extrabold tracking-tight">Learning Modules</h1>
          <p className="text-muted-foreground mt-1">Complete quizzes to unlock specialized certificates.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Completed", count: quizzes.filter(q => q.status === "COMPLETED").length, color: "text-success", bg: "bg-success/10" },
            { label: "In Progress", count: quizzes.filter(q => q.status === "IN_PROGRESS").length, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Available", count: quizzes.filter(q => q.status === "PENDING").length, color: "text-secondary", bg: "bg-secondary/10" },
            { label: "Locked", count: quizzes.filter(q => q.status === "LOCKED").length, color: "text-slate-400", bg: "bg-slate-100" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border p-4 shadow-sm">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 animate-pulse space-y-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => {
              const cfg = statusStyle[quiz.status] || statusStyle.PENDING;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={quiz._id || quiz.id}
                  whileHover={quiz.status !== "LOCKED" ? { y: -4 } : {}}
                  className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col transition-all ${
                    quiz.status === "LOCKED" ? "opacity-60 grayscale" : "hover:shadow-lg cursor-pointer"
                  }`}
                  onClick={() => handleAction(quiz)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    {quiz.score != null && (
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-lg ${quiz.score >= 80 ? "bg-success/10 text-success" : "bg-amber-100 text-amber-700"}`}>
                        {quiz.score}%
                      </div>
                    )}
                    {quiz.status !== "LOCKED" && quiz.status !== "COMPLETED" && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2 leading-tight">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-2 flex-1">{quiz.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {quiz.questions} Questions</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {quiz.timeLimit} min</span>
                  </div>

                  {/* Score bar for completed */}
                  {quiz.score != null && (
                    <div className="mb-4">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${quiz.score >= 80 ? "bg-success" : "bg-amber-400"}`}
                          style={{ width: `${quiz.score}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    disabled={quiz.status === "LOCKED"}
                    onClick={e => { e.stopPropagation(); handleAction(quiz); }}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 ${
                      quiz.status === "LOCKED" ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                      quiz.status === "COMPLETED" ? "bg-success/10 text-success hover:bg-success/20" :
                      "bg-secondary text-white hover:bg-destructive"
                    }`}
                  >
                    {quiz.status === "COMPLETED" ? "Review Answers" :
                     quiz.status === "LOCKED" ? "Locked" : "Start Quiz"}
                    {quiz.status !== "LOCKED" && <ChevronRight className="w-4 h-4" />}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewQuiz && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setReviewQuiz(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-x-1/4 md:inset-y-10 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b flex items-start justify-between shrink-0 bg-gradient-to-r from-secondary to-secondary/90 text-white">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Quiz Review</p>
                  <h2 className="text-xl font-extrabold">{reviewQuiz.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Award className="w-4 h-4 text-yellow-400" />
                      Score: {reviewQuiz.score}%
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      (reviewQuiz.score ?? 0) >= 80 ? "bg-success text-white" : "bg-amber-400 text-white"
                    }`}>
                      {(reviewQuiz.score ?? 0) >= 80 ? "Passed" : "Needs Improvement"}
                    </span>
                  </div>
                </div>
                <button onClick={() => setReviewQuiz(null)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Questions */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {reviewLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : !Array.isArray(reviewQuiz.questionList) || reviewQuiz.questionList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">Detailed review not available for this quiz.</p>
                ) : (
                  reviewQuiz.questionList.map((q, idx) => (
                    <div key={q._id} className="bg-slate-50 rounded-2xl p-5 border">
                      <p className="text-sm font-bold text-secondary mb-3">
                        Q{idx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            oi === q.correct
                              ? "bg-success/10 border-success/30 text-success"
                              : "bg-white border-border text-muted-foreground"
                          }`}>
                            {oi === q.correct
                              ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                              : <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                            }
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t shrink-0">
                <button onClick={() => setReviewQuiz(null)} className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-destructive transition-colors">
                  Close Review
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
