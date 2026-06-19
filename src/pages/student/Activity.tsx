import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { studentApi } from "@/utils/api";
import { Award, CheckCircle2, BookOpen, ClipboardList, Megaphone } from "lucide-react";

interface ActivityItem {
  _id: string;
  type: string;
  title: string;
  description: string;
  time: string;
}

const iconMap: Record<string, any> = {
  badge: Award,
  quiz: BookOpen,
  task: ClipboardList,
  campaign: Megaphone,
  certificate: CheckCircle2,
};

const colorMap: Record<string, string> = {
  badge: "bg-amber-100 text-amber-600",
  quiz: "bg-secondary/10 text-secondary",
  task: "bg-blue-100 text-blue-600",
  campaign: "bg-destructive/10 text-destructive",
  certificate: "bg-success/10 text-success",
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Activity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.activity()
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial="hidden" animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-extrabold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground mt-1">A history of all your recent actions and achievements.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <motion.div variants={fadeUp} className="text-center py-16 text-muted-foreground">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No activity yet</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="space-y-3">
          {activities.map((item) => {
            const Icon = iconMap[item.type] || Award;
            const color = colorMap[item.type] || "bg-slate-100 text-slate-500";
            return (
              <motion.div
                key={item._id}
                variants={fadeUp}
                className="bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-secondary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
