import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* <Outlet /> akan menampilkan halaman (Finalis, Dukungan, dll) di bawah Header */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}