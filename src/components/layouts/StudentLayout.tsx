import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Megaphone,
  ClipboardList,
  GraduationCap,
  Award,
  IdCard,
  Store,
  ShoppingCart,
  Package,
  HeartHandshake,
  User,
  PlusCircle,
  Search,
  HelpCircle,
  LogOut,
  Menu,
  Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function StudentLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: Megaphone, label: "Campaigns", path: "/student/campaigns" },
    { icon: ClipboardList, label: "Tasks", path: "/student/tasks" },
    { icon: GraduationCap, label: "Quizzes", path: "/student/quizzes" },
    { icon: Award, label: "Certificates", path: "/student/certificates" },
    { icon: IdCard, label: "ID Card", path: "/student/id-card" },
    { icon: Camera, label: "Selfie Frame", path: "/student/selfie-frame" },
    { icon: Store, label: "Marketplace", path: "/student/marketplace" },
    { icon: Package, label: "Orders", path: "/student/orders" },
    { icon: HeartHandshake, label: "Donations", path: "/student/donations" },
    { icon: User, label: "Profile", path: "/student/profile" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[240px] bg-secondary text-white flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="h-[72px] flex items-center px-6 border-b border-white/10 shrink-0">
          <img src="/logo.png" alt="SOCIAL NEWS" className="h-8 w-auto object-contain" />
        </div>
        
        <div className="p-6 flex items-center gap-3 border-b border-white/10 shrink-0">
          <img src={user?.avatar || "https://i.pravatar.cc/150?u=student"} alt="User" className="w-10 h-10 rounded-full border-2 border-white/20" />
          <div>
            <h3 className="font-semibold text-sm leading-tight">{user?.name || 'Student'}</h3>
            <p className="text-xs text-white/60">Level {user?.level || 1}</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group overflow-hidden ${
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-destructive rounded-lg -z-10" />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <link.icon className={`w-5 h-5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
          {/* <button className="w-full bg-destructive hover:bg-destructive/90 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
            <PlusCircle className="w-4 h-4" />
            New Impact Story
          </button> */}
          <button onClick={handleLogout} className="w-full bg-white/5 hover:bg-white/10 text-white/80 rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button 
              className="p-2 -ml-2 text-muted-foreground lg:hidden hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search campaigns, tasks, or peers..." 
                className="w-full bg-slate-100 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-4">
            <button className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold leading-none">{user?.name || 'Student'}</p>
                <p className="text-xs text-muted-foreground mt-1">Level {user?.level || 1}</p>
              </div>
              <img src={user?.avatar || "https://i.pravatar.cc/150?u=student"} alt="User" className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
