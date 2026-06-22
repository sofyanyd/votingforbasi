import React, { useState } from "react";
import { Home, Users, Trophy, Ticket, LogIn, Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export const Header: React.FC = () => {
  // State untuk melacak apakah menu HP sedang terbuka atau tertutup
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Beranda", href: "/beranda", icon: <Home size={18} /> },
    { label: "Peserta", href: "/peserta", icon: <Users size={18} /> },
    { label: "Leaderboard", href: "/leaderboard", icon: <Trophy size={18} /> },
    { label: "Dukungan", href: "/dukungan", icon: <Ticket size={18} /> },
  ];

  // Style untuk versi Desktop (Laptop)
  const activeStyle = "text-emerald-700 border-b-2 border-emerald-700 font-bold"; 
  const defaultStyle = "text-slate-500 hover:text-emerald-700 font-medium";

  // Style untuk versi Mobile (HP) - Dibuat bentuk kotak (rounded) biar gampang diklik jari
  const mobileActiveStyle = "bg-emerald-50 text-emerald-700 font-bold";
  const mobileDefaultStyle = "text-slate-500 hover:bg-slate-50 hover:text-emerald-700 font-medium";

  return (
    <header className="bg-white border-b border-slate-100 py-3 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* ── Logo Area ── */}
        <div className="logo">
          <Link to="/beranda" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
              <img src="/forbasi.png" alt="logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
                <span className="font-black text-slate-900 leading-none tracking-tight text-lg">KEJURCAB</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Voting Platform</span>
            </div>
          </Link>
        </div>

        {/* ── Tombol Hamburger untuk HP (Hanya Muncul di Mobile) ── */}
        <button 
          className="md:hidden p-2 text-slate-500 hover:text-emerald-700 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* Jika menu terbuka tampilkan silang (X), jika tertutup tampilkan garis 3 (Menu) */}
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* ── Navigation Area (Hanya Muncul di Desktop) ── */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 transition-all duration-200 
                  ${isActive ? activeStyle : defaultStyle}`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Login Button Area */}
          <div className="pl-6 border-l border-slate-200">
             <Link 
                to="/login"
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300"
             >
                <LogIn size={18} />
                <span>Login</span>
             </Link>
          </div>
        </div>

      </div>

      {/* ── Mobile Menu Dropdown (Muncul saat tombol Hamburger diklik) ── */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              onClick={() => setIsMenuOpen(false)} // Otomatis menutup menu setelah diklik
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                ${isActive ? mobileActiveStyle : mobileDefaultStyle}`
              }
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
          
          <div className="mt-4 mb-2">
             <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)} // Otomatis menutup menu setelah diklik
                className="flex items-center justify-center gap-2 w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-300"
             >
                <LogIn size={18} />
                <span>Login</span>
             </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;