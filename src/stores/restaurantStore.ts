import { create } from 'zustand';
import type { Category, MenuItem, RestaurantSettings, Coupon } from '@/types';
import { restaurantSettings } from '@/data/seedData';

function getItem<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setItem<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

interface RestaurantState {
  settings: RestaurantSettings;
  getCategories: () => Category[];
  getMenuItems: () => MenuItem[];
  getCoupons: () => Coupon[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (cats: Category[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  duplicateMenuItem: (id: string) => void;
  bulkDeleteMenuItems: (ids: string[]) => void;
  updateSettings: (settings: Partial<RestaurantSettings>) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string) => Coupon | null;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  settings: getItem('mashawy_sah_settings', restaurantSettings),

  getCategories: () => getItem<Category[]>('mashawy_sah_categories', []).sort((a, b) => a.order - b.order),
  getMenuItems: () => getItem<MenuItem[]>('mashawy_sah_menuItems', []),
  getCoupons: () => getItem<Coupon[]>('mashawy_sah_coupons', []),

  addCategory: (cat) => {
    const cats = get().getCategories();
    cats.push(cat);
    setItem('mashawy_sah_categories', cats);
  },
  updateCategory: (id, data) => {
    const cats = get().getCategories().map((c) => c.id === id ? { ...c, ...data } : c);
    setItem('mashawy_sah_categories', cats);
  },
  deleteCategory: (id) => {
    const cats = get().getCategories().filter((c) => c.id !== id);
    setItem('mashawy_sah_categories', cats);
  },
  reorderCategories: (cats) => {
    setItem('mashawy_sah_categories', cats);
  },

  addMenuItem: (item) => {
    const items = get().getMenuItems();
    items.push(item);
    setItem('mashawy_sah_menuItems', items);
  },
  updateMenuItem: (id, data) => {
    const items = get().getMenuItems().map((i) => i.id === id ? { ...i, ...data } : i);
    setItem('mashawy_sah_menuItems', items);
  },
  deleteMenuItem: (id) => {
    const items = get().getMenuItems().filter((i) => i.id !== id);
    setItem('mashawy_sah_menuItems', items);
  },
  duplicateMenuItem: (id) => {
    const items = get().getMenuItems();
    const item = items.find((i) => i.id === id);
    if (item) {
      const dup = { ...item, id: `mi-${Date.now()}`, nameAr: `${item.nameAr} (نسخة)`, nameEn: `${item.nameEn} (Copy)`, createdAt: new Date().toISOString() };
      items.push(dup);
      setItem('mashawy_sah_menuItems', items);
    }
  },
  bulkDeleteMenuItems: (ids) => {
    const items = get().getMenuItems().filter((i) => !ids.includes(i.id));
    setItem('mashawy_sah_menuItems', items);
  },

  updateSettings: (s) => {
    const updated = { ...get().settings, ...s };
    setItem('mashawy_sah_settings', updated);
    set({ settings: updated });
  },

  addCoupon: (coupon) => {
    const coupons = get().getCoupons();
    coupons.push(coupon);
    setItem('mashawy_sah_coupons', coupons);
  },
  updateCoupon: (id, data) => {
    const coupons = get().getCoupons().map((c) => c.id === id ? { ...c, ...data } : c);
    setItem('mashawy_sah_coupons', coupons);
  },
  deleteCoupon: (id) => {
    const coupons = get().getCoupons().filter((c) => c.id !== id);
    setItem('mashawy_sah_coupons', coupons);
  },
  validateCoupon: (code) => {
    const coupon = get().getCoupons().find(
      (c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive && new Date(c.expiryDate) > new Date() && (!c.usageLimit || c.usageCount < c.usageLimit)
    );
    return coupon || null;
  },
}));
