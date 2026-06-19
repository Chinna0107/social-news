import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { HeartHandshake, X, CheckCircle2, Loader2, IndianRupee, Megaphone, History } from "lucide-react";
import { API_BASE_URL } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/contexts/AuthContext";

interface Donation {
  id: string;
  campaign_title?: string;
  campaign?: string;
  created_at?: string;
  date?: string;
  amount: number;
  status?: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  collected: number;
}

const inr = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const PRESETS = [100, 500, 1000, 2000, 5000];

const fadeUp: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [campLoading, setCampLoading] = useState(true);
  const [tab, setTab] = useState<"campaigns" | "history">("campaigns");

  // Donate modal
  const [donating, setDonating] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState("");
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);

  useEffect(() => {
    apiRequest("/student/donations/history")
      .then((data: any) => setDonations(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/donations/campaigns`)
      .then(r => r.json())
      .then((data: any) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setCampLoading(false));
  }, []);

  const openDonate = (c: Campaign) => {
    setDonating(c);
    setAmount("");
    setDonateSuccess(false);
  };

  const handleDonate = async () => {
    const amt = parseFloat(amount);
    if (!donating || !amt || amt <= 0) return;
    setDonateLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/donations/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          campaign_id: donating.id,
          amount: amt,
          donor_name: user?.name || "Anonymous",
          donor_email: user?.email || "",
          user_id: user?.id || null,
        }),
      });
      const newDon = await res.json();
      setCampaigns(prev => prev.map(c => c.id === donating.id ? { ...c, collected: (c.collected || 0) + amt } : c));
      setDonations(prev => [{ ...newDon, campaign_title: donating.title }, ...prev]);
      setDonateSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Donation failed. Please try again.");
    } finally {
      setDonateLoading(false);
    }
  };

  const totalDonated = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return (
    <>
      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
        className="space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-extrabold tracking-tight">Donations</h1>
          <p className="text-muted-foreground mt-1">Support campaigns and track your giving impact.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Donated", value: inr(totalDonated), color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: IndianRupee },
            { label: "Donations Made", value: donations.length, color: "text-secondary", bg: "bg-secondary/5 border-secondary/20", icon: HeartHandshake },
            { label: "Campaigns Supported", value: new Set(donations.map(d => d.campaign_title || d.campaign)).size, color: "text-success", bg: "bg-success/10 border-success/20", icon: Megaphone },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-5 flex items-center gap-3`}>
              <s.icon className={`w-7 h-7 ${s.color} shrink-0`} />
              <div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp} className="flex gap-1 bg-white p-1.5 rounded-xl border shadow-sm w-max">
          <button onClick={() => setTab("campaigns")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === "campaigns" ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
            <Megaphone className="w-4 h-4" /> Donate Now
          </button>
          <button onClick={() => setTab("history")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === "history" ? "bg-secondary text-white shadow-sm" : "text-foreground/60 hover:bg-slate-100"}`}>
            <History className="w-4 h-4" /> My History
          </button>
        </motion.div>

        {/* Campaigns Tab */}
        {tab === "campaigns" && (
          <motion.div variants={fadeUp}>
            {campLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No active campaigns available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map(c => {
                  const pct = c.goal > 0 ? Math.min(Math.round((c.collected / c.goal) * 100), 100) : 0;
                  return (
                    <motion.div key={c.id} whileHover={{ y: -2 }}
                      className="bg-white rounded-2xl border shadow-sm overflow-hidden flex hover:shadow-md transition-all">
                      {c.image && (
                        <div className="w-24 shrink-0 overflow-hidden">
                          <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-secondary text-sm line-clamp-1">{c.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.description}</p>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-destructive">{inr(c.collected)}</span>
                            <span className="text-muted-foreground">{pct}% of {inr(c.goal)}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-destructive rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <button onClick={() => openDonate(c)}
                          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-xl transition-colors">
                          <HeartHandshake className="w-3.5 h-3.5" /> Donate Now
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <motion.div variants={fadeUp}>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : donations.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <HeartHandshake className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No donations yet.</p>
                <button onClick={() => setTab("campaigns")} className="mt-3 text-secondary font-bold text-sm hover:underline">
                  Donate to a campaign →
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-muted-foreground border-b">
                    <tr>
                      <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider">Campaign</th>
                      <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider">Amount</th>
                      <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {donations.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-secondary">
                          {d.campaign_title || d.campaign || "—"}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">
                          {d.created_at ? new Date(d.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : d.date || "—"}
                        </td>
                        <td className="px-5 py-3 font-extrabold text-success">{inr(Number(d.amount))}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${d.status === "completed" || !d.status ? "bg-success/10 text-success" : "bg-amber-100 text-amber-700"}`}>
                            {d.status || "completed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Donate Modal */}
      <AnimatePresence>
        {donating && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setDonating(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
                  <button onClick={() => setDonating(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <HeartHandshake className="w-8 h-8 mb-2 opacity-90" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-75 mb-1">Donating to</p>
                  <h2 className="text-xl font-extrabold leading-tight pr-8">{donating.title}</h2>
                  {donating.image && (
                    <div className="mt-3 rounded-xl overflow-hidden h-20">
                      <img src={donating.image} alt={donating.title} className="w-full h-full object-cover opacity-70" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {donateSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-9 h-9 text-success" />
                      </div>
                      <h3 className="text-xl font-extrabold text-secondary mb-1">Thank You! 🙏</h3>
                      <p className="text-sm text-muted-foreground">
                        Your donation of <span className="font-bold text-success">₹{parseFloat(amount).toLocaleString("en-IN")}</span> has been received.
                      </p>
                      <button onClick={() => setDonating(null)}
                        className="mt-5 w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors">
                        Done
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Progress */}
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-foreground/60">Raised so far</span>
                          <span className="text-destructive font-extrabold">{inr(donating.collected)}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-destructive rounded-full"
                            style={{ width: `${donating.goal > 0 ? Math.min(Math.round((donating.collected / donating.goal) * 100), 100) : 0}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                          <span>{donating.goal > 0 ? Math.min(Math.round((donating.collected / donating.goal) * 100), 100) : 0}% funded</span>
                          <span>Goal: {inr(donating.goal)}</span>
                        </div>
                      </div>

                      {/* Presets */}
                      <div>
                        <p className="text-xs font-black text-foreground/50 uppercase tracking-widest mb-2">Quick Select</p>
                        <div className="grid grid-cols-5 gap-2">
                          {PRESETS.map(p => (
                            <button key={p} onClick={() => setAmount(String(p))}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all ${amount === String(p) ? "bg-amber-500 text-white border-amber-500" : "bg-slate-50 border-border hover:border-amber-400 hover:text-amber-600"}`}>
                              ₹{p >= 1000 ? `${p / 1000}k` : p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom amount */}
                      <div>
                        <p className="text-xs font-black text-foreground/50 uppercase tracking-widest mb-2">Or Enter Amount (₹)</p>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full pl-9 pr-4 py-3 border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all" />
                        </div>
                      </div>

                      <button onClick={handleDonate}
                        disabled={donateLoading || !amount || parseFloat(amount) <= 0}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-colors shadow-lg">
                        {donateLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <HeartHandshake className="w-5 h-5" />}
                        {donateLoading ? "Processing..." : `Donate ₹${parseFloat(amount || "0").toLocaleString("en-IN") || "—"}`}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
