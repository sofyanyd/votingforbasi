import { create } from "zustand";
import axios from "axios";

interface CategoryData {
  id: number;
  nama: string;
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
      const response = await axios.get("http://localhost:3000/categories");
      set({ categories: response.data, loading: false });
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
      set({ loading: false });
    }
  },

  // 2. POST CATEGORY
  addCategory: async (formData) => {
    try {
      const response = await axios.post("http://localhost:3000/categories", formData);
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
      const response = await axios.delete(`http://localhost:3000/categories/${id}`);
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
      const response = await axios.put(`http://localhost:3000/categories/${id}`, formData);
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