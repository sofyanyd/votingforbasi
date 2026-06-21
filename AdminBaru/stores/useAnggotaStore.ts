import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Anggota {
  id: string;
  namaKlub: string;
  sekolah: string;
  email: string;
  telepon: string;
  foto: string; // Base64 data URL or external URL or SVG
  statusKta: "Aktif" | "Pending" | "Ditolak";
}

interface AnggotaState {
  anggotaList: Anggota[];
  addAnggota: (anggota: Omit<Anggota, "id">) => void;
  updateAnggota: (id: string, updated: Omit<Anggota, "id">) => void;
  deleteAnggota: (id: string) => void;
}

// Initial seed data with SVG Data URLs for avatars
const seedAnggota: Anggota[] = [
  {
    id: "ANG-101",
    namaKlub: "Paskagama Sakti",
    sekolah: "SMK N 3 KOTA TEGAL",
    email: "paskagama.sakti@gmail.com",
    telepon: "081234567890",
    foto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%2300a54f"/><text x="50" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">PS</text></svg>`,
    statusKta: "Aktif",
  },
  {
    id: "ANG-102",
    namaKlub: "Pasgawira",
    sekolah: "SMK Harapan Bersama Kota Tegal",
    email: "pasgawira.tegal@gmail.com",
    telepon: "087654321098",
    foto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%236366f1"/><text x="50" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">PW</text></svg>`,
    statusKta: "Aktif",
  },
  {
    id: "ANG-103",
    namaKlub: "Satria Bahari",
    sekolah: "SMA N 1 TEGAL",
    email: "satria.bahari@sma1tegal.sch.id",
    telepon: "082345678901",
    foto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%2306b6d4"/><text x="50" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">SB</text></svg>`,
    statusKta: "Pending",
  },
  {
    id: "ANG-104",
    namaKlub: "Bhayangkara Club",
    sekolah: "SMA N 2 KOTA TEGAL",
    email: "bhayangkara.club@gmail.com",
    telepon: "089876543210",
    foto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23f59e0b"/><text x="50" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">BC</text></svg>`,
    statusKta: "Aktif",
  },
  {
    id: "ANG-105",
    namaKlub: "Ganesha Jaya",
    sekolah: "SMA N 3 KOTA TEGAL",
    email: "ganeshajaya@sma3tegal.sch.id",
    telepon: "085678901234",
    foto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23ef4444"/><text x="50" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">GJ</text></svg>`,
    statusKta: "Ditolak",
  },
];

export const useAnggotaStore = create<AnggotaState>()(
  persist(
    (set) => ({
      anggotaList: seedAnggota,
      addAnggota: (anggota) =>
        set((state) => {
          const newId = `ANG-${Math.floor(100 + Math.random() * 900)}`;
          return {
            anggotaList: [...state.anggotaList, { ...anggota, id: newId }],
          };
        }),
      updateAnggota: (id, updated) =>
        set((state) => ({
          anggotaList: state.anggotaList.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
        })),
      deleteAnggota: (id) =>
        set((state) => ({
          anggotaList: state.anggotaList.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "anggota-storage",
    }
  )
);
