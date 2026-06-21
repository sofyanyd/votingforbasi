import { Home, Trophy, Users, Monitor, Mic2, LogIn } from "lucide-react"; // Icon disesuaikan agar lebih mirip
import { NavLink } from "react-router-dom";

export const Header: React.FC = () => {
  const menuItems = [
    { label: "Beranda", href: "/", icon: <Home size={18} /> },
    { label: "Competition", href: "/competition", icon: <Trophy size={18} /> },
    { label: "Seminar", href: "/seminar", icon: <Users size={18} /> },
    { label: "Workshop", href: "/workshop", icon: <Monitor size={18} /> },
    { label: "Talkshow", href: "/talkshow", icon: <Mic2 size={18} /> },
    { label: "Login", href: "/login", icon: <LogIn size={18} /> },
  ];

  // Sesuaikan warna dengan brand INVOFEST (Merah Marun)
  const activeStyle = "text-[#7B1D3F] border-b-2 border-[#7B1D3F]"; 
  const defaultStyle = "text-slate-700 hover:text-[#7B1D3F]";

  return (
    // Background diubah jadi putih agar logo kelihatan jelas
    <header className="bg-white text-slate-800 py-2 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="logo">
          <img
            src="https://www.invofest-harkatnegeri.com/assets/nav-logo.png"
            alt="logo"
            className="h-14 md:h-16 object-contain"
          />
        </div>

        {/* Navigation Area */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 font-semibold transition-all duration-200 
                  ${isActive ? activeStyle : defaultStyle}`
              }
            >
              {item.icon}
              <span className="text-sm lg:text-base">{item.label}</span>
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default Header;