import prisma from "../lib/prisma.js";
// GET ALL QR CODES
export const getQrCodes = async (req, res) => {
    try {
        const qrCodes = await prisma.qrcodes.findMany({
            orderBy: {
                id: "desc",
            },
        });
        res.status(200).json(qrCodes);
    }
    catch (error) {
        console.error("Gagal mengambil data QR Code:", error);
        res.status(500).json({ message: "Gagal mengambil data QR Code", error: error.message });
    }
};
// CREATE NEW QR CODE
export const createQrCode = async (req, res) => {
    try {
        const { name, image, description, status } = req.body;
        if (!name || !image) {
            return res.status(400).json({ message: "Nama dan Gambar QR Code wajib diisi" });
        }
        // If status is "Aktif", make others "Non-Aktif" to have only one active QR code
        if (status === "Aktif") {
            await prisma.qrcodes.updateMany({
                where: { status: "Aktif" },
                data: { status: "Non-Aktif" },
            });
        }
        const newQr = await prisma.qrcodes.create({
            data: {
                name,
                image,
                description: description || "",
                status: status || "Aktif",
            },
        });
        res.status(201).json(newQr);
    }
    catch (error) {
        console.error("Gagal membuat QR Code:", error);
        res.status(500).json({ message: "Gagal membuat QR Code", error: error.message });
    }
};
// UPDATE QR CODE
export const updateQrCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, description, status } = req.body;
        if (!name || !image) {
            return res.status(400).json({ message: "Nama dan Gambar QR Code wajib diisi" });
        }
        // If status is updated to "Aktif", make others "Non-Aktif"
        if (status === "Aktif") {
            await prisma.qrcodes.updateMany({
                where: {
                    status: "Aktif",
                    id: { not: Number(id) }
                },
                data: { status: "Non-Aktif" },
            });
        }
        const updatedQr = await prisma.qrcodes.update({
            where: { id: Number(id) },
            data: {
                name,
                image,
                description: description || "",
                status: status || "Aktif",
            },
        });
        res.status(200).json(updatedQr);
    }
    catch (error) {
        console.error("Gagal mengupdate QR Code:", error);
        res.status(500).json({ message: "Gagal mengupdate QR Code", error: error.message });
    }
};
// DELETE QR CODE
export const deleteQrCode = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.qrcodes.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "QR Code berhasil dihapus" });
    }
    catch (error) {
        console.error("Gagal menghapus QR Code:", error);
        res.status(500).json({ message: "Gagal menghapus QR Code", error: error.message });
    }
};
