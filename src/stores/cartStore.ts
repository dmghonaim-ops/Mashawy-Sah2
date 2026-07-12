import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem, MenuItemOption } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: () => number;
  subtotal: () => number;
  deliveryFee: number;
  discount: number;
  total: () => number;
  addItem: (menuItem: MenuItem, quantity: number, options: MenuItemOption[], instructions: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (amount: number) => void;
  removeCoupon: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      deliveryFee: 15,
      discount: 0,

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => {
        const optionsPrice = item.selectedOptions.reduce((oSum, opt) => oSum + opt.price, 0);
        return sum + (item.menuItem.price + optionsPrice) * item.quantity;
      }, 0),
      total: () => {
        const s = get().subtotal();
        return s + get().deliveryFee - get().discount;
      },

      addItem: (menuItem, quantity, options, instructions) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.menuItem.id === menuItem.id &&
          JSON.stringify(i.selectedOptions.map(o => o.id).sort()) === JSON.stringify(options.map(o => o.id).sort())
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [...items, {
              id: `ci-${Date.now()}`,
              menuItem,
              quantity,
              selectedOptions: options,
              specialInstructions: instructions,
            }],
          });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) });
        }
      },
      clearCart: () => set({ items: [], discount: 0 }),
      applyCoupon: (amount) => set({ discount: amount }),
      removeCoupon: () => set({ discount: 0 }),
      toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: 'mashawy_sah_cart',
      partialize: (state) => ({ items: state.items, deliveryFee: state.deliveryFee, discount: state.discount }),
    }
  )
);
