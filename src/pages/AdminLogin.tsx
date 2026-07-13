import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Lock, User, Eye, EyeOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminLogin, adminLogout, isAdminLoggedIn, getCurrentAdmin } from '@/lib/adminAuth';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);
    
    try {
      await adminLogin(username.trim(), password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/admin', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast.success('تم تسجيل الخروج');
    navigate('/admin/login', { replace: true });
  };

  const currentAdmin = getCurrentAdmin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Already Logged In State */}
        {currentAdmin && (
          <div className="bg-dark-800/50 rounded-3xl p-8 border border-dark-700/50 backdrop-blur-xl shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700">
              <User className="h-8 w-8 text-dark-900" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">مرحباً {currentAdmin.full_name}</h2>
            <p className="text-dark-400 text-sm mb-6">أنت مسجل الدخول بالفعل</p>
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => navigate('/admin', { replace: true })}>
                الانتقال إلى لوحة التحكم
              </Button>
              <Button size="lg" variant="outline" className="w-full gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        )}

        {/* Login Form */}
        {!currentAdmin && (
          <div className="bg-dark-800/50 rounded-3xl p-8 border border-dark-700/50 backdrop-blur-xl shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/20">
                <Flame className="h-8 w-8 text-dark-900" />
              </div>
              <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
              <p className="text-sm text-dark-400 mt-1">Admin Panel - مشاوي صح</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm text-dark-300">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin123"
                    className="pr-12"
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm text-dark-300">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-12 pl-12"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-dark-700/50 text-center">
              <p className="text-xs text-dark-500">
                © {new Date().getFullYear()} مشاوي صح - جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}