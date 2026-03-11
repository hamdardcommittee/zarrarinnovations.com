"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react"

const SQL_MIGRATION = `-- Run this SQL in your Supabase SQL Editor to create the blog tables

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  date TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Zarrar Innovations',
  content TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage all posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON public.blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.blog_categories (name) VALUES
  ('Web Development'),
  ('UI/UX Design'),
  ('E-Commerce'),
  ('Business Systems'),
  ('Mobile Apps'),
  ('Tech Trends')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- LEADS / CONTACT REQUESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  service TEXT DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'follow-up', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read leads"
  ON public.leads FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE TO authenticated USING (true);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================

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

CREATE POLICY "Admins can read activity logs"
  ON public.activity_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert activity logs"
  ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- SITE ANALYTICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON public.site_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read analytics"
  ON public.site_analytics FOR SELECT TO authenticated USING (true);

-- ============================================
-- JOB POSTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL DEFAULT 'Engineering',
  location TEXT NOT NULL DEFAULT 'Remote',
  type TEXT NOT NULL DEFAULT 'Full-time'
    CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')),
  experience_level TEXT NOT NULL DEFAULT 'Mid-level'
    CHECK (experience_level IN ('Entry-level', 'Mid-level', 'Senior', 'Lead', 'Director')),
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published jobs"
  ON public.job_postings FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all jobs"
  ON public.job_postings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  experience_years TEXT,
  current_role TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications"
  ON public.job_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read applications"
  ON public.job_applications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update applications"
  ON public.job_applications FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete applications"
  ON public.job_applications FOR DELETE TO authenticated USING (true);

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
  ON public.demo_requests FOR DELETE TO authenticated USING (true);`

export default function SetupPage() {
  const [seeding, setSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSeed() {
    setSeeding(true)
    setResult(null)
    try {
      const res = await fetch("/api/setup", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, message: data.message || "Database seeded successfully!" })
      } else {
        setResult({ success: false, message: data.error || "Failed to seed database." })
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." })
    } finally {
      setSeeding(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(SQL_MIGRATION)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight lg:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Database Setup
        </h1>
        <p className="mt-1 text-muted-foreground">
          Set up your Supabase database tables and seed initial data.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Step 1: Create tables */}
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Database className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-3">Step 1: Create Tables</CardTitle>
            <CardDescription>
              Copy the SQL below and run it in your Supabase SQL Editor to create the required tables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy SQL
                  </>
                )}
              </Button>
              <pre className="max-h-64 overflow-auto rounded-lg bg-foreground p-4 text-xs leading-relaxed text-background/80">
                {SQL_MIGRATION}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Seed data */}
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Database className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-3">Step 2: Seed Data</CardTitle>
            <CardDescription>
              After creating the tables, click below to seed the database with the default blog posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full"
              size="lg"
            >
              {seeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Database className="size-4" />
              )}
              {seeding ? "Seeding..." : "Seed Database"}
            </Button>

            {result && (
              <div
                className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                  result.success
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-destructive/20 bg-destructive/10 text-destructive"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                )}
                {result.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
