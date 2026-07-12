import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';

function getOrders(): Order[] {
  return JSON.parse(localStorage.getItem('mashawy_sah_orders') || '[]');
}

function saveOrders(orders: Order[]) {
  localStorage.setItem('mashawy_sah_orders', JSON.stringify(orders));
}

interface OrdersState {
  getOrders: () => Order[];
  getCustomerOrders: (customerId: string) => Order[];
  createOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>(() => ({
  getOrders: () => getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getCustomerOrders: (customerId) => getOrders().filter((o) => o.customerId === customerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  createOrder: (order) => {
    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);
  },
  updateOrderStatus: (id, status) => {
    const orders = getOrders().map((o) => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    saveOrders(orders);
  },
  cancelOrder: (id) => {
    const orders = getOrders().map((o) => o.id === id ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date().toISOString() } : o);
    saveOrders(orders);
  },
  getOrderById: (id) => getOrders().find((o) => o.id === id),
}));
