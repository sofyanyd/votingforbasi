import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserAdmin {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface UserState {
  userList: UserAdmin[];
  addUser: (user: Omit<UserAdmin, "id">) => void;
  updateUser: (id: string, updated: Omit<UserAdmin, "id">) => void;
  deleteUser: (id: string) => void;
}

const seedUsers: UserAdmin[] = [
  {
    id: "USR-001",
    username: "admin",
    email: "admin@gmail.com",
    password: "12345678",
  },
  {
    id: "USR-002",
    username: "pranada",
    email: "pranadaalfath@gmail.com",
    password: "24090027",
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userList: seedUsers,
      addUser: (user) =>
        set((state) => {
          const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
          return {
            userList: [...state.userList, { ...user, id: newId }],
          };
        }),
      updateUser: (id, updated) =>
        set((state) => ({
          userList: state.userList.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          userList: state.userList.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "user-storage",
    }
  )
);
