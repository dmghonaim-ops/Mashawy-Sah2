import { create } from 'zustand';
import type { Category, MenuItem, RestaurantSettings, Coupon } from '@/types';
import { supabase } from '@/lib/supabase';

function catFromRow(row: any): Category {
  return {
    id: row.id, nameAr: row.name_ar, nameEn: row.name_en, image: row.image,
    descriptionAr: row.description_ar ?? undefined, descriptionEn: row.description_en ?? undefined,
    isVisible: row.is_visible, order: row.order,
  };
}
function catToRow(c: Category) {
  return {
    id: c.id, name_ar: c.nameAr, name_en: c.nameEn, image: c.image,
    description_ar: c.descriptionAr ?? null, description_en: c.descriptionEn ?? null,
    is_visible: c.isVisible, order: c.order,
  };
}

function itemFromRow(row: any): MenuItem {
  return {
    id: row.id, nameAr: row.name_ar, nameEn: row.name_en,
    descriptionAr: row.description_ar, descriptionEn: row.description_en,
    price: Number(row.price), image: row.image, categoryId: row.category_id,
    preparationTime: row.preparation_time, calories: row.calories ?? undefined,
    isAvailable: row.is_available, isFeatured: row.is_featured, isPopular: row.is_popular,
    isVegetarian: row.is_vegetarian, isSpicy: row.is_spicy, createdAt: row.created_at,
    options: row.options ?? undefined,
  };
}
function itemToRow(i: MenuItem) {
  return {
    id: i.id, name_ar: i.nameAr, name_en: i.nameEn,
    description_ar: i.descriptionAr, description_en: i.descriptionEn,
    price: i.price, image: i.image, category_id: i.categoryId,
    preparation_time: i.preparationTime, calories: i.calories ?? null,
    is_available: i.isAvailable, is_featured: i.isFeatured, is_popular: i.isPopular,
    is_vegetarian: i.isVegetarian, is_spicy: i.isSpicy, created_at: i.createdAt,
    options: i.options ?? null,
  };
}

function couponFromRow(row: any): Coupon {
  return {
    id: row.id, code: row.code, type: row.type, value: Number(row.value),
    minOrder: Number(row.min_order), usageLimit: row.usage_limit ?? undefined,
    usageCount: row.usage_count, expiryDate: row.expiry_date, isActive: row.is_active,
  };
}
function couponToRow(c: Coupon) {
  return {
    id: c.id, code: c.code, type: c.type, value: c.value, min_order: c.minOrder,
    usage_limit: c.usageLimit ?? null, usage_count: c.usageCount,
    expiry_date: c.expiryDate, is_active: c.isActive,
  };
}

const DEFAULT_SETTINGS: RestaurantSettings = {
  nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '', phone: '', email: '',
  address: '', googleMapsUrl: '', logo: '', heroBanner: '', primaryColor: '#c8a45c',
  secondaryColor: '#c62828', facebookUrl: '', instagramUrl: '', whatsappNumber: '',
  tiktokUrl: '', deliveryFee: 0, taxRate: 0, minOrder: 0, deliveryRadius: 0,
  isOpen24Hours: true, openingHours: [],
};

interface RestaurantState {
  settings: RestaurantSettings;
  categories: Category[];
  menuItems: MenuItem[];
  coupons: Coupon[];
  loaded: boolean;
  init: () => Promise<void>;

  getCategories: () => Category[];
  getMenuItems: () => MenuItem[];
  getCoupons: () => Coupon[];

  addCategory: (cat: Category) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (cats: Category[]) => Promise<void>;

  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  duplicateMenuItem: (id: string) => Promise<void>;
  bulkDeleteMenuItems: (ids: string[]) => Promise<void>;

  updateSettings: (settings: Partial<RestaurantSettings>) => Promise<void>;

  addCoupon: (coupon: Coupon) => Promise<void>;
  updateCoupon: (id: string, data: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  validateCoupon: (code: string) => Coupon | null;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  categories: [],
  menuItems: [],
  coupons: [],
  loaded: false,

  init: async () => {
    const [catRes, itemRes, couponRes, settingsRes] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('menu_items').select('*'),
      supabase.from('coupons').select('*'),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    if (catRes.error) console.error('Failed to load categories:', catRes.error.message);
    if (itemRes.error) console.error('Failed to load menu items:', itemRes.error.message);
    if (couponRes.error) console.error('Failed to load coupons:', couponRes.error.message);
    if (settingsRes.error) console.error('Failed to load settings:', settingsRes.error.message);

    set({
      categories: (catRes.data || []).map(catFromRow).sort((a, b) => a.order - b.order),
      menuItems: (itemRes.data || []).map(itemFromRow),
      coupons: (couponRes.data || []).map(couponFromRow),
      settings: settingsRes.data ? { ...DEFAULT_SETTINGS, ...settingsRes.data.data } : DEFAULT_SETTINGS,
      loaded: true,
    });
  },

  getCategories: () => [...get().categories].sort((a, b) => a.order - b.order),
  getMenuItems: () => get().menuItems,
  getCoupons: () => get().coupons,

  addCategory: async (cat) => {
    set({ categories: [...get().categories, cat] });
    const { error } = await supabase.from('categories').insert(catToRow(cat));
    if (error) console.error('addCategory failed:', error.message);
  },
  updateCategory: async (id, data) => {
    set({ categories: get().categories.map((c) => (c.id === id ? { ...c, ...data } : c)) });
    const merged = get().categories.find((c) => c.id === id);
    if (merged) {
      const { error } = await supabase.from('categories').update(catToRow(merged)).eq('id', id);
      if (error) console.error('updateCategory failed:', error.message);
    }
  },
  deleteCategory: async (id) => {
    set({ categories: get().categories.filter((c) => c.id !== id) });
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) console.error('deleteCategory failed:', error.message);
  },
  reorderCategories: async (cats) => {
    set({ categories: cats });
    for (const c of cats) {
      const { error } = await supabase.from('categories').update({ order: c.order }).eq('id', c.id);
      if (error) console.error('reorderCategories failed:', error.message);
    }
  },

  addMenuItem: async (item) => {
    set({ menuItems: [...get().menuItems, item] });
    const { error } = await supabase.from('menu_items').insert(itemToRow(item));
    if (error) console.error('addMenuItem failed:', error.message);
  },
  updateMenuItem: async (id, data) => {
    set({ menuItems: get().menuItems.map((i) => (i.id === id ? { ...i, ...data } : i)) });
    const merged = get().menuItems.find((i) => i.id === id);
    if (merged) {
      const { error } = await supabase.from('menu_items').update(itemToRow(merged)).eq('id', id);
      if (error) console.error('updateMenuItem failed:', error.message);
    }
  },
  deleteMenuItem: async (id) => {
    set({ menuItems: get().menuItems.filter((i) => i.id !== id) });
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) console.error('deleteMenuItem failed:', error.message);
  },
  duplicateMenuItem: async (id) => {
    const item = get().menuItems.find((i) => i.id === id);
    if (!item) return;
    const dup: MenuItem = { ...item, id: `mi-${Date.now()}`, nameAr: `${item.nameAr} (نسخة)`, nameEn: `${item.nameEn} (Copy)`, createdAt: new Date().toISOString() };
    set({ menuItems: [...get().menuItems, dup] });
    const { error } = await supabase.from('menu_items').insert(itemToRow(dup));
    if (error) console.error('duplicateMenuItem failed:', error.message);
  },
  bulkDeleteMenuItems: async (ids) => {
    set({ menuItems: get().menuItems.filter((i) => !ids.includes(i.id)) });
    const { error } = await supabase.from('menu_items').delete().in('id', ids);
    if (error) console.error('bulkDeleteMenuItems failed:', error.message);
  },

  updateSettings: async (s) => {
    const updated = { ...get().settings, ...s };
    set({ settings: updated });
    const { error } = await supabase.from('settings').upsert({ id: 1, data: updated });
    if (error) console.error('updateSettings failed:', error.message);
  },

  addCoupon: async (coupon) => {
    set({ coupons: [...get().coupons, coupon] });
    const { error } = await supabase.from('coupons').insert(couponToRow(coupon));
    if (error) console.error('addCoupon failed:', error.message);
  },
  updateCoupon: async (id, data) => {
    set({ coupons: get().coupons.map((c) => (c.id === id ? { ...c, ...data } : c)) });
    const merged = get().coupons.find((c) => c.id === id);
    if (merged) {
      const { error } = await supabase.from('coupons').update(couponToRow(merged)).eq('id', id);
      if (error) console.error('updateCoupon failed:', error.message);
    }
  },
  deleteCoupon: async (id) => {
    set({ coupons: get().coupons.filter((c) => c.id !== id) });
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) console.error('deleteCoupon failed:', error.message);
  },
  validateCoupon: (code) => {
    const coupon = get().coupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive && new Date(c.expiryDate) > new Date() && (!c.usageLimit || c.usageCount < c.usageLimit)
    );
    return coupon || null;
  },
}));

useRestaurantStore.getState().init();

// Realtime: menu & category edits (e.g. from another admin device) show up live
supabase
  .channel('menu-realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, (payload) => {
    const current = useRestaurantStore.getState().menuItems;
    if (payload.eventType === 'INSERT') {
      const incoming = itemFromRow(payload.new);
      if (!current.some((i) => i.id === incoming.id)) useRestaurantStore.setState({ menuItems: [...current, incoming] });
    } else if (payload.eventType === 'UPDATE') {
      const updated = itemFromRow(payload.new);
      useRestaurantStore.setState({ menuItems: current.map((i) => (i.id === updated.id ? updated : i)) });
    } else if (payload.eventType === 'DELETE') {
      useRestaurantStore.setState({ menuItems: current.filter((i) => i.id !== (payload.old as any).id) });
    }
  })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
    const current = useRestaurantStore.getState().categories;
    if (payload.eventType === 'INSERT') {
      const incoming = catFromRow(payload.new);
      if (!current.some((c) => c.id === incoming.id)) useRestaurantStore.setState({ categories: [...current, incoming] });
    } else if (payload.eventType === 'UPDATE') {
      const updated = catFromRow(payload.new);
      useRestaurantStore.setState({ categories: current.map((c) => (c.id === updated.id ? updated : c)) });
    } else if (payload.eventType === 'DELETE') {
      useRestaurantStore.setState({ categories: current.filter((c) => c.id !== (payload.old as any).id) });
    }
  })
  .subscribe();
