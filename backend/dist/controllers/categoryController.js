import prisma from "../lib/prisma.js";
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kategori", error });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.categories.findUnique({
            where: { id: Number(id) },
        });
        if (!category)
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Gagal mengambil kategori", error });
    }
};
export const createCategory = async (req, res) => {
    try {
        const { nama, deskripsi } = req.body;
        if (!nama)
            return res.status(400).json({ message: "Nama kategori harus diisi" });
        const newCategory = await prisma.categories.create({ data: { nama, deskripsi } });
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: "Gagal membuat kategori", error });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, deskripsi } = req.body;
        const updatedCategory = await prisma.categories.update({
            where: { id: Number(id) },
            data: { nama, deskripsi },
        });
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memperbarui kategori", error });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.categories.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Kategori berhasil dihapus" });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal menghapus kategori", error });
    }
};
