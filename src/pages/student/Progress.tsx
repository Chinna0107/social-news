import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { studentApi } from "@/utils/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Award, BookOpen, ClipboardList, CheckCircle2 } from "lucide-react";

interface ProgressData {
  completionRate: number;
  quizAvg: number;
  totalPoints: number;
  tasksCompleted: number;
  quizzesCompleted: number;
  certificatesEarned: number;
  performanceData: { name: string; score: number }[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Progress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.progress()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Completion Rate", value: `${data?.completionRate ?? 0}%`, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Quiz Average", value: `${data?.quizAvg ?? 0}%`, icon: BookOpen, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Tasks Done", value: data?.tasksCompleted ?? 0, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Certificates", value: data?.certificatesEarned ?? 0, icon: Award, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <motion.div
      initial="hidden" animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-extrabold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground mt-1">Track your learning journey and performance over time.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-4 animate-pulse space-y-2">
              <div className="w-9 h-9 bg-slate-200 rounded-xl" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border shadow-sm p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </motion.div>

          {data?.performanceData && data.performanceData.length > 0 && (
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
              <h3 className="font-bold text-secondary mb-1">Quiz Performance</h3>
              <p className="text-xs text-muted-foreground mb-4">Your scores across completed modules</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748B", fontWeight: 600 }} dy={8} />
                    <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                    <Line type="monotone" dataKey="score" stroke="#E30613" strokeWidth={3}
                      dot={{ r: 4, fill: "#E30613", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 7, strokeWidth: 0, fill: "#FF8B8B" }} animationDuration={1500} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-4">Impact Points</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-secondary">{(data?.totalPoints ?? 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total impact points earned</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
