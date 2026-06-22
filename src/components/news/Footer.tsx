import { Link } from "react-router-dom";
import { useState } from "react";
import { mockCategories } from "@/utils/mockData";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-sm text-success font-semibold">Thanks for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your Email"
        required
        className="bg-white/10 border border-white/20 px-3 py-2 text-sm w-full focus:outline-none focus:border-white"
      />
      <button type="submit" className="bg-destructive text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors">
        Go
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6 border-t-[8px] border-primary mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white/10 p-2 rounded-lg inline-block mb-4">
              <img src="/logo.png" alt="SOCIAL NEWS" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-white/60 text-sm mb-6 pr-4 leading-relaxed">
              Your trusted source for local community impact, volunteer campaigns, and the latest breaking news.
            </p>
            <div className="flex gap-3">
  <a
    href="https://www.facebook.com/share/17cf2y99T8/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-destructive transition-colors"
  >
    <FaFacebookF size={16} />
  </a>

  <a
    href="https://x.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-destructive transition-colors"
  >
    <FaXTwitter size={16} />
  </a>

  <a
    href="https://www.instagram.com/socialvoice._?igsh=ZWQ3bXdtY3U1MGp2"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-destructive transition-colors"
  >
    <FaInstagram size={16} />
  </a>

  <a
    href="https://youtube.com/@voiceoftelugustates?si=Qqy7bWq60Qk2xbAF"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-destructive transition-colors"
  >
    <FaYoutube size={16} />
  </a>
</div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2">Categories</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {mockCategories.filter(c => c.id !== "home").slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link to={cat.path} className="hover:text-destructive transition-colors">{cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/campaigns" className="hover:text-destructive transition-colors">Campaigns</Link></li>
              <li><Link to="/marketplace" className="hover:text-destructive transition-colors">Marketplace</Link></li>
              <li><Link to="/donations" className="hover:text-destructive transition-colors">Donate</Link></li>
              <li><Link to="/enquiry" className="hover:text-destructive transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-destructive transition-colors font-bold text-white">User Login</Link></li>
              <li><Link to="/register" className="hover:text-destructive transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2">Subscribe</h3>
            <p className="text-sm text-white/70 mb-4">Get the latest news directly to your inbox.</p>
            <SubscribeForm />
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>© {new Date().getFullYear()} Social News Network. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-white">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
