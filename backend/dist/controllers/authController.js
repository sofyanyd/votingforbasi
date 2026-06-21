import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password harus diisi" });
        }
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Hanya administrator yang dapat masuk" });
        }
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        const token = `admin-token-${user.id}-${Date.now()}`;
        res.status(200).json({
            message: "Login berhasil",
            token,
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
};
