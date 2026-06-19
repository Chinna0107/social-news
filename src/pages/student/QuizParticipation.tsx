import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { studentApi } from "@/utils/api";
import {
  Clock, ChevronLeft, ChevronRight, CheckCircle2,
  XCircle, Award, ArrowLeft, Flag, BookOpen, BadgeCheck
} from "lucide-react";

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

export default function QuizParticipation() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [certEarned, setCertEarned] = useState(false);

  useEffect(() => {
    studentApi.quiz(quizId!)
      .then(q => {
        setQuiz(q);
        if (q) setTimeLeft(q.timeLimit * 60);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [quizId]);

  const submitQuiz = useCallback(async (ans: Record<number, number>, q: Quiz) => {
    const questionList: QuizQuestion[] = q.questionList || (q as any).questions || [];
    const correct = questionList.filter((item, i) => ans[i] === item.correct).length;
    const pct = questionList.length > 0 ? Math.round((correct / questionList.length) * 100) : 0;
    setScore(pct);
    setFinished(true);
    try {
      const res = await studentApi.submitQuiz(q._id || q.id!, ans, pct);
      if (res?.passed) setCertEarned(true);
    } catch (err) {
      console.error("Failed to save quiz result", err);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!quiz || finished || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); submitQuiz(answers, quiz); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [quiz, finished, timeLeft, answers, submitQuiz]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timeWarning = timeLeft < 60 && timeLeft > 0;

  const select = (qi: number, oi: number) => {
    if (finished) return;
    setAnswers(prev => ({ ...prev, [qi]: oi }));
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/3" />
      <div className="h-64 bg-slate-100 rounded-2xl" />
    </div>
  );

  if (!quiz) return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <p className="text-muted-foreground">Quiz not found.</p>
      <button onClick={() => navigate("/student/quizzes")} className="mt-4 text-secondary font-semibold hover:underline">Back to Quizzes</button>
    </div>
  );

  const qs: QuizQuestion[] = quiz.questionList || (quiz as any).questions || [];

  if (qs.length === 0) return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <p className="text-muted-foreground">No questions available for this quiz.</p>
      <button onClick={() => navigate("/student/quizzes")} className="mt-4 text-secondary font-semibold hover:underline">Back to Quizzes</button>
    </div>
  );

  // ── Results Screen ────────────────────────────────────────────────────────
  if (finished) {
    const passed = score >= 70;
    const correctCount = qs.filter((q, i) => answers[i] === q.correct).length;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl p-8 text-white text-center ${passed ? "bg-gradient-to-br from-success to-emerald-700" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            {passed ? <CheckCircle2 className="w-12 h-12" /> : <Award className="w-12 h-12" />}
          </motion.div>
          <h2 className="text-4xl font-extrabold mb-1">{score}%</h2>
          <p className="text-xl font-bold opacity-90 mb-2">{passed ? "🎉 Quiz Passed!" : "Keep Practicing!"}</p>
          <p className="text-sm opacity-75">{correctCount} of {qs.length} correct answers</p>
        </motion.div>

        {/* Certificate banner when passed */}
        {certEarned && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <BadgeCheck className="w-7 h-7 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-amber-900">🎓 Certificate Earned!</p>
              <p className="text-sm text-amber-700 mt-0.5">Your certificate has been issued. Download and share it now.</p>
            </div>
            <button
              onClick={() => navigate("/student/certificates")}
              className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4" /> View Certificate
            </button>
          </motion.div>
        )}

        {/* Answer review */}
        <div className="space-y-4">
          <h3 className="font-bold text-secondary text-lg">Answer Review</h3>
          {qs.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.correct;
            return (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border shadow-sm p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <p className="text-sm font-bold text-secondary">Q{i + 1}. {q.question}</p>
                </div>
                <div className="ml-10 space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`px-3 py-2 rounded-xl text-sm border ${
                      oi === q.correct ? "bg-success/10 border-success/30 text-success font-semibold" :
                      oi === userAns && !isCorrect ? "bg-destructive/10 border-destructive/30 text-destructive" :
                      "border-transparent text-muted-foreground"
                    }`}>
                      {oi === q.correct && "✓ "}{oi === userAns && !isCorrect && "✗ "}{opt}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate("/student/quizzes")} className="flex-1 bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Quizzes
          </button>
          {!passed && (
            <button onClick={() => { setFinished(false); setCurrent(0); setAnswers({}); setTimeLeft(quiz.timeLimit * 60); }}
              className="flex-1 bg-white border py-3.5 rounded-xl font-bold text-secondary hover:bg-slate-50 transition-colors">
              Retry Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Quiz Screen ────────────────────────────────────────────────────────────
  const q = qs[current];
  const progress = ((current + 1) / qs.length) * 100;
  const answered = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/student/quizzes")} className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Exit Quiz
        </button>
        <div className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl ${timeWarning ? "bg-destructive/10 text-destructive animate-pulse" : "bg-slate-100 text-secondary"}`}>
          <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Quiz header */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex justify-between items-center mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {quiz.title}</span>
          <span>Q {current + 1} of {qs.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-secondary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >
          <p className="text-base font-bold text-secondary mb-6 leading-relaxed">
            <span className="text-destructive mr-2">Q{current + 1}.</span>{q.question}
          </p>
          <div className="space-y-3">
            {q.options.map((opt, oi) => {
              const selected = answers[current] === oi;
              return (
                <motion.button
                  key={oi}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => select(current, oi)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    selected
                      ? "bg-secondary text-white border-secondary shadow-md"
                      : "bg-slate-50 text-foreground border-border hover:border-secondary/40 hover:bg-secondary/5"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 ${
                    selected ? "border-white text-white" : "border-border text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                  {selected && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrent(p => Math.max(0, p - 1))}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl border font-bold text-sm text-secondary hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Question dots */}
        <div className="flex gap-1.5 flex-wrap justify-center flex-1">
          {qs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-full text-[10px] font-bold transition-all ${
                i === current ? "bg-secondary text-white scale-110" :
                answers[i] !== undefined ? "bg-secondary/20 text-secondary" :
                "bg-slate-100 text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < qs.length - 1 ? (
          <button
            onClick={() => setCurrent(p => p + 1)}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-secondary text-white font-bold text-sm hover:bg-secondary/90 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => submitQuiz(answers, quiz)}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-destructive text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-md"
          >
            <Flag className="w-4 h-4" />
            Submit ({answered}/{qs.length})
          </button>
        )}
      </div>
    </div>
  );
}
