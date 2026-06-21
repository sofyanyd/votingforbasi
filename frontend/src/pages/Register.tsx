import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (_data: any) => {
    setLoading(true);
    // Simulasi proses registrasi
    setTimeout(() => {
      alert("Akun berhasil dibuat! Silakan login.");
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md p-8 md:p-12">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Buat Akun Baru</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Daftarkan dirimu untuk mulai mendukung pleton favorit di KEJURCAB 2026.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Input Nama */}
        <div>
          <label className="block mb-2 font-bold text-slate-700 text-sm">Nama Lengkap</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register("name")}
              placeholder="Nama Lengkap"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
            />
          </div>
          {errors.name && <p className="text-xs font-bold text-red-500 mt-2 ml-1">{errors.name.message as string}</p>}
        </div>

        {/* Input Email */}
        <div>
          <label className="block mb-2 font-bold text-slate-700 text-sm">Alamat Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register("email")}
              placeholder="contoh@email.com"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
            />
          </div>
          {errors.email && <p className="text-xs font-bold text-red-500 mt-2 ml-1">{errors.email.message as string}</p>}
        </div>

        {/* Input Password */}
        <div>
          <label className="block mb-2 font-bold text-slate-700 text-sm">Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
            />
          </div>
          {errors.password && <p className="text-xs font-bold text-red-500 mt-2 ml-1">{errors.password.message as string}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-bold transition-all shadow-lg ${
            loading 
            ? "bg-emerald-400 cursor-not-allowed shadow-none" 
            : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 shadow-emerald-200"
          }`}
        >
          {loading ? "Memproses..." : (
            <>
              <span>Daftar Sekarang</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-slate-500 mt-8 text-sm">
        Sudah memiliki akun?{" "}
        <Link to="/login" className="text-emerald-600 font-black hover:underline underline-offset-4 transition-all">
          Masuk Sekarang
        </Link>
      </p>
    </div>
  );
}