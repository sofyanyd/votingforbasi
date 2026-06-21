import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── IMPORT HALAMAN UTAMA (VOTING) ──
import Deskripsi from "./pages/Deskripsi"; // Ini sekarang jadi halaman Deskripsi/Home
import Finalis from "./pages/Finalis"; // Pastikan file ini sudah dibuat
import Leaderboard from "./pages/Leaderboard"; // Pastikan file ini sudah dibuat
import Dukungan from "./pages/Dukungan"; // Pastikan file ini sudah dibuat
import CatalogVote from "./pages/CatalogVote"; // Pastikan file ini sudah dibuat

// ── IMPORT LAYOUT & AUTH ──
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ── IMPORT DASHBOARD ──
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import CategoryIndex from "./pages/dashboard/kategori/CategoryIndex";
import CategoryCreate from "./pages/dashboard/kategori/CategoryCreate";
import CategoryEdit from "./pages/dashboard/kategori/CategoryEdit";
import EventIndex from "./pages/dashboard/event/EventIndex";
import EventCreate from "./pages/dashboard/event/EventCreate";
import EventEdit from "./pages/dashboard/event/EventEdit";
import PembicaraIndex from "./pages/dashboard/pembicara/PembicaraIndex";
import PembicaraCreate from "./pages/dashboard/pembicara/PembicaraCreate";
import PembicaraEdit from "./pages/dashboard/pembicara/PembicaraEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ── 1. WEBSITE UTAMA (VOTING LKBB) ── */}
        <Route element={<MainLayout />}>
          {/* Redirect otomatis dari root ("/") ke tab deskripsi */}
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

        {/* ── 3. DASHBOARD ADMIN (Route Terlindungi) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Manajemen Kategori */}
            <Route path="/dashboard/category" element={<CategoryIndex />} />
            <Route path="/dashboard/category/create" element={<CategoryCreate />} />
            <Route path="/dashboard/category/edit/:id" element={<CategoryEdit />} />

            {/* Manajemen Event (Bisa diubah jadi Manajemen Lomba/Vote nanti) */}
            <Route path="/dashboard/event" element={<EventIndex />} />
            <Route path="/dashboard/event/create" element={<EventCreate />} />
            <Route path="/dashboard/event/edit/:id" element={<EventEdit />} />

            {/* Manajemen Pembicara (Bisa diubah jadi Manajemen Pleton/Peserta nanti) */}
            <Route path="/dashboard/pembicara" element={<PembicaraIndex />} />
            <Route path="/dashboard/pembicara/create" element={<PembicaraCreate />} />
            <Route path="/dashboard/pembicara/edit/:id" element={<PembicaraEdit />} />
          </Route>
        </Route>

        {/* ── 4. FALLBACK / 404 ── */}
        <Route path="*" element={<Navigate to="/voting/deskripsi" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;