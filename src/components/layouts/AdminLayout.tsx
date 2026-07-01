import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BarChart3,
  Users,
  Megaphone,
  Store,
  GraduationCap,
  HeartHandshake,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  ClipboardList,
  SendHorizonal,
  Package,
  Newspaper,
  Camera,
  Tv2
} from "lucide-react";

export function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarLinks = [
    { icon: BarChart3, label: "Analytics", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Megaphone, label: "Campaign Management", path: "/admin/campaigns" },
    { icon: Store, label: "Marketplace", path: "/admin/marketplace" },
    { icon: Package, label: "Orders", path: "/admin/orders" },
    { icon: ClipboardList, label: "Tasks", path: "/admin/tasks" },
    { icon: GraduationCap, label: "Quizzes", path: "/admin/quizzes" },
    { icon: SendHorizonal, label: "Submissions", path: "/admin/submissions" },
    { icon: HeartHandshake, label: "Donation Tracking", path: "/admin/donations" },
    { icon: MessageSquare, label: "Enquiries", path: "/admin/enquiries" },
    { icon: Newspaper, label: "News Management", path: "/admin/news" },
    { icon: Camera, label: "Selfie Management", path: "/admin/selfie-management" },
    { icon: Tv2, label: "Advertisements", path: "/admin/advertisements" },
    // { icon: Settings, label: "CMS", path: "/admin/content" },
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
      <aside className={`w-[260px] bg-secondary text-white flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="h-[90px] flex flex-col justify-center px-6 border-b border-white/10 shrink-0">
          <img src="/logo.png" alt="SOCIAL NEWS Admin" className="h-8 w-auto object-contain mb-1" />
          <span className="text-[10px] text-white/50 tracking-widest uppercase">Enterprise Control</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group overflow-hidden ${
                  isActive ? "text-white shadow-md shadow-destructive/20" : "text-white/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive to-destructive/80 rounded-xl -z-10" />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <link.icon className={`w-5 h-5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Admin" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-semibold text-sm leading-tight">Alex Rivera</h3>
              <p className="text-xs text-white/50">System Admin</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 shrink-0">
           <Link to="/login" className="w-full bg-white/5 hover:bg-white/10 text-white/80 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Log Out
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button 
              className="p-2 -ml-2 text-muted-foreground lg:hidden hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search analytics, users, or campaigns..." 
                className="w-full bg-slate-100 rounded-full pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-4">
             <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded shadow-sm">
              v2.4.0 PRODUCTION
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
