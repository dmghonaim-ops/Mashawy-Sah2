import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const { language } = useLanguageStore();
  const { items, updateQuantity, removeItem, subtotal, total, deliveryFee, discount } = useCartStore();
  const s = subtotal();
  const tot = total();

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Header */}
      <div className="bg-[#1a1a1a] pt-16 pb-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-4">
            <Link to="/" className="hover:text-[#c8a45c]">{t('الرئيسية', 'Home', language)}</Link>
            <span>/</span>
            <span className="text-[#c8a45c]">{t('السلة', 'Cart', language)}</span>
          </div>
          <h1 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5]">
            {t('سلة التسوق', 'Shopping Cart', language)}
          </h1>
        </div>
      </div>

      <div className="container-custom py-10 pb-20">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag size={64} className="text-[#2a2a2a] mx-auto mb-4" />
            <h2 className="font-arabic text-xl font-semibold text-[#a0a0a0] mb-2">
              {t('سلة التسوق فارغة', 'Your cart is empty', language)}
            </h2>
            <p className="text-sm text-[#666] mb-6">
              {t('تصفح قائمتنا واختر ما يعجبك', 'Browse our menu and choose what you like', language)}
            </p>
            <Link to="/menu" className="btn-primary inline-flex">
              {t('تصفح القائمة', 'Browse Menu', language)}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <h2 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-6">
                {t('الأصناف', 'Items', language)} ({items.length})
              </h2>
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-[#111] border border-[#2a2a2a] rounded-2xl p-4"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={t(item.menuItem.nameAr, item.menuItem.nameEn, language)}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-arabic text-base font-semibold text-[#f5f5f5]">
                          {t(item.menuItem.nameAr, item.menuItem.nameEn, language)}
                        </h3>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-xs text-[#666] mt-1">
                            {item.selectedOptions.map((o) => t(o.nameAr, o.nameEn, language)).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold text-[#f5f5f5] w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#c8a45c] font-bold">
                              {item.menuItem.price * item.quantity} {t('ج.م', 'EGP', language)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-[#666] hover:text-[#f44336] transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-5">
                  {t('ملخص الطلب', 'Order Summary', language)}
                </h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0a0a0]">{t('المجموع:', 'Subtotal:', language)}</span>
                    <span className="text-[#f5f5f5]">{s} {t('ج.م', 'EGP', language)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0a0a0]">{t('التوصيل:', 'Delivery:', language)}</span>
                    <span className="text-[#f5f5f5]">{deliveryFee} {t('ج.م', 'EGP', language)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0a0a0]">{t('الخصم:', 'Discount:', language)}</span>
                      <span className="text-[#4caf50]">-{discount} {t('ج.م', 'EGP', language)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-[#2a2a2a] pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#f5f5f5]">{t('الإجمالي:', 'Total:', language)}</span>
                    <span className="text-[#c8a45c]">{tot} {t('ج.م', 'EGP', language)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="btn-primary w-full h-13 text-base flex items-center justify-center"
                >
                  {t('متابعة الدفع', 'Proceed to Checkout', language)}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/menu"
                  className="block text-center text-sm text-[#a0a0a0] hover:text-[#c8a45c] mt-4 transition-colors"
                >
                  {t('مواصلة التسوق', 'Continue Shopping', language)}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
