import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { publicApi } from "@/utils/api";
import { HeartHandshake, ShieldCheck } from "lucide-react";

interface Donation {
  _id: string;
  campaign: string;
  amount: number;
  date: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// stable tx ids derived from _id so they don't change on re-render
const txId = (id: string) => `TX-${id.toUpperCase().padEnd(9, "0").slice(0, 9)}`;

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.donations()
      .then(setDonations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-8 md:px-16">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
        <motion.div variants={fadeUp} className="max-w-2xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary mb-4">Transparent Giving</h1>
          <p className="text-lg text-muted-foreground">We believe in absolute transparency. View recent live donations fueling our global impact campaigns.</p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border shadow-lg overflow-hidden">
            <div className="p-8 bg-secondary text-white text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">100% Public Audit Log</h2>
              <p className="text-white/70 text-sm">Every transaction is recorded and verified.</p>
            </div>

            {loading ? (
              <p className="p-8 text-center text-muted-foreground">Loading donations...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-muted-foreground font-semibold">Transaction Hash</th>
                      <th className="px-8 py-5 text-muted-foreground font-semibold">Campaign Focus</th>
                      <th className="px-8 py-5 text-muted-foreground font-semibold">Date</th>
                      <th className="px-8 py-5 text-right text-muted-foreground font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {donations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-mono text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success shrink-0"></div>
                            {txId(donation._id)}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-bold text-secondary">{donation.campaign}</td>
                        <td className="px-8 py-5 text-muted-foreground">{donation.date}</td>
                        <td className="px-8 py-5 font-black text-lg text-success text-right">${donation.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-6 bg-slate-50 border-t text-center">
              <button className="text-secondary font-bold hover:text-primary transition-colors text-sm flex items-center gap-2 mx-auto">
                <HeartHandshake className="w-4 h-4" /> Make a Direct Donation
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
