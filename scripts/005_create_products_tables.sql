-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'System'
    CHECK (category IN ('System', 'Website', 'Template', 'Plugin', 'SaaS')),
  features JSONB NOT NULL DEFAULT '[]',
  screenshots TEXT[] NOT NULL DEFAULT '{}',
  pricing JSONB DEFAULT NULL,
  demo_video_url TEXT,
  faq JSONB NOT NULL DEFAULT '[]',
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published products"
  ON public.products FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================
-- DEMO REQUESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT,
  preferred_demo_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit demo requests"
  ON public.demo_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read demo requests"
  ON public.demo_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update demo requests"
  ON public.demo_requests FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete demo requests"
  ON public.demo_requests FOR DELETE TO authenticated USING (true);
