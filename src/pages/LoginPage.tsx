import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Lock, LogIn, UserPlus } from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export default function LoginPage() {
  const { language } = useLanguageStore();
  const { login, register } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (login(phone, password)) {
        addToast({ type: 'success', message: t('تم تسجيل الدخول', 'Logged in successfully', language) });
        navigate('/');
      } else {
        addToast({ type: 'error', message: t('رقم الهاتف أو كلمة المرور غير صحيحة', 'Invalid phone or password', language) });
      }
    } else {
      if (!name.trim()) {
        addToast({ type: 'error', message: t('الاسم مطلوب', 'Name is required', language) });
        return;
      }
      if (password !== confirmPassword) {
        addToast({ type: 'error', message: t('كلمات المرور غير متطابقة', 'Passwords do not match', language) });
        return;
      }
      if (register(name, phone, password)) {
        addToast({ type: 'success', message: t('تم إنشاء الحساب', 'Account created successfully', language) });
        navigate('/');
      } else {
        addToast({ type: 'error', message: t('رقم الهاتف مستخدم', 'Phone number already in use', language) });
      }
    }
  };

  return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[rgba(200,164,92,0.1)] border border-[rgba(200,164,92,0.2)] flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-[#c8a45c]" />
            </div>
            <h1 className="font-arabic text-2xl font-bold text-[#f5f5f5]">
              {mode === 'login' ? t('تسجيل الدخول', 'Login', language) : t('إنشاء حساب', 'Register', language)}
            </h1>
            <p className="text-sm text-[#a0a0a0] mt-2">
              {mode === 'login'
                ? t('أهلاً بك مجدداً', 'Welcome back', language)
                : t('انضم إلينا اليوم', 'Join us today', language)}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-2">{t('الاسم', 'Name', language)} *</label>
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pr-10 pl-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                    placeholder={t('اسمك الكامل', 'Your full name', language)}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs text-[#a0a0a0] mb-2">{t('رقم الهاتف / اسم المستخدم', 'Phone Number / Username', language)} *</label>
              <div className="relative">
                <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pr-10 pl-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#a0a0a0] mb-2">{t('كلمة المرور', 'Password', language)} *</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pr-10 pl-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                  placeholder="••••••"
                />
              </div>
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-2">{t('تأكيد كلمة المرور', 'Confirm Password', language)} *</label>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pr-10 pl-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                    placeholder="••••••"
                  />
                </div>
              </div>
            )}
            <button type="submit" className="btn-primary w-full h-12">
              {mode === 'login' ? (
                <><LogIn size={18} /> {t('تسجيل الدخول', 'Login', language)}</>
              ) : (
                <><UserPlus size={18} /> {t('إنشاء حساب', 'Register', language)}</>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-[#a0a0a0] mt-6">
            {mode === 'login' ? (
              <>
                {t('ليس لديك حساب؟', "Don't have an account?", language)}{' '}
                <button onClick={() => setMode('register')} className="text-[#c8a45c] hover:underline">
                  {t('سجل الآن', 'Register', language)}
                </button>
              </>
            ) : (
              <>
                {t('لديك حساب؟', 'Have an account?', language)}{' '}
                <button onClick={() => setMode('login')} className="text-[#c8a45c] hover:underline">
                  {t('سجل دخول', 'Login', language)}
                </button>
              </>
            )}
          </p>

        </div>
      </motion.div>
    </div>
  );
}
