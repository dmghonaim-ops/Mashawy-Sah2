import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useRestaurantStore } from '@/stores/restaurantStore';

export default function Footer() {
  const { language } = useLanguageStore();
  const { settings } = useRestaurantStore();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[rgba(200,164,92,0.3)]">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-arabic text-2xl font-bold text-[#c8a45c] block">مشاوي صح</span>
              <span className="font-display text-xs text-[#666] tracking-[2px] uppercase">Mashawy Sah</span>
            </Link>
            <p className="text-sm text-[#a0a0a0] mb-6 leading-relaxed">
              {t('ألذ مشاوي في كفر الشيخ', 'The Best Grills in Kafr El Sheikh', language)}
            </p>
            <div className="flex items-center gap-3">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#c8a45c] hover:border-[rgba(200,164,92,0.3)] transition-all hover:scale-110">
                  <Facebook size={18} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#c8a45c] hover:border-[rgba(200,164,92,0.3)] transition-all hover:scale-110">
                  <Instagram size={18} />
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#25D366] hover:border-[rgba(37,211,102,0.3)] transition-all hover:scale-110">
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-6">
              {t('روابط سريعة', 'Quick Links', language)}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
                { path: '/menu', labelAr: 'القائمة', labelEn: 'Menu' },
                { path: '/about', labelAr: 'من نحن', labelEn: 'About' },
                { path: '/gallery', labelAr: 'المعرض', labelEn: 'Gallery' },
                { path: '/reviews', labelAr: 'التقييمات', labelEn: 'Reviews' },
                { path: '/contact', labelAr: 'تواصل معنا', labelEn: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-[#a0a0a0] hover:text-[#f5f5f5] hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  {t(link.labelAr, link.labelEn, language)}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-6">
              {t('تواصل معنا', 'Contact Us', language)}
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[#a0a0a0]">
                <Phone size={18} className="text-[#c8a45c] shrink-0" />
                <span className="text-sm">{settings.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-[#a0a0a0]">
                <MapPin size={18} className="text-[#c8a45c] shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{settings.address}</span>
              </div>
              <div className="flex items-center gap-3 text-[#a0a0a0]">
                <Clock size={18} className="text-[#c8a45c] shrink-0" />
                <span className="text-sm">
                  {t('مفتوح 24 ساعة', 'Open 24 Hours', language)}
                </span>
              </div>
            </div>

            {settings.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full h-11 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl text-sm font-semibold animate-pulse-glow transition-transform hover:scale-[1.02]"
              >
                <MessageCircle size={18} />
                {t('اطلب عبر واتساب', 'Order via WhatsApp', language)}
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#666]">
            &copy; 2025 {t('مشاوي صح. جميع الحقوق محفوظة.', 'Mashawy Sah. All rights reserved.', language)}
          </p>
          <p className="text-xs text-[#666] flex items-center gap-1">
            {t('صنع بـ', 'Made with', language)} <span className="text-[#c62828]">&#9829;</span> {t('في كفر الشيخ', 'in Kafr El Sheikh', language)}
          </p>
        </div>
      </div>
    </footer>
  );
}
