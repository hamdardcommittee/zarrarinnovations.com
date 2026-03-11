-- ============================================================
-- LEADS / CONTACT REQUESTS TABLE
-- Stores all contact form submissions from the website
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  service TEXT DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow-up', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (public contact form submissions)
CREATE POLICY "Public can submit leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can SELECT / UPDATE / DELETE
CREATE POLICY "Admins can read leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================
-- ACTIVITY LOGS TABLE
-- Tracks admin actions for audit/activity feed
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  resource_title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert and read logs
CREATE POLICY "Admins can read activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- ============================================================
-- SITE ANALYTICS TABLE (simple page-view counter)
-- Lightweight analytics for dashboard KPIs
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (tracking pixel / beacon)
CREATE POLICY "Public can insert analytics"
  ON public.site_analytics FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read analytics"
  ON public.site_analytics FOR SELECT
  TO authenticated
  USING (true);
