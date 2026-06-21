import { Home, Users, Trophy, Ticket, LogIn } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export const Header: React.FC = () => {
  const menuItems = [
    { label: "Beranda", href: "/beranda", icon: <Home size={18} /> },
    { label: "Peserta", href: "/peserta", icon: <Users size={18} /> },
    { label: "Leaderboard", href: "/leaderboard", icon: <Trophy size={18} /> },
    { label: "Dukungan", href: "/dukungan", icon: <Ticket size={18} /> },
  ];

  // Menggunakan palet Hijau Emerald untuk kesan modern dan selaras dengan logo FORBASI
  const activeStyle = "text-emerald-700 border-b-2 border-emerald-700 font-bold"; 
  const defaultStyle = "text-slate-500 hover:text-emerald-700 font-medium";

  return (
    <header className="bg-white border-b border-slate-100 py-3 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="logo">
          <Link to="/beranda" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
              <img src="https://forbasi.or.id/logo-forbasi.png" alt="logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
                <span className="font-black text-slate-900 leading-none tracking-tight text-lg">KEJURCAB</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Voting Platform</span>
            </div>
          </Link>
        </div>

        {/* Navigation Area */}
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

          {/* Login Button Area (Hijau Emerald) */}
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
    </header>
  );
};

export default Header;