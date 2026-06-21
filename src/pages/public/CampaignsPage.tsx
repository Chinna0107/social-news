import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { publicApi } from "@/utils/api";
import { Users } from "lucide-react";

interface Campaign {
  _id: string;
  id?: string;
  title: string;
  description: string;
  image: string;
  collected: number | string;
  goal: number | string;
  progress: number | string;
  tag: string;
  participants: number | string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.campaigns()
      .then(setCampaigns)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-8 md:px-16">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
        <motion.div variants={fadeUp} className="max-w-2xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary mb-4">Active Campaigns</h1>
          <p className="text-lg text-muted-foreground">Discover campaigns making a real-world impact. Join thousands of contributors driving change.</p>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading campaigns...</p>
        ) : (
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <div key={campaign._id || campaign.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-52 relative overflow-hidden">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {campaign.tag && (
                    <div className="absolute top-4 left-4 bg-destructive text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {campaign.tag}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-destructive transition-colors">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{campaign.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-destructive">${Number(campaign.collected).toLocaleString()} raised</span>
                      <span className="text-muted-foreground">of ${Number(campaign.goal).toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-destructive rounded-full transition-all duration-700" style={{ width: `${Number(campaign.progress)}%` }} />
                    </div>
                    <p className="text-xs text-right text-muted-foreground font-semibold">{Math.round(Number(campaign.progress))}% funded</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {Number(campaign.participants || 0).toLocaleString()} participants
                    </div>
                    <button className="bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-destructive transition-colors">
                      Support Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
