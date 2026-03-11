-- =====================================================
-- ZARRAR INNOVATIONS - COMPLETE DATABASE SETUP
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  excerpt TEXT,
  read_time TEXT DEFAULT '5 min read',
  date TEXT,
  author TEXT DEFAULT 'Zarrar Innovations',
  content TEXT[] DEFAULT '{}',
  content_blocks JSONB DEFAULT '[]',
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'content_blocks') THEN
    ALTER TABLE blog_posts ADD COLUMN content_blocks JSONB DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'featured_image') THEN
    ALTER TABLE blog_posts ADD COLUMN featured_image TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'images') THEN
    ALTER TABLE blog_posts ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON blog_posts;

-- Create policies
CREATE POLICY "Anyone can view published posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  category TEXT NOT NULL,
  pricing JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  content_blocks JSONB DEFAULT '[]',
  demo_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'content_blocks') THEN
    ALTER TABLE products ADD COLUMN content_blocks JSONB DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
    ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END $$;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

CREATE POLICY "Anyone can view published products" ON products
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. PORTFOLIO PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  tags TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  content_blocks JSONB DEFAULT '[]',
  live_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published portfolio" ON portfolio_projects;
DROP POLICY IF EXISTS "Authenticated users can manage portfolio" ON portfolio_projects;

CREATE POLICY "Anyone can view published portfolio" ON portfolio_projects
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage portfolio" ON portfolio_projects
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. CASE STUDIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client TEXT,
  industry TEXT,
  duration TEXT,
  problem TEXT,
  solution TEXT,
  process TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  results JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  content_blocks JSONB DEFAULT '[]',
  excerpt TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published case studies" ON case_studies;
DROP POLICY IF EXISTS "Authenticated users can manage case studies" ON case_studies;

CREATE POLICY "Anyone can view published case studies" ON case_studies
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage case studies" ON case_studies
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. LEADS TABLE (Contact Form Submissions)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  budget TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact',
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;

CREATE POLICY "Anyone can submit leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage leads" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. DEMO REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  product TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit demo requests" ON demo_requests;
DROP POLICY IF EXISTS "Authenticated users can manage demo requests" ON demo_requests;

CREATE POLICY "Anyone can submit demo requests" ON demo_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage demo requests" ON demo_requests
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 7. JOB POSTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  department TEXT,
  location TEXT,
  type TEXT DEFAULT 'Full-time',
  experience TEXT,
  salary_range TEXT,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published jobs" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can manage jobs" ON job_postings;

CREATE POLICY "Anyone can view published jobs" ON job_postings
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage jobs" ON job_postings
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 8. JOB APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  experience TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can manage applications" ON job_applications;

CREATE POLICY "Anyone can submit applications" ON job_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage applications" ON job_applications
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 9. MEDIA SLIDER TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS media_slider (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  type TEXT DEFAULT 'image',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media_slider ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published media" ON media_slider;
DROP POLICY IF EXISTS "Authenticated users can manage media" ON media_slider;

CREATE POLICY "Anyone can view published media" ON media_slider
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage media" ON media_slider
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 10. SITE ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  scroll_depth INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert analytics" ON site_analytics;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON site_analytics;

CREATE POLICY "Anyone can insert analytics" ON site_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" ON site_analytics
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 11. PAGE HISTORY / VISITOR TRACKING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT,
  page_path TEXT NOT NULL,
  page_title TEXT,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert page visits" ON page_visits;
DROP POLICY IF EXISTS "Authenticated users can view page visits" ON page_visits;

CREATE POLICY "Anyone can insert page visits" ON page_visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view page visits" ON page_visits
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 12. NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'website',
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON newsletter_subscribers;

CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 13. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;

CREATE POLICY "Anyone can view published testimonials" ON testimonials
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 14. TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published team members" ON team_members;
DROP POLICY IF EXISTS "Authenticated users can manage team members" ON team_members;

CREATE POLICY "Anyone can view published team members" ON team_members
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage team members" ON team_members
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON site_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON site_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_page_visits_session ON page_visits(session_id);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Created tables: blog_posts, products, portfolio_projects, case_studies, leads, demo_requests, job_postings, job_applications, media_slider, site_analytics, page_visits, newsletter_subscribers, testimonials, team_members';
END $$;
