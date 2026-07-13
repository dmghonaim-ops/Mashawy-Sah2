import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { seedData } from '@/data/seedData';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ToastContainer from '@/components/shared/Toast';
import LoadingScreen from '@/components/shared/LoadingScreen';
import AdminLogin from '@/pages/AdminLogin';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const MenuPage = lazy(() => import('@/pages/MenuPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    seedData();
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LoadingScreen />
      <ToastContainer />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Customer Routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c8a45c] border-t-transparent rounded-full animate-spin" /></div>}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
                      <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
