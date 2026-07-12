import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Clock, Flame, Star } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import type { MenuItem } from '@/types';

interface Props {
  item: MenuItem;
  index?: number;
}

export default function MenuItemCard({ item, index = 0 }: Props) {
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item, 1, [], '');
    setAdded(true);
    addToast({
      type: 'success',
      message: t(`${item.nameAr} أُضيف إلى السلة`, `${item.nameEn} added to cart`, language),
    });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={t(item.nameAr, item.nameEn, language)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#c8a45c] text-[#0a0a0a] text-[10px] font-bold rounded-full">
              <Star size={10} /> {t('مميز', 'Featured', language)}
            </span>
          )}
          {item.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#c62828] text-white text-[10px] font-bold rounded-full">
              <Flame size={10} /> {t('الأكثر مبيعاً', 'Best Seller', language)}
            </span>
          )}
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
            <span className="px-4 py-2 bg-[#c62828] text-white text-sm font-semibold rounded-full">
              {t('غير متوفر', 'Unavailable', language)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-arabic text-base font-semibold text-[#f5f5f5] mb-1.5 line-clamp-1">
          {t(item.nameAr, item.nameEn, language)}
        </h3>
        <p className="text-xs text-[#a0a0a0] mb-3 line-clamp-2 leading-relaxed">
          {t(item.descriptionAr, item.descriptionEn, language)}
        </p>

        <div className="flex items-center gap-3 mb-4 text-[10px] text-[#666]">
          <span className="flex items-center gap-1">
            <Clock size={10} /> {item.preparationTime} {t('دقيقة', 'min', language)}
          </span>
          {item.calories && (
            <span>{item.calories} {t('سعرة', 'cal', language)}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#c8a45c]">
            {item.price} {t('ج.م', 'EGP', language)}
          </span>
          {item.isAvailable && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                added
                  ? 'bg-[#4caf50] text-white'
                  : 'bg-[#c8a45c] text-[#0a0a0a] hover:bg-[#d4b76a] hover:shadow-[0_4px_16px_rgba(200,164,92,0.3)]'
              }`}
            >
              {added ? <Check size={18} /> : <Plus size={18} />}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
