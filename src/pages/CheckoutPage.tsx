import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, Store, CreditCard, Wallet, Banknote, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { useUIStore } from '@/stores/uiStore';
import AddressAutocomplete from '@/components/shared/AddressAutocomplete';
import type { Order, PaymentMethod, DeliveryType, OrderItem } from '@/types';

export default function CheckoutPage() {
  const { language } = useLanguageStore();
  const { items, subtotal, total, deliveryFee, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder } = useOrdersStore();
  const { addToast } = useUIStore();
  const s = subtotal();
  const tot = total();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      addToast({ type: 'error', message: t('الهاتف مطلوب', 'Phone is required', language) });
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      addToast({ type: 'error', message: t('العنوان مطلوب', 'Address is required', language) });
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      menuItem: item.menuItem,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      specialInstructions: item.specialInstructions,
      unitPrice: item.menuItem.price + item.selectedOptions.reduce((sum, o) => sum + o.price, 0),
      totalPrice: (item.menuItem.price + item.selectedOptions.reduce((sum, o) => sum + o.price, 0)) * item.quantity,
    }));

    const order: Order = {
      id: `MS-${Date.now().toString(36).toUpperCase()}`,
      customerId: user?.id || 'guest',
      customerName: user?.name || phone,
      customerPhone: phone,
      customerEmail: user?.email,
      items: orderItems,
      subtotal: s,
      deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
      discount: 0,
      total: deliveryType === 'delivery' ? tot : s,
      status: 'new',
      paymentMethod,
      deliveryType,
      address: deliveryType === 'delivery' ? address : undefined,
      specialInstructions: instructions || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createOrder(order);
    setOrderId(order.id);
    clearCart();
    setStep('success');
    addToast({ type: 'success', message: t('تم تأكيد طلبك!', 'Your order is confirmed!', language) });
  };

  if (items.length === 0 && step === 'form') {
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-arabic text-xl text-[#a0a0a0] mb-4">{t('السلة فارغة', 'Cart is empty', language)}</h2>
          <Link to="/menu" className="btn-primary">{t('تصفح القائمة', 'Browse Menu', language)}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px]">
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="bg-[#1a1a1a] pt-16 pb-10">
              <div className="container-custom">
                <div className="flex items-center gap-2 text-sm text-[#666] mb-4">
                  <Link to="/cart" className="hover:text-[#c8a45c]">{t('السلة', 'Cart', language)}</Link>
                  <span>/</span>
                  <span className="text-[#c8a45c]">{t('الدفع', 'Checkout', language)}</span>
                </div>
                <h1 className="font-arabic text-3xl font-bold text-[#f5f5f5]">
                  {t('إتمام الطلب', 'Checkout', language)}
                </h1>
              </div>
            </div>

            <div className="container-custom py-10 pb-20">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Contact */}
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                    <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">
                      {t('معلومات التواصل', 'Contact Information', language)}
                    </h3>
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-2">{t('رقم الهاتف', 'Phone Number', language)} *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    {!isAuthenticated && (
                      <p className="text-xs text-[#666] mt-3">
                        {t('هل لديك حساب؟', 'Have an account?', language)}{' '}
                        <Link to="/login" className="text-[#c8a45c] hover:underline">{t('سجل دخول', 'Login', language)}</Link>
                      </p>
                    )}
                  </div>

                  {/* Delivery Type */}
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                    <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">
                      {t('طريقة الاستلام', 'Delivery Method', language)}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          deliveryType === 'delivery'
                            ? 'border-[#c8a45c] bg-[rgba(200,164,92,0.1)] text-[#c8a45c]'
                            : 'border-[#2a2a2a] text-[#a0a0a0] hover:border-[rgba(200,164,92,0.3)]'
                        }`}
                      >
                        <Truck size={24} />
                        <span className="text-sm font-medium">{t('توصيل', 'Delivery', language)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          deliveryType === 'pickup'
                            ? 'border-[#c8a45c] bg-[rgba(200,164,92,0.1)] text-[#c8a45c]'
                            : 'border-[#2a2a2a] text-[#a0a0a0] hover:border-[rgba(200,164,92,0.3)]'
                        }`}
                      >
                        <Store size={24} />
                        <span className="text-sm font-medium">{t('استلام', 'Pickup', language)}</span>
                      </button>
                    </div>

                    {deliveryType === 'delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <label className="block text-xs text-[#a0a0a0] mb-2">{t('العنوان', 'Address', language)} *</label>
                        <AddressAutocomplete
                          value={address}
                          onChange={setAddress}
                          placeholder={t('ابدأ بكتابة عنوانك...', 'Start typing your address...', language)}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                    <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">
                      {t('طريقة الدفع', 'Payment Method', language)}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {[
                        { value: 'cash' as PaymentMethod, icon: Banknote, labelAr: 'كاش عند الاستلام', labelEn: 'Cash on Delivery' },
                        { value: 'card' as PaymentMethod, icon: CreditCard, labelAr: 'بطاقة ائتمان', labelEn: 'Credit Card' },
                        { value: 'wallet' as PaymentMethod, icon: Wallet, labelAr: 'محفظة إلكترونية', labelEn: 'Digital Wallet' },
                      ].map((method) => (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setPaymentMethod(method.value)}
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                            paymentMethod === method.value
                              ? 'border-[#c8a45c] bg-[rgba(200,164,92,0.1)]'
                              : 'border-[#2a2a2a] hover:border-[rgba(200,164,92,0.3)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.value ? 'border-[#c8a45c]' : 'border-[#2a2a2a]'
                          }`}>
                            {paymentMethod === method.value && <div className="w-2.5 h-2.5 rounded-full bg-[#c8a45c]" />}
                          </div>
                          <method.icon size={20} className={paymentMethod === method.value ? 'text-[#c8a45c]' : 'text-[#a0a0a0]'} />
                          <span className={`text-sm font-medium ${paymentMethod === method.value ? 'text-[#f5f5f5]' : 'text-[#a0a0a0]'}`}>
                            {t(method.labelAr, method.labelEn, language)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                    <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">
                      {t('ملاحظات خاصة', 'Special Instructions', language)}
                    </h3>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none resize-y"
                      placeholder={t('أي تعليمات خاصة بالطلب...', 'Any special instructions...', language)}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 lg:sticky lg:top-24 h-fit"
                >
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                    <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-5">
                      {t('ملخص الطلب', 'Order Summary', language)}
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-[#c8a45c] font-medium">{item.quantity}x</span>
                            <span className="text-[#a0a0a0] truncate max-w-[150px]">{t(item.menuItem.nameAr, item.menuItem.nameEn, language)}</span>
                          </div>
                          <span className="text-[#f5f5f5]">{item.menuItem.price * item.quantity} {t('ج.م', 'EGP', language)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[#2a2a2a] pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#a0a0a0]">{t('المجموع:', 'Subtotal:', language)}</span>
                        <span className="text-[#f5f5f5]">{s} {t('ج.م', 'EGP', language)}</span>
                      </div>
                      {deliveryType === 'delivery' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#a0a0a0]">{t('التوصيل:', 'Delivery:', language)}</span>
                          <span className="text-[#f5f5f5]">{deliveryFee} {t('ج.م', 'EGP', language)}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-[#2a2a2a] pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-[#f5f5f5]">{t('الإجمالي:', 'Total:', language)}</span>
                        <span className="text-[#c8a45c]">{deliveryType === 'delivery' ? tot : s} {t('ج.م', 'EGP', language)}</span>
                      </div>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-6 h-13 text-base flex items-center justify-center">
                      {t('تأكيد الطلب', 'Place Order', language)}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="text-center max-w-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-[#4caf20] flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-white" />
              </motion.div>
              <h1 className="font-arabic text-3xl font-bold text-[#f5f5f5] mb-3">
                {t('تم تأكيد طلبك!', 'Your Order is Confirmed!', language)}
              </h1>
              <p className="text-[#a0a0a0] mb-2">
                {t('رقم الطلب:', 'Order Number:', language)} <span className="text-[#c8a45c] font-bold">#{orderId}</span>
              </p>
              <p className="text-sm text-[#666] mb-8">
                {t('وقت التوصيل المتوقع: 30-45 دقيقة', 'Estimated delivery: 30-45 mins', language)}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/dashboard" className="btn-primary">
                  {t('تتبع الطلب', 'Track Order', language)}
                </Link>
                <Link to="/" className="btn-secondary">
                  {t('العودة للرئيسية', 'Back to Home', language)}
                </Link>
              </div>
              <a
                href="https://wa.me/01068186660"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm text-[#25D366] hover:underline"
              >
                <MessageCircle size={16} />
                {t('هل تحتاج مساعدة؟ تواصل معنا', 'Need help? Contact us', language)}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
