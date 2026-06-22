import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    // Background bersih, konten hanya di tengah
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        {/* Outlet ini akan merender Login.tsx secara penuh */}
        <Outlet />
      </div>
    </div>
  );
}