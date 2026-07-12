import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useLanguageStore, t } from '@/stores/languageStore';

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, subtotal, total, deliveryFee, updateQuantity, removeItem } = useCartStore();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const s = subtotal();
  const tot = total();

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[2000] bg-[rgba(0,0,0,0.7)]"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-[2001] bg-[#111] border-l border-[#2a2a2a] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-lg font-semibold text-[#f5f5f5] font-arabic">
                {t('سلة التسوق', 'Your Cart', language)}
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors rounded-lg hover:bg-[#1a1a1a]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-[#2a2a2a] mb-4" />
                  <h3 className="text-lg font-medium text-[#a0a0a0] mb-2">
                    {t('السلة فارغة', 'Your cart is empty', language)}
                  </h3>
                  <p className="text-sm text-[#666]">
                    {t('أضف بعض الأصناف', 'Add some items', language)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
                      >
                        <img
                          src={item.menuItem.image}
                          alt={t(item.menuItem.nameAr, item.menuItem.nameEn, language)}
                          className="w-20 h-20 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#f5f5f5] truncate">
                            {t(item.menuItem.nameAr, item.menuItem.nameEn, language)}
                          </h4>
                          <p className="text-sm text-[#c8a45c] font-semibold mt-1">
                            {item.menuItem.price} {t('ج.م', 'EGP', language)}
                          </p>
                          {item.selectedOptions.length > 0 && (
                            <p className="text-xs text-[#666] mt-0.5">
                              {item.selectedOptions.map(o => t(o.nameAr, o.nameEn, language)).join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#333] transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                className="text-sm font-semibold text-[#f5f5f5] w-6 text-center"
                              >
                                {item.quantity}
                              </motion.span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#333] transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-[#666] hover:text-[#f44336] transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#2a2a2a] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">{t('المجموع:', 'Subtotal:', language)}</span>
                  <span className="text-[#f5f5f5]">{s} {t('ج.م', 'EGP', language)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">{t('التوصيل:', 'Delivery:', language)}</span>
                  <span className="text-[#f5f5f5]">{deliveryFee} {t('ج.م', 'EGP', language)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-[#2a2a2a] pt-3">
                  <span className="text-[#f5f5f5]">{t('الإجمالي:', 'Total:', language)}</span>
                  <span className="text-[#c8a45c]">{tot} {t('ج.م', 'EGP', language)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary h-[52px] text-base"
                >
                  {t('إتمام الطلب', 'Checkout', language)}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
