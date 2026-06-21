import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── IMPORT HALAMAN UTAMA (VOTING) ──
import Beranda from "./pages/Beranda"; // Ini sekarang jadi halaman Deskripsi/Home
import Peserta from "./pages/Peserta"; // Pastikan file ini sudah dibuat
import Leaderboard from "./pages/Leaderboard"; // Pastikan file ini sudah dibuat
import Dukungan from "./pages/Dukungan"; // Pastikan file ini sudah dibuat
import CatalogVote from "./pages/CatalogVote"; // Pastikan file ini sudah dibuat
import Checkout from "./pages/Checkout";


// ── IMPORT LAYOUT & AUTH ──
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ── IMPORT DASHBOARD ──
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import FinanceIndex from "./pages/dashboard/keuangan/FinanceIndex";
import PletonManagemen from "./pages/dashboard/pleton/PletonManagemen";
import UserManagemen from "./pages/dashboard/user/UserManagemen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ── 1. WEBSITE UTAMA (VOTING LKBB) ── */}
        <Route element={<MainLayout />}>
          {/* Redirect otomatis dari root ("/") ke tab deskripsi */}
          <Route path="/" element={<Navigate to="/beranda" replace />} />
          
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dukungan" element={<Dukungan />} />
          <Route path="/peserta" element={<Peserta />} />
          <Route path="/catalogvote" element={<CatalogVote />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* ── 2. LOGIN & REGISTER ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ── 3. DASHBOARD ADMIN (Route Terlindungi) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/finance" element={<FinanceIndex />} />
            <Route path="/dashboard/pleton" element={<PletonManagemen />} />
            <Route path="/dashboard/user" element={<UserManagemen />} />
          </Route>
        </Route>

        {/* ── 4. FALLBACK / 404 ── */}
        <Route path="*" element={<Navigate to="/beranda" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;