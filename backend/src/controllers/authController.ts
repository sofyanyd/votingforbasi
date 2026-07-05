import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const login = async (req: Request, res: Response) => {
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

    const timestamp = Date.now();
    const secret = process.env.JWT_SECRET || "default_fallback_secret_key_123_forbasi";
    const signature = crypto.createHmac("sha256", secret).update(`${user.id}-${timestamp}`).digest("hex");
    const token = `admin-token-${user.id}-${timestamp}-${signature}`;

    res.status(200).json({
      message: "Login berhasil",
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// GET ALL USERS (Admins & Voters)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { id: "asc" }
    });
    
    // Map to frontend UserAdmin format
    const mapped = users.map(u => ({
      id: String(u.id),
      username: u.name,
      email: u.email,
      role: u.role,
      password: "" // Do not send password hashes to client
    }));
    
    res.status(200).json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data user", error });
  }
};

// CREATE USER ADMIN
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password harus diisi" });
    }

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = await prisma.users.create({
      data: {
        name: username,
        email: email.toLowerCase(),
        password_hash,
        role: role || "admin"
      }
    });

    res.status(201).json({
      id: String(newUser.id),
      username: newUser.name,
      email: newUser.email,
      role: newUser.role,
      password: ""
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat user admin", error });
  }
};

// UPDATE USER ADMIN
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const data: any = {
      name: username,
      email: email?.toLowerCase(),
      role
    };

    if (password && password.trim() !== "") {
      const salt = bcrypt.genSaltSync(10);
      data.password_hash = bcrypt.hashSync(password, salt);
    }

    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data
    });

    res.status(200).json({
      id: String(updatedUser.id),
      username: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      password: ""
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user admin", error });
  }
};

// DELETE USER ADMIN
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "User admin berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user admin", error });
  }
};
