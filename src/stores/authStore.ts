import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { seedData } from '@/data/seedData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (phone: string, password: string) => boolean;
  register: (name: string, phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  getAllUsers: () => User[];
  toggleUserActive: (userId: string) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
}

seedData();

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('mashawy_sah_users') || '[]');
}

function saveUsers(users: User[]) {
  localStorage.setItem('mashawy_sah_users', JSON.stringify(users));
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (phone, password) => {
        const users = getUsers();
        const user = users.find((u) => u.phone === phone && u.password === password && u.isActive);
        if (user) {
          set({ user, isAuthenticated: true, isAdmin: user.role === 'admin' });
          return true;
        }
        return false;
      },

      register: (name, phone, password) => {
        const users = getUsers();
        if (users.some((u) => u.phone === phone)) return false;
        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          phone,
          password,
          role: 'customer',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        users.push(newUser);
        saveUsers(users);
        set({ user: newUser, isAuthenticated: true, isAdmin: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateProfile: (data) => {
        const { user } = get();
        if (!user) return;
        const updated = { ...user, ...data };
        const users = getUsers().map((u) => (u.id === user.id ? updated : u));
        saveUsers(users);
        set({ user: updated, isAdmin: updated.role === 'admin' });
      },

      getAllUsers: () => {
        return getUsers().filter((u) => u.role === 'customer');
      },

      toggleUserActive: (userId) => {
        const users = getUsers().map((u) =>
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        );
        saveUsers(users);
      },

      updateUser: (userId, data) => {
        const users = getUsers().map((u) =>
          u.id === userId ? { ...u, ...data } : u
        );
        saveUsers(users);
      },
    }),
    {
      name: 'mashawy_sah_auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, isAdmin: state.isAdmin }),
    }
  )
);
