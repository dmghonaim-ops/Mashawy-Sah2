import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Package, Utensils, Tag, Users, Star, Percent, Settings,
  LogOut, Menu, X, Search, Plus, Edit, Trash2, Copy, Check, XCircle,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { useReviewsStore } from '@/stores/reviewsStore';
import { useUIStore } from '@/stores/uiStore';
import type { OrderStatus, MenuItem, Category, Coupon, ReviewStatus } from '@/types';

const statusColors: Record<OrderStatus, string> = {
  new: '#2196f3', preparing: '#ff9800', ready: '#4caf50',
  delivering: '#9c27b0', completed: '#4caf50', cancelled: '#f44336',
};
const statusLabelsAr: Record<OrderStatus, string> = {
  new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز', delivering: 'جاري التوصيل', completed: 'مكتمل', cancelled: 'ملغي',
};
const statusLabelsEn: Record<OrderStatus, string> = {
  new: 'New', preparing: 'Preparing', ready: 'Ready', delivering: 'Delivering', completed: 'Completed', cancelled: 'Cancelled',
};

const sidebarItems = [
  { id: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: BarChart3 },
  { id: 'orders', labelAr: 'الطلبات', labelEn: 'Orders', icon: Package },
  { id: 'menu', labelAr: 'القائمة', labelEn: 'Menu', icon: Utensils },
  { id: 'categories', labelAr: 'التصنيفات', labelEn: 'Categories', icon: Tag },
  { id: 'customers', labelAr: 'المستخدمون', labelEn: 'Users', icon: Users },
  { id: 'reviews', labelAr: 'التقييمات', labelEn: 'Reviews', icon: Star },
  { id: 'coupons', labelAr: 'كوبونات الخصم', labelEn: 'Coupons', icon: Percent },
  { id: 'settings', labelAr: 'إعدادات المطعم', labelEn: 'Settings', icon: Settings },
];

const COLORS = ['#c8a45c', '#d4b76a', '#a88b4a', '#c62828', '#4caf50', '#2196f3'];

export default function AdminDashboard() {
  const { language } = useLanguageStore();
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex" dir="ltr">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#111] border-r border-[#2a2a2a] z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 lg:w-16 overflow-hidden' : 'w-64'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-[#2a2a2a]">
            {!sidebarCollapsed && (
              <Link to="/" className="flex flex-col">
                <span className="font-arabic text-lg font-bold text-[#c8a45c] leading-tight">مشاوي صح</span>
                <span className="text-[9px] text-[#666] tracking-[1px]">Mashawy Sah</span>
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden ml-auto p-2 text-[#a0a0a0]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarCollapsed(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-l-[3px] ${
                  activeTab === item.id
                    ? 'border-l-[#c8a45c] bg-[rgba(200,164,92,0.1)] text-[#c8a45c]'
                    : 'border-l-transparent text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
                }`}
              >
                <item.icon size={18} />
                {!sidebarCollapsed && <span>{t(item.labelAr, item.labelEn, language)}</span>}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-[#2a2a2a]">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-[#f44336] hover:bg-[#1a1a1a] rounded-xl transition-all"
            >
              <LogOut size={18} />
              {!sidebarCollapsed && <span>{t('تسجيل خروج', 'Logout', language)}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 text-[#a0a0a0] hover:text-[#f5f5f5] lg:hidden">
              <Menu size={20} />
            </button>
            <h1 className="font-arabic text-lg font-semibold text-[#f5f5f5]">
              {t(sidebarItems.find((i) => i.id === activeTab)?.labelAr || '', sidebarItems.find((i) => i.id === activeTab)?.labelEn || '', language)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c8a45c] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'menu' && <MenuTab />}
              {activeTab === 'categories' && <CategoriesTab />}
              {activeTab === 'customers' && <CustomersTab />}
              {activeTab === 'reviews' && <ReviewsTab />}
              {activeTab === 'coupons' && <CouponsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ========== Dashboard Tab ========== */
function DashboardTab() {
  const { language } = useLanguageStore();
  const { getOrders } = useOrdersStore();
  const { getReviews } = useReviewsStore();
  const orders = getOrders();
  const reviews = getReviews();

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.filter((o) => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const customers = new Set(orders.map((o) => o.customerId)).size;
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';
    return { totalOrders, revenue, customers, avgRating };
  }, [orders, reviews]);

  const revenueData = useMemo(() => {
    const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days.map((day) => ({
      name: day,
      revenue: Math.floor(Math.random() * 5000) + 2000,
    }));
  }, []);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((i) => {
        const catId = i.menuItem.categoryId;
        cats[catId] = (cats[catId] || 0) + i.quantity;
      });
    });
    return Object.entries(cats).map(([catId, value]) => ({
      name: catId,
      value,
    })).slice(0, 6);
  }, [orders]);

  const recentOrders = orders.slice(0, 5);
  const recentReviews = reviews.filter((r) => r.status === 'approved').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { labelAr: 'إجمالي الطلبات', labelEn: 'Total Orders', value: stats.totalOrders.toLocaleString(), trend: '+12%', icon: Package, up: true },
          { labelAr: 'الإيرادات', labelEn: 'Revenue', value: `${stats.revenue.toLocaleString()} EGP`, trend: '+8%', icon: BarChart3, up: true },
          { labelAr: 'العملاء', labelEn: 'Customers', value: stats.customers.toLocaleString(), trend: '+15%', icon: Users, up: true },
          { labelAr: 'متوسط التقييم', labelEn: 'Avg. Rating', value: stats.avgRating, trend: '+0.2', icon: Star, up: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-[#a0a0a0] mb-1">{t(stat.labelAr, stat.labelEn, language)}</p>
                <p className="text-2xl font-bold text-[#f5f5f5]">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[rgba(200,164,92,0.1)] flex items-center justify-center">
                <stat.icon size={18} className="text-[#c8a45c]" />
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
              {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-arabic text-base font-semibold text-[#f5f5f5] mb-4">
            {t('الإيرادات (آخر 7 أيام)', 'Revenue (Last 7 Days)', language)}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '12px' }}
                labelStyle={{ color: '#f5f5f5' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#c8a45c" strokeWidth={2} dot={{ fill: '#c8a45c', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-arabic text-base font-semibold text-[#f5f5f5] mb-4">
            {t('الطلبات حسب التصنيف', 'Orders by Category', language)}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '12px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-arabic text-base font-semibold text-[#f5f5f5] mb-4">
            {t('أحدث الطلبات', 'Recent Orders', language)}
          </h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                <div>
                  <span className="text-sm font-medium text-[#f5f5f5]">#{order.id}</span>
                  <p className="text-xs text-[#666]">{order.customerName}</p>
                </div>
                <div className="text-end">
                  <span className="text-sm text-[#c8a45c]">{order.total} EGP</span>
                  <span
                    className="block text-[10px] px-2 py-0.5 rounded-full mt-1"
                    style={{ backgroundColor: `${statusColors[order.status]}20`, color: statusColors[order.status] }}
                  >
                    {t(statusLabelsAr[order.status], statusLabelsEn[order.status], language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-arabic text-base font-semibold text-[#f5f5f5] mb-4">
            {t('أحدث التقييمات', 'Recent Reviews', language)}
          </h3>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="py-2 border-b border-[#2a2a2a] last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#f5f5f5]">{review.customerName}</span>
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-[#c8a45c]' : 'text-[#2a2a2a]'}>★</span>
                  ))}</div>
                </div>
                <p className="text-xs text-[#a0a0a0] line-clamp-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Orders Tab ========== */
function OrdersTab() {
  const { language } = useLanguageStore();
  const { getOrders, updateOrderStatus, deleteOrder } = useOrdersStore();
  const { addToast } = useUIStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const orders = getOrders();

  const handleComplete = (id: string) => {
    deleteOrder(id);
    addToast({ type: 'success', message: t('تم إنهاء الطلب', 'Order completed', language) });
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث...', 'Search...', language)}
            className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-10 pr-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5]"
        >
          <option value="all">{t('الكل', 'All', language)}</option>
          {Object.keys(statusLabelsAr).map((s) => (
            <option key={s} value={s}>{t(statusLabelsAr[s as OrderStatus], statusLabelsEn[s as OrderStatus], language)}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الطلب', 'Order', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('العميل', 'Customer', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('المبلغ', 'Total', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الحالة', 'Status', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الإجراءات', 'Actions', language)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-[#f5f5f5]">#{order.id}</span>
                  <p className="text-xs text-[#666]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3 text-[#a0a0a0]">{order.customerName}</td>
                <td className="px-4 py-3 text-[#c8a45c] font-medium">{order.total} EGP</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                    {t(statusLabelsAr[order.status], statusLabelsEn[order.status], language)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
                    >
                      {Object.keys(statusLabelsAr).map((s) => (
                        <option key={s} value={s}>{t(statusLabelsAr[s as OrderStatus], statusLabelsEn[s as OrderStatus], language)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleComplete(order.id)}
                      title={t('إنهاء وإخفاء الطلب', 'Complete and remove order', language)}
                      className="w-8 h-8 rounded-lg bg-[rgba(76,175,80,0.15)] text-[#4caf50] flex items-center justify-center hover:bg-[#4caf50] hover:text-white transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== Menu Tab ========== */
function MenuTab() {
  const { language } = useLanguageStore();
  const { getMenuItems, getCategories, deleteMenuItem, duplicateMenuItem, updateMenuItem, addMenuItem } = useRestaurantStore();
  const { addToast } = useUIStore();
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const items = getMenuItems();
  const categories = getCategories();

  const filtered = items.filter((i) =>
    !search || i.nameAr.toLowerCase().includes(search.toLowerCase()) || i.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const emptyForm: Partial<MenuItem> = {
    nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '', price: 0,
    image: '', categoryId: categories[0]?.id || '', preparationTime: 15,
    isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: false, isSpicy: false,
  };

  const handleAddNew = () => {
    setEditForm(emptyForm);
    setIsAdding(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handleSave = () => {
    if (editingItem && editForm) {
      updateMenuItem(editingItem.id, editForm);
      addToast({ type: 'success', message: t('تم التحديث', 'Updated', language) });
      setEditingItem(null);
    }
  };

  const handleCreate = () => {
    if (!editForm.nameAr || !editForm.nameEn || !editForm.categoryId) {
      addToast({ type: 'error', message: t('يرجى ملء الاسم والتصنيف', 'Please fill in name and category', language) });
      return;
    }
    const newItem: MenuItem = {
      id: `mi-${Date.now()}`,
      nameAr: editForm.nameAr || '',
      nameEn: editForm.nameEn || '',
      descriptionAr: editForm.descriptionAr || '',
      descriptionEn: editForm.descriptionEn || '',
      price: editForm.price || 0,
      image: editForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      categoryId: editForm.categoryId || categories[0]?.id || '',
      preparationTime: editForm.preparationTime || 15,
      isAvailable: editForm.isAvailable ?? true,
      isFeatured: editForm.isFeatured ?? false,
      isPopular: editForm.isPopular ?? false,
      isVegetarian: editForm.isVegetarian ?? false,
      isSpicy: editForm.isSpicy ?? false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    addMenuItem(newItem);
    addToast({ type: 'success', message: t('تمت الإضافة', 'Item added', language) });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث في القائمة...', 'Search menu...', language)}
            className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-10 pr-4 text-sm text-[#f5f5f5] focus:border-[#c8a45c] focus:outline-none"
          />
        </div>
        <button onClick={handleAddNew} className="btn-primary h-10 px-4 text-sm flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> {t('إضافة صنف', 'Add Item', language)}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleEdit(item)} className="w-9 h-9 rounded-lg bg-[#c8a45c] text-[#0a0a0a] flex items-center justify-center hover:scale-110 transition-transform"><Edit size={16} /></button>
                <button onClick={() => { duplicateMenuItem(item.id); addToast({ type: 'success', message: t('تم النسخ', 'Duplicated', language) }); }} className="w-9 h-9 rounded-lg bg-[#2196f3] text-white flex items-center justify-center hover:scale-110 transition-transform"><Copy size={16} /></button>
                <button onClick={() => { deleteMenuItem(item.id); addToast({ type: 'success', message: t('تم الحذف', 'Deleted', language) }); }} className="w-9 h-9 rounded-lg bg-[#f44336] text-white flex items-center justify-center hover:scale-110 transition-transform"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-[#f5f5f5]">{t(item.nameAr, item.nameEn, language)}</h4>
                <span className="text-sm font-bold text-[#c8a45c]">{item.price} EGP</span>
              </div>
              <p className="text-xs text-[#a0a0a0] line-clamp-1 mb-2">{t(item.descriptionAr, item.descriptionEn, language)}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { updateMenuItem(item.id, { isAvailable: !item.isAvailable }); addToast({ type: 'success', message: t('تم التحديث', 'Updated', language) }); }}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                    item.isAvailable ? 'bg-[rgba(76,175,80,0.15)] text-[#4caf50]' : 'bg-[rgba(244,67,54,0.15)] text-[#f44336]'
                  }`}
                >
                  {item.isAvailable ? t('متوفر', 'Available', language) : t('غير متوفر', 'Unavailable', language)}
                </button>
                {item.isFeatured && <span className="text-[10px] px-2.5 py-1 rounded-full bg-[rgba(200,164,92,0.15)] text-[#c8a45c]">{t('مميز', 'Featured', language)}</span>}
                {item.isPopular && <span className="text-[10px] px-2.5 py-1 rounded-full bg-[rgba(198,40,40,0.15)] text-[#c62828]">{t('شعبي', 'Popular', language)}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[2000] bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">{t('تعديل الصنف', 'Edit Item', language)}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('الاسم (عربي)', 'Name (AR)', language)}</label>
                <input value={editForm.nameAr || ''} onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('الاسم (English)', 'Name (EN)', language)}</label>
                <input value={editForm.nameEn || ''} onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('السعر', 'Price', language)}</label>
                <input type="number" value={editForm.price || 0} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('التصنيف', 'Category', language)}</label>
                <select value={editForm.categoryId || ''} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]">
                  {categories.map((c) => <option key={c.id} value={c.id}>{t(c.nameAr, c.nameEn, language)}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                  <input type="checkbox" checked={editForm.isAvailable || false} onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
                  {t('متوفر', 'Available', language)}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                  <input type="checkbox" checked={editForm.isFeatured || false} onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
                  {t('مميز', 'Featured', language)}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                  <input type="checkbox" checked={editForm.isPopular || false} onChange={(e) => setEditForm({ ...editForm, isPopular: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
                  {t('شعبي', 'Popular', language)}
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-primary flex-1 h-10 text-sm">{t('حفظ', 'Save', language)}</button>
                <button onClick={() => setEditingItem(null)} className="btn-secondary flex-1 h-10 text-sm">{t('إلغاء', 'Cancel', language)}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add New Item Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[2000] bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4" onClick={() => setIsAdding(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">{t('إضافة صنف جديد', 'Add New Item', language)}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('الاسم (عربي)', 'Name (AR)', language)} *</label>
                <input value={editForm.nameAr || ''} onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('الاسم (English)', 'Name (EN)', language)} *</label>
                <input value={editForm.nameEn || ''} onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('الوصف (عربي)', 'Description (AR)', language)}</label>
                <textarea value={editForm.descriptionAr || ''} onChange={(e) => setEditForm({ ...editForm, descriptionAr: e.target.value })} rows={2} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] resize-y" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('الوصف (English)', 'Description (EN)', language)}</label>
                <textarea value={editForm.descriptionEn || ''} onChange={(e) => setEditForm({ ...editForm, descriptionEn: e.target.value })} rows={2} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] resize-y" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('السعر', 'Price', language)}</label>
                <input type="number" value={editForm.price || 0} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('رابط الصورة', 'Image URL', language)}</label>
                <input value={editForm.image || ''} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="https://..." className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1">{t('التصنيف', 'Category', language)}</label>
                <select value={editForm.categoryId || ''} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]">
                  {categories.map((c) => <option key={c.id} value={c.id}>{t(c.nameAr, c.nameEn, language)}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                  <input type="checkbox" checked={editForm.isAvailable ?? true} onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
                  {t('متوفر', 'Available', language)}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                  <input type="checkbox" checked={editForm.isFeatured || false} onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
                  {t('مميز', 'Featured', language)}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                  <input type="checkbox" checked={editForm.isPopular || false} onChange={(e) => setEditForm({ ...editForm, isPopular: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
                  {t('شعبي', 'Popular', language)}
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} className="btn-primary flex-1 h-10 text-sm">{t('إضافة', 'Add', language)}</button>
                <button onClick={() => setIsAdding(false)} className="btn-secondary flex-1 h-10 text-sm">{t('إلغاء', 'Cancel', language)}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
function CategoriesTab() {
  const { language } = useLanguageStore();
  const { getCategories, updateCategory, deleteCategory } = useRestaurantStore();
  const { addToast } = useUIStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const categories = getCategories();

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setEditForm({ ...cat });
  };

  const handleSave = () => {
    if (editing && editForm) {
      updateCategory(editing.id, editForm);
      addToast({ type: 'success', message: t('تم التحديث', 'Updated', language) });
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('التصنيف', 'Category', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الحالة', 'Status', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الإجراءات', 'Actions', language)}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={cat.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium text-[#f5f5f5]">{t(cat.nameAr, cat.nameEn, language)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { updateCategory(cat.id, { isVisible: !cat.isVisible }); addToast({ type: 'success', message: t('تم التحديث', 'Updated', language) }); }}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${cat.isVisible ? 'bg-[rgba(76,175,80,0.15)] text-[#4caf50]' : 'bg-[rgba(244,67,54,0.15)] text-[#f44336]'}`}
                  >
                    {cat.isVisible ? t('مرئي', 'Visible', language) : t('مخفي', 'Hidden', language)}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-1.5 text-[#a0a0a0] hover:text-[#c8a45c] transition-colors"><Edit size={14} /></button>
                    <button onClick={() => { deleteCategory(cat.id); addToast({ type: 'success', message: t('تم الحذف', 'Deleted', language) }); }} className="p-1.5 text-[#a0a0a0] hover:text-[#f44336] transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[2000] bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">{t('تعديل التصنيف', 'Edit Category', language)}</h3>
            <div className="space-y-4">
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('الاسم (عربي)', 'Name (AR)', language)}</label><input value={editForm.nameAr || ''} onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('الاسم (English)', 'Name (EN)', language)}</label><input value={editForm.nameEn || ''} onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-primary flex-1 h-10 text-sm">{t('حفظ', 'Save', language)}</button>
                <button onClick={() => setEditing(null)} className="btn-secondary flex-1 h-10 text-sm">{t('إلغاء', 'Cancel', language)}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ========== Customers Tab ========== */
function CustomersTab() {
  const { language } = useLanguageStore();
  const { getAllUsers, toggleUserActive, updateUser, user: currentUser } = useAuthStore();
  const { getOrders } = useOrdersStore();
  const { addToast } = useUIStore();
  const [search, setSearch] = useState('');
  const customers = getAllUsers();
  const orders = getOrders();

  const filtered = customers.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const handleToggleAdmin = (customerId: string, currentRole: string) => {
    if (customerId === currentUser?.id) {
      addToast({ type: 'error', message: t('لا يمكنك تغيير صلاحيتك الخاصة', "You can't change your own role", language) });
      return;
    }
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    updateUser(customerId, { role: newRole as 'admin' | 'customer' });
    addToast({
      type: 'success',
      message: newRole === 'admin'
        ? t('تم منح صلاحية المدير', 'Admin access granted', language)
        : t('تم إلغاء صلاحية المدير', 'Admin access removed', language),
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('بحث...', 'Search...', language)} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-10 pr-4 text-sm text-[#f5f5f5]" />
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('العميل', 'Customer', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الهاتف', 'Phone', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الصلاحية', 'Role', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الطلبات', 'Orders', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الحالة', 'Status', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الإجراءات', 'Actions', language)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => {
              const orderCount = orders.filter((o) => o.customerId === customer.id).length;
              const isAdmin = customer.role === 'admin';
              return (
                <tr key={customer.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[rgba(200,164,92,0.2)] flex items-center justify-center text-[#c8a45c] font-bold text-xs">{customer.name.charAt(0)}</div>
                      <span className="font-medium text-[#f5f5f5]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#a0a0a0]">{customer.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isAdmin ? 'bg-[rgba(200,164,92,0.15)] text-[#c8a45c]' : 'bg-[#1a1a1a] text-[#a0a0a0]'}`}>
                      {isAdmin ? t('مدير', 'Admin', language) : t('عميل', 'Customer', language)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#a0a0a0]">{orderCount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${customer.isActive ? 'bg-[rgba(76,175,80,0.15)] text-[#4caf50]' : 'bg-[rgba(244,67,54,0.15)] text-[#f44336]'}`}>
                      {customer.isActive ? t('نشط', 'Active', language) : t('معطل', 'Inactive', language)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleUserActive(customer.id)} className="text-xs text-[#a0a0a0] hover:text-[#c8a45c] transition-colors">
                        {customer.isActive ? t('تعطيل', 'Disable', language) : t('تفعيل', 'Enable', language)}
                      </button>
                      <button onClick={() => handleToggleAdmin(customer.id, customer.role)} className="text-xs text-[#a0a0a0] hover:text-[#c8a45c] transition-colors">
                        {isAdmin ? t('إلغاء المدير', 'Remove Admin', language) : t('جعله مديراً', 'Make Admin', language)}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== Reviews Tab ========== */
function ReviewsTab() {
  const { language } = useLanguageStore();
  const { getReviews, approveReview, rejectReview, deleteReview, pinReview } = useReviewsStore();
  const { addToast } = useUIStore();
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('all');
  const reviews = getReviews();

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === f ? 'bg-[#c8a45c] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#a0a0a0]'}`}>
            {f === 'all' ? t('الكل', 'All', language) : f === 'pending' ? t('معلق', 'Pending', language) : f === 'approved' ? t('مقبول', 'Approved', language) : t('مرفوض', 'Rejected', language)}
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('العميل', 'Customer', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('التقييم', 'Rating', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('التعليق', 'Comment', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الحالة', 'Status', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الإجراءات', 'Actions', language)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review) => (
              <tr key={review.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3 font-medium text-[#f5f5f5]">{review.customerName}</td>
                <td className="px-4 py-3">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<span key={i} className={i < review.rating ? 'text-[#c8a45c]' : 'text-[#2a2a2a]'}>★</span>))}</div>
                </td>
                <td className="px-4 py-3 text-[#a0a0a0] max-w-[200px] truncate">{review.comment}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    review.status === 'approved' ? 'bg-[rgba(76,175,80,0.15)] text-[#4caf50]' :
                    review.status === 'rejected' ? 'bg-[rgba(244,67,54,0.15)] text-[#f44336]' :
                    'bg-[rgba(255,152,0,0.15)] text-[#ff9800]'
                  }`}>
                    {review.status === 'approved' ? t('مقبول', 'Approved', language) : review.status === 'rejected' ? t('مرفوض', 'Rejected', language) : t('معلق', 'Pending', language)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {review.status !== 'approved' && <button onClick={() => { approveReview(review.id); addToast({ type: 'success', message: t('تم القبول', 'Approved', language) }); }} className="p-1.5 text-[#a0a0a0] hover:text-[#4caf50] transition-colors" title="Approve"><Check size={14} /></button>}
                    {review.status !== 'rejected' && <button onClick={() => { rejectReview(review.id); addToast({ type: 'warning', message: t('تم الرفض', 'Rejected', language) }); }} className="p-1.5 text-[#a0a0a0] hover:text-[#f44336] transition-colors" title="Reject"><XCircle size={14} /></button>}
                    <button onClick={() => { pinReview(review.id); addToast({ type: 'success', message: t('تم التثبيت', 'Pinned', language) }); }} className={`p-1.5 transition-colors ${review.isPinned ? 'text-[#c8a45c]' : 'text-[#a0a0a0] hover:text-[#c8a45c]'}`} title="Pin"><Star size={14} /></button>
                    <button onClick={() => { deleteReview(review.id); addToast({ type: 'success', message: t('تم الحذف', 'Deleted', language) }); }} className="p-1.5 text-[#a0a0a0] hover:text-[#f44336] transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== Coupons Tab ========== */
function CouponsTab() {
  const { language } = useLanguageStore();
  const { getCoupons, addCoupon, updateCoupon, deleteCoupon } = useRestaurantStore();
  const { addToast } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>({ code: '', type: 'percentage', value: 0, minOrder: 0, usageLimit: undefined, expiryDate: '', isActive: true });
  const coupons = getCoupons();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.expiryDate) return;
    if (editing) {
      updateCoupon(editing.id, form);
      addToast({ type: 'success', message: t('تم التحديث', 'Updated', language) });
    } else {
      addCoupon({ ...form as Coupon, id: `coup-${Date.now()}`, usageCount: 0 });
      addToast({ type: 'success', message: t('تم الإنشاء', 'Created', language) });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ code: '', type: 'percentage', value: 0, minOrder: 0, usageLimit: undefined, expiryDate: '', isActive: true });
  };

  return (
    <div className="space-y-6">
      <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary h-10 text-sm">
        <Plus size={16} /> {t('إضافة كوبون', 'Add Coupon', language)}
      </button>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الكود', 'Code', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('النوع', 'Type', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('القيمة', 'Value', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الاستخدام', 'Usage', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الانتهاء', 'Expiry', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الحالة', 'Status', language)}</th>
              <th className="text-start px-4 py-3 text-[#a0a0a0] font-medium">{t('الإجراءات', 'Actions', language)}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-[#c8a45c]">{coupon.code}</td>
                <td className="px-4 py-3 text-[#a0a0a0]">{coupon.type === 'percentage' ? '%' : 'EGP'}</td>
                <td className="px-4 py-3 text-[#f5f5f5]">{coupon.value}{coupon.type === 'percentage' ? '%' : ' EGP'}</td>
                <td className="px-4 py-3 text-[#a0a0a0]">{coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</td>
                <td className="px-4 py-3 text-[#a0a0a0]">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${coupon.isActive ? 'bg-[rgba(76,175,80,0.15)] text-[#4caf50]' : 'bg-[rgba(244,67,54,0.15)] text-[#f44336]'}`}>
                    {coupon.isActive ? t('نشط', 'Active', language) : t('غير نشط', 'Inactive', language)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(coupon); setForm({ ...coupon }); setShowForm(true); }} className="p-1.5 text-[#a0a0a0] hover:text-[#c8a45c] transition-colors"><Edit size={14} /></button>
                    <button onClick={() => { deleteCoupon(coupon.id); addToast({ type: 'success', message: t('تم الحذف', 'Deleted', language) }); }} className="p-1.5 text-[#a0a0a0] hover:text-[#f44336] transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[2000] bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] mb-4">{editing ? t('تعديل كوبون', 'Edit Coupon', language) : t('إضافة كوبون', 'Add Coupon', language)}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('الكود', 'Code', language)}</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('النوع', 'Type', language)}</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]"><option value="percentage">%</option><option value="fixed">EGP</option></select></div>
                <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('القيمة', 'Value', language)}</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('الحد الأدنى', 'Min Order', language)}</label><input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
                <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('حد الاستخدام', 'Usage Limit', language)}</label><input type="number" value={form.usageLimit || ''} onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : undefined })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
              </div>
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('تاريخ الانتهاء', 'Expiry Date', language)}</label><input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" required /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 h-10 text-sm">{t('حفظ', 'Save', language)}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 h-10 text-sm">{t('إلغاء', 'Cancel', language)}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ========== Settings Tab ========== */
function SettingsTab() {
  const { language } = useLanguageStore();
  const { settings, updateSettings } = useRestaurantStore();
  const { addToast } = useUIStore();
  const [form, setForm] = useState({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState('general');

  const handleSave = () => {
    updateSettings(form);
    addToast({ type: 'success', message: t('تم حفظ الإعدادات', 'Settings saved', language) });
  };

  const subTabs = [
    { id: 'general', labelAr: 'عام', labelEn: 'General' },
    { id: 'hours', labelAr: 'ساعات العمل', labelEn: 'Hours' },
    { id: 'social', labelAr: 'وسائل التواصل', labelEn: 'Social' },
    { id: 'delivery', labelAr: 'التوصيل', labelEn: 'Delivery' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {subTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeSubTab === tab.id ? 'bg-[#c8a45c] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#a0a0a0]'}`}>
            {t(tab.labelAr, tab.labelEn, language)}
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
        {activeSubTab === 'general' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('اسم المطعم (عربي)', 'Restaurant Name (AR)', language)}</label><input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('اسم المطعم (English)', 'Restaurant Name (EN)', language)}</label><input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('الهاتف', 'Phone', language)}</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('البريد الإلكتروني', 'Email', language)}</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            </div>
            <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('العنوان', 'Address', language)}</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] resize-y" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('اللون الأساسي', 'Primary Color', language)}</label><div className="flex items-center gap-3"><input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-[#2a2a2a] bg-transparent" /><span className="text-sm text-[#a0a0a0]">{form.primaryColor}</span></div></div>
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('اللون الثانوي', 'Secondary Color', language)}</label><div className="flex items-center gap-3"><input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-[#2a2a2a] bg-transparent" /><span className="text-sm text-[#a0a0a0]">{form.secondaryColor}</span></div></div>
            </div>
          </>
        )}

        {activeSubTab === 'hours' && (
          <div>
            <label className="flex items-center gap-2 text-sm text-[#a0a0a0] mb-4">
              <input type="checkbox" checked={form.isOpen24Hours} onChange={(e) => setForm({ ...form, isOpen24Hours: e.target.checked })} className="w-4 h-4 rounded accent-[#c8a45c]" />
              {t('مفتوح 24 ساعة', 'Open 24 Hours', language)}
            </label>
            {!form.isOpen24Hours && (
              <div className="space-y-3">
                {form.openingHours.map((oh, i) => (
                  <div key={oh.day} className="flex items-center gap-3">
                    <span className="text-sm text-[#f5f5f5] w-24">{language === 'ar' ? oh.dayAr : oh.day}</span>
                    <input type="time" value={oh.open} onChange={(e) => { const updated = [...form.openingHours]; updated[i] = { ...oh, open: e.target.value }; setForm({ ...form, openingHours: updated }); }} className="h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 text-sm text-[#f5f5f5]" />
                    <span className="text-[#666]">-</span>
                    <input type="time" value={oh.close} onChange={(e) => { const updated = [...form.openingHours]; updated[i] = { ...oh, close: e.target.value }; setForm({ ...form, openingHours: updated }); }} className="h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 text-sm text-[#f5f5f5]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'social' && (
          <div className="space-y-4">
            <div><label className="block text-xs text-[#a0a0a0] mb-1">Facebook</label><input value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            <div><label className="block text-xs text-[#a0a0a0] mb-1">Instagram</label><input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            <div><label className="block text-xs text-[#a0a0a0] mb-1">WhatsApp</label><input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            <div><label className="block text-xs text-[#a0a0a0] mb-1">TikTok</label><input value={form.tiktokUrl} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
          </div>
        )}

        {activeSubTab === 'delivery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('رسوم التوصيل', 'Delivery Fee', language)} (EGP)</label><input type="number" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
              <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('الحد الأدنى للطلب', 'Min Order', language)} (EGP)</label><input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            </div>
            <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('نسبة الضريبة', 'Tax Rate', language)} (%)</label><input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
            <div><label className="block text-xs text-[#a0a0a0] mb-1">{t('نطاق التوصيل', 'Delivery Radius', language)} (km)</label><input type="number" value={form.deliveryRadius} onChange={(e) => setForm({ ...form, deliveryRadius: Number(e.target.value) })} className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 text-sm text-[#f5f5f5]" /></div>
          </div>
        )}

        <button onClick={handleSave} className="btn-primary h-11 w-full sm:w-auto px-8">
          {t('حفظ التغييرات', 'Save Changes', language)}
        </button>
      </div>
    </div>
  );
}
