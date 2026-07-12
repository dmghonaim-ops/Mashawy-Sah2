import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';
import { supabase } from '@/lib/supabase';

function fromRow(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    items: row.items,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    discount: Number(row.discount),
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
    deliveryType: row.delivery_type,
    address: row.address ?? undefined,
    specialInstructions: row.special_instructions ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(order: Order) {
  return {
    id: order.id,
    customer_id: order.customerId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    status: order.status,
    payment_method: order.paymentMethod,
    delivery_type: order.deliveryType,
    address: order.address ?? null,
    special_instructions: order.specialInstructions ?? null,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

function sortByNewest(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

interface OrdersState {
  orders: Order[];
  loaded: boolean;
  init: () => Promise<void>;
  getOrders: () => Order[];
  getCustomerOrders: (customerId: string) => Order[];
  createOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loaded: false,

  init: async () => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
      console.error('Failed to load orders from Supabase:', error.message);
      set({ loaded: true });
      return;
    }
    set({ orders: (data || []).map(fromRow), loaded: true });
  },

  getOrders: () => sortByNewest(get().orders),
  getCustomerOrders: (customerId) => sortByNewest(get().orders.filter((o) => o.customerId === customerId)),

  createOrder: async (order) => {
    // Optimistic: show it immediately, then persist
    set({ orders: [...get().orders, order] });
    const { error } = await supabase.from('orders').insert(toRow(order));
    if (error) console.error('createOrder failed:', error.message);
  },

  updateOrderStatus: async (id, status) => {
    const updatedAt = new Date().toISOString();
    set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status, updatedAt } : o)) });
    const { error } = await supabase.from('orders').update({ status, updated_at: updatedAt }).eq('id', id);
    if (error) console.error('updateOrderStatus failed:', error.message);
  },

  cancelOrder: async (id) => {
    await get().updateOrderStatus(id, 'cancelled');
  },

  deleteOrder: async (id) => {
    set({ orders: get().orders.filter((o) => o.id !== id) });
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) console.error('deleteOrder failed:', error.message);
  },

  clearAllOrders: async () => {
    const ids = get().orders.map((o) => o.id);
    set({ orders: [] });
    if (ids.length > 0) {
      const { error } = await supabase.from('orders').delete().in('id', ids);
      if (error) console.error('clearAllOrders failed:', error.message);
    }
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),
}));

useOrdersStore.getState().init();

// Realtime: keep every open tab/device in sync the moment an order
// is created, updated, or removed anywhere else.
supabase
  .channel('orders-realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
    const current = useOrdersStore.getState().orders;
    if (payload.eventType === 'INSERT') {
      const incoming = fromRow(payload.new);
      if (!current.some((o) => o.id === incoming.id)) {
        useOrdersStore.setState({ orders: [...current, incoming] });
      }
    } else if (payload.eventType === 'UPDATE') {
      const updated = fromRow(payload.new);
      useOrdersStore.setState({ orders: current.map((o) => (o.id === updated.id ? updated : o)) });
    } else if (payload.eventType === 'DELETE') {
      useOrdersStore.setState({ orders: current.filter((o) => o.id !== (payload.old as any).id) });
    }
  })
  .subscribe();
