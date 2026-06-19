import { useEffect, useState } from "react";
import { 
  Users, 
  Megaphone, 
  HeartHandshake, 
  Calendar,
  FileDown,
  Globe,
  MessageSquare
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import CountUpImport from "react-countup";

// Handle Vite CJS interop issue for react-countup
const CountUp = (CountUpImport as any).default || CountUpImport;

const API_BASE = "http://localhost:5000/api/admin";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [donationReports, setDonationReports] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, donRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard`, { headers: headers() }),
          fetch(`${API_BASE}/reports/donations`, { headers: headers() }),
        ]);
        
        if (dashRes.ok) setDashboardData(await dashRes.json());
        if (donRes.ok) setDonationReports(await donRes.json());
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading || !dashboardData) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div></div>;
  }

  const { stats, recentUsers, recentEnquiries } = dashboardData;
  
  // Format chart data
  const chartData = (donationReports?.monthly || []).map((m: any) => {
    const date = new Date(m.month);
    return {
      name: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      donations: parseFloat(m.total || 0),
      // Dummy user engagement data since it's not directly in the API
      users: Math.floor(Math.random() * 1000) + 500 
    };
  }).reverse();

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary tracking-tight">Analytics Overview</h1>
          <p className="text-sm text-foreground/70 mt-1">Real-time performance metrics across Social News ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-border hover:bg-slate-50 text-secondary font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="bg-destructive hover:bg-destructive/90 text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-secondary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Total Users</p>
          <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={stats.totalUsers} duration={2.5} separator="," /></h3>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Active Campaigns</p>
          <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={stats.activeCampaigns} duration={2} /></h3>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-secondary">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Total Donations</p>
          <h3 className="text-3xl font-extrabold text-secondary">₹<CountUp end={stats.totalDonations} decimals={2} duration={2} separator="," /></h3>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-secondary">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Open Enquiries</p>
          <h3 className="text-3xl font-extrabold text-secondary"><CountUp end={stats.openEnquiries} duration={2.5} separator="," /></h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth & Platform Activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-secondary mb-1 tracking-tight">Donation Trends</h3>
              <p className="text-[11px] text-foreground/60">Monthly donation volume</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-foreground/60 uppercase tracking-wider">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#fecdd3]"></div> Donations ($)</div>
            </div>
          </div>
          <div className="h-[250px] w-full mt-4">
            {chartData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="donations" fill="#fecdd3" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-foreground/40">No donation data available</div>
            )}
          </div>
        </motion.div>

        {/* Global Impact */}
        <motion.div variants={fadeUp} className="bg-gradient-to-br from-[#011B4A] to-secondary rounded-2xl shadow-xl p-6 text-white relative overflow-hidden flex flex-col group">
          <Globe className="absolute -right-12 -top-12 w-48 h-48 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" />
          <h3 className="font-bold mb-6 relative z-10 flex items-center gap-2 tracking-tight">
             <Globe className="w-5 h-5 text-white/80" /> Top Campaigns
          </h3>
          
          <div className="space-y-6 relative z-10 flex-1">
            {donationReports?.byCampaign?.slice(0, 3).map((camp: any, idx: number) => (
              <div key={idx} className={`group/item cursor-pointer ${idx > 0 ? 'pt-4 border-t border-white/10' : ''}`}>
                 <h4 className="font-bold text-base mb-2 truncate">{camp.title}</h4>
                 <p className="text-xs text-white/70">₹{parseFloat(camp.total).toLocaleString("en-IN")} raised</p>
                 <p className="text-[10px] text-white/50">{camp.count} donations</p>
              </div>
            )) || <p className="text-sm text-white/60">No campaign data.</p>}
          </div>

          <motion.button whileHover={{ scale: 1.02 }} className="w-full bg-white text-secondary font-bold text-[11px] py-3 rounded-lg mt-6 transition-all shadow-lg hover:shadow-xl relative z-10">
            View All Campaigns
          </motion.button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-secondary mb-1 tracking-tight">Recent Signups</h3>
            </div>
            <button className="text-xs font-bold text-secondary bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">View All</button>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                  <th className="pb-3 px-2">User</th>
                  <th className="pb-3 px-2">Role</th>
                  <th className="pb-3 px-2 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentUsers?.map((user: any, i: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.1) }}
                    key={user.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/5 text-secondary flex items-center justify-center font-bold text-[10px] border border-secondary/10">
                          {user.name?.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-secondary text-xs">{user.name}</p>
                          <p className="text-[10px] text-foreground/50">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-slate-100 text-secondary text-[10px] font-black px-2 py-1 rounded shadow-sm capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-xs text-foreground/50">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Enquiries */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-secondary mb-1 tracking-tight">Recent Enquiries</h3>
            </div>
            <button className="text-xs font-bold text-secondary bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">Manage</button>
          </div>

          <div className="space-y-4">
            {recentEnquiries?.map((enq: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (i * 0.1) }}
                key={enq.id} 
                className="flex flex-col p-3 rounded-xl border bg-slate-50/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-secondary">{enq.subject}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    enq.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {enq.status}
                  </span>
                </div>
                <p className="text-xs text-foreground/60 line-clamp-2 mb-2">{enq.message}</p>
                <div className="text-[10px] text-foreground/40 flex justify-between">
                  <span>{enq.name} ({enq.email})</span>
                  <span>{new Date(enq.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
            {(!recentEnquiries || recentEnquiries.length === 0) && (
              <p className="text-sm text-center text-foreground/50 py-4">No recent enquiries.</p>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
