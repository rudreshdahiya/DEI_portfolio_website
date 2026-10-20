-- ── Supabase setup for Pratik Aggarwal's site (secure) ─────────────────────────
-- Creates everything the site needs and locks it so only the admin can change content.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run. Safe to re-run.
--
-- BEFORE RUNNING:
--   1. Authentication → Users → Add user → create the admin login (tick "Auto confirm user").
--   2. Replace admin@example.com below with that same email.

-- ── 0. Tables and image storage ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT,
  session_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- ── 1. Who counts as an admin ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY
);
-- RLS on with no policies: the table can't be read or changed through the public API.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_users (email) VALUES ('admin@example.com')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ── 2. Remove every existing policy on the tables we're locking ─────────────────
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('site_settings', 'analytics_events')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;

  -- Storage policies that mention the site-images bucket
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (coalesce(qual, '') ILIKE '%site-images%' OR coalesce(with_check, '') ILIKE '%site-images%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- ── 3. Site content: everyone reads, only admins write ──────────────────────────
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete site settings" ON public.site_settings
  FOR DELETE TO authenticated USING (public.is_admin());

-- ── 4. Analytics: visitors can record events, only admins can see or clear them ─
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read analytics events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete analytics events" ON public.analytics_events
  FOR DELETE TO authenticated USING (public.is_admin());

-- ── 5. Image uploads (site-images bucket): everyone views, only admins change ───
CREATE POLICY "Public can view site images" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Admins can upload site images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.is_admin());
CREATE POLICY "Admins can update site images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-images' AND public.is_admin());
CREATE POLICY "Admins can delete site images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.is_admin());

-- ── 6. Check: you should see exactly these 11 policies ─────────────────────────
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN ('site_settings', 'analytics_events'))
   OR (schemaname = 'storage' AND tablename = 'objects' AND policyname ILIKE '%site images%')
ORDER BY tablename, cmd;
