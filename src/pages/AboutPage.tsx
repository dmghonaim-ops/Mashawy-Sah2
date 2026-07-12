import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Heart, Clock, MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useRestaurantStore } from '@/stores/restaurantStore';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const { language } = useLanguageStore();
  const { settings } = useRestaurantStore();
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      });

      // Counter animation
      if (statsRef.current) {
        gsap.utils.toArray<HTMLElement>('.counter-value').forEach((el) => {
          const target = parseInt(el.dataset.target || '0');
          gsap.fromTo(el, { innerText: 0 }, {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const values = [
    { icon: Flame, titleAr: 'جودة لا تُضاهى', titleEn: 'Unmatched Quality', descAr: 'نختار أفضل المكونات الطازجة يومياً', descEn: 'We choose the freshest ingredients daily' },
    { icon: Heart, titleAr: 'عملاءنا أولويتنا', titleEn: 'Customers First', descAr: 'رضاكم هو هدفنا الأسمى', descEn: 'Your satisfaction is our highest goal' },
    { icon: Clock, titleAr: 'الالتزام بالمواعيد', titleEn: 'Punctuality', descAr: 'نحترم وقتكم ونلتزم بالتوصيل في الوقت المحدد', descEn: 'We respect your time and commit to on-time delivery' },
  ];

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Header */}
      <div className="bg-[#1a1a1a] pt-16 pb-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-4">
            <span>{t('الرئيسية', 'Home', language)}</span>
            <span>/</span>
            <span className="text-[#c8a45c]">{t('من نحن', 'About', language)}</span>
          </div>
          <h1 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">
            {t('قصتنا', 'Our Story', language)}
          </h1>
          <p className="text-[#a0a0a0]">{t('منذ البداية وحتى اليوم', 'From the Beginning to Today', language)}</p>
        </div>
      </div>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/images/about/story.jpg"
                alt="Our Story"
                className="w-full rounded-2xl"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-arabic text-2xl md:text-3xl font-bold text-[#f5f5f5] mb-6">
                {t('تراث من النكهات', 'A Heritage of Flavors', language)}
              </h2>
              <div className="space-y-4 text-[#a0a0a0] leading-relaxed">
                <p>
                  {t('بدأت مشاوي صح رحلتها في قلب كفر الشيخ، حاملةً معها سر الوصفات الأصيلة التي توارثتها عبر الأجيال.', 'Mashawy Sah began its journey in the heart of Kafr El Sheikh, carrying with it the secret of authentic recipes passed down through generations.', language)}
                </p>
                <p>
                  {t('نحن نؤمن بأن الطعم الأصيل يبدأ من اختيار أفضل اللحوم الطازجة، والتتبيلة السرية، والشواء على الفحم الحقيقي.', 'We believe that authentic taste starts with choosing the finest fresh meats, our secret marinade, and grilling over real charcoal.', language)}
                </p>
                <p>
                  {t('اليوم، نفخر بخدمة آلاف العملاء، ونظل ملتزمين بأعلى معايير الجودة والنظافة.', 'Today, we proudly serve thousands of customers and remain committed to the highest standards of quality and cleanliness.', language)}
                </p>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-10">
                {[
                  { target: 10, suffix: '+', labelAr: 'سنوات', labelEn: 'Years' },
                  { target: 50000, suffix: '+', labelAr: 'عميل', labelEn: 'Customers' },
                  { target: 44, suffix: '', labelAr: 'تقييم', labelEn: 'Rating', isDecimal: true },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-[#c8a45c] mb-1">
                      {stat.isDecimal ? (
                        <span>4.4</span>
                      ) : (
                        <span className="counter-value" data-target={stat.target}>
                          0
                        </span>
                      )}
                      {stat.suffix}
                    </div>
                    <p className="text-xs text-[#a0a0a0]">{t(stat.labelAr, stat.labelEn, language)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-[#111]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5]">
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

      {/* Location Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="w-full h-[400px] bg-[#111] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.7261!2d30.8382!3d31.1105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDA2JzM3LjgiTiAzMMKwNTAnMTcuNSJF!5e0!3m2!1sen!2seg!4v1"
                  className="w-full h-full border-0 grayscale-[30%]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Restaurant Location"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h3 className="font-arabic text-xl font-semibold text-[#f5f5f5] mb-6">
                {t('موقعنا', 'Our Location', language)}
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#c8a45c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{t('العنوان', 'Address', language)}</p>
                    <p className="text-sm text-[#a0a0a0]">{settings.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-[#c8a45c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{t('الهاتف', 'Phone', language)}</p>
                    <p className="text-sm text-[#a0a0a0]">{settings.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-[#c8a45c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{t('ساعات العمل', 'Hours', language)}</p>
                    <p className="text-sm text-[#a0a0a0]">
                      {settings.isOpen24Hours
                        ? t('مفتوح 24 ساعة', 'Open 24 Hours', language)
                        : t('يتم تحديدها يومياً', 'Set daily', language)}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=31.1105,30.8382`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full mt-8 inline-flex justify-center"
              >
                {t('احصل على الاتجاهات', 'Get Directions', language)}
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
