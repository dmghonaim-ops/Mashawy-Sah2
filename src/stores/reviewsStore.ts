import { create } from 'zustand';
import type { Review, ReviewStatus } from '@/types';

function getReviews(): Review[] {
  return JSON.parse(localStorage.getItem('mashawy_sah_reviews') || '[]');
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem('mashawy_sah_reviews', JSON.stringify(reviews));
}

interface ReviewsState {
  getReviews: () => Review[];
  addReview: (review: Review) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  deleteReview: (id: string) => void;
  pinReview: (id: string) => void;
  updateReviewStatus: (id: string, status: ReviewStatus) => void;
}

export const useReviewsStore = create<ReviewsState>(() => ({
  getReviews: () => getReviews().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  addReview: (review) => {
    const reviews = getReviews();
    reviews.push(review);
    saveReviews(reviews);
  },
  approveReview: (id) => {
    const reviews = getReviews().map((r) => r.id === id ? { ...r, status: 'approved' as ReviewStatus } : r);
    saveReviews(reviews);
  },
  rejectReview: (id) => {
    const reviews = getReviews().map((r) => r.id === id ? { ...r, status: 'rejected' as ReviewStatus } : r);
    saveReviews(reviews);
  },
  deleteReview: (id) => {
    const reviews = getReviews().filter((r) => r.id !== id);
    saveReviews(reviews);
  },
  pinReview: (id) => {
    const reviews = getReviews().map((r) => r.id === id ? { ...r, isPinned: !r.isPinned } : r);
    saveReviews(reviews);
  },
  updateReviewStatus: (id, status) => {
    const reviews = getReviews().map((r) => r.id === id ? { ...r, status } : r);
    saveReviews(reviews);
  },
}));
