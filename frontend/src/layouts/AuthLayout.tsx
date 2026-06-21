import { Outlet } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Container Utama: Harus identik dengan Login.tsx */}
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 flex overflow-hidden border border-slate-100 min-h-[600px]">
        
        {/* KIRI: VISUAL BANNER (Sama dengan sisi kanan di Login.tsx) */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-900 p-12 overflow-hidden flex-col justify-between">
          
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          {/* Top Content */}
          <div className="relative z-10 flex justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-300" />
              Sistem Voting Aman & Terenkripsi
            </div>
          </div>

          {/* Center/Bottom Content */}
          <div className="relative z-10 text-white mt-auto">
            <Sparkles size={40} className="text-emerald-300 mb-6 opacity-80" />
            <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">
              Satu Suaramu,<br/>Sangat Berarti.
            </h2>
            <p className="text-emerald-100/80 text-base leading-relaxed max-w-sm font-medium">
              Transparansi penuh dalam penentuan Juara Favorit. Dukung pleton terbaikmu untuk meraih kemenangan di ajang KEJURCAB 2026.
            </p>
            
            {/* Visual element dekoratif */}
            <div className="flex -space-x-3 mt-8">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-slate-600">01</div>
              <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-slate-600">02</div>
              <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-slate-700">03</div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-white">+5k</div>
            </div>
            <p className="text-xs text-emerald-200 mt-3 font-medium">Bergabung bersama ribuan voter lainnya.</p>
          </div>
        </div>

        {/* KANAN: Outlet (Login/Register di-render di sini) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}