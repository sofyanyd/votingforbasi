import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL } from "../config";

interface EventData {
  id: number;
  nama: string;
  lokasi: string;
  tanggal: string;
  deskripsi: string;
  categoryId: number;
  pembicaraId: number;
  category?: { nama: string };
  pembicara?: { nama: string; bidang: string };
}

interface EventState {
  events: EventData[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  addEvent: (formData: Omit<EventData, "id">) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;
  updateEvent: (id: number, formData: Omit<EventData, "id">) => Promise<boolean>; // <-- 1. Tambah di interface
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  
  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      set({ events: response.data, loading: false });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      set({ loading: false });
    }
  },

  addEvent: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, formData);
      if (response.status === 201) {
        get().fetchEvents();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menambah event:", error);
      return false;
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
      if (response.status === 200) {
        get().fetchEvents();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menghapus event:", error);
      return false;
    }
  },

  // 2. Tambahkan fungsi update di bawah ini
  updateEvent: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/events/${id}`, formData);
      if (response.status === 200) {
        get().fetchEvents();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal memperbarui event:", error);
      return false;
    }
  },
}));