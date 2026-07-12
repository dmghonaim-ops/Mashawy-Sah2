import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, MessageCircle, Mail, Facebook, Instagram, Send } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { useUIStore } from '@/stores/uiStore';

export default function ContactPage() {
  const { language } = useLanguageStore();
  const { settings } = useRestaurantStore();
  const { addToast } = useUIStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'inquiry', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('الاسم مطلوب', 'Name is required', language);
    if (!form.phone.trim()) e.phone = t('الهاتف مطلوب', 'Phone is required', language);
    if (form.message.trim().length < 10) e.message = t('الرسالة يجب أن تكون 10 أحرف على الأقل', 'Message must be at least 10 characters', language);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addToast({ type: 'success', message: t('تم إرسال رسالتك بنجاح', 'Your message was sent successfully', language) });
      setForm({ name: '', phone: '', email: '', subject: 'inquiry', message: '' });
    }
  };

  const contactCards = [
    { icon: Phone, titleAr: 'اتصل بنا', titleEn: 'Call Us', value: settings.phone, action: `tel:${settings.phone}`, btn: t('اتصل الآن', 'Call Now', language) },
    { icon: MessageCircle, titleAr: 'واتساب', titleEn: 'WhatsApp', value: settings.whatsappNumber, action: `https://wa.me/${settings.whatsappNumber}`, btn: t('راسلنا', 'Message Us', language), isWhatsApp: true },
    { icon: MapPin, titleAr: 'العنوان', titleEn: 'Address', value: settings.address, action: 'https://www.google.com/maps/dir/?api=1&destination=31.1105,30.8382', btn: t('احصل على الاتجاهات', 'Get Directions', language) },
  ];

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Header */}
      <div className="bg-[#1a1a1a] pt-16 pb-10">
        <div className="container-custom">
          <h1 className="font-arabic text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">
            {t('تواصل معنا', 'Contact Us', language)}
          </h1>
          <p className="text-[#a0a0a0]">{t('نحن هنا لمساعدتك', "We're Here to Help", language)}</p>
        </div>
      </div>

      {/* Contact Cards */}
      <section className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(200,164,92,0.1)] flex items-center justify-center mx-auto mb-4">
                <card.icon size={22} className="text-[#c8a45c]" />
              </div>
              <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-2">{t(card.titleAr, card.titleEn, language)}</h3>
              <p className="text-sm text-[#a0a0a0] mb-5">{card.value}</p>
              <a
                href={card.action}
                target={card.isWhatsApp ? '_blank' : undefined}
                rel={card.isWhatsApp ? 'noopener noreferrer' : undefined}
                className={`inline-flex items-center justify-center w-full h-11 rounded-xl text-sm font-semibold transition-all ${
                  card.isWhatsApp
                    ? 'bg-[#25D366] text-white hover:scale-[1.02]'
                    : 'bg-[#c8a45c] text-[#0a0a0a] hover:bg-[#d4b76a]'
                }`}
              >
                {card.btn}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-[#111]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h2 className="font-arabic text-2xl font-bold text-[#f5f5f5] mb-6">
                {t('أرسل لنا رسالة', 'Send Us a Message', language)}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-2">{t('الاسم', 'Name', language)} *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full h-12 bg-[#1a1a1a] border rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none transition-colors ${errors.name ? 'border-[#f44336]' : 'border-[#2a2a2a]'}`}
                    />
                    {errors.name && <p className="text-xs text-[#f44336] mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-2">{t('الهاتف', 'Phone', language)} *</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full h-12 bg-[#1a1a1a] border rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none transition-colors ${errors.phone ? 'border-[#f44336]' : 'border-[#2a2a2a]'}`}
                    />
                    {errors.phone && <p className="text-xs text-[#f44336] mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0a0] mb-2">{t('البريد الإلكتروني', 'Email', language)}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0a0] mb-2">{t('الموضوع', 'Subject', language)}</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                  >
                    <option value="inquiry">{t('استفسار', 'Inquiry', language)}</option>
                    <option value="complaint">{t('شكوى', 'Complaint', language)}</option>
                    <option value="suggestion">{t('اقتراح', 'Suggestion', language)}</option>
                    <option value="special">{t('طلب خاص', 'Special Request', language)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0a0] mb-2">{t('الرسالة', 'Message', language)} *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none transition-colors resize-y ${errors.message ? 'border-[#f44336]' : 'border-[#2a2a2a]'}`}
                    placeholder={t('اكتب رسالتك هنا...', 'Write your message here...', language)}
                  />
                  {errors.message && <p className="text-xs text-[#f44336] mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary w-full h-12">
                  <Send size={16} />
                  {t('إرسال', 'Send', language)}
                </button>
              </form>
            </motion.div>

            {/* Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h3 className="font-arabic text-xl font-semibold text-[#f5f5f5] mb-6">
                {t('معلومات التواصل', 'Contact Information', language)}
              </h3>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[#c8a45c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{t('ساعات العمل', 'Working Hours', language)}</p>
                    <p className="text-sm text-[#a0a0a0]">{t('مفتوح 24 ساعة', 'Open 24 Hours', language)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#c8a45c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{t('البريد الإلكتروني', 'Email', language)}</p>
                    <p className="text-sm text-[#a0a0a0]">{settings.email}</p>
                  </div>
                </div>
              </div>

              <h4 className="font-arabic text-sm font-semibold text-[#a0a0a0] mb-4">
                {t('تابعنا', 'Follow Us', language)}
              </h4>
              <div className="flex items-center gap-3">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#c8a45c] hover:border-[rgba(200,164,92,0.3)] transition-all">
                    <Facebook size={18} />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#c8a45c] hover:border-[rgba(200,164,92,0.3)] transition-all">
                    <Instagram size={18} />
                  </a>
                )}
                {settings.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#25D366] hover:border-[rgba(37,211,102,0.3)] transition-all">
                    <MessageCircle size={18} />
                  </a>
                )}
              </div>

              {/* Map */}
              <div className="mt-8 w-full h-[200px] bg-[#111] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.7261!2d30.8382!3d31.1105"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
