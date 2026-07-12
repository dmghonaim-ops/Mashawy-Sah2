import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown,
} from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import CartDrawer from './CartDrawer';

const navLinks = [
  { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
  { path: '/menu', labelAr: 'القائمة', labelEn: 'Menu' },
  { path: '/about', labelAr: 'من نحن', labelEn: 'About' },
  { path: '/gallery', labelAr: 'المعرض', labelEn: 'Gallery' },
  { path: '/reviews', labelAr: 'التقييمات', labelEn: 'Reviews' },
  { path: '/contact', labelAr: 'تواصل معنا', labelEn: 'Contact' },
];

export default function Navbar() {
  const { language, toggleLanguage, dir } = useLanguageStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems, openDrawer } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = totalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.9)] backdrop-blur-[20px] border-b border-[#2a2a2a]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-custom h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start shrink-0">
            <span className="font-arabic text-[22px] font-bold text-[#c8a45c] leading-tight">
              مشاوي صح
            </span>
            <span className="font-display text-[10px] text-[#666] tracking-[2px] uppercase">
              Mashawy Sah
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${
                  location.pathname === link.path
                    ? 'text-[#f5f5f5]'
                    : 'text-[#a0a0a0] hover:text-[#f5f5f5]'
                }`}
              >
                {t(link.labelAr, link.labelEn, language)}
                <span
                  className={`absolute bottom-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-[2px] bg-[#c8a45c] transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#a0a0a0] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-[#c8a45c] hover:border-[rgba(200,164,92,0.3)] transition-all"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="relative p-2 text-[#a0a0a0] hover:text-[#c8a45c] transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#c62828] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#c8a45c] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-48 bg-[#111] border border-[#2a2a2a] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#2a2a2a]">
                        <p className="text-sm font-medium text-[#f5f5f5]">{user?.name}</p>
                        <p className="text-xs text-[#666]">{user?.phone}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] transition-colors">
                        <User size={16} /> {t('حسابي', 'My Account', language)}
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#c8a45c] hover:bg-[#1a1a1a] transition-colors">
                          <LayoutDashboard size={16} /> {t('لوحة التحكم', 'Dashboard', language)}
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-[#f44336] hover:bg-[#1a1a1a] transition-colors border-t border-[#2a2a2a]"
                      >
                        <LogOut size={16} /> {t('تسجيل خروج', 'Logout', language)}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#c8a45c] border border-[rgba(200,164,92,0.3)] rounded-xl hover:bg-[rgba(200,164,92,0.1)] transition-all"
              >
                <User size={16} />
                {t('تسجيل دخول', 'Login', language)}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[rgba(0,0,0,0.7)] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: dir === 'rtl' ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? 300 : -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-[280px] h-full bg-[#111] border-${dir === 'rtl' ? 'r' : 'l'} border-[#2a2a2a] pt-20 pb-6 px-4 overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-[rgba(200,164,92,0.1)] text-[#c8a45c]'
                        : 'text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {t(link.labelAr, link.labelEn, language)}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="mt-4 px-4 py-3 rounded-xl text-sm font-medium text-center bg-[#c8a45c] text-[#0a0a0a]"
                  >
                    {t('تسجيل دخول', 'Login', language)}
                  </Link>
                )}
                <button
                  onClick={toggleLanguage}
                  className="mt-2 px-4 py-3 rounded-xl text-sm font-medium text-[#a0a0a0] border border-[#2a2a2a] hover:border-[rgba(200,164,92,0.3)] transition-colors"
                >
                  {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
