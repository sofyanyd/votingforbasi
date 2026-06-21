import { Outlet, Link, useLocation } from "react-router-dom";

export default function MainLayout() {
  // Mengambil informasi URL saat ini untuk menandai menu mana yang sedang aktif
  const location = useLocation();

  // Daftar menu navigasi untuk web voting
  const navMenus = [
    { label: "Deskripsi", path: "/voting/deskripsi" },
    { label: "Finalis", path: "/voting/finalis" },
    { label: "Leaderboard", path: "/voting/leaderboard" },
    { label: "Dukungan", path: "/voting/dukungan" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. HEADER / NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo atau Judul Acara */}
            <div className="flex-shrink-0 flex items-center">
              {/* Kamu bisa ganti tag <span> ini dengan tag <img> untuk logo acara */}
              <span className="text-xl font-black text-blue-800 tracking-tight">
                FORBASI KOTA TEGAL
              </span>
            </div>

            {/* Menu Navigasi (Desktop) */}
            <nav className="hidden md:flex space-x-8">
              {navMenus.map((menu) => {
                // Mengecek apakah menu sedang aktif
                const isActive = location.pathname.includes(menu.path);
                
                return (
                  <Link
                    key={menu.label}
                    to={menu.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {menu.label}
                  </Link>
                );
              })}
            </nav>

            {/* Tombol Login / User Profile (Opsional) */}
            <div className="flex items-center">
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition"
              >
                Login Voter
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT (Konten Berubah-ubah disini) */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* <Outlet /> akan me-render halaman dari folder /pages sesuai URL */}
        <Outlet />
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t mt-auto py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 Voting Platform. Recreated by You.</p>
        </div>
      </footer>
    </div>
  );
}