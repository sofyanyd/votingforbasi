import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL } from "../config";

export interface QrCode {
  id: string | number;
  name: string;
  image: string; // Base64 data URL or external URL
  description: string;
  status: "Aktif" | "Non-Aktif" | string;
}

interface QrState {
  qrList: QrCode[];
  loading: boolean;
  fetchQrCodes: () => Promise<void>;
  addQrCode: (qr: Omit<QrCode, "id">) => Promise<void>;
  updateQrCode: (id: string | number, updated: Omit<QrCode, "id">) => Promise<void>;
  deleteQrCode: (id: string | number) => Promise<void>;
}

export const useQrCodeStore = create<QrState>((set, get) => ({
  qrList: [],
  loading: false,

  fetchQrCodes: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_BASE_URL}/qrcodes`);
      set({ qrList: response.data, loading: false });
    } catch (error) {
      console.error("Gagal mengambil data QR Code dari server:", error);
      set({ loading: false });
    }
  },

  addQrCode: async (qr) => {
    try {
      await axios.post(`${API_BASE_URL}/qrcodes`, qr);
      await get().fetchQrCodes();
    } catch (error) {
      console.error("Gagal menambah QR Code:", error);
      throw error;
    }
  },

  updateQrCode: async (id, updated) => {
    try {
      await axios.put(`${API_BASE_URL}/qrcodes/${id}`, updated);
      await get().fetchQrCodes();
    } catch (error) {
      console.error("Gagal mengupdate QR Code:", error);
      throw error;
    }
  },

  deleteQrCode: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/qrcodes/${id}`);
      await get().fetchQrCodes();
    } catch (error) {
      console.error("Gagal menghapus QR Code:", error);
      throw error;
    }
  }
}));
