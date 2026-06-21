import { Request, Response } from "express";

// In-memory events to prevent database crashes since event is not in forbasi.sql
let inMemoryEvents = [
  {
    id: 1,
    nama: "LKBB KEJURCAB Tegal 2026",
    lokasi: "Stadion Utama Tegal",
    tanggal: "2026-10-26T00:00:00.000Z",
    deskripsi: "Kompetisi baris berbaris tingkat cabang se-Tegal.",
    categoryId: 1,
    pembicaraId: 1,
    category: { nama: "SMP Sederajat" },
    pembicara: { nama: "SMP N 2 Tegal", bidang: "No. 01 - SMP N 2 Tegal" }
  }
];

export const getEvents = async (req: Request, res: Response) => {
  res.status(200).json(inMemoryEvents);
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { nama, lokasi, tanggal, deskripsi, categoryId, pembicaraId } = req.body;
    if (!nama || !lokasi || !tanggal) {
      return res.status(400).json({ message: "Data wajib diisi semua!" });
    }

    const newEvent = {
      id: inMemoryEvents.length > 0 ? Math.max(...inMemoryEvents.map(e => e.id)) + 1 : 1,
      nama,
      lokasi,
      tanggal: new Date(tanggal).toISOString(),
      deskripsi: deskripsi || "",
      categoryId: Number(categoryId),
      pembicaraId: Number(pembicaraId),
      category: { nama: Number(categoryId) === 1 ? "SMP Sederajat" : "SMA/SMK/MA Sederajat" },
      pembicara: { nama: "Pleton Terpilih", bidang: "No. 01 - Pleton Terpilih" }
    };
    inMemoryEvents.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat event", error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, lokasi, tanggal, deskripsi, categoryId, pembicaraId } = req.body;

    const eventIndex = inMemoryEvents.findIndex(e => e.id === Number(id));
    if (eventIndex === -1) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    const updatedEvent = {
      ...inMemoryEvents[eventIndex],
      nama: nama || inMemoryEvents[eventIndex].nama,
      lokasi: lokasi || inMemoryEvents[eventIndex].lokasi,
      tanggal: tanggal ? new Date(tanggal).toISOString() : inMemoryEvents[eventIndex].tanggal,
      deskripsi: deskripsi || inMemoryEvents[eventIndex].deskripsi,
      categoryId: categoryId ? Number(categoryId) : inMemoryEvents[eventIndex].categoryId,
      pembicaraId: pembicaraId ? Number(pembicaraId) : inMemoryEvents[eventIndex].pembicaraId,
    };
    inMemoryEvents[eventIndex] = updatedEvent;
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui event", error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    inMemoryEvents = inMemoryEvents.filter(e => e.id !== Number(id));
    res.status(200).json({ message: "Event berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus event", error });
  }
};