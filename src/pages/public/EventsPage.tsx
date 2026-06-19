import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { mockEvents } from "@/utils/mockData";
import { Calendar, MapPin } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function EventsPage() {
  return (
    <div className="py-12 px-8 md:px-16">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
        <motion.div variants={fadeUp} className="max-w-2xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary mb-4">Upcoming Events</h1>
          <p className="text-lg text-muted-foreground">Join our global network of volunteers, leaders, and activists in these upcoming live and virtual sessions.</p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mx-auto space-y-6">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow group">
              <div className="bg-secondary/5 border border-secondary/10 text-secondary rounded-2xl p-6 text-center min-w-[140px] flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                <span className="block text-sm font-bold uppercase tracking-widest opacity-80 mb-1">{event.date.split(" ")[0]}</span>
                <span className="block text-3xl font-black">{event.date.split(" ")[1].replace(",", "")}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-destructive bg-destructive/10 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    {event.type.includes("VIRTUAL") ? <Calendar className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    {event.type}
                  </span>
                </div>
                <h3 className="font-bold text-2xl text-secondary mb-3">{event.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{event.description}</p>
                <div className="flex items-center gap-4">
                  <button className="bg-destructive text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-destructive/90 transition-colors">
                    Register Now
                  </button>
                  <button className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
