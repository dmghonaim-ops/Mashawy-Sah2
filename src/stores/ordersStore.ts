import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';

const STORAGE_KEY = 'mashawy_sah_orders';

function loadOrders(): Order[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function persist(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function sortByNewest(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

interface OrdersState {
  orders: Order[];
  getOrders: () => Order[];
  getCustomerOrders: (customerId: string) => Order[];
  createOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  clearAllOrders: () => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: loadOrders(),

  getOrders: () => sortByNewest(get().orders),
  getCustomerOrders: (customerId) => sortByNewest(get().orders.filter((o) => o.customerId === customerId)),

  createOrder: (order) => {
    const orders = [...get().orders, order];
    persist(orders);
    set({ orders });
  },
  updateOrderStatus: (id, status) => {
    const orders = get().orders.map((o) => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    persist(orders);
    set({ orders });
  },
  cancelOrder: (id) => {
    const orders = get().orders.map((o) => o.id === id ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date().toISOString() } : o);
    persist(orders);
    set({ orders });
  },
  deleteOrder: (id) => {
    const orders = get().orders.filter((o) => o.id !== id);
    persist(orders);
    set({ orders });
  },
  clearAllOrders: () => {
    persist([]);
    set({ orders: [] });
  },
  getOrderById: (id) => get().orders.find((o) => o.id === id),
}));

// Keep state in sync if orders change in another browser tab of the same session
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      useOrdersStore.setState({ orders: loadOrders() });
    }
  });
}
