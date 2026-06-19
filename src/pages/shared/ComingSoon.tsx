import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-extrabold text-secondary mb-3">Under Construction</h2>
      <p className="text-foreground/70 max-w-md mx-auto mb-8">
        This section is currently being built. Check back soon for updates and new features!
      </p>
      <Link to="/" className="flex items-center gap-2 text-sm font-bold bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
