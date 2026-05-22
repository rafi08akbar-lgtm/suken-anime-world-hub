
-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
CREATE TYPE public.transaction_type AS ENUM ('online', 'offline');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- =====================================================
-- UTILITY: updated_at trigger function
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- USER ROLES
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- =====================================================
-- handle_new_user trigger
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- USER_ROLES POLICIES
-- =====================================================
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PRODUCTS
-- =====================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone view active products" ON public.products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert products" ON public.products
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update products" ON public.products
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete products" ON public.products
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- TRANSACTIONS
-- =====================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('SKN-' || to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Customers view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins view all transactions" ON public.transactions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers create own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = customer_id AND type = 'online');
CREATE POLICY "Admins create transactions" ON public.transactions
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update transactions" ON public.transactions
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete transactions" ON public.transactions
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- TRANSACTION ITEMS
-- =====================================================
CREATE TABLE public.transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View items of accessible transactions" ON public.transaction_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = transaction_id
        AND (t.customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );
CREATE POLICY "Insert items into own/admin transactions" ON public.transaction_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = transaction_id
        AND (t.customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );
CREATE POLICY "Admins update items" ON public.transaction_items
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete items" ON public.transaction_items
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- STORAGE: product-images bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- SEED PRODUCTS
-- =====================================================
INSERT INTO public.products (slug, name, description, price, category, image_url, stock, is_featured) VALUES
  ('plush-luffy', 'Plush Doll Luffy Gear 5', 'Boneka plush eksklusif Monkey D. Luffy mode Gear 5, super lembut & lucu!', 189000, 'plush', '/src/assets/product-plush.jpg', 25, true),
  ('plush-pikachu', 'Plush Doll Pikachu Jumbo', 'Pikachu plush jumbo 40cm, sahabat tidur paling menggemaskan.', 159000, 'plush', '/src/assets/product-plush2.jpg', 30, true),
  ('cosplay-naruto', 'Cosplay Set Naruto Sage Mode', 'Set kostum lengkap Naruto Sage Mode termasuk headband & jubah.', 549000, 'cosplay', '/src/assets/product-cosplay.jpg', 10, true),
  ('figure-goku', 'Action Figure Goku Ultra Instinct', 'Figure Goku Ultra Instinct skala 1/7 dengan detail premium.', 749000, 'figure', '/src/assets/product-figure.jpg', 8, true),
  ('figure-zoro', 'Action Figure Roronoa Zoro', 'Figure Zoro three sword style dengan base bertema dojo.', 689000, 'figure', '/src/assets/product-figure2.jpg', 12, false),
  ('accessory-keychain', 'Keychain Anime Set (5pcs)', 'Set 5 gantungan kunci karakter anime favorit kamu.', 89000, 'accessory', '/src/assets/product-accessory.jpg', 50, false);
