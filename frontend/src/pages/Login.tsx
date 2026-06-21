import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuthStore } from "../stores/useAuthStore";


const schema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        login(response.data.name);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Gagal login:", error);
      const message = error.response?.data?.message || "Gagal masuk. Silakan periksa koneksi internet.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 md:p-12">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Selamat Datang!</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Silakan masuk menggunakan akun voter untuk memberikan dukungan.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Input Email */}
        <div>
          <label className="block mb-2 font-bold text-slate-700 text-sm">Alamat Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register("email")}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
            />
          </div>
        </div>

        {/* Input Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-bold text-slate-700 text-sm">Kata Sandi</label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              {...register("password")}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
          {loading ? "Memverifikasi..." : "Masuk ke Akun"}
        </button>
      </form>

      <p className="text-center text-slate-500 mt-8 text-sm">
        Belum memiliki akun?{" "}
        <Link to="/register" className="text-emerald-600 font-black hover:underline">Daftar Sekarang</Link>
      </p>
    </div>
  );
}