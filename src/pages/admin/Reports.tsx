import { useEffect, useState } from "react";
import { Users, DollarSign, CheckSquare, MessageSquare, BarChart2, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/reports";
const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

const TABS = ["Overview", "Users", "Donations", "Tasks", "Activity", "AdSense"];

export default function AdminReports() {
  const [tab, setTab] = useState("Overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const endpoints: Record<string, string> = {
    Overview: `${API}/overview`,
    Users: `${API}/users`,
    Donations: `${API}/donations`,
    Tasks: `${API}/tasks`,
    Activity: `${API}/activity`,
    AdSense: `${API}/adsense`,
  };

  const load = async (t: string) => {
    setLoading(true); setData(null);
    const r = await fetch(endpoints[t], { headers: headers() });
    setData(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(tab); }, [tab]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Reports & Activity Monitoring</h1>

      <div className="flex gap-2 flex-wrap border-b pb-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${tab === t ? "border-secondary text-secondary" : "border-transparent text-foreground/50 hover:text-secondary"}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-foreground/40 py-8 text-center">Loading...</p>}

      {!loading && data && tab === "Overview" && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Total Users", value: data.users?.total, sub: `${data.users?.active} active`, icon: Users },
            { label: "Campaigns", value: data.campaigns?.total, sub: `${data.campaigns?.active} active`, icon: BarChart2 },
            { label: "Tasks", value: data.tasks?.total, sub: `${data.tasks?.active} active`, icon: CheckSquare },
            { label: "Donations", value: data.donations?.total, sub: `₹${parseFloat(data.donations?.total_amount || 0).toLocaleString("en-IN")}`, icon: DollarSign },
            { label: "Submissions", value: data.submissions?.total, sub: `${data.submissions?.approved} approved`, icon: CheckSquare },
            { label: "Enquiries", value: data.enquiries?.total, sub: `${data.enquiries?.open} open`, icon: MessageSquare },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border shadow-sm p-5">
              <Icon className="w-5 h-5 mb-3 text-secondary/60" />
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{label}</p>
              <p className="text-3xl font-extrabold text-secondary">{Number(value || 0).toLocaleString()}</p>
              <p className="text-xs text-foreground/50 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && data && tab === "Users" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.roleStats?.map((r: any) => (
              <div key={r.role} className="bg-white rounded-xl border shadow-sm p-4">
                <p className="text-xs font-bold text-foreground/50 capitalize mb-1">{r.role}</p>
                <p className="text-2xl font-extrabold text-secondary">{Number(r.count).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-4 text-sm">Registration Trends (12 months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.registrationTrends?.map((r: any) => ({ month: new Date(r.month).toLocaleDateString("en", { month: "short" }), registrations: parseInt(r.registrations) }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="registrations" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-4 text-sm">Top Users by Impact Points</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-[10px] font-black text-foreground/40 uppercase tracking-widest border-b">
                <th className="pb-2 text-left">Name</th><th className="pb-2 text-left">Role</th><th className="pb-2 text-right">Points</th>
              </tr></thead>
              <tbody>{data.topUsers?.map((u: any) => (
                <tr key={u.id} className="border-b border-border/30 hover:bg-slate-50/50">
                  <td className="py-2 font-semibold text-secondary">{u.name}</td>
                  <td className="py-2 text-xs capitalize text-foreground/60">{u.role}</td>
                  <td className="py-2 text-right font-bold text-secondary">{u.impact_points.toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && data && tab === "Donations" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-4 text-sm">Monthly Donation Revenue</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.monthly?.map((m: any) => ({ month: new Date(m.month).toLocaleDateString("en", { month: "short" }), total: parseFloat(m.total) }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
                <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-4 text-sm">Top Campaigns by Collection</h3>
            <div className="space-y-3">
              {data.byCampaign?.map((c: any) => (
                <div key={c.title}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-secondary">{c.title}</span>
                    <span className="text-foreground/60">{c.progress_pct}% — ₹{parseFloat(c.collected).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full" style={{ width: `${Math.min(c.progress_pct, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && data && tab === "Tasks" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.statusBreakdown?.map((s: any) => (
              <div key={s.status} className="bg-white rounded-xl border shadow-sm p-4">
                <p className="text-xs font-bold text-foreground/50 capitalize">{s.status.toLowerCase()}</p>
                <p className="text-2xl font-extrabold text-secondary">{s.count}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-4 text-sm">Top Tasks by Submissions</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-[10px] font-black text-foreground/40 uppercase tracking-widest border-b">
                <th className="pb-2 text-left">Task</th><th className="pb-2 text-right">Submissions</th><th className="pb-2 text-right">Approved</th>
              </tr></thead>
              <tbody>{data.topTasks?.map((t: any, i: number) => (
                <tr key={i} className="border-b border-border/30 hover:bg-slate-50/50">
                  <td className="py-2 font-semibold text-secondary text-xs">{t.title}</td>
                  <td className="py-2 text-right text-xs">{t.submissions}</td>
                  <td className="py-2 text-right text-xs text-green-600 font-bold">{t.approved}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && data && tab === "Activity" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.summary?.map((s: any) => (
              <div key={s.action} className="bg-white rounded-xl border shadow-sm p-4">
                <Activity className="w-4 h-4 mb-2 text-secondary/60" />
                <p className="text-xs font-bold text-foreground/50 capitalize">{s.action}</p>
                <p className="text-2xl font-extrabold text-secondary">{s.count}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                <tr>{["User", "Action", "Details", "Time"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.logs?.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-xs font-semibold text-secondary">{l.user_name || "System"}</td>
                    <td className="px-4 py-2 text-xs capitalize">{l.action}</td>
                    <td className="px-4 py-2 text-xs text-foreground/50 max-w-[250px] truncate">{l.details}</td>
                    <td className="px-4 py-2 text-xs text-foreground/40">{new Date(l.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && data && tab === "AdSense" && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
              <tr>{["Label", "Slot", "Position", "Impressions", "Clicks", "CTR", "Status"].map(h =>
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(Array.isArray(data) ? data : []).map((u: any) => (
                <tr key={u.slot} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-secondary text-xs">{u.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/50">{u.slot || "—"}</td>
                  <td className="px-4 py-3 text-xs capitalize">{u.position}</td>
                  <td className="px-4 py-3 text-xs">{u.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{u.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{u.ctr}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {u.is_active ? "Active" : "Paused"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
