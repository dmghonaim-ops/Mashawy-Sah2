-- ============================================================
-- Mashawy Sah — Full Backend SQL
-- One complete file: tables, security, image storage, and a
-- realistic demo menu. Safe to run on a fresh Supabase project,
-- and safe to re-run on this same one — nothing gets duplicated
-- or overwritten.
--
-- HOW TO RUN: Supabase → your project → SQL Editor → New query →
-- paste this whole file → Run.
-- ============================================================

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists categories (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  image text,
  description_ar text,
  description_en text,
  is_visible boolean not null default true,
  "order" int not null default 0
);

create table if not exists menu_items (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  price numeric not null default 0,
  image text,
  category_id text references categories(id) on delete set null,
  preparation_time int default 15,
  calories int,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_vegetarian boolean not null default false,
  is_spicy boolean not null default false,
  created_at timestamptz not null default now(),
  options jsonb
);

create table if not exists users (
  id text primary key,
  name text not null,
  phone text unique not null,
  email text,
  email_verified boolean not null default false,
  password text not null,
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  is_active boolean not null default true,
  addresses jsonb
);

create table if not exists orders (
  id text primary key,
  customer_id text,
  customer_name text,
  customer_phone text,
  customer_email text,
  items jsonb not null,
  subtotal numeric not null default 0,
  delivery_fee numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'new',
  payment_method text,
  delivery_type text,
  address text,
  special_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reviews (
  id text primary key,
  customer_id text,
  customer_name text,
  rating int not null,
  comment text,
  menu_item_id text,
  menu_item_name text,
  status text not null default 'pending',
  is_pinned boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists coupons (
  id text primary key,
  code text unique not null,
  type text not null,
  value numeric not null,
  min_order numeric not null default 0,
  usage_limit int,
  usage_count int not null default 0,
  expiry_date date,
  is_active boolean not null default true
);

-- Single-row table holding restaurant-wide settings as JSON
create table if not exists settings (
  id int primary key default 1,
  data jsonb not null
);

-- Make sure columns exist even if this runs against an older version
-- of these tables (harmless no-ops on a fresh database).
alter table users add column if not exists email_verified boolean not null default false;
alter table orders add column if not exists customer_email text;

-- ------------------------------------------------------------
-- Row Level Security
-- This app has no real user-auth wired into Supabase Auth for regular
-- sign-in (login is handled inside the app against the `users` table).
-- These policies allow the public "anon" key to read and write freely,
-- matching the trust level the original localStorage version had.
-- Fine for a demo/portfolio site; if this becomes a real production
-- restaurant handling real payments, tighten these before go-live
-- (e.g. restrict writes to verified admins via Supabase Auth).
-- ------------------------------------------------------------

alter table categories enable row level security;
alter table menu_items enable row level security;
alter table users enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table coupons enable row level security;
alter table settings enable row level security;

drop policy if exists "public full access" on categories;
drop policy if exists "public full access" on menu_items;
drop policy if exists "public full access" on users;
drop policy if exists "public full access" on orders;
drop policy if exists "public full access" on reviews;
drop policy if exists "public full access" on coupons;
drop policy if exists "public full access" on settings;

create policy "public full access" on categories for all using (true) with check (true);
create policy "public full access" on menu_items for all using (true) with check (true);
create policy "public full access" on users for all using (true) with check (true);
create policy "public full access" on orders for all using (true) with check (true);
create policy "public full access" on reviews for all using (true) with check (true);
create policy "public full access" on coupons for all using (true) with check (true);
create policy "public full access" on settings for all using (true) with check (true);

-- Enable realtime for live cross-device updates (new orders, menu changes)
do $$
begin
  begin
    alter publication supabase_realtime add table orders;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table menu_items;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table categories;
  exception when duplicate_object then null;
  end;
end $$;

-- ------------------------------------------------------------
-- Image storage (for uploading menu/category photos from the
-- admin dashboard, straight from your device)
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "public read menu-images" on storage.objects;
drop policy if exists "public upload menu-images" on storage.objects;

create policy "public read menu-images" on storage.objects
  for select using (bucket_id = 'menu-images');

create policy "public upload menu-images" on storage.objects
  for insert with check (bucket_id = 'menu-images');

-- ------------------------------------------------------------
-- Seed data: admin logins + a full demo menu so the site looks
-- fully populated when showing it to anyone. Safe to re-run —
-- existing rows are left untouched (ON CONFLICT DO NOTHING).
-- ------------------------------------------------------------

-- Admin logins
insert into users (id, name, phone, password, role, created_at, is_active) values
  ('u-1', 'مدير النظام', 'amin123', 'admin123', 'admin', '2024-01-01', true),
  ('u-1b', 'مدير 2', 'admin2', 'admin456', 'admin', '2024-01-01', true),
  ('u-1c', 'مدير 3', 'admin3', 'admin789', 'admin', '2024-01-01', true)
on conflict (id) do nothing;

-- Categories
insert into categories (id, name_ar, name_en, image, description_ar, description_en, is_visible, "order") values
  ('cat-1', 'كباب ومشاوي', 'Kebabs & Grills', '/images/categories/kebabs.jpg', 'أصناف الكباب والمشاوي على الفحم', 'Charcoal grilled kebabs and grills', true, 1),
  ('cat-2', 'دجاج مشوي', 'Grilled Chicken', '/images/categories/chicken.jpg', 'دجاج مشوي على الفحم', 'Charcoal grilled chicken', true, 2),
  ('cat-3', 'لحوم', 'Meat', '/images/categories/meat.jpg', 'أصناف اللحوم المشوية', 'Grilled meat dishes', true, 3),
  ('cat-4', 'مأكولات بحرية', 'Seafood', '/images/categories/seafood.jpg', 'مأكولات بحرية مشوية', 'Grilled seafood', true, 4),
  ('cat-5', 'مقبلات', 'Appetizers', '/images/categories/appetizers.jpg', 'مقبلات وسلطات', 'Appetizers and salads', true, 5),
  ('cat-6', 'مشروبات', 'Drinks', '/images/categories/drinks.jpg', 'عصائر ومشروبات', 'Fresh juices and drinks', true, 6)
on conflict (id) do nothing;

-- Menu items
insert into menu_items (id, name_ar, name_en, description_ar, description_en, price, image, category_id, preparation_time, calories, is_available, is_featured, is_popular, is_vegetarian, is_spicy, created_at, options) values
  ('mi-1', 'كفتة مشوية', 'Grilled Kofta', 'لحم مفروم متبل مشوي على الفحم مع خبز وطحينة', 'Spiced minced lamb grilled on charcoal with bread and tahini', 85, '/images/menu/kofta.jpg', 'cat-1', 15, 420, true, true, true, false, false, '2024-01-01', '[{"id":"opt-1","nameAr":"صوص إضافي","nameEn":"Extra Sauce","price":5},{"id":"opt-2","nameAr":"خبز إضافي","nameEn":"Extra Bread","price":3}]'::jsonb),
  ('mi-2', 'مشكل مشاوي', 'Mixed Grill', 'تشكيلة من الكفتة والدجاج واللحوم مع أرز وخبز وصوص', 'Assortment of kofta, chicken, and meats with rice, bread, and sauces', 220, '/images/menu/mixed-grill.jpg', 'cat-1', 25, 850, true, true, true, false, false, '2024-01-01', '[{"id":"opt-3","nameAr":"أرز إضافي","nameEn":"Extra Rice","price":10},{"id":"opt-4","nameAr":"سلطة إضافية","nameEn":"Extra Salad","price":8}]'::jsonb),
  ('mi-3', 'شيش طاووق', 'Shish Tawook', 'قطع دجاج متبلة على السيخ مع فلفل ألوان وبصل مشوي', 'Marinated chicken chunks on skewers with bell peppers and grilled onions', 95, '/images/menu/shish-tawook.jpg', 'cat-1', 18, 380, true, false, false, false, false, '2024-01-02', NULL),
  ('mi-4', 'شاورما دجاج', 'Chicken Shawarma', 'دجاج شاورما متبل مع ثومية ومخلل وبطاطس', 'Spiced shawarma chicken with garlic sauce, pickles, and fries', 60, '/images/menu/shawarma.jpg', 'cat-2', 10, 520, true, false, true, false, false, '2024-01-01', NULL),
  ('mi-5', 'دجاج مشوي كامل', 'Whole Grilled Chicken', 'دجاجة كاملة مشوية على الفحم مع ثومية وبطاطس', 'Whole chicken charcoal grilled with garlic sauce and fries', 180, '/images/menu/shish-tawook.jpg', 'cat-2', 30, 1200, true, true, false, false, false, '2024-01-03', NULL),
  ('mi-6', 'ريش ضأن', 'Lamb Chops', 'ريش ضأن مشوية على الفحم متبلة بأعشاب خاصة', 'Charcoal grilled lamb chops seasoned with special herbs', 250, '/images/menu/lamb-chops.jpg', 'cat-3', 25, 680, true, true, true, false, false, '2024-01-01', NULL),
  ('mi-7', 'ستيك لحم', 'Beef Steak', 'ستيك لحم بقري مشوي مع صوص الفلفل والمشروم', 'Grilled beef steak with pepper and mushroom sauce', 200, '/images/menu/lamb-chops.jpg', 'cat-3', 22, 650, true, false, false, false, false, '2024-01-04', NULL),
  ('mi-8', 'جمبري مشوي', 'Grilled Shrimp', 'جمبري كبير مشوي على الفحم مع زبدة وثوم وليمون', 'Large shrimp charcoal grilled with butter, garlic, and lemon', 160, '/images/categories/seafood.jpg', 'cat-4', 20, 320, true, false, false, false, true, '2024-01-05', NULL),
  ('mi-9', 'سمك فيليه مشوي', 'Grilled Fish Fillet', 'فيليه سمك مشوي مع أعشاب وبهارات خاصة', 'Grilled fish fillet with herbs and special spices', 130, '/images/categories/seafood.jpg', 'cat-4', 22, 280, true, false, false, false, false, '2024-01-06', NULL),
  ('mi-10', 'فتوش', 'Fattoush', 'سلطة خضراء مقرمشة مع خبز محمص وسماق', 'Crispy green salad with toasted bread and sumac', 35, '/images/menu/fattoush.jpg', 'cat-5', 8, 150, true, false, true, true, false, '2024-01-01', NULL),
  ('mi-11', 'حمص', 'Hummus', 'حمص ناعم مع طحينة وزيت زيتون وبابريكا', 'Creamy hummus with tahini, olive oil, and paprika', 30, '/images/menu/hummus.jpg', 'cat-5', 5, 220, true, false, true, true, false, '2024-01-01', NULL),
  ('mi-12', 'بابا غنوج', 'Baba Ganoush', 'باذنجان مشوي مهروس مع طحينة وثوم وليمون', 'Smoky roasted eggplant dip with tahini, garlic, and lemon', 30, '/images/menu/baba-ganoush.jpg', 'cat-5', 5, 180, true, false, false, true, false, '2024-01-02', NULL),
  ('mi-13', 'جناحات دجاج', 'Chicken Wings', 'جناحات دجاج مشوية متبلة مع صوص البافلو', 'Spicy grilled chicken wings with buffalo sauce', 75, '/images/menu/wings.jpg', 'cat-5', 15, 450, true, false, false, false, true, '2024-01-07', NULL),
  ('mi-14', 'أرز باللبن', 'Rice Pudding', 'أرز باللبن مع قرفة ومكسرات', 'Creamy rice pudding with cinnamon and nuts', 25, '/images/menu/rice-pudding.jpg', 'cat-5', 5, 280, true, false, false, true, false, '2024-01-08', NULL),
  ('mi-15', 'عصير مانجو', 'Mango Juice', 'عصير مانجو طازج وطبيعي', 'Fresh natural mango juice', 35, '/images/categories/drinks.jpg', 'cat-6', 3, 180, true, false, true, true, false, '2024-01-01', NULL),
  ('mi-16', 'عصير فراولة', 'Strawberry Juice', 'عصير فراولة طازج وطبيعي', 'Fresh natural strawberry juice', 35, '/images/categories/drinks.jpg', 'cat-6', 3, 160, true, false, false, true, false, '2024-01-02', NULL),
  ('mi-17', 'عصير ليمون ونعناع', 'Lemon Mint Juice', 'عصير ليمون طازج مع نعناع', 'Fresh lemon juice with mint', 25, '/images/categories/drinks.jpg', 'cat-6', 3, 80, true, false, false, true, false, '2024-01-03', NULL),
  ('mi-18', 'مياه معدنية', 'Mineral Water', 'مياه معدنية', 'Mineral water', 10, '/images/categories/drinks.jpg', 'cat-6', 1, 0, true, false, false, true, false, '2024-01-04', NULL)
on conflict (id) do nothing;

-- Demo reviews
insert into reviews (id, customer_id, customer_name, rating, comment, menu_item_id, menu_item_name, status, is_pinned, is_verified, created_at) values
  ('rev-1', 'u-2', 'أحمد محمد', 5, 'ألذ مشاوي جربتها في كفر الشيخ، الكفتة رائعة والخدمة ممتازة. أنصح الجميع بتجربته!', 'mi-1', 'كفتة مشوية', 'approved', true, true, '2025-06-15'),
  ('rev-2', 'u-3', 'سارة أحمد', 5, 'التوصيل سريع والأكل دافئ وطازج، أنصح بالمشكل مشاوي للعائلة. سعر مناسب وجودة عالية.', 'mi-2', 'مشكل مشاوي', 'approved', true, true, '2025-06-10'),
  ('rev-3', 'u-4', 'محمد علي', 4, 'جودة ممتازة وسعر مناسب، مفتوح 24 ساعة وهذا رائع. الشاورما لذيذة جداً.', 'mi-4', 'شاورما دجاج', 'approved', false, true, '2025-06-08'),
  ('rev-4', 'u-5', 'فاطمة حسن', 5, 'أحببنا المكان كثيراً، نظافة وأكل شهي. الريش الضأن ممتازة والسلطات طازجة.', 'mi-6', 'ريش ضأن', 'approved', false, true, '2025-06-05'),
  ('rev-5', 'u-6', 'خالد سامي', 4, 'تجربة رائعة، الطعم أصيل والنكهات مميزة. سأعود مرة أخرى بالتأكيد.', NULL, NULL, 'approved', false, true, '2025-06-01')
on conflict (id) do nothing;

-- Demo coupons
insert into coupons (id, code, type, value, min_order, usage_limit, usage_count, expiry_date, is_active) values
  ('coup-1', 'SAH20', 'percentage', 20, 100, 100, 45, '2025-12-31', true),
  ('coup-2', 'WELCOME15', 'percentage', 15, 50, 50, 23, '2025-08-31', true),
  ('coup-3', 'FLAT30', 'fixed', 30, 150, 30, 12, '2025-10-31', true)
on conflict (id) do nothing;

-- Restaurant settings (single row)
insert into settings (id, data) values (1, '{"nameAr":"مشاوي صح","nameEn":"Mashawy Sah","descriptionAr":"ألذ مشاوي في كفر الشيخ - نقدم أصنافاً متنوعة من المشاوي على الفحم","descriptionEn":"The Best Grills in Kafr El Sheikh - We offer a variety of charcoal grilled dishes","phone":"01068186660","email":"info@mashawysah.com","address":"بجوار مكتب بريد، مصير، كفر الشيخ، مصر","googleMapsUrl":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.7261!2d30.8382!3d31.1105","logo":"/images/hero-poster.jpg","heroBanner":"/images/hero-poster.jpg","primaryColor":"#c8a45c","secondaryColor":"#c62828","facebookUrl":"https://facebook.com/mashawysah","instagramUrl":"https://instagram.com/mashawysah","whatsappNumber":"01068186660","tiktokUrl":"https://tiktok.com/@mashawysah","deliveryFee":15,"taxRate":0,"minOrder":30,"deliveryRadius":15,"isOpen24Hours":true,"openingHours":[{"day":"saturday","dayAr":"السبت","open":"00:00","close":"23:59","isClosed":false},{"day":"sunday","dayAr":"الأحد","open":"00:00","close":"23:59","isClosed":false},{"day":"monday","dayAr":"الإثنين","open":"00:00","close":"23:59","isClosed":false},{"day":"tuesday","dayAr":"الثلاثاء","open":"00:00","close":"23:59","isClosed":false},{"day":"wednesday","dayAr":"الأربعاء","open":"00:00","close":"23:59","isClosed":false},{"day":"thursday","dayAr":"الخميس","open":"00:00","close":"23:59","isClosed":false},{"day":"friday","dayAr":"الجمعة","open":"00:00","close":"23:59","isClosed":false}]}'::jsonb)
on conflict (id) do nothing;
