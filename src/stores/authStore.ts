import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Egyptian mobile format: 01 followed by 0/1/2/5 then 8 more digits (11 digits total)
const EGYPT_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
export function isValidPhone(phone: string): boolean {
  return EGYPT_PHONE_REGEX.test(phone.trim());
}

function fromRow(row: any): User {
  return {
    id: row.id, name: row.name, phone: row.phone, email: row.email ?? undefined,
    emailVerified: row.email_verified ?? false,
    password: row.password, role: row.role, createdAt: row.created_at,
    isActive: row.is_active, addresses: row.addresses ?? undefined,
  };
}
function toRow(u: User) {
  return {
    id: u.id, name: u.name, phone: u.phone, email: u.email ?? null,
    email_verified: u.emailVerified ?? false,
    password: u.password, role: u.role, created_at: u.createdAt,
    is_active: u.isActive, addresses: u.addresses ?? null,
  };
}

type RegisterResult = { success: true } | { success: false; reason: 'phone_taken' | 'invalid_email' | 'invalid_phone' | 'auth_error'; message?: string };

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  allUsers: User[];
  init: () => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, email: string, password: string) => Promise<RegisterResult>;
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

      register: async (name, phone, email, password) => {
        if (!isValidEmail(email)) return { success: false, reason: 'invalid_email' };
        if (!isValidPhone(phone)) return { success: false, reason: 'invalid_phone' };

        const { data: existing } = await supabase.from('users').select('id').eq('phone', phone).maybeSingle();
        if (existing) return { success: false, reason: 'phone_taken' };

        // Sends a real confirmation email via Supabase Auth — the user must
        // click the link in it before we mark their account as verified.
        const { error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
          return { success: false, reason: 'auth_error', message: authError.message };
        }

        const newUser: User = {
          id: `u-${Date.now()}`,
          name, phone, email,
          emailVerified: false,
          password,
          role: 'customer',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        const { error } = await supabase.from('users').insert(toRow(newUser));
        if (error) {
          console.error('register failed:', error.message);
          return { success: false, reason: 'auth_error', message: error.message };
        }
        set({ user: newUser, isAuthenticated: true, isAdmin: false, allUsers: [...get().allUsers, newUser] });
        return { success: true };
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

// When someone clicks the confirmation link in their email, Supabase
// redirects them back here with a confirmed auth session. Catch that
// and flip email_verified on their row in our own `users` table.
supabase.auth.onAuthStateChange(async (event, session) => {
  if (!session?.user?.email || !session.user.email_confirmed_at) return;
  const email = session.user.email;
  const { data } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  if (data && !data.email_verified) {
    await supabase.from('users').update({ email_verified: true }).eq('email', email);
    const state = useAuthStore.getState();
    const updatedList = state.allUsers.map((u) => (u.email === email ? { ...u, emailVerified: true } : u));
    const updatedCurrent = state.user?.email === email ? { ...state.user, emailVerified: true } : state.user;
    useAuthStore.setState({ allUsers: updatedList, user: updatedCurrent });
  }
});
