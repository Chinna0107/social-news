import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, Mail, User, MessageSquare, FileText, Phone } from "lucide-react";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/enquiries";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function PublicEnquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-secondary mb-3">Thank You!</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your enquiry has been submitted successfully. Our team will review it and get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-secondary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-secondary/90 shadow-md transition-all"
          >
            Submit Another Enquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Have a question, suggestion, or need help? Fill out the form below and our team will respond promptly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div variants={fadeUp} className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-secondary to-secondary/80 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                We value your feedback and are here to assist you with any queries related to our platform, campaigns, or services.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Email</p>
                    <p className="text-sm font-semibold">support@socialnews.org</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Phone</p>
                    <p className="text-sm font-semibold">+91 9876 543 210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Response Time</p>
                    <p className="text-sm font-semibold">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                💡 <strong>Tip:</strong> For faster responses, please include your registered email and a clear subject line describing your query.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-shadow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-shadow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Subject *
                  </label>
                  <select
                    required
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-shadow"
                  >
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Campaign Support">Campaign Support</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Account Help">Account Help</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Message *
                </label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Please describe your enquiry in detail..."
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/20 resize-none transition-shadow"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm hover:bg-secondary/90 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Enquiry
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground">
                By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-secondary underline">Privacy Policy</a>.
              </p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
