import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL } from "../config";

export interface UserAdmin {
  id: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

interface UserState {
  userList: UserAdmin[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<UserAdmin, "id">) => Promise<boolean>;
  updateUser: (id: string, updated: Omit<UserAdmin, "id">) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

const API_URL = `${API_BASE_URL}/auth/users`;

export const useUserStore = create<UserState>((set, get) => ({
  userList: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL);
      set({ userList: response.data, loading: false });
    } catch (error) {
      console.error("Gagal memuat user admin:", error);
      set({ loading: false });
    }
  },

  addUser: async (user) => {
    try {
      const response = await axios.post(API_URL, user);
      if (response.status === 201 || response.status === 200) {
        get().fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menambahkan user admin:", error);
      return false;
    }
  },

  updateUser: async (id, updated) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updated);
      if (response.status === 200) {
        get().fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal memperbarui user admin:", error);
      return false;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.status === 200) {
        get().fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal menghapus user admin:", error);
      return false;
    }
  },
}));
