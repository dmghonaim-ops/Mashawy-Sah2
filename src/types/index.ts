export type Language = 'ar' | 'en';
export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type DeliveryType = 'delivery' | 'pickup';
export type CouponType = 'percentage' | 'fixed';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  emailVerified?: boolean;
  password: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
  isActive: boolean;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label: string;
  address: string;
  landmark?: string;
  building?: string;
  apartment?: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isVisible: boolean;
  order: number;
}

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  image: string;
  categoryId: string;
  preparationTime: number;
  calories?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  createdAt: string;
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: MenuItemOption[];
  specialInstructions: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  address?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: MenuItemOption[];
  specialInstructions: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  menuItemId?: string;
  menuItemName?: string;
  status: ReviewStatus;
  isPinned: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  usageLimit?: number;
  usageCount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface RestaurantSettings {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  logo: string;
  heroBanner: string;
  primaryColor: string;
  secondaryColor: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  tiktokUrl: string;
  deliveryFee: number;
  taxRate: number;
  minOrder: number;
  deliveryRadius: number;
  isOpen24Hours: boolean;
  openingHours: OpeningHour[];
}

export interface OpeningHour {
  day: string;
  dayAr: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
