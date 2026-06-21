import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper untuk menandai menu yang aktif
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#7B1D3F] flex flex-col justify-between text-white shadow-xl">
        <div>
          {/* Logo Section - Menggunakan logo resmi dari Beranda */}
          <div className="flex items-center justify-center px-6 h-24 border-b border-white/10">
            <img
              src="https://www.invofest-harkatnegeri.com/assets/nav-logo.png"
              alt="INVOFEST Logo"
              className="h-12 w-auto brightness-0 invert object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4 mt-4">
            {[
              { label: "Dashboard", to: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { label: "Kategori Event", to: "/dashboard/category", icon: "M4 6h16M4 12h16M4 18h7" },
              { label: "Event", to: "/dashboard/event", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { label: "Pembicara", to: "/dashboard/pembicara", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" },
            ].map((menu) => (
              <Link
                key={menu.to}
                to={menu.to}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group ${
                  isActive(menu.to)
                    ? "bg-white text-[#7B1D3F] shadow-lg"
                    : "hover:bg-white/10 text-pink-100"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon} />
                </svg>
                <span className="font-semibold text-sm">{menu.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-red-600 w-full rounded-xl transition-all duration-200 font-bold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10">
           <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm font-medium">Administrator</span>
              <div className="w-10 h-10 rounded-full bg-[#7B1D3F] flex items-center justify-center text-white font-bold shadow-sm">A</div>
           </div>
        </header>

        <div className="p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
}