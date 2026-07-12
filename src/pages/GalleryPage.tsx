import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';

const galleryImages = [
  { src: '/images/gallery/interior.jpg', category: 'restaurant', titleAr: 'داخل المطعم', titleEn: 'Restaurant Interior' },
  { src: '/images/gallery/chef.jpg', category: 'team', titleAr: 'الشيف', titleEn: 'Our Chef' },
  { src: '/images/gallery/food-spread.jpg', category: 'food', titleAr: 'مائدة الطعام', titleEn: 'Food Spread' },
  { src: '/images/gallery/outdoor.jpg', category: 'restaurant', titleAr: 'الجلسة الخارجية', titleEn: 'Outdoor Seating' },
  { src: '/images/menu/kofta.jpg', category: 'food', titleAr: 'كفتة مشوية', titleEn: 'Grilled Kofta' },
  { src: '/images/menu/mixed-grill.jpg', category: 'food', titleAr: 'مشكل مشاوي', titleEn: 'Mixed Grill' },
  { src: '/images/menu/shawarma.jpg', category: 'food', titleAr: 'شاورما دجاج', titleEn: 'Chicken Shawarma' },
  { src: '/images/menu/fattoush.jpg', category: 'food', titleAr: 'فتوش', titleEn: 'Fattoush' },
  { src: '/images/categories/kebabs.jpg', category: 'food', titleAr: 'مشاوي متنوعة', titleEn: 'Variety of Grills' },
  { src: '/images/categories/chicken.jpg', category: 'food', titleAr: 'دجاج مشوي', titleEn: 'Grilled Chicken' },
  { src: '/images/categories/meat.jpg', category: 'food', titleAr: 'لحوم', titleEn: 'Meat' },
  { src: '/images/categories/appetizers.jpg', category: 'food', titleAr: 'مقبلات', titleEn: 'Appetizers' },
];

const tabs = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
  { id: 'food', labelAr: 'الطعام', labelEn: 'Food' },
  { id: 'restaurant', labelAr: 'المطعم', labelEn: 'Restaurant' },
  { id: 'team', labelAr: 'الفريق', labelEn: 'Team' },
];

export default function GalleryPage() {
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeTab === 'all' ? galleryImages : galleryImages.filter((img) => img.category === activeTab);
  const currentLightbox = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Header */}
      <div className="bg-[#1a1a1a] pt-16 pb-10">
        <div className="container-custom">
          <h1 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">
            {t('معرض الصور', 'Gallery', language)}
          </h1>
          <p className="text-[#a0a0a0]">{t('لحظات من مشاوي صح', 'Moments from Mashawy Sah', language)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-custom py-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#c8a45c] text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#a0a0a0] hover:text-[#f5f5f5]'
              }`}
            >
              {t(tab.labelAr, tab.labelEn, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container-custom pb-20">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={img.src}
                  alt={t(img.titleAr, img.titleEn, language)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[rgba(0,0,0,0)] group-hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-[rgba(0,0,0,0.9)] flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={currentLightbox.src}
              alt={t(currentLightbox.titleAr, currentLightbox.titleEn, language)}
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white bg-[rgba(0,0,0,0.6)] px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
