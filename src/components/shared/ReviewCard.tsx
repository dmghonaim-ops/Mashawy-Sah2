import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import StarRating from './StarRating';
import type { Review } from '@/types';

interface Props {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: Props) {
  const { language } = useLanguageStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8a45c] to-[#a88b4a] flex items-center justify-center text-[#0a0a0a] font-bold text-sm shrink-0">
          {review.customerName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-[#f5f5f5] truncate">{review.customerName}</h4>
            {review.isVerified && (
              <CheckCircle size={14} className="text-[#4caf50] shrink-0" />
            )}
          </div>
          <p className="text-xs text-[#666]">{new Date(review.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>

      {/* Comment */}
      <p className="text-sm text-[#a0a0a0] leading-relaxed mb-4">{review.comment}</p>

      {/* Footer */}
      {review.menuItemName && (
        <div className="inline-flex px-3 py-1 bg-[#1a1a1a] rounded-full text-xs text-[#c8a45c]">
          {review.menuItemName}
        </div>
      )}
    </motion.div>
  );
}
