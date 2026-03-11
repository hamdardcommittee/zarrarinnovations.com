-- Fix RLS policy for leads table
-- The original policy didn't explicitly grant to 'anon' role
-- Drop and recreate the INSERT policy targeting both anon and authenticated

DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;

CREATE POLICY "Anyone can submit leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
