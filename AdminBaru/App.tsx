import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── IMPORT HALAMAN UTAMA (VOTING) ──
import Deskripsi from "./pages/Deskripsi";
import Finalis from "./pages/Finalis";
import Leaderboard from "./pages/Leaderboard";
import Dukungan from "./pages/Dukungan";
import CatalogVote from "./pages/CatalogVote";

// Layouts & Auth
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import FinanceIndex from "./pages/dashboard/keuangan/FinanceIndex";
import AnggotaManagemen from "./pages/dashboard/anggota/AnggotaManagemen";
import UserManagemen from "./pages/dashboard/user/UserManagemen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── 1. WEBSITE UTAMA (VOTING LKBB) ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/voting/deskripsi" replace />} />
          <Route path="/voting/deskripsi" element={<Deskripsi />} />
          <Route path="/voting/leaderboard" element={<Leaderboard />} />
          <Route path="/voting/dukungan" element={<Dukungan />} />
          <Route path="/voting/finalis" element={<Finalis />} />
          <Route path="/voting/catalogvote" element={<CatalogVote />} />
        </Route>

        {/* ── 2. LOGIN & REGISTER ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ── 3. DASHBOARD ADMIN ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Fokus utama pada Finance */}
            <Route path="/dashboard/finance" element={<FinanceIndex />} />
            <Route path="/dashboard/anggota" element={<AnggotaManagemen />} />
            <Route path="/dashboard/user" element={<UserManagemen />} />
          </Route>
        </Route>

        {/* ── 4. FALLBACK ── */}
        <Route path="*" element={<Navigate to="/voting/deskripsi" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;