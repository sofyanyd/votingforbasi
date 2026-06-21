import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Panggil Header yang sudah kita buat sebelumnya */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto">
        {/* <Outlet /> akan menampilkan halaman (Finalis, Dukungan, dll) di bawah Header */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}