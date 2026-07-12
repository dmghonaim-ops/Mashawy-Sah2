import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Heart, Settings, LogOut,
  Clock, CheckCircle, XCircle, Truck, ChefHat,
} from 'lucide-react';
import { useLanguageStore, t } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { useRestaurantStore } from '@/stores/restaurantStore';
import type { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { labelAr: string; labelEn: string; color: string; icon: typeof Clock }> = {
  new: { labelAr: 'جديد', labelEn: 'New', color: '#2196f3', icon: Clock },
  preparing: { labelAr: 'قيد التحضير', labelEn: 'Preparing', color: '#ff9800', icon: ChefHat },
  ready: { labelAr: 'جاهز', labelEn: 'Ready', color: '#4caf50', icon: CheckCircle },
  delivering: { labelAr: 'جاري التوصيل', labelEn: 'Out for Delivery', color: '#9c27b0', icon: Truck },
  completed: { labelAr: 'مكتمل', labelEn: 'Completed', color: '#4caf50', icon: CheckCircle },
  cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', color: '#f44336', icon: XCircle },
};

const tabs = [
  { id: 'orders', labelAr: 'طلباتي', labelEn: 'My Orders', icon: Package },
  { id: 'favorites', labelAr: 'مفضلتي', labelEn: 'Favorites', icon: Heart },
  { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
];

export default function DashboardPage() {
  const { language } = useLanguageStore();
  const { user, logout } = useAuthStore();
  const { getCustomerOrders } = useOrdersStore();
  const { getMenuItems } = useRestaurantStore();
  const [activeTab, setActiveTab] = useState('orders');
  const orders = user ? getCustomerOrders(user.id) : [];
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  const orderStatusTabs: (OrderStatus | 'all')[] = ['all', 'preparing', 'delivering', 'completed'];

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="container-custom py-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0"
          >
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c8a45c] to-[#a88b4a] flex items-center justify-center text-[#0a0a0a] font-bold text-xl mx-auto mb-3">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h3 className="font-arabic text-lg font-semibold text-[#f5f5f5] text-center">{user?.name}</h3>
              <p className="text-xs text-[#a0a0a0] text-center">{user?.phone}</p>
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all border-r-2 ${
                    activeTab === tab.id
                      ? 'border-r-[#c8a45c] bg-[rgba(200,164,92,0.05)] text-[#c8a45c]'
                      : 'border-r-transparent text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
                  }`}
                >
                  <tab.icon size={18} />
                  {t(tab.labelAr, tab.labelEn, language)}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-[#a0a0a0] hover:text-[#f44336] hover:bg-[#1a1a1a] transition-all border-t border-[#2a2a2a]"
              >
                <LogOut size={18} />
                {t('تسجيل خروج', 'Logout', language)}
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-arabic text-xl font-semibold text-[#f5f5f5] mb-6">
                  {t('طلباتي', 'My Orders', language)}
                </h2>

                {/* Status Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {orderStatusTabs.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        statusFilter === status
                          ? 'bg-[#c8a45c] text-[#0a0a0a]'
                          : 'bg-[#1a1a1a] text-[#a0a0a0] hover:text-[#f5f5f5]'
                      }`}
                    >
                      {status === 'all' ? t('الكل', 'All', language) : t(statusConfig[status].labelAr, statusConfig[status].labelEn, language)}
                    </button>
                  ))}
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-[#111] border border-[#2a2a2a] rounded-2xl">
                    <Package size={48} className="text-[#2a2a2a] mx-auto mb-4" />
                    <p className="text-[#a0a0a0]">{t('لا توجد طلبات', 'No orders yet', language)}</p>
                    <Link to="/menu" className="text-[#c8a45c] text-sm hover:underline mt-2 inline-block">
                      {t('اطلب الآن', 'Order Now', language)}
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {filteredOrders.map((order) => {
                      const config = statusConfig[order.status];
                      const StatusIcon = config.icon;
                      return (
                        <div
                          key={order.id}
                          className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5"
                          style={{ borderLeftColor: config.color, borderLeftWidth: '3px' }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-sm font-semibold text-[#f5f5f5]">#{order.id}</span>
                              <p className="text-xs text-[#666]">{new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                              <StatusIcon size={12} />
                              {t(config.labelAr, config.labelEn, language)}
                            </span>
                          </div>
                          <div className="text-sm text-[#a0a0a0] mb-3">
                            {order.items.map((item, i) => (
                              <span key={i}>
                                {item.quantity}x {t(item.menuItem.nameAr, item.menuItem.nameEn, language)}
                                {i < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#c8a45c] font-bold">{order.total} {t('ج.م', 'EGP', language)}</span>
                            <span className="text-xs text-[#666]">{t(order.deliveryType === 'delivery' ? 'توصيل' : 'استلام', order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup', language)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="font-arabic text-xl font-semibold text-[#f5f5f5] mb-6">
                  {t('مفضلتي', 'My Favorites', language)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getMenuItems().filter((i) => i.isPopular).slice(0, 4).map((item) => (
                    <Link key={item.id} to={`/menu`} className="flex gap-4 bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 hover:border-[rgba(200,164,92,0.3)] transition-colors">
                      <img src={item.image} alt={t(item.nameAr, item.nameEn, language)} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-[#f5f5f5]">{t(item.nameAr, item.nameEn, language)}</h4>
                        <p className="text-sm text-[#c8a45c] mt-1">{item.price} {t('ج.م', 'EGP', language)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="font-arabic text-xl font-semibold text-[#f5f5f5] mb-6">
                  {t('الإعدادات', 'Settings', language)}
                </h2>
                <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-2">{t('الاسم', 'Name', language)}</label>
                    <input defaultValue={user?.name} className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5]" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-2">{t('الهاتف', 'Phone', language)}</label>
                    <input defaultValue={user?.phone} className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 text-sm text-[#f5f5f5]" readOnly />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
