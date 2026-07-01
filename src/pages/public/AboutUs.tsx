import { Link } from "react-router-dom";
import { Globe2, Newspaper, UsersRound } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="mb-10 border-b-4 border-primary pb-6">
        <p className="text-xs font-black text-destructive uppercase tracking-widest mb-3">About Us</p>
        <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight mb-4">Social Voice News</h1>
        <p className="news-subheading text-lg text-foreground/70 leading-relaxed max-w-3xl">
          Social Voice News brings together timely reporting, community stories, campaigns, and public-interest updates for readers who want news with context and local relevance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: Newspaper, title: "Independent Coverage", text: "We focus on clear, accessible news across science, Telangana, national, international, cinema, sports, and business updates." },
          { icon: UsersRound, title: "Community First", text: "Our platform highlights campaigns, student activity, public enquiries, donations, and stories that matter to everyday readers." },
          { icon: Globe2, title: "Digital Reach", text: "We publish for a connected audience through the web, social platforms, video, and mobile-friendly news experiences." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="border border-border rounded-lg p-6 bg-slate-50">
            <Icon className="w-8 h-8 text-destructive mb-4" />
            <h2 className="text-lg font-black text-secondary mb-2">{title}</h2>
            <p className="text-sm text-foreground/70 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-7">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">Our Mission</h2>
          <p>
            Our mission is to keep readers informed with trustworthy news, useful updates, and community-driven coverage. We aim to make important stories easy to follow while giving space to civic initiatives, youth participation, and local impact.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">What We Cover</h2>
          <p>
            We cover breaking news, science and technology, state updates, national affairs, world news, entertainment, sports, business, campaigns, marketplace activity, events, and public enquiries.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">Get In Touch</h2>
          <p>
            For news tips, partnerships, corrections, or general questions, reach us through the enquiry page or email us at{" "}
            <a href="mailto:support@socialvoicenews.com" className="text-destructive hover:underline font-semibold">support@socialvoicenews.com</a>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4">
        <Link to="/enquiry" className="bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors">Contact Us</Link>
        <Link to="/" className="border border-border px-5 py-2.5 rounded-lg text-sm font-bold text-secondary hover:bg-slate-50 transition-colors">Latest News</Link>
      </div>
    </div>
  );
}
