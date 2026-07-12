import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useReviewsStore } from '@/stores/reviewsStore';
import StarRating from '@/components/shared/StarRating';
import ReviewCard from '@/components/shared/ReviewCard';

export default function ReviewsPage() {
  const { language } = useLanguageStore();
  const { getReviews } = useReviewsStore();
  const allReviews = getReviews().filter((r) => r.status === 'approved');
  const [sortBy, setSortBy] = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const stats = useMemo(() => {
    const total = allReviews.length;
    const avg = total > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: allReviews.filter((r) => r.rating === star).length,
      percent: total > 0 ? (allReviews.filter((r) => r.rating === star).length / total) * 100 : 0,
    }));
    return { total, avg: avg.toFixed(1), distribution };
  }, [allReviews]);

  const filteredReviews = useMemo(() => {
    let reviews = [...allReviews];
    if (verifiedOnly) reviews = reviews.filter((r) => r.isVerified);
    switch (sortBy) {
      case 'highest': reviews.sort((a, b) => b.rating - a.rating); break;
      case 'lowest': reviews.sort((a, b) => a.rating - b.rating); break;
      default: break;
    }
    return reviews;
  }, [allReviews, sortBy, verifiedOnly]);

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Header */}
      <div className="bg-[#1a1a1a] pt-16 pb-10">
        <div className="container-custom">
          <h1 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">
            {t('التقييمات', 'Reviews', language)}
          </h1>
          <p className="text-[#a0a0a0]">{t('آراء عملائنا الكرام', 'What Our Valued Customers Say', language)}</p>
        </div>
      </div>

      {/* Rating Summary */}
      <section className="container-custom py-10">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center md:text-start">
              <div className="text-5xl font-bold text-[#c8a45c] mb-2">{stats.avg}</div>
              <StarRating rating={parseFloat(stats.avg)} size={24} />
              <p className="text-sm text-[#a0a0a0] mt-2">
                {stats.total} {t('تقييم', 'reviews', language)}
              </p>
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              {stats.distribution.map((d) => (
                <div key={d.star} className="flex items-center gap-3">
                  <span className="text-xs text-[#a0a0a0] w-12">{d.star} {t('نجوم', 'stars', language)}</span>
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${d.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          d.star >= 4 ? '#4caf50' : d.star === 3 ? '#ff9800' : '#f44336',
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#666] w-8">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container-custom pb-6">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
          >
            <option value="newest">{t('الأحدث', 'Newest', language)}</option>
            <option value="highest">{t('الأعلى تقييماً', 'Highest Rated', language)}</option>
            <option value="lowest">{t('الأقل تقييماً', 'Lowest Rated', language)}</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-[#a0a0a0] cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#c8a45c] focus:ring-[#c8a45c]"
            />
            <CheckCircle size={14} />
            {t('طلبات موثقة فقط', 'Verified orders only', language)}
          </label>
        </div>
      </div>

      {/* Reviews List */}
      <div className="container-custom pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <Star size={48} className="text-[#2a2a2a] mx-auto mb-4" />
            <p className="text-[#a0a0a0]">{t('لا توجد تقييمات', 'No reviews found', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
