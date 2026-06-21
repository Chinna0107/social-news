import { useState, useEffect } from "react";
import { Megaphone, HeartHandshake, ClipboardList, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ campaigns: 0, donations: 0, tasks: 0, impactPoints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest("/student/campaigns"),
      apiRequest("/student/donations/history"),
      apiRequest("/student/tasks"),
    ]).then(([campaigns, donations, tasks]) => {
      setStats({
        campaigns: Array.isArray(campaigns) ? campaigns.filter((c: any) => c.is_registered).length : 0,
        donations: Array.isArray(donations) ? donations.length : 0,
        tasks: Array.isArray(tasks) ? tasks.filter((t: any) => t.assignment_status === 'PENDING' || t.status === 'PENDING').length : 0,
        impactPoints: user?.impact_points || 0,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const firstName = user?.name?.split(" ")[0] || "User";

  const cards = [
    { icon: Megaphone,      label: "Registered Campaigns", value: stats.campaigns,     color: "text-destructive", bg: "bg-destructive/10" },
    { icon: HeartHandshake, label: "Donations Made",        value: stats.donations,     color: "text-secondary",   bg: "bg-secondary/10" },
    { icon: ClipboardList,  label: "Pending Tasks",        value: stats.tasks,         color: "text-amber-600",   bg: "bg-amber-100" },
    { icon: Award,          label: "Impact Points",         value: stats.impactPoints,  color: "text-success",     bg: "bg-success/10" },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="max-w-5xl mx-auto space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your activity overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <motion.div key={label} variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className={`text-3xl font-extrabold ${color}`}>{loading ? "—" : value}</h3>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-bold text-secondary mb-2">Your Account</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div><p className="text-muted-foreground">Name</p><p className="font-semibold">{user?.name}</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-semibold">{user?.email}</p></div>
          <div><p className="text-muted-foreground">Member ID</p><p className="font-semibold font-mono">{user?.student_id || "—"}</p></div>
          
          {(user as any)?.age && <div><p className="text-muted-foreground">Age</p><p className="font-semibold capitalize">{(user as any)?.age}</p></div>}
          {(user as any)?.gender && <div><p className="text-muted-foreground">Gender</p><p className="font-semibold capitalize">{(user as any)?.gender}</p></div>}
          {(user as any)?.college && <div className="sm:col-span-2 lg:col-span-1"><p className="text-muted-foreground">College</p><p className="font-semibold">{(user as any)?.college}</p></div>}
          {(user as any)?.address && <div className="sm:col-span-2 lg:col-span-3"><p className="text-muted-foreground">Address</p><p className="font-semibold">{(user as any)?.address}</p></div>}
        </div>
      </motion.div>
    </motion.div>
  );
}
