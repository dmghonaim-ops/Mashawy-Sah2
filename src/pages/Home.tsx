import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Clock, Truck, Star, ChevronDown, Phone, MessageCircle, Utensils, Heart, ChefHat } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { useReviewsStore } from '@/stores/reviewsStore';
import MenuItemCard from '@/components/shared/MenuItemCard';
import ReviewCard from '@/components/shared/ReviewCard';
import StarRating from '@/components/shared/StarRating';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { language } = useLanguageStore();
  const { getCategories, getMenuItems, settings } = useRestaurantStore();
  const { getReviews } = useReviewsStore();
  const categories = getCategories().slice(0, 6);
  const featuredItems = getMenuItems().filter((i) => i.isFeatured || i.isPopular).slice(0, 8);
  const reviews = getReviews().filter((r) => r.status === 'approved').slice(0, 3);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-rating', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-status', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-buttons', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

      // Scroll-triggered sections
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Flame, titleAr: 'مشاوي على الفحم', titleEn: 'Charcoal Grilled', descAr: 'نكهة أصيلة', descEn: 'Authentic Flavor' },
    { icon: Clock, titleAr: 'مفتوح 24 ساعة', titleEn: 'Open 24 Hours', descAr: 'طوال أيام الأسبوع', descEn: 'All Week Long' },
    { icon: Truck, titleAr: 'توصيل سريع', titleEn: 'Fast Delivery', descAr: 'إلى باب منزلك', descEn: 'To Your Doorstep' },
    { icon: Star, titleAr: '4.4 تقييم', titleEn: '4.4 Rating', descAr: 'من آلاف العملاء', descEn: 'From Thousands' },
  ];

  const values = [
    { icon: ChefHat, titleAr: 'جودة لا تُضاهى', titleEn: 'Unmatched Quality', descAr: 'نختار أفضل المكونات الطازجة يومياً', descEn: 'We choose the freshest ingredients daily' },
    { icon: Heart, titleAr: 'عملاءنا أولويتنا', titleEn: 'Customers First', descAr: 'رضاكم هو هدفنا الأسمى', descEn: 'Your satisfaction is our highest goal' },
    { icon: Clock, titleAr: 'الالتزام بالمواعيد', titleEn: 'Punctuality', descAr: 'نحترم وقتكم ونلتزم بالتوصيل في الوقت المحدد', descEn: 'We respect your time and commit to on-time delivery' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-poster.jpg"
            alt="Grill"
            className="w-full h-full object-cover"
            style={{ animation: 'ken-burns 20s ease-in-out infinite alternate' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.5)] via-[rgba(10,10,10,0.6)] to-[rgba(10,10,10,0.95)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.p
            className="hero-subtitle text-[#a0a0a0] text-sm sm:text-base font-medium tracking-[3px] uppercase mb-6 opacity-0"
          >
            {t('ألذ مشاوي في كفر الشيخ', 'The Best Grills in Kafr El Sheikh', language)}
          </motion.p>

          <motion.h1
            className="hero-title font-arabic text-5xl sm:text-6xl md:text-7xl font-bold text-[#f5f5f5] mb-6 opacity-0"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            <span className="text-gold-gradient">مشاوي صح</span>
          </motion.h1>

          <div className="hero-rating flex items-center justify-center gap-3 mb-4 opacity-0">
            <StarRating rating={4.4} size={20} />
            <span className="text-[#f5f5f5] font-bold">4.4</span>
            <span className="text-[#a0a0a0] text-sm">({t('2,847 تقييم', '2,847 reviews', language)})</span>
          </div>

          <motion.div
            className="hero-status flex items-center justify-center gap-2 mb-8 opacity-0"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf50] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4caf50]" />
            </span>
            <span className="text-[#4caf50] font-medium text-sm">{t('مفتوح الآن', 'Open Now', language)}</span>
          </motion.div>

          <motion.div
            className="hero-buttons flex flex-wrap items-center justify-center gap-4 opacity-0"
          >
            <Link to="/menu" className="btn-primary text-base px-8 py-4">
              <Utensils size={18} />
              {t('اطلب الآن', 'Order Now', language)}
            </Link>
            <Link to="/menu" className="btn-secondary text-base px-8 py-4">
              {t('القائمة', 'View Menu', language)}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={28} className="text-[#a0a0a0] animate-bounce-subtle" />
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="bg-[#111] py-10 border-b border-[#2a2a2a]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <f.icon size={32} className="text-[#c8a45c] mx-auto mb-3" />
                <h4 className="font-arabic text-sm font-semibold text-[#f5f5f5] mb-1">{t(f.titleAr, f.titleEn, language)}</h4>
                <p className="text-xs text-[#a0a0a0]">{t(f.descAr, f.descEn, language)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="gsap-reveal flex items-center justify-between mb-10">
            <div>
              <h2 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">
                {t('تصنيفاتنا', 'Our Categories', language)}
              </h2>
              <p className="text-[#a0a0a0]">{t('اكتشف أصنافنا المتنوعة', 'Discover Our Variety', language)}</p>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center gap-1 text-[#c8a45c] text-sm font-medium hover:underline">
              {t('عرض الكل', 'View All', language)} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/menu?category=${cat.id}`} className="group block bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden card-hover">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={cat.image} alt={t(cat.nameAr, cat.nameEn, language)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5]">{t(cat.nameAr, cat.nameEn, language)}</h3>
                    <p className="text-sm text-[#a0a0a0] mt-1">
                      {getMenuItems().filter((m) => m.categoryId === cat.id).length} {t('صنف', 'items', language)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="section-padding bg-[#111]">
        <div className="container-custom">
          <div className="gsap-reveal text-center mb-12">
            <h2 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-3">
              {t('أشهر أطباقنا', 'Our Best Sellers', language)}
            </h2>
            <p className="text-[#a0a0a0]">{t('الأكثر طلباً من عملائنا', 'Most Ordered by Our Customers', language)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredItems.map((item, i) => (
              <MenuItemCard key={item.id} item={item} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/menu" className="btn-secondary inline-flex">
              {t('عرض القائمة كاملة', 'View Full Menu', language)}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="gsap-reveal text-center mb-12">
            <h2 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-3">
              {t('آراء عملائنا', 'What Our Customers Say', language)}
            </h2>
            <p className="text-[#a0a0a0]">{t('ثقة آلاف العملاء', 'Trusted by Thousands', language)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/reviews" className="btn-secondary inline-flex">
              {t('عرض جميع التقييمات', 'View All Reviews', language)}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden border-y border-[rgba(200,164,92,0.3)]"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 50%, #1a1a1a 100%)' }}>
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-arabic text-3xl md:text-5xl font-bold text-[#f5f5f5] mb-4">
              {t('جائع؟ اطلب الآن!', 'Hungry? Order Now!', language)}
            </h2>
            <p className="text-[#a0a0a0] mb-6">
              {t('توصيل سريع إلى جميع مناطق كفر الشيخ', 'Fast delivery to all areas of Kafr El Sheikh', language)}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[#c8a45c] mb-8 flex items-center justify-center gap-3">
              <Phone size={28} /> {settings.phone}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform animate-pulse-glow"
              >
                <MessageCircle size={20} />
                {t('اطلب عبر الواتساب', 'Order via WhatsApp', language)}
              </a>
              <a href={`tel:${settings.phone}`} className="btn-secondary inline-flex px-8 py-4">
                <Phone size={18} />
                {t('اتصل بنا', 'Call Us', language)}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-[#111]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-3">
              {t('قيمنا', 'Our Values', language)}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8"
              >
                <div className="w-16 h-16 rounded-full bg-[rgba(200,164,92,0.1)] border border-[rgba(200,164,92,0.2)] flex items-center justify-center mx-auto mb-5">
                  <v.icon size={28} className="text-[#c8a45c]" />
                </div>
                <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-3">{t(v.titleAr, v.titleEn, language)}</h3>
                <p className="text-sm text-[#a0a0a0] leading-relaxed">{t(v.descAr, v.descEn, language)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="shrink-0"
            >
              <div className="w-64 h-64 bg-[#111] border-2 border-[rgba(200,164,92,0.3)] rounded-2xl flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <div className="w-40 h-40 bg-[#0a0a0a] rounded-lg flex flex-col items-center justify-center">
                      <Utensils size={32} className="text-[#c8a45c] mb-2" />
                      <span className="font-arabic text-[8px] text-[#c8a45c]">مشاوي صح</span>
                      <span className="text-[6px] text-[#666] mt-0.5">Mashawy Sah</span>
                      <div className="mt-2 grid grid-cols-5 gap-0.5">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-[1px] ${Math.random() > 0.4 ? 'bg-[#c8a45c]' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#666]">{t('امسح للطلب', 'Scan to Order', language)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-start"
            >
              <h2 className="font-arabic text-3xl font-bold text-[#f5f5f5] mb-4">
                {t('امسح واطلب', 'Scan & Order', language)}
              </h2>
              <p className="text-[#a0a0a0] mb-4">
                {t('افتح قائمتنا على هاتفك بسرعة', 'Quickly open our menu on your phone', language)}
              </p>
              <p className="text-sm text-[#666] mb-6">
                {t('امسح رمز الاستجابة السريعة بكاميرا هاتفك', 'Scan the QR code with your phone camera', language)}
              </p>
              <Link to="/menu" className="btn-secondary inline-flex">
                {t('فتح القائمة', 'Open Menu', language)}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ken-burns {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
