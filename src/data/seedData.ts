import type {
  Category, MenuItem, Review, User, Order, Coupon, RestaurantSettings, OpeningHour
} from '@/types';

export const categories: Category[] = [
  { id: 'cat-1', nameAr: 'كباب ومشاوي', nameEn: 'Kebabs & Grills', image: '/images/categories/kebabs.jpg', descriptionAr: 'أصناف الكباب والمشاوي على الفحم', descriptionEn: 'Charcoal grilled kebabs and grills', isVisible: true, order: 1 },
  { id: 'cat-2', nameAr: 'دجاج مشوي', nameEn: 'Grilled Chicken', image: '/images/categories/chicken.jpg', descriptionAr: 'دجاج مشوي على الفحم', descriptionEn: 'Charcoal grilled chicken', isVisible: true, order: 2 },
  { id: 'cat-3', nameAr: 'لحوم', nameEn: 'Meat', image: '/images/categories/meat.jpg', descriptionAr: 'أصناف اللحوم المشوية', descriptionEn: 'Grilled meat dishes', isVisible: true, order: 3 },
  { id: 'cat-4', nameAr: 'مأكولات بحرية', nameEn: 'Seafood', image: '/images/categories/seafood.jpg', descriptionAr: 'مأكولات بحرية مشوية', descriptionEn: 'Grilled seafood', isVisible: true, order: 4 },
  { id: 'cat-5', nameAr: 'مقبلات', nameEn: 'Appetizers', image: '/images/categories/appetizers.jpg', descriptionAr: 'مقبلات وسلطات', descriptionEn: 'Appetizers and salads', isVisible: true, order: 5 },
  { id: 'cat-6', nameAr: 'مشروبات', nameEn: 'Drinks', image: '/images/categories/drinks.jpg', descriptionAr: 'عصائر ومشروبات', descriptionEn: 'Fresh juices and drinks', isVisible: true, order: 6 },
];

export const menuItems: MenuItem[] = [
  // Kebabs & Grills
  { id: 'mi-1', nameAr: 'كفتة مشوية', nameEn: 'Grilled Kofta', descriptionAr: 'لحم مفروم متبل مشوي على الفحم مع خبز وطحينة', descriptionEn: 'Spiced minced lamb grilled on charcoal with bread and tahini', price: 85, image: '/images/menu/kofta.jpg', categoryId: 'cat-1', preparationTime: 15, calories: 420, isAvailable: true, isFeatured: true, isPopular: true, isVegetarian: false, isSpicy: false, createdAt: '2024-01-01', options: [{ id: 'opt-1', nameAr: 'صوص إضافي', nameEn: 'Extra Sauce', price: 5 }, { id: 'opt-2', nameAr: 'خبز إضافي', nameEn: 'Extra Bread', price: 3 }] },
  { id: 'mi-2', nameAr: 'مشكل مشاوي', nameEn: 'Mixed Grill', descriptionAr: 'تشكيلة من الكفتة والدجاج واللحوم مع أرز وخبز وصوص', descriptionEn: 'Assortment of kofta, chicken, and meats with rice, bread, and sauces', price: 220, image: '/images/menu/mixed-grill.jpg', categoryId: 'cat-1', preparationTime: 25, calories: 850, isAvailable: true, isFeatured: true, isPopular: true, isVegetarian: false, isSpicy: false, createdAt: '2024-01-01', options: [{ id: 'opt-3', nameAr: 'أرز إضافي', nameEn: 'Extra Rice', price: 10 }, { id: 'opt-4', nameAr: 'سلطة إضافية', nameEn: 'Extra Salad', price: 8 }] },
  { id: 'mi-3', nameAr: 'شيش طاووق', nameEn: 'Shish Tawook', descriptionAr: 'قطع دجاج متبلة على السيخ مع فلفل ألوان وبصل مشوي', descriptionEn: 'Marinated chicken chunks on skewers with bell peppers and grilled onions', price: 95, image: '/images/menu/shish-tawook.jpg', categoryId: 'cat-1', preparationTime: 18, calories: 380, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: false, isSpicy: false, createdAt: '2024-01-02' },
  // Grilled Chicken
  { id: 'mi-4', nameAr: 'شاورما دجاج', nameEn: 'Chicken Shawarma', descriptionAr: 'دجاج شاورما متبل مع ثومية ومخلل وبطاطس', descriptionEn: 'Spiced shawarma chicken with garlic sauce, pickles, and fries', price: 60, image: '/images/menu/shawarma.jpg', categoryId: 'cat-2', preparationTime: 10, calories: 520, isAvailable: true, isFeatured: false, isPopular: true, isVegetarian: false, isSpicy: false, createdAt: '2024-01-01' },
  { id: 'mi-5', nameAr: 'دجاج مشوي كامل', nameEn: 'Whole Grilled Chicken', descriptionAr: 'دجاجة كاملة مشوية على الفحم مع ثومية وبطاطس', descriptionEn: 'Whole chicken charcoal grilled with garlic sauce and fries', price: 180, image: '/images/menu/shish-tawook.jpg', categoryId: 'cat-2', preparationTime: 30, calories: 1200, isAvailable: true, isFeatured: true, isPopular: false, isVegetarian: false, isSpicy: false, createdAt: '2024-01-03' },
  // Meat
  { id: 'mi-6', nameAr: 'ريش ضأن', nameEn: 'Lamb Chops', descriptionAr: 'ريش ضأن مشوية على الفحم متبلة بأعشاب خاصة', descriptionEn: 'Charcoal grilled lamb chops seasoned with special herbs', price: 250, image: '/images/menu/lamb-chops.jpg', categoryId: 'cat-3', preparationTime: 25, calories: 680, isAvailable: true, isFeatured: true, isPopular: true, isVegetarian: false, isSpicy: false, createdAt: '2024-01-01' },
  { id: 'mi-7', nameAr: 'ستيك لحم', nameEn: 'Beef Steak', descriptionAr: 'ستيك لحم بقري مشوي مع صوص الفلفل والمشروم', descriptionEn: 'Grilled beef steak with pepper and mushroom sauce', price: 200, image: '/images/menu/lamb-chops.jpg', categoryId: 'cat-3', preparationTime: 22, calories: 650, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: false, isSpicy: false, createdAt: '2024-01-04' },
  // Seafood
  { id: 'mi-8', nameAr: 'جمبري مشوي', nameEn: 'Grilled Shrimp', descriptionAr: 'جمبري كبير مشوي على الفحم مع زبدة وثوم وليمون', descriptionEn: 'Large shrimp charcoal grilled with butter, garlic, and lemon', price: 160, image: '/images/categories/seafood.jpg', categoryId: 'cat-4', preparationTime: 20, calories: 320, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: false, isSpicy: true, createdAt: '2024-01-05' },
  { id: 'mi-9', nameAr: 'سمك فيليه مشوي', nameEn: 'Grilled Fish Fillet', descriptionAr: 'فيليه سمك مشوي مع أعشاب وبهارات خاصة', descriptionEn: 'Grilled fish fillet with herbs and special spices', price: 130, image: '/images/categories/seafood.jpg', categoryId: 'cat-4', preparationTime: 22, calories: 280, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: false, isSpicy: false, createdAt: '2024-01-06' },
  // Appetizers
  { id: 'mi-10', nameAr: 'فتوش', nameEn: 'Fattoush', descriptionAr: 'سلطة خضراء مقرمشة مع خبز محمص وسماق', descriptionEn: 'Crispy green salad with toasted bread and sumac', price: 35, image: '/images/menu/fattoush.jpg', categoryId: 'cat-5', preparationTime: 8, calories: 150, isAvailable: true, isFeatured: false, isPopular: true, isVegetarian: true, isSpicy: false, createdAt: '2024-01-01' },
  { id: 'mi-11', nameAr: 'حمص', nameEn: 'Hummus', descriptionAr: 'حمص ناعم مع طحينة وزيت زيتون وبابريكا', descriptionEn: 'Creamy hummus with tahini, olive oil, and paprika', price: 30, image: '/images/menu/hummus.jpg', categoryId: 'cat-5', preparationTime: 5, calories: 220, isAvailable: true, isFeatured: false, isPopular: true, isVegetarian: true, isSpicy: false, createdAt: '2024-01-01' },
  { id: 'mi-12', nameAr: 'بابا غنوج', nameEn: 'Baba Ganoush', descriptionAr: 'باذنجان مشوي مهروس مع طحينة وثوم وليمون', descriptionEn: 'Smoky roasted eggplant dip with tahini, garlic, and lemon', price: 30, image: '/images/menu/baba-ganoush.jpg', categoryId: 'cat-5', preparationTime: 5, calories: 180, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: true, isSpicy: false, createdAt: '2024-01-02' },
  { id: 'mi-13', nameAr: 'جناحات دجاج', nameEn: 'Chicken Wings', descriptionAr: 'جناحات دجاج مشوية متبلة مع صوص البافلو', descriptionEn: 'Spicy grilled chicken wings with buffalo sauce', price: 75, image: '/images/menu/wings.jpg', categoryId: 'cat-5', preparationTime: 15, calories: 450, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: false, isSpicy: true, createdAt: '2024-01-07' },
  { id: 'mi-14', nameAr: 'أرز باللبن', nameEn: 'Rice Pudding', descriptionAr: 'أرز باللبن مع قرفة ومكسرات', descriptionEn: 'Creamy rice pudding with cinnamon and nuts', price: 25, image: '/images/menu/rice-pudding.jpg', categoryId: 'cat-5', preparationTime: 5, calories: 280, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: true, isSpicy: false, createdAt: '2024-01-08' },
  // Drinks
  { id: 'mi-15', nameAr: 'عصير مانجو', nameEn: 'Mango Juice', descriptionAr: 'عصير مانجو طازج وطبيعي', descriptionEn: 'Fresh natural mango juice', price: 35, image: '/images/categories/drinks.jpg', categoryId: 'cat-6', preparationTime: 3, calories: 180, isAvailable: true, isFeatured: false, isPopular: true, isVegetarian: true, isSpicy: false, createdAt: '2024-01-01' },
  { id: 'mi-16', nameAr: 'عصير فراولة', nameEn: 'Strawberry Juice', descriptionAr: 'عصير فراولة طازج وطبيعي', descriptionEn: 'Fresh natural strawberry juice', price: 35, image: '/images/categories/drinks.jpg', categoryId: 'cat-6', preparationTime: 3, calories: 160, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: true, isSpicy: false, createdAt: '2024-01-02' },
  { id: 'mi-17', nameAr: 'عصير ليمون ونعناع', nameEn: 'Lemon Mint Juice', descriptionAr: 'عصير ليمون طازج مع نعناع', descriptionEn: 'Fresh lemon juice with mint', price: 25, image: '/images/categories/drinks.jpg', categoryId: 'cat-6', preparationTime: 3, calories: 80, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: true, isSpicy: false, createdAt: '2024-01-03' },
  { id: 'mi-18', nameAr: 'مياه معدنية', nameEn: 'Mineral Water', descriptionAr: 'مياه معدنية', descriptionEn: 'Mineral water', price: 10, image: '/images/categories/drinks.jpg', categoryId: 'cat-6', preparationTime: 1, calories: 0, isAvailable: true, isFeatured: false, isPopular: false, isVegetarian: true, isSpicy: false, createdAt: '2024-01-04' },
];

export const reviews: Review[] = [
  { id: 'rev-1', customerId: 'u-2', customerName: 'أحمد محمد', rating: 5, comment: 'ألذ مشاوي جربتها في كفر الشيخ، الكفتة رائعة والخدمة ممتازة. أنصح الجميع بتجربته!', menuItemId: 'mi-1', menuItemName: 'كفتة مشوية', status: 'approved', isPinned: true, isVerified: true, createdAt: '2025-06-15' },
  { id: 'rev-2', customerId: 'u-3', customerName: 'سارة أحمد', rating: 5, comment: 'التوصيل سريع والأكل دافئ وطازج، أنصح بالمشكل مشاوي للعائلة. سعر مناسب وجودة عالية.', menuItemId: 'mi-2', menuItemName: 'مشكل مشاوي', status: 'approved', isPinned: true, isVerified: true, createdAt: '2025-06-10' },
  { id: 'rev-3', customerId: 'u-4', customerName: 'محمد علي', rating: 4, comment: 'جودة ممتازة وسعر مناسب، مفتوح 24 ساعة وهذا رائع. الشاورما لذيذة جداً.', menuItemId: 'mi-4', menuItemName: 'شاورما دجاج', status: 'approved', isPinned: false, isVerified: true, createdAt: '2025-06-08' },
  { id: 'rev-4', customerId: 'u-5', customerName: 'فاطمة حسن', rating: 5, comment: 'أحببنا المكان كثيراً، نظافة وأكل شهي. الريش الضأن ممتازة والسلطات طازجة.', menuItemId: 'mi-6', menuItemName: 'ريش ضأن', status: 'approved', isPinned: false, isVerified: true, createdAt: '2025-06-05' },
  { id: 'rev-5', customerId: 'u-6', customerName: 'خالد سامي', rating: 4, comment: 'تجربة رائعة، الطعم أصيل والنكهات مميزة. سأعود مرة أخرى بالتأكيد.', status: 'approved', isPinned: false, isVerified: true, createdAt: '2025-06-01' },
  { id: 'rev-6', customerId: 'u-7', customerName: 'نور الدين', rating: 5, comment: 'الحمص والمقبلات رائعة، والمشاوي على الفحم لا تُضاهى. شكراً لفريق مشاوي صح!', menuItemId: 'mi-11', menuItemName: 'حمص', status: 'approved', isPinned: false, isVerified: false, createdAt: '2025-05-28' },
  { id: 'rev-7', customerId: 'u-8', customerName: 'مريم عادل', rating: 3, comment: 'الأكل جيد لكن الانتظار طويل قليلاً. أتمنى تحسين سرعة التحضير.', menuItemId: 'mi-2', menuItemName: 'مشكل مشاوي', status: 'approved', isPinned: false, isVerified: true, createdAt: '2025-05-20' },
  { id: 'rev-8', customerId: 'u-9', customerName: 'عمر خالد', rating: 5, comment: 'أفضل مطعم مشاوي في المنطقة بدون منازع. الجودة والنظافة والخدمة كلها ممتازة.', status: 'approved', isPinned: false, isVerified: true, createdAt: '2025-05-15' },
  { id: 'rev-9', customerId: 'u-10', customerName: 'ريم عبدالله', rating: 4, comment: 'العصائر طازجة والفتوش لذيذ. مكان جميل للعائلة.', menuItemId: 'mi-10', menuItemName: 'فتوش', status: 'approved', isPinned: false, isVerified: false, createdAt: '2025-05-10' },
  { id: 'rev-10', customerId: 'u-11', customerName: 'يوسف إبراهيم', rating: 5, comment: 'لا أستطيع التوقف عن الطلب من هنا! كل شيء لذيذ وطازج.', status: 'approved', isPinned: false, isVerified: true, createdAt: '2025-05-05' },
];

export const users: User[] = [
  { id: 'u-1', name: 'مدير النظام', phone: 'amin123', password: 'admin123', role: 'admin', createdAt: '2024-01-01', isActive: true },
  { id: 'u-2', name: 'أحمد محمد', phone: '01012345678', password: '123456', role: 'customer', createdAt: '2024-02-01', isActive: true },
  { id: 'u-3', name: 'سارة أحمد', phone: '01023456789', password: '123456', role: 'customer', createdAt: '2024-02-05', isActive: true },
  { id: 'u-4', name: 'محمد علي', phone: '01034567890', password: '123456', role: 'customer', createdAt: '2024-02-10', isActive: true },
  { id: 'u-5', name: 'فاطمة حسن', phone: '01045678901', password: '123456', role: 'customer', createdAt: '2024-02-15', isActive: true },
  { id: 'u-6', name: 'خالد سامي', phone: '01056789012', password: '123456', role: 'customer', createdAt: '2024-03-01', isActive: true },
  { id: 'u-7', name: 'نور الدين', phone: '01067890123', password: '123456', role: 'customer', createdAt: '2024-03-10', isActive: true },
  { id: 'u-8', name: 'مريم عادل', phone: '01078901234', password: '123456', role: 'customer', createdAt: '2024-03-15', isActive: true },
  { id: 'u-9', name: 'عمر خالد', phone: '01089012345', password: '123456', role: 'customer', createdAt: '2024-04-01', isActive: true },
  { id: 'u-10', name: 'ريم عبدالله', phone: '01090123456', password: '123456', role: 'customer', createdAt: '2024-04-10', isActive: true },
  { id: 'u-11', name: 'يوسف إبراهيم', phone: '01001234567', password: '123456', role: 'customer', createdAt: '2024-04-20', isActive: true },
];

export const orders: Order[] = [
  { id: 'ord-1', customerId: 'u-2', customerName: 'أحمد محمد', customerPhone: '01012345678', items: [{ menuItem: menuItems[0], quantity: 2, selectedOptions: [], specialInstructions: '', unitPrice: 85, totalPrice: 170 }, { menuItem: menuItems[9], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 35, totalPrice: 35 }], subtotal: 205, deliveryFee: 15, discount: 0, total: 220, status: 'completed', paymentMethod: 'cash', deliveryType: 'delivery', address: 'شارع الجيش، كفر الشيخ', createdAt: '2025-07-10T14:30:00', updatedAt: '2025-07-10T15:15:00' },
  { id: 'ord-2', customerId: 'u-3', customerName: 'سارة أحمد', customerPhone: '01023456789', items: [{ menuItem: menuItems[1], quantity: 1, selectedOptions: [], specialInstructions: 'بدون بصل', unitPrice: 220, totalPrice: 220 }, { menuItem: menuItems[14], quantity: 2, selectedOptions: [], specialInstructions: '', unitPrice: 35, totalPrice: 70 }], subtotal: 290, deliveryFee: 15, discount: 10, total: 295, status: 'completed', paymentMethod: 'cash', deliveryType: 'delivery', address: 'حي الجامعة، كفر الشيخ', createdAt: '2025-07-10T12:00:00', updatedAt: '2025-07-10T12:45:00' },
  { id: 'ord-3', customerId: 'u-4', customerName: 'محمد علي', customerPhone: '01034567890', items: [{ menuItem: menuItems[3], quantity: 3, selectedOptions: [], specialInstructions: 'ثومية extra', unitPrice: 60, totalPrice: 180 }], subtotal: 180, deliveryFee: 15, discount: 0, total: 195, status: 'preparing', paymentMethod: 'cash', deliveryType: 'delivery', address: 'مصير، كفر الشيخ', createdAt: '2025-07-12T10:00:00', updatedAt: '2025-07-12T10:05:00' },
  { id: 'ord-4', customerId: 'u-5', customerName: 'فاطمة حسن', customerPhone: '01045678901', items: [{ menuItem: menuItems[5], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 250, totalPrice: 250 }, { menuItem: menuItems[10], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 30, totalPrice: 30 }, { menuItem: menuItems[11], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 30, totalPrice: 30 }], subtotal: 310, deliveryFee: 0, discount: 0, total: 310, status: 'ready', paymentMethod: 'cash', deliveryType: 'pickup', createdAt: '2025-07-12T09:30:00', updatedAt: '2025-07-12T09:50:00' },
  { id: 'ord-5', customerId: 'u-6', customerName: 'خالد سامي', customerPhone: '01056789012', items: [{ menuItem: menuItems[2], quantity: 2, selectedOptions: [], specialInstructions: '', unitPrice: 95, totalPrice: 190 }, { menuItem: menuItems[12], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 75, totalPrice: 75 }], subtotal: 265, deliveryFee: 15, discount: 0, total: 280, status: 'delivering', paymentMethod: 'cash', deliveryType: 'delivery', address: 'الحامول، كفر الشيخ', createdAt: '2025-07-12T08:00:00', updatedAt: '2025-07-12T09:30:00' },
  { id: 'ord-6', customerId: 'u-2', customerName: 'أحمد محمد', customerPhone: '01012345678', items: [{ menuItem: menuItems[0], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 85, totalPrice: 85 }, { menuItem: menuItems[3], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 60, totalPrice: 60 }], subtotal: 145, deliveryFee: 15, discount: 0, total: 160, status: 'completed', paymentMethod: 'cash', deliveryType: 'delivery', address: 'شارع الجيش، كفر الشيخ', createdAt: '2025-07-09T19:00:00', updatedAt: '2025-07-09T19:45:00' },
  { id: 'ord-7', customerId: 'u-7', customerName: 'نور الدين', customerPhone: '01067890123', items: [{ menuItem: menuItems[9], quantity: 2, selectedOptions: [], specialInstructions: '', unitPrice: 35, totalPrice: 70 }, { menuItem: menuItems[10], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 30, totalPrice: 30 }, { menuItem: menuItems[11], quantity: 1, selectedOptions: [], specialInstructions: '', unitPrice: 30, totalPrice: 30 }], subtotal: 130, deliveryFee: 15, discount: 0, total: 145, status: 'completed', paymentMethod: 'cash', deliveryType: 'delivery', address: 'بلطيم، كفر الشيخ', createdAt: '2025-07-08T13:00:00', updatedAt: '2025-07-08T13:40:00' },
  { id: 'ord-8', customerId: 'u-8', customerName: 'مريم عادل', customerPhone: '01078901234', items: [{ menuItem: menuItems[1], quantity: 1, selectedOptions: [], specialInstructions: 'بدون طماطم', unitPrice: 220, totalPrice: 220 }], subtotal: 220, deliveryFee: 15, discount: 0, total: 235, status: 'cancelled', paymentMethod: 'cash', deliveryType: 'delivery', address: 'الرياض، كفر الشيخ', createdAt: '2025-07-07T20:00:00', updatedAt: '2025-07-07T20:10:00' },
];

export const coupons: Coupon[] = [
  { id: 'coup-1', code: 'SAH20', type: 'percentage', value: 20, minOrder: 100, usageLimit: 100, usageCount: 45, expiryDate: '2025-12-31', isActive: true },
  { id: 'coup-2', code: 'WELCOME15', type: 'percentage', value: 15, minOrder: 50, usageLimit: 50, usageCount: 23, expiryDate: '2025-08-31', isActive: true },
  { id: 'coup-3', code: 'FLAT30', type: 'fixed', value: 30, minOrder: 150, usageLimit: 30, usageCount: 12, expiryDate: '2025-10-31', isActive: true },
  { id: 'coup-4', code: 'FAMILY10', type: 'percentage', value: 10, minOrder: 200, usageLimit: 20, usageCount: 8, expiryDate: '2025-09-30', isActive: true },
  { id: 'coup-5', code: 'EXPIRED50', type: 'percentage', value: 50, minOrder: 100, usageLimit: 10, usageCount: 10, expiryDate: '2025-01-01', isActive: false },
];

const openingHours: OpeningHour[] = [
  { day: 'saturday', dayAr: 'السبت', open: '00:00', close: '23:59', isClosed: false },
  { day: 'sunday', dayAr: 'الأحد', open: '00:00', close: '23:59', isClosed: false },
  { day: 'monday', dayAr: 'الإثنين', open: '00:00', close: '23:59', isClosed: false },
  { day: 'tuesday', dayAr: 'الثلاثاء', open: '00:00', close: '23:59', isClosed: false },
  { day: 'wednesday', dayAr: 'الأربعاء', open: '00:00', close: '23:59', isClosed: false },
  { day: 'thursday', dayAr: 'الخميس', open: '00:00', close: '23:59', isClosed: false },
  { day: 'friday', dayAr: 'الجمعة', open: '00:00', close: '23:59', isClosed: false },
];

export const restaurantSettings: RestaurantSettings = {
  nameAr: 'مشاوي صح',
  nameEn: 'Mashawy Sah',
  descriptionAr: 'ألذ مشاوي في كفر الشيخ - نقدم أصنافاً متنوعة من المشاوي على الفحم',
  descriptionEn: 'The Best Grills in Kafr El Sheikh - We offer a variety of charcoal grilled dishes',
  phone: '01068186660',
  email: 'info@mashawysah.com',
  address: 'بجوار مكتب بريد، مصير، كفر الشيخ، مصر',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.7261!2d30.8382!3d31.1105',
  logo: '/images/hero-poster.jpg',
  heroBanner: '/images/hero-poster.jpg',
  primaryColor: '#c8a45c',
  secondaryColor: '#c62828',
  facebookUrl: 'https://facebook.com/mashawysah',
  instagramUrl: 'https://instagram.com/mashawysah',
  whatsappNumber: '01068186660',
  tiktokUrl: 'https://tiktok.com/@mashawysah',
  deliveryFee: 15,
  taxRate: 0,
  minOrder: 30,
  deliveryRadius: 15,
  isOpen24Hours: true,
  openingHours,
};

export function seedData() {
  const initialized = localStorage.getItem('mashawy_sah_initialized');
  if (initialized) return;

  localStorage.setItem('mashawy_sah_categories', JSON.stringify(categories));
  localStorage.setItem('mashawy_sah_menuItems', JSON.stringify(menuItems));
  localStorage.setItem('mashawy_sah_reviews', JSON.stringify(reviews));
  localStorage.setItem('mashawy_sah_users', JSON.stringify(users));
  localStorage.setItem('mashawy_sah_orders', JSON.stringify(orders));
  localStorage.setItem('mashawy_sah_coupons', JSON.stringify(coupons));
  localStorage.setItem('mashawy_sah_settings', JSON.stringify(restaurantSettings));
  localStorage.setItem('mashawy_sah_initialized', 'true');
}
