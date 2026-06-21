import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categoryEvent.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data kategori", error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.categoryEvent.findUnique({
      where: { id: Number(id) },
    });
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil kategori", error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ message: "Nama kategori harus diisi" });
    const newCategory = await prisma.categoryEvent.create({ data: { nama } });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat kategori", error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    const updatedCategory = await prisma.categoryEvent.update({
      where: { id: Number(id) },
      data: { nama },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui kategori", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.categoryEvent.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kategori", error });
  }
};