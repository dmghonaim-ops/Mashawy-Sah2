import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useRestaurantStore } from '@/stores/restaurantStore';
import MenuItemCard from '@/components/shared/MenuItemCard';

export default function MenuPage() {
  const { language } = useLanguageStore();
  const { getCategories, getMenuItems } = useRestaurantStore();
  const [searchParams] = useSearchParams();
  const categories = getCategories();
  const allItems = getMenuItems().filter((i) => i.isAvailable);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    let items = [...allItems];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.nameAr.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.descriptionAr.toLowerCase().includes(q) ||
          i.descriptionEn.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== 'all') {
      items = items.filter((i) => i.categoryId === activeCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return items;
  }, [allItems, search, activeCategory, sortBy]);

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Page Header */}
      <div className="bg-[#1a1a1a] pt-16 pb-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-4">
            <span>{t('الرئيسية', 'Home', language)}</span>
            <span>/</span>
            <span className="text-[#c8a45c]">{t('القائمة', 'Menu', language)}</span>
          </div>
          <h1 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">
            {t('قائمتنا', 'Our Menu', language)}
          </h1>
          <p className="text-[#a0a0a0]">
            {t('اكتشف تشكيلتنا من المشاوي والأطباق الشهية', 'Discover our selection of grills and delicious dishes', language)}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-[72px] z-50 bg-[rgba(17,17,17,0.95)] backdrop-blur-[20px] border-b border-[#2a2a2a]">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('ابحث عن طبق...', 'Search for a dish...', language)}
                className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pr-10 pl-4 text-sm text-[#f5f5f5] placeholder:text-[#666] focus:border-[#c8a45c] focus:outline-none transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#f5f5f5]">
                  ✕
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
              >
                <option value="popular">{t('الأكثر مبيعاً', 'Popular', language)}</option>
                <option value="price-asc">{t('السعر: من الأقل', 'Price: Low to High', language)}</option>
                <option value="price-desc">{t('السعر: من الأعلى', 'Price: High to Low', language)}</option>
                <option value="newest">{t('الأحدث', 'Newest', language)}</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 w-11 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-[#a0a0a0] hover:text-[#f5f5f5] hover:border-[rgba(200,164,92,0.3)] transition-colors"
              >
                <SlidersHorizontal size={18} />
              </button>

              <div className="hidden sm:flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-11 w-11 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-[#c8a45c] text-[#0a0a0a]' : 'text-[#a0a0a0]'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`h-11 w-11 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-[#c8a45c] text-[#0a0a0a]' : 'text-[#a0a0a0]'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#c8a45c] text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#a0a0a0] hover:text-[#f5f5f5]'
              }`}
            >
              {t('الكل', 'All', language)}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#c8a45c] text-[#0a0a0a]'
                    : 'bg-[#1a1a1a] text-[#a0a0a0] hover:text-[#f5f5f5]'
                }`}
              >
                {t(cat.nameAr, cat.nameEn, language)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="container-custom py-10 pb-20">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search size={64} className="text-[#2a2a2a] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#a0a0a0] mb-2">
              {t('لا توجد نتائج', 'No results found', language)}
            </h3>
            <p className="text-sm text-[#666] mb-4">
              {t('جرب بحثاً مختلفاً', 'Try a different search', language)}
            </p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="btn-secondary">
              {t('مسح الفلاتر', 'Clear Filters', language)}
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={`gap-6 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => (
                <MenuItemCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
