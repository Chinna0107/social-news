import { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Megaphone, 
  Zap, 
  Award, 
  CheckCircle2, 
  Upload, 
  Share2, 
  Download,
  Camera,
  RefreshCw,
  MoreVertical,
  User,
  IdCard,
  BarChart3
} from "lucide-react";
import { studentApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import CountUpImport from "react-countup";

const CountUp = (CountUpImport as any).default || CountUpImport;

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface DashboardData {
  stats: { tasks: number; campaigns: number; quizAvg: number; certificates: number };
  taskPipeline: { pending: any[]; inProgress: any[]; submitted: any[]; approved: any[] };
  activityFeed: { id: string; type: string; title: string; description: string; time: string }[];
  certificates: { _id: string; title: string; verifiedDate: string }[];
  performanceData: { name: string; score: number }[];
  idCard: { name: string; role: string; avatar: string; studentId: string; level: string };
  completionRate: number;
  nextAchievement: { name: string; progress: number };
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.dashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Student';
  const stats = data?.stats;
  const idCard = data?.idCard;
  const performanceData = data?.performanceData || [];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Welcome Message */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Good Morning, {firstName}!</h1>
        <p className="text-sm text-foreground/70 mt-1">Your community efforts have impacted <span className="font-bold text-secondary"><CountUp end={42} duration={2} /></span> lives this week. Keep going!</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-secondary">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-1 rounded">+2 New</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/70">Assigned Tasks</p>
            <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={loading ? 0 : (stats?.tasks ?? 0)} duration={2} /></h3>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
              <Megaphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground/50">Active</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/70">Campaigns</p>
            <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={loading ? 0 : (stats?.campaigns ?? 0)} duration={2.5} /></h3>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-secondary">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">Top 5%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/70">Quiz Score Avg</p>
            <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={loading ? 0 : (stats?.quizAvg ?? 0)} duration={2} />%</h3>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground/50">Verified</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/70">Certificates</p>
            <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={loading ? 0 : (stats?.certificates ?? 0)} duration={2.5} /></h3>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Pipeline */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-secondary flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-destructive" /> Task Pipeline
            </h3>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <h4 className="text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-3">Pending ({data?.taskPipeline?.pending?.length ?? 0})</h4>
              {data?.taskPipeline?.pending?.slice(0,1).map(t => (
                <motion.div key={t._id || t.id} whileHover={{ scale: 1.02 }} className="bg-slate-50 border p-4 rounded-xl border-l-4 border-l-slate-300 shadow-sm cursor-pointer hover:shadow-md transition-all">
                  <h5 className="text-sm font-bold text-secondary mb-1 leading-tight">{t.title}</h5>
                  <p className="text-[11px] text-foreground/60 mb-3 line-clamp-2">{t.description}</p>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-200 text-foreground rounded">{t.priority}</span>
                </motion.div>
              ))}
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-destructive uppercase tracking-widest mb-3">In Progress ({data?.taskPipeline?.inProgress?.length ?? 0})</h4>
              {data?.taskPipeline?.inProgress?.slice(0,1).map(t => (
                <motion.div key={t._id || t.id} whileHover={{ scale: 1.02 }} className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl border-l-4 border-l-destructive shadow-sm cursor-pointer hover:shadow-md transition-all">
                  <h5 className="text-sm font-bold text-destructive mb-1 leading-tight">{t.title}</h5>
                  <p className="text-[11px] text-foreground/60 line-clamp-2">{t.description}</p>
                </motion.div>
              ))}
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-3">Submitted ({data?.taskPipeline?.submitted?.length ?? 0})</h4>
              {data?.taskPipeline?.submitted?.slice(0,1).map(t => (
                <motion.div key={t._id || t.id} whileHover={{ scale: 1.02 }} className="bg-slate-50 border p-4 rounded-xl border-l-4 border-l-secondary shadow-sm cursor-pointer hover:shadow-md transition-all">
                  <h5 className="text-sm font-bold text-secondary mb-1 leading-tight">{t.title}</h5>
                </motion.div>
              ))}
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-success uppercase tracking-widest mb-3">Approved ({data?.taskPipeline?.approved?.length ?? 0})</h4>
              {data?.taskPipeline?.approved?.slice(0,1).map(t => (
                <motion.div key={t._id || t.id} whileHover={{ scale: 1.02 }} className="bg-success/5 border border-success/20 p-4 rounded-xl border-l-4 border-l-success shadow-sm cursor-pointer hover:shadow-md transition-all">
                  <h5 className="text-sm font-bold text-success mb-1 leading-tight">{t.title}</h5>
                  <p className="text-xs text-success font-semibold mt-2 flex items-center gap-1">
                    <Award className="w-3 h-3" /> +{t.points} Points
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Feed & Achievements */}
        <div className="space-y-6">
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary flex items-center gap-2 mb-6">
              <RefreshCw className="w-5 h-5 text-secondary" /> Activity Feed
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {data?.activityFeed?.slice(0,2).map((activity, i) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-destructive/10 text-destructive shrink-0 md:order-1 shadow-sm relative z-10">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <h4 className="text-sm font-bold text-secondary mb-1">{activity.title}</h4>
                    <p className="text-[11px] text-foreground/60 mb-2">{activity.description}</p>
                    <span className="text-[10px] font-semibold text-foreground/40">{activity.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-gradient-to-br from-secondary to-secondary/90 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
            <h3 className="font-bold mb-4 relative z-10">Achievement Progress</h3>
            <div className="flex gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-full border-2 border-destructive flex items-center justify-center bg-white/10 text-destructive shadow-[0_0_15px_rgba(227,6,19,0.3)]">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-white/40">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-white/40">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm relative z-10">Next: <span className="font-bold text-white">{data?.nextAchievement?.name || 'Visionary Leader'}</span> (<CountUp end={data?.nextAchievement?.progress ?? 85} duration={3} />% towards goal)</p>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
              <Award className="w-32 h-32" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificates */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-secondary flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" /> Certificates & Credentials
            </h3>
            <button className="text-[11px] font-bold text-destructive hover:underline uppercase tracking-wider">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {data?.certificates?.map((cert, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -5 }}
                key={cert._id} 
                className="min-w-[200px] border border-border/50 rounded-xl p-4 bg-gradient-to-b from-white to-slate-50 shadow-sm flex flex-col items-center justify-center text-center aspect-[4/3] cursor-pointer hover:shadow-md transition-all"
              >
                <h4 className="text-sm font-bold text-secondary mb-2 leading-tight">{cert.title}</h4>
                <p className="text-[10px] text-foreground/50 font-mono tracking-wider mb-3">Verified: {cert.verifiedDate}</p>
                <div className="w-8 h-8 bg-success/10 text-success rounded flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ID Card Preview */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-bold text-secondary flex items-center gap-2 mb-6">
            <IdCard className="w-5 h-5 text-secondary" /> ID Card Live Preview
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="w-full sm:w-[300px] aspect-[1.6/1] bg-gradient-to-br from-[#011B4A] to-secondary rounded-2xl shadow-[0_10px_30px_rgba(1,27,74,0.3)] relative overflow-hidden flex flex-col cursor-pointer transition-all duration-500"
            >
              <div className="flex justify-between p-4 relative z-10">
                <img src="/logo.png" alt="SOCIAL NEWS" className="h-4 w-auto object-contain opacity-90" />
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <User className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex px-4 gap-4 relative z-10 items-center">
                <img src={idCard?.avatar || user?.avatar || "https://i.pravatar.cc/150?u=student"} className="w-16 h-16 rounded-xl border-2 border-white/20 shadow-lg" alt="Avatar" />
                <div>
                  <h4 className="text-white font-bold text-lg leading-tight uppercase tracking-wide">{idCard?.name || user?.name}</h4>
                  <p className="text-white/50 text-[9px] font-mono tracking-widest mb-1">ID: {idCard?.studentId || user?.student_id || 'SN-2024'}</p>
                  <span className="bg-destructive text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">{idCard?.role || user?.role}</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <IdCard className="w-48 h-48" />
              </div>
            </motion.div>
            <div className="flex flex-col gap-3 w-full sm:w-auto flex-1">
              <button className="w-full bg-slate-50 border hover:bg-slate-100 text-secondary font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow">
                <Camera className="w-4 h-4 text-foreground/50" /> Update Selfie
              </button>
              <button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Download className="w-4 h-4" /> Download ID
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Insights */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-secondary flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-secondary" /> Performance Insights
              </h3>
              <p className="text-[11px] text-foreground/60">Your learning curve over recent modules</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Completion Rate</p>
              <p className="text-xl font-black text-secondary"><CountUp end={data?.completionRate ?? 0} duration={2} decimals={1} />%</p>
              <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mt-1">Avg Score</p>
              <p className="text-xl font-black text-destructive"><CountUp end={stats?.quizAvg ?? 0} duration={2} />%</p>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} dy={10} />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#E30613', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="score" stroke="#E30613" strokeWidth={3} dot={{ r: 4, fill: '#E30613', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#FF8B8B' }} animationDuration={2000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Campaign Selfie Studio */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-secondary mb-1">Campaign Selfie Studio</h3>
          <p className="text-[11px] text-foreground/60 max-w-sm mb-6">Generate personalized campaign posters and frames to share your impact story on social media.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
            <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-1/2 aspect-square bg-slate-100 rounded-2xl border overflow-hidden relative shadow-inner cursor-pointer group">
              <img src="https://picsum.photos/seed/selfie/500/500" alt="Selfie" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-destructive to-destructive/80 p-3 text-white text-center backdrop-blur-sm">
                <p className="text-[11px] font-black tracking-widest mb-0.5">VOTE FOR IMPACT</p>
                <p className="text-[7px] uppercase tracking-widest opacity-80 font-semibold">Social News Global Campaign 2024</p>
              </div>
              <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-colors">
                <MoreVertical className="w-3 h-3" />
              </button>
            </motion.div>

            <div className="w-full sm:w-1/2 flex flex-col justify-center">
              <motion.div whileHover={{ scale: 1.02 }} className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center text-center mb-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 text-secondary/40 mb-2" />
                <p className="text-[11px] font-bold text-secondary">Drop selfie here</p>
                <p className="text-[9px] font-mono text-foreground/40 mt-1">PNG, JPG up to 10MB</p>
              </motion.div>
              <div className="flex gap-2">
                <button className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold text-[11px] py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Download
                </button>
                <button className="w-10 flex items-center justify-center bg-white border border-border text-secondary rounded-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
