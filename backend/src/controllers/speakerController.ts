import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// GET ALL SPEAKERS
export const getSpeakers = async (req: Request, res: Response) => {
  try {
    const speakers = await prisma.pembicara.findMany();
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pembicara", error });
  }
};

// CREATE SPEAKER
export const createSpeaker = async (req: Request, res: Response) => {
  try {
    const { nama, bidang } = req.body;
    if (!nama || !bidang) {
      return res.status(400).json({ message: "Nama dan bidang harus diisi" });
    }
    const newSpeaker = await prisma.pembicara.create({
      data: { nama, bidang },
    });
    res.status(201).json(newSpeaker);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat pembicara", error });
  }
};

// UPDATE SPEAKER
export const updateSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, bidang } = req.body;
    const updatedSpeaker = await prisma.pembicara.update({
      where: { id: Number(id) },
      data: { nama, bidang },
    });
    res.status(200).json(updatedSpeaker);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui pembicara", error });
  }
};

// DELETE SPEAKER
export const deleteSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pembicara.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Pembicara berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pembicara", error });
  }
};