-- ============================================================
-- JOB POSTINGS TABLE
-- Stores job listings created by admin
-- ============================================================

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

-- Public can view published jobs
CREATE POLICY "Public can read published jobs"
  ON public.job_postings FOR SELECT
  USING (published = true);

-- Authenticated admins can manage all jobs
CREATE POLICY "Admins can manage all jobs"
  ON public.job_postings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- JOB APPLICATIONS TABLE
-- Stores applications submitted by candidates
-- ============================================================

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

-- Anyone can submit an application (anon + authenticated)
CREATE POLICY "Anyone can submit applications"
  ON public.job_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can read all applications
CREATE POLICY "Admins can read applications"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (true);

-- Admins can update applications
CREATE POLICY "Admins can update applications"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON public.job_applications FOR DELETE
  TO authenticated
  USING (true);
