import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <section className="bg-slate-50 p-6 md:p-8 rounded-xl border border-border mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-destructive uppercase tracking-widest mb-2 block">
              Get in Touch
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-secondary mb-4 leading-tight">
              Contact Social News
            </h2>
            <p className="text-sm text-foreground/70 mb-8 leading-relaxed">
              Have an impactful local story, want to launch a community campaign, or have feedback about our news network? Reach out to our dedicated editorial and support team.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Headquarters</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    SNN Tower, Plot 42, Hitec City Phase 2, Madhapur, Hyderabad, TS, 500081
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Phone Support</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    +91 40 4829 5678 (Mon - Sat, 9 AM - 6 PM IST)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Email Editorial</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    editorial@socialnewsnetwork.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Response Time</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    We generally respond to all inquiries within 24-48 business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Connect on Social</h4>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-destructive hover:text-white cursor-pointer transition-all duration-300">f</a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-destructive hover:text-white cursor-pointer transition-all duration-300">x</a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-destructive hover:text-white cursor-pointer transition-all duration-300">in</a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-destructive hover:text-white cursor-pointer transition-all duration-300">yt</a>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-border/50 shadow-sm flex flex-col justify-center">
          {status === "success" ? (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-2">Message Sent!</h3>
              <p className="text-foreground/70 text-sm max-w-md mx-auto mb-6">
                Thank you for reaching out to Social News. Your message has been successfully received, and a representative will follow up with you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-2.5 bg-primary hover:bg-secondary text-white font-bold rounded-lg transition-colors text-sm shadow-sm cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-secondary">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={status === "submitting"}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 transition-all ${
                      errors.name ? "border-destructive ring-2 ring-destructive/10" : "border-border"
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-destructive flex items-center gap-1 font-medium mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-secondary">
                    Your Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    disabled={status === "submitting"}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 transition-all ${
                      errors.email ? "border-destructive ring-2 ring-destructive/10" : "border-border"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-destructive flex items-center gap-1 font-medium mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-secondary">
                  Subject <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  disabled={status === "submitting"}
                  className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 transition-all ${
                    errors.subject ? "border-destructive ring-2 ring-destructive/10" : "border-border"
                  }`}
                />
                {errors.subject && (
                  <span className="text-[11px] text-destructive flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-bold text-secondary">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your query or message here..."
                  rows={4}
                  disabled={status === "submitting"}
                  className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 transition-all resize-none ${
                    errors.message ? "border-destructive ring-2 ring-destructive/10" : "border-border"
                  }`}
                />
                {errors.message && (
                  <span className="text-[11px] text-destructive flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 w-full sm:w-auto self-end bg-destructive hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow hover:shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
