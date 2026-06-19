import { Link, useLocation } from "react-router-dom";
import { mockCategories } from "@/utils/mockData";
import { Search, Menu, LogIn } from "lucide-react";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('en-IN', dateOptions);

  return (
    <header className="w-full font-sans shadow-md z-50 sticky top-0 bg-white">
      <div className="bg-secondary text-white text-xs py-1 px-4 hidden md:flex justify-between items-center border-b border-white/20">
        <div className="flex gap-4">
          <span>{today}</span>
          <span className="text-white/50">|</span>
          <Link to="/" className="hover:text-destructive transition-colors">English</Link>
          <Link to="/" className="text-white/50 hover:text-white transition-colors">తెలుగు</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/campaigns" className="hover:text-destructive transition-colors">Campaigns</Link>
          <Link to="/marketplace" className="hover:text-destructive transition-colors">Marketplace</Link>
          <Link to="/donations" className="hover:text-destructive transition-colors">Donate</Link>
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center hover:bg-destructive cursor-pointer">f</div>
            <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center hover:bg-destructive cursor-pointer">x</div>
            <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center hover:bg-destructive cursor-pointer">yt</div>
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="SOCIAL NEWS" className="h-8 md:h-12 w-auto max-w-[200px] md:max-w-xs object-contain" />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search news..." 
              className="border border-border rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-primary w-64 bg-slate-50"
            />
            <Search className="w-4 h-4 text-foreground/50 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
          <Link to="/login" className="flex items-center gap-2 bg-destructive text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition-colors shadow-sm">
            <LogIn className="w-4 h-4" /> User Login
          </Link>
        </div>
        <button 
          className="md:hidden text-secondary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      <div className="bg-primary border-t-4 border-destructive text-white shadow-md relative">
        <nav className="max-w-7xl mx-auto px-4 hidden md:flex items-center">
          {mockCategories.map((cat) => {
            const isActive = location.pathname === cat.path;
            return (
              <Link 
                key={cat.id} 
                to={cat.path} 
                className={`py-3 px-4 font-bold text-sm hover:bg-secondary transition-colors whitespace-nowrap border-r border-white/10 last:border-0 ${isActive ? 'bg-secondary' : ''}`}
              >
                {cat.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t absolute top-full left-0 w-full shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b flex flex-col gap-4">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search news..." 
                 className="border border-border rounded w-full pl-3 pr-10 py-2 text-sm bg-slate-50"
               />
               <Search className="w-4 h-4 text-foreground/50 absolute right-3 top-1/2 -translate-y-1/2" />
             </div>
             <Link to="/login" className="flex justify-center items-center gap-2 bg-destructive text-white px-5 py-2 rounded font-bold text-sm hover:bg-red-700 transition-colors">
               <LogIn className="w-4 h-4" /> User Login
             </Link>
          </div>
          <nav className="flex flex-col">
            {mockCategories.map((cat) => (
              <Link 
                key={cat.id} 
                to={cat.path} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-6 border-b font-bold text-secondary hover:bg-slate-50"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
