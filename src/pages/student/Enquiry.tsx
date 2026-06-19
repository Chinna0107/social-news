import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Enquiry() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/student/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject, message })
      });

      if (res.ok) {
        setSuccess(true);
        setSubject("");
        setMessage("");
      } else {
        setError("Failed to send enquiry. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 max-w-2xl mx-auto">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-extrabold tracking-tight">Submit an Enquiry</h1>
        <p className="text-muted-foreground mt-2">Have a question or need support? Reach out to us below.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-2xl border shadow-sm p-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-success mb-4" />
            <h3 className="text-xl font-bold mb-2">Enquiry Sent!</h3>
            <p className="text-muted-foreground mb-6">We have received your message and will get back to you shortly.</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold mb-1">Subject</label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                placeholder="What is this regarding?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none"
                placeholder="Type your message here..."
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send Enquiry"}
              {!submitting && <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
