import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL } from "../config";

export interface CategoryData {
  id: number;
  nama: string;
  deskripsi?: string;
}

interface CategoryState {
  categories: CategoryData[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (formData: Omit<CategoryData, "id">) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  updateCategory: (id: number, formData: Omit<CategoryData, "id">) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  // 1. GET ALL CATEGORIES
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      set({ categories: response.data, loading: false });
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
      set({ loading: false });
    }
  },

  // 2. POST CATEGORY
  addCategory: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, formData);
      if (response.status === 201 || response.status === 200) {
        get().fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
      return false;
    }
  },

  // 3. DELETE CATEGORY
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
      if (response.status === 200) {
        get().fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      return false;
    }
  },

  // 4. PUT CATEGORY
  updateCategory: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/categories/${id}`, formData);
      if (response.status === 200) {
        get().fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal memperbarui kategori:", error);
      return false;
    }
  },
}));