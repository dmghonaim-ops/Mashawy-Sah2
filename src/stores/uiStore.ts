import { create } from 'zustand';
import type { Toast } from '@/types';

interface UIState {
  toasts: Toast[];
  activeModal: string | null;
  isLoading: boolean;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  activeModal: null,
  isLoading: false,

  addToast: (toast) => {
    const id = `toast-${Date.now()}`;
    set({ toasts: [...get().toasts, { ...toast, id }] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, toast.duration || 4000);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  clearToasts: () => set({ toasts: [] }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
