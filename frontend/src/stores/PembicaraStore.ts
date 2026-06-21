import { create } from "zustand";
import axios from "axios";

interface PembicaraData {
  id: number;
  nama: string;
  bidang: string;
  email: string; 
}

interface PembicaraState {
  pembicaraList: PembicaraData[]; 
  loading: boolean;
  fetchPembicara: () => Promise<void>; 
  addPembicara: (formData: Omit<PembicaraData, "id">) => Promise<boolean>;
  deletePembicara: (id: number) => Promise<boolean>;
  updatePembicara: (id: number, formData: Omit<PembicaraData, "id">) => Promise<boolean>;
}

const API_URL = "http://localhost:3000/speakers";

export const usePembicaraStore = create<PembicaraState>((set, get) => ({
  pembicaraList: [],
  loading: false,

  fetchPembicara: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL);
      set({ pembicaraList: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  addPembicara: async (formData) => {
    try {
      const response = await axios.post(API_URL, formData);
      if (response.status === 201 || response.status === 200) {
        get().fetchPembicara();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  deletePembicara: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.status === 200) {
        get().fetchPembicara();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  updatePembicara: async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData);
      if (response.status === 200) {
        get().fetchPembicara();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },
}));

// Jembatan untuk memastikan kode lama yang memakai 'useSpeakerStore' tetap jalan
export const useSpeakerStore = usePembicaraStore;