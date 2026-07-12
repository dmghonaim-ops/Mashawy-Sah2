import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';

function fromRow(row: any): User {
  return {
    id: row.id, name: row.name, phone: row.phone, email: row.email ?? undefined,
    password: row.password, role: row.role, createdAt: row.created_at,
    isActive: row.is_active, addresses: row.addresses ?? undefined,
  };
}
function toRow(u: User) {
  return {
    id: u.id, name: u.name, phone: u.phone, email: u.email ?? null,
    password: u.password, role: u.role, created_at: u.createdAt,
    is_active: u.isActive, addresses: u.addresses ?? null,
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  allUsers: User[];
  init: () => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  getAllUsers: () => User[];
  toggleUserActive: (userId: string) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      allUsers: [],

      init: async () => {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
          console.error('Failed to load users:', error.message);
          return;
        }
        set({ allUsers: (data || []).map(fromRow) });
      },

      login: async (phone, password) => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone)
          .eq('password', password)
          .eq('is_active', true)
          .maybeSingle();
        if (error || !data) return false;
        const user = fromRow(data);
        set({ user, isAuthenticated: true, isAdmin: user.role === 'admin' });
        return true;
      },

      register: async (name, phone, password) => {
        const { data: existing } = await supabase.from('users').select('id').eq('phone', phone).maybeSingle();
        if (existing) return false;
        const newUser: User = {
          id: `u-${Date.now()}`,
          name, phone, password,
          role: 'customer',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        const { error } = await supabase.from('users').insert(toRow(newUser));
        if (error) {
          console.error('register failed:', error.message);
          return false;
        }
        set({ user: newUser, isAuthenticated: true, isAdmin: false, allUsers: [...get().allUsers, newUser] });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return;
        const updated = { ...user, ...data };
        set({ user: updated, isAdmin: updated.role === 'admin', allUsers: get().allUsers.map((u) => (u.id === user.id ? updated : u)) });
        const { error } = await supabase.from('users').update(toRow(updated)).eq('id', user.id);
        if (error) console.error('updateProfile failed:', error.message);
      },

      getAllUsers: () => get().allUsers,

      toggleUserActive: async (userId) => {
        const target = get().allUsers.find((u) => u.id === userId);
        if (!target) return;
        const updated = { ...target, isActive: !target.isActive };
        set({ allUsers: get().allUsers.map((u) => (u.id === userId ? updated : u)) });
        const { error } = await supabase.from('users').update({ is_active: updated.isActive }).eq('id', userId);
        if (error) console.error('toggleUserActive failed:', error.message);
      },

      updateUser: async (userId, data) => {
        set({ allUsers: get().allUsers.map((u) => (u.id === userId ? { ...u, ...data } : u)) });
        const merged = get().allUsers.find((u) => u.id === userId);
        if (merged) {
          const { error } = await supabase.from('users').update(toRow(merged)).eq('id', userId);
          if (error) console.error('updateUser failed:', error.message);
        }
      },
    }),
    {
      name: 'mashawy_sah_auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, isAdmin: state.isAdmin }),
    }
  )
);

useAuthStore.getState().init();
