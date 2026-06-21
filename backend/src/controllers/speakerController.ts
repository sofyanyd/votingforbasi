import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// Helper to parse bidang
const parseBidang = (bidang: string) => {
  let no_urut = "01";
  let asal_sekolah = bidang;
  
  if (bidang.startsWith("No. ") && bidang.includes(" - ")) {
    const parts = bidang.substring(4).split(" - ");
    no_urut = parts[0].trim();
    asal_sekolah = parts.slice(1).join(" - ").trim();
  }
  return { no_urut, asal_sekolah };
};

// Helper to determine category_id based on school/instansi name
const determineCategoryId = (nama: string, asal_sekolah: string): number => {
  const text = `${nama} ${asal_sekolah}`.toLowerCase();
  if (text.includes("smp") || text.includes("mts")) {
    return 1; // SMP Sederajat
  }
  return 2; // SMA/SMK/MA Sederajat
};

// GET ALL SPEAKERS (Finalists)
export const getSpeakers = async (req: Request, res: Response) => {
  try {
    const finalists = await prisma.finalists.findMany({
      orderBy: { id: "asc" }
    });
    
    // Map to frontend expected Pembicara (Speaker) format
    const speakers = finalists.map(f => ({
      id: f.id,
      nama: f.nama,
      bidang: `No. ${f.no_urut} - ${f.asal_sekolah}`,
      email: "",
      foto_url: f.foto_url
    }));
    
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pembicara/finalis", error });
  }
};

// CREATE SPEAKER (Finalist)
export const createSpeaker = async (req: Request, res: Response) => {
  try {
    const { nama, bidang, foto_url } = req.body;
    if (!nama || !bidang) {
      return res.status(400).json({ message: "Nama dan bidang harus diisi" });
    }
    
    const { no_urut, asal_sekolah } = parseBidang(bidang);
    const category_id = determineCategoryId(nama, asal_sekolah);
    
    const newFinalist = await prisma.finalists.create({
      data: {
        nama,
        no_urut,
        asal_sekolah,
        category_id,
        foto_url: foto_url || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(nama)}`
      }
    });
    
    const speaker = {
      id: newFinalist.id,
      nama: newFinalist.nama,
      bidang: `No. ${newFinalist.no_urut} - ${newFinalist.asal_sekolah}`,
      email: "",
      foto_url: newFinalist.foto_url
    };
    
    res.status(201).json(speaker);
  } catch (error) {
    console.error("Gagal membuat finalist:", error);
    res.status(500).json({ message: "Gagal membuat pembicara/finalis", error });
  }
};

// UPDATE SPEAKER (Finalist)
export const updateSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, bidang, foto_url } = req.body;
    
    const { no_urut, asal_sekolah } = parseBidang(bidang);
    const category_id = determineCategoryId(nama, asal_sekolah);
    
    const updatedFinalist = await prisma.finalists.update({
      where: { id: Number(id) },
      data: {
        nama,
        no_urut,
        asal_sekolah,
        category_id,
        foto_url: foto_url !== undefined ? foto_url : undefined
      }
    });
    
    const speaker = {
      id: updatedFinalist.id,
      nama: updatedFinalist.nama,
      bidang: `No. ${updatedFinalist.no_urut} - ${updatedFinalist.asal_sekolah}`,
      email: "",
      foto_url: updatedFinalist.foto_url
    };
    
    res.status(200).json(speaker);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui peserta", error });
  }
};

// DELETE SPEAKER (Finalist)
export const deleteSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.finalists.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Peserta berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus peserta", error });
  }
};