import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
});

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    setLoading(true);

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();

    // LOGIKA MULTI-USER
    if (cleanEmail === "pranadaalfath@gmail.com" && cleanPassword === "24090027") {
      // Skenario User 1: Admin
      localStorage.setItem("token", "token_user");
      alert("Login berhasil!");
      navigate("/");
    } else if (cleanEmail === "admin@gmail.com" && cleanPassword === "12345678") {
      // Skenario User 2: User Biasa
      localStorage.setItem("token", "token_admin");
      alert("Login berhasil sebagai Admin!");
      navigate("/dashboard");
    } else {
      // Skenario Gagal
      alert("Email atau Password salah");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#7B1D3F] mb-2">
          Selamat Datang
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Silahkan login untuk melanjutkan
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 text-sm">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Masukan email"
              className={`w-full px-3 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-[#7B1D3F] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 text-sm">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Masukan Password"
              className={`w-full px-3 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-[#7B1D3F] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7B1D3F] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#5a152e] transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-gray-500 mt-6 text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="text-[#7B1D3F] font-semibold">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}