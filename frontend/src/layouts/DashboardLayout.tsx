import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  Trophy, 
  PlusCircle, 
  LogOut,
  Menu,
  UserCog
} from "lucide-react";

export default function DashboardLayout() {
  // Initialize sidebar open based on screen size (default open on desktop, closed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Adjust sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); // Clear token to trigger ProtectedRoute redirect
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, disabled = false }: { to: string, icon: any, label: string, disabled?: boolean }) => {
    const active = isActive(to);

    if (disabled) {
      return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60 transition-all duration-300 ${!isSidebarOpen && "justify-center px-0"}`}>
          <Icon size={20} className="text-gray-450" />
          {isSidebarOpen && <span className="text-sm truncate">{label}</span>}
        </div>
      );
    }

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
          active
            ? "bg-[#00a54f]/10 text-[#00a54f] font-semibold"
            : "text-gray-600 hover:bg-gray-100 font-medium"
        } ${!isSidebarOpen && "justify-center px-0"}`}
        title={!isSidebarOpen ? label : ""}
      >
        <Icon size={20} className={active ? "text-[#00a54f]" : "text-gray-500"} />
        {isSidebarOpen && <span className="text-sm truncate">{label}</span>}
        {isSidebarOpen && active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00a54f]"></div>
        )}
      </Link>
    );
  };

  return (
    <div className="flex w-full min-h-screen bg-emerald-50/40 relative">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        style={{ willChange: "width, transform" }}
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-gray-300 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? "w-56 translate-x-0" 
            : "w-20 -translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 h-16 overflow-hidden flex-shrink-0">
          <div className="bg-[#00a54f] p-1.5 rounded-lg w-8 h-8 flex-shrink-0 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          {isSidebarOpen && (
            <div className="whitespace-nowrap min-w-0 flex-1">
              <h1 className="font-extrabold text-gray-800 text-sm leading-tight tracking-tight truncate">
                FORBASI TEGAL
              </h1>
              <p className="text-[10px] font-bold text-[#00a54f] tracking-wider">ADMIN PANEL</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/dashboard/finance" icon={Banknote} label="Keuangan" />
          <NavItem to="/dashboard/category" icon={Users} label="Kategori Pleton" />
          <NavItem to="/dashboard/pleton" icon={Users} label="Pleton" />
          <NavItem to="/dashboard/user" icon={UserCog} label="User Admin" />
          {isSidebarOpen && (
            <div className="mt-6 mb-2 px-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">EVENT</p>
            </div>
          )}
          
          <NavItem to="#" icon={PlusCircle} label="Kategori Event" disabled={true} />
          <NavItem to="#" icon={PlusCircle} label="Event" disabled={true} />
        </nav>

        <div className="p-4 border-t border-gray-300 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm ${!isSidebarOpen && "justify-center px-0"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-emerald-50/40 border-b border-gray-300 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-white transition-colors flex-shrink-0"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-extrabold text-[#00a54f] text-sm sm:text-base md:text-lg leading-tight tracking-tight truncate">
              DASHBOARD FORBASI <span className="hidden xs:inline">KOTA TEGAL</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">Minggu, 21 Juni 2026</span> 
            <div className="flex items-center gap-2 sm:gap-3 bg-white/50 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full border border-emerald-100">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00a54f]/20 flex items-center justify-center text-[#00a54f] font-bold text-xs">
                A
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#00a54f]">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}