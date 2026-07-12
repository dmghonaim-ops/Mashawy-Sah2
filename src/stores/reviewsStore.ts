import { create } from 'zustand';
import type { Review, ReviewStatus } from '@/types';
import { supabase } from '@/lib/supabase';

function fromRow(row: any): Review {
  return {
    id: row.id, customerId: row.customer_id, customerName: row.customer_name,
    rating: row.rating, comment: row.comment, menuItemId: row.menu_item_id ?? undefined,
    menuItemName: row.menu_item_name ?? undefined, status: row.status,
    isPinned: row.is_pinned, isVerified: row.is_verified, createdAt: row.created_at,
  };
}
function toRow(r: Review) {
  return {
    id: r.id, customer_id: r.customerId, customer_name: r.customerName,
    rating: r.rating, comment: r.comment, menu_item_id: r.menuItemId ?? null,
    menu_item_name: r.menuItemName ?? null, status: r.status,
    is_pinned: r.isPinned, is_verified: r.isVerified, created_at: r.createdAt,
  };
}
function sortByNewest(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

interface ReviewsState {
  reviews: Review[];
  init: () => Promise<void>;
  getReviews: () => Review[];
  addReview: (review: Review) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  pinReview: (id: string) => Promise<void>;
  updateReviewStatus: (id: string, status: ReviewStatus) => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],

  init: async () => {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error) {
      console.error('Failed to load reviews:', error.message);
      return;
    }
    set({ reviews: (data || []).map(fromRow) });
  },

  getReviews: () => sortByNewest(get().reviews),

  addReview: async (review) => {
    set({ reviews: [...get().reviews, review] });
    const { error } = await supabase.from('reviews').insert(toRow(review));
    if (error) console.error('addReview failed:', error.message);
  },
  approveReview: async (id) => {
    set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, status: 'approved' as ReviewStatus } : r)) });
    const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
    if (error) console.error('approveReview failed:', error.message);
  },
  rejectReview: async (id) => {
    set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, status: 'rejected' as ReviewStatus } : r)) });
    const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
    if (error) console.error('rejectReview failed:', error.message);
  },
  deleteReview: async (id) => {
    set({ reviews: get().reviews.filter((r) => r.id !== id) });
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) console.error('deleteReview failed:', error.message);
  },
  pinReview: async (id) => {
    const target = get().reviews.find((r) => r.id === id);
    if (!target) return;
    const isPinned = !target.isPinned;
    set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, isPinned } : r)) });
    const { error } = await supabase.from('reviews').update({ is_pinned: isPinned }).eq('id', id);
    if (error) console.error('pinReview failed:', error.message);
  },
  updateReviewStatus: async (id, status) => {
    set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, status } : r)) });
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
    if (error) console.error('updateReviewStatus failed:', error.message);
  },
}));

useReviewsStore.getState().init();
