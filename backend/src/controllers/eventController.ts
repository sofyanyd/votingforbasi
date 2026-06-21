import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// 1. GET ALL EVENTS (Include Category & Speaker)
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
        pembicara: true,
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data event", error });
  }
};

// 2. CREATE EVENT
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { nama, lokasi, tanggal, deskripsi, categoryId, pembicaraId } = req.body;

    console.log("Data masuk dari Postman:", req.body);

    if (!nama || !lokasi || !tanggal || !categoryId || !pembicaraId) {
      return res.status(400).json({ message: "Data wajib diisi semua, tot!" });
    }

    const newEvent = await prisma.event.create({
      data: {
        nama,
        lokasi,
        tanggal: new Date(tanggal),
        deskripsi: deskripsi || "",
        categoryId: Number(categoryId),   
        pembicaraId: Number(pembicaraId), 
      },
    });

    res.status(201).json(newEvent);
  } catch (error: any) {
    console.error("Error Prisma Detail:", error);
    res.status(500).json({ message: "Gagal membuat event", error });
  }
};

// 3. UPDATE EVENT
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, lokasi, tanggal, deskripsi, categoryId, pembicaraId } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        nama,
        lokasi,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        deskripsi,
        categoryId: categoryId ? Number(categoryId) : undefined,
        pembicaraId: pembicaraId ? Number(pembicaraId) : undefined,
      },
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui event", error });
  }
};

// 4. DELETE EVENT
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Event berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus event", error });
  }
};