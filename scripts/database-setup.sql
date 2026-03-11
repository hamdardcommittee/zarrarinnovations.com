-- ============================================
-- Zarrar Innovations Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. LEADS TABLE (Contact Form Submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  service TEXT DEFAULT 'General',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow-up', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON leads;
DROP POLICY IF EXISTS "Allow authenticated read" ON leads;
DROP POLICY IF EXISTS "Allow authenticated update" ON leads;
DROP POLICY IF EXISTS "Allow authenticated delete" ON leads;

-- RLS Policies for leads
-- Allow anyone to insert (for contact form)
CREATE POLICY "Allow anonymous insert" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all leads
CREATE POLICY "Allow authenticated read" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated update" ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete leads
CREATE POLICY "Allow authenticated delete" ON leads
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 2. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT,
  read_time TEXT DEFAULT '5 min read',
  date TEXT,
  author TEXT DEFAULT 'Zarrar Innovations',
  content JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read published" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated full access" ON blog_posts;

-- RLS Policies for blog_posts
-- Allow anyone to read published posts
CREATE POLICY "Allow public read published" ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.role() = 'authenticated');

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access" ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. BLOG CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow authenticated manage categories" ON blog_categories;

-- RLS Policies
CREATE POLICY "Allow public read categories" ON blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated manage categories" ON blog_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  pricing_tiers JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read published products" ON products;
DROP POLICY IF EXISTS "Allow authenticated full access products" ON products;

-- RLS Policies
CREATE POLICY "Allow public read published products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access products" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. DEMO REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT,
  preferred_demo_time TIMESTAMP WITH TIME ZONE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert demo" ON demo_requests;
DROP POLICY IF EXISTS "Allow authenticated read demo" ON demo_requests;
DROP POLICY IF EXISTS "Allow authenticated update demo" ON demo_requests;
DROP POLICY IF EXISTS "Allow authenticated delete demo" ON demo_requests;

-- RLS Policies
CREATE POLICY "Allow anonymous insert demo" ON demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read demo" ON demo_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update demo" ON demo_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete demo" ON demo_requests
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 6. JOB POSTINGS TABLE (Careers)
-- ============================================
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  type TEXT DEFAULT 'Full-time',
  experience_level TEXT DEFAULT 'Mid-level',
  salary_range TEXT,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read published jobs" ON job_postings;
DROP POLICY IF EXISTS "Allow authenticated full access jobs" ON job_postings;

-- RLS Policies
CREATE POLICY "Allow public read published jobs" ON job_postings
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access jobs" ON job_postings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  experience_years TEXT,
  current_role TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'hired')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert application" ON job_applications;
DROP POLICY IF EXISTS "Allow authenticated read application" ON job_applications;
DROP POLICY IF EXISTS "Allow authenticated update application" ON job_applications;
DROP POLICY IF EXISTS "Allow authenticated delete application" ON job_applications;

-- RLS Policies
CREATE POLICY "Allow anonymous insert application" ON job_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read application" ON job_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update application" ON job_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete application" ON job_applications
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 8. SITE ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  language TEXT,
  ip_address TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  timezone TEXT,
  org TEXT,
  session_id TEXT,
  time_spent INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert analytics" ON site_analytics;
DROP POLICY IF EXISTS "Allow authenticated read analytics" ON site_analytics;

-- RLS Policies
CREATE POLICY "Allow anonymous insert analytics" ON site_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read analytics" ON site_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 9. ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  resource_title TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated insert logs" ON activity_logs;
DROP POLICY IF EXISTS "Allow authenticated read logs" ON activity_logs;

-- RLS Policies
CREATE POLICY "Allow authenticated insert logs" ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read logs" ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 10. MEDIA SLIDER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media_slider (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  src TEXT NOT NULL,
  thumbnail TEXT,
  title TEXT,
  description TEXT,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE media_slider ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read published media" ON media_slider;
DROP POLICY IF EXISTS "Allow authenticated full access media" ON media_slider;

-- RLS Policies
CREATE POLICY "Allow public read published media" ON media_slider
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access media" ON media_slider
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 11. Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);
CREATE INDEX IF NOT EXISTS idx_job_postings_published ON job_postings(published);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_site_analytics_page_path ON site_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_session_id ON site_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_media_slider_sort_order ON media_slider(sort_order);
CREATE INDEX IF NOT EXISTS idx_media_slider_published ON media_slider(published);

-- ============================================
-- 12. Insert default blog categories
-- ============================================
INSERT INTO blog_categories (name, slug) VALUES
  ('Technology', 'technology'),
  ('Tutorials', 'tutorials'),
  ('Case Studies', 'case-studies'),
  ('Business', 'business'),
  ('Design', 'design'),
  ('Development', 'development')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Success message
-- ============================================
-- Database setup complete! All tables created with proper RLS policies.
-- Public users can now submit:
-- - Contact forms (leads table)
-- - Demo requests (demo_requests table)
-- - Job applications (job_applications table)
-- - Analytics data (site_analytics table)
