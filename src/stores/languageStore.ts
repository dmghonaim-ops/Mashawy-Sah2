import { create } from 'zustand';
import type { Language } from '@/types';

interface LanguageState {
  language: Language;
  dir: 'rtl' | 'ltr';
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ar',
  dir: 'rtl',
  toggleLanguage: () =>
    set((state) => {
      const newLang = state.language === 'ar' ? 'en' : 'ar';
      const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      document.documentElement.dir = newDir;
      return { language: newLang, dir: newDir };
    }),
  setLanguage: (lang) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    set({ language: lang, dir });
  },
}));

export function t(ar: string, en: string, language: Language): string {
  return language === 'ar' ? ar : en;
}
