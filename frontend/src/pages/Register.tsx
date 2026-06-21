import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// 1. Skema Validasi (Username dihapus)
const schema = z
    .object({
        email: z.string().trim().toLowerCase().email("Format email tidak valid"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi password tidak cocok",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof schema>;

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Simpan email dan password ke LocalStorage
            const userToSave = {
                email: data.email,
                password: data.password,
            };

            localStorage.setItem("registeredUser", JSON.stringify(userToSave));

            alert("Pendaftaran berhasil! Silakan login.");
            navigate("/login");
        } catch (error) {
            console.error("Register Error:", error);
            alert("Terjadi kesalahan saat mendaftar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#7B1D3F]">Registrasi Akun</h1>
                    <p className="text-gray-500 mt-2">Lengkapi data untuk bergabung</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Masukan email anda"
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#7B1D3F] outline-none transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Masukan password"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#7B1D3F] outline-none transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi
                            </label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="Konfirmasi password"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#7B1D3F] outline-none transition-all ${errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors mt-4 ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#7B1D3F] hover:bg-[#5a152e]"
                            }`}
                    >
                        {loading ? "Memproses..." : "Daftar Sekarang"}
                    </button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-[#7B1D3F] font-bold hover:underline">
                        Login di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}