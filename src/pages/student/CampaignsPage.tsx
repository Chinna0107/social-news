import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { studentApi } from "@/utils/api";
import { Megaphone, Target, CheckCircle2, Loader2, HeartHandshake, X, IndianRupee, Calendar } from "lucide-react";
import { apiRequest, API_BASE_URL } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

interface Campaign {
  id: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
  collected: number;
  goal: number;
  tag: string;
  is_registered?: boolean;
}

const inr = (n: number) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fadeUp: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const PRESETS = [100, 500, 1000, 2000, 5000];

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  // Donate modal state
  const [donating, setDonating] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState("");
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);

  useEffect(() => {
    studentApi.campaigns()
      .then((data: any) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (campaign: Campaign) => {
    const id = campaign.id || campaign._id!;
    setRegistering(id);
    try {
      await apiRequest(`/student/campaigns/${id}/register`, { method: "POST" });
      setCampaigns(prev => prev.map(c => (c.id === id || c._id === id) ? { ...c, is_registered: true } : c));
    } catch (err) { console.error(err); }
    finally { setRegistering(null); }
  };

  const openDonate = (campaign: Campaign) => {
    setDonating(campaign);
    setAmount("");
    setDonateSuccess(false);
  };

  const handleDonate = async () => {
    const amt = parseFloat(amount);
    if (!donating || !amt || amt <= 0) return;
    setDonateLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/donations/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          campaign_id: donating.id || donating._id,
          amount: amt,
          donor_name: user?.name || "Anonymous",
          donor_email: user?.email || "",
          user_id: user?.id || null,
        }),
      });
      // Update collected in local state
      setCampaigns(prev => prev.map(c =>
        (c.id === donating.id || c._id === donating._id)
          ? { ...c, collected: (c.collected || 0) + amt }
          : c
      ));
      setDonateSuccess(true);
    } catch (err) { console.error(err); alert("Donation failed. Please try again."); }
    finally { setDonateLoading(false); }
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-extrabold tracking-tight">Active Campaigns</h1>
          <p className="text-muted-foreground mt-1">Discover, join, and donate to campaigns making real-world impact.</p>
        </motion.div>

        {/* Stats */}
        {!loading && (
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Total Campaigns", value: campaigns.length, icon: Megaphone, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Joined", value: campaigns.filter(c => c.is_registered).length, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
              { label: "Available", value: campaigns.filter(c => !c.is_registered).length, icon: Target, color: "text-amber-600", bg: "bg-amber-100" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 border flex items-center gap-3`}>
                <s.icon className={`w-6 h-6 ${s.color} shrink-0`} />
                <div>
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-8 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Megaphone className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg">No campaigns available</p>
          </div>
        ) : (
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => {
              const id = campaign.id || campaign._id!;
              const pct = campaign.goal > 0 ? Math.min(Math.round((campaign.collected / campaign.goal) * 100), 100) : 0;
              const isReg = campaign.is_registered;
              const isRegLoading = registering === id;

              return (
                <motion.div key={id} whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-lg transition-all flex flex-col">
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden bg-slate-100">
                    {campaign.image ? (
                      <img src={campaign.image} alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Megaphone className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    {campaign.tag && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-secondary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {campaign.tag}
                      </div>
                    )}
                    {isReg && (
                      <div className="absolute top-3 right-3 bg-success text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Joined
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-destructive transition-colors leading-tight line-clamp-1">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{campaign.description}</p>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-slate-50 border px-3 py-2 rounded-xl mb-4 w-max">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>{new Date(Date.now() + Math.random() * 10000000000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-destructive">{inr(campaign.collected)} raised</span>
                        <span className="text-muted-foreground">Goal: {inr(campaign.goal)}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-destructive rounded-full"
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }} />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground">{pct}% funded</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <button
                        onClick={() => !isReg && handleRegister(campaign)}
                        disabled={isReg || isRegLoading}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isReg ? "bg-success/10 text-success cursor-default" : "bg-secondary text-white hover:bg-secondary/90"
                        }`}
                      >
                        {isRegLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isReg ? <><CheckCircle2 className="w-3.5 h-3.5" /> Joined</> : "Join →"}
                      </button>
                      <button
                        onClick={() => openDonate(campaign)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" /> Donate
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
                  <button onClick={() => setDonating(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <HeartHandshake className="w-8 h-8 mb-2 opacity-90" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-75 mb-1">Donating to</p>
                  <h2 className="text-xl font-extrabold leading-tight">{donating.title}</h2>
                  {donating.image && (
                    <div className="mt-3 rounded-xl overflow-hidden h-24">
                      <img src={donating.image} alt={donating.title} className="w-full h-full object-cover opacity-70" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {donateSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-9 h-9 text-success" />
                      </div>
                      <h3 className="text-xl font-extrabold text-secondary mb-1">Thank You! 🙏</h3>
                      <p className="text-sm text-muted-foreground">Your donation of <span className="font-bold text-success">₹{parseFloat(amount).toLocaleString("en-IN")}</span> has been received.</p>
                      <button onClick={() => setDonating(null)}
                        className="mt-5 w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors">
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Campaign progress mini */}
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-foreground/60">Raised</span>
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

                      {/* Preset amounts */}
                      <div>
                        <p className="text-xs font-black text-foreground/50 uppercase tracking-widest mb-2">Quick Select</p>
                        <div className="grid grid-cols-5 gap-2">
                          {PRESETS.map(p => (
                            <button key={p}
                              onClick={() => setAmount(String(p))}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all ${amount === String(p) ? "bg-amber-500 text-white border-amber-500" : "bg-slate-50 border-border hover:border-amber-400 hover:text-amber-600"}`}>
                              ₹{p >= 1000 ? `${p / 1000}k` : p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom amount */}
                      <div>
                        <p className="text-xs font-black text-foreground/50 uppercase tracking-widest mb-2">Or Enter Amount</p>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="number" min="1" value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full pl-9 pr-4 py-3 border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleDonate}
                        disabled={donateLoading || !amount || parseFloat(amount) <= 0}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-colors shadow-lg"
                      >
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
