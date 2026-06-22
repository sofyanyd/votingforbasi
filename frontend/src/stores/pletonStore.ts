import { create } from "zustand";
import axios from "axios";

export interface PletonData {
  id: number;
  nama: string;
  bidang: string; 
  email: string; 
  foto_url?: string;
  category_id?: number;
}

interface PletonState {
  pletonList: PletonData[]; 
  loading: boolean;
  fetchPleton: () => Promise<void>; 
  addPleton: (formData: Omit<PletonData, "id">) => Promise<boolean>;
  deletePleton: (id: number) => Promise<boolean>;
  updatePleton: (id: number, formData: Omit<PletonData, "id">) => Promise<boolean>;
}

import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/speakers`;

export const usePletonStore = create<PletonState>((set, get) => ({
  pletonList: [],
  loading: false,

  fetchPleton: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL);
      set({ pletonList: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  addPleton: async (formData) => {
    try {
      const response = await axios.post(API_URL, formData);
      if (response.status === 201 || response.status === 200) {
        get().fetchPleton();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  deletePleton: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.status === 200) {
        get().fetchPleton();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  updatePleton: async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData);
      if (response.status === 200) {
        get().fetchPleton();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },
}));

// Backwards compatibility aliases
export const usePembicaraStore = usePletonStore;
export const useSpeakerStore = usePletonStore;