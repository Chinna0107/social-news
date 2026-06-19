import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, Users, BarChart2 } from "lucide-react";

const inr = (n: number | string) =>
  "₹" + parseFloat(String(n || 0)).toLocaleString("en-IN", { maximumFractionDigits: 2 });

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  campaign_title: string;
  user_name: string;
  status: string;
  message: string;
  created_at: string;
}

interface Stats {
  total_donations: string;
  total_amount: string;
  avg_amount: string;
  unique_donors: string;
}

const API = "http://localhost:5000/api/donations";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-red-100 text-red-700",
  failed: "bg-slate-100 text-slate-500",
};

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filterStatus) params.set("status", filterStatus);
    const [r, s] = await Promise.all([
      fetch(`${API}?${params}`, { headers: headers() }),
      fetch(`${API}/stats`, { headers: headers() }),
    ]);
    const data = await r.json();
    const statsData = await s.json();
    setDonations(data.donations || []);
    setTotal(data.total || 0);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/${id}/status`, { method: "PATCH", headers: headers(), body: JSON.stringify({ status }) });
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Donation Management</h1>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Donations", value: stats.total_donations, icon: BarChart2, color: "text-blue-600" },
            { label: "Total Amount", value: inr(stats.total_amount || "0"), icon: IndianRupee, color: "text-green-600" },
            { label: "Avg. Donation", value: inr(stats.avg_amount || "0"), icon: TrendingUp, color: "text-purple-600" },
            { label: "Unique Donors", value: stats.unique_donors, icon: Users, color: "text-orange-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border shadow-sm p-5">
              <Icon className={`w-5 h-5 mb-3 ${color}`} />
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-2xl font-extrabold text-secondary">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {["", "completed", "pending", "refunded", "failed"].map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${filterStatus === s ? "bg-secondary text-white" : "bg-white"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
              <tr>
                {["ID", "Donor", "Campaign", "Amount", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-sm text-foreground/40">Loading...</td></tr>
              ) : donations.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono text-xs text-foreground/50">{d.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-secondary text-xs">{d.donor_name || d.user_name || "Anonymous"}</p>
                    <p className="text-[10px] text-foreground/50">{d.donor_email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">{d.campaign_title || "—"}</td>
                  <td className="px-4 py-3 font-bold text-green-700 text-sm">{inr(d.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[d.status] || "bg-slate-100"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-secondary/30">
                      {["completed", "pending", "refunded", "failed"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-foreground/50">
          <span>Showing {donations.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
