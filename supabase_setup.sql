-- ── Supabase Setup SQL Script for Pratik Aggarwal DEI Portfolio ──────────────

-- 1. Create site_settings table for dynamic Admin Back-Office edits
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies if any to avoid duplicates
DROP POLICY IF EXISTS "Allow public select on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public insert on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public update on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public delete on site_settings" ON public.site_settings;

-- Grant public read and write access for site_settings
CREATE POLICY "Allow public select on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on site_settings" ON public.site_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on site_settings" ON public.site_settings FOR DELETE USING (true);


-- 2. Create analytics_events table for cookieless PM analytics tracking
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT,
  session_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public select on analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow public insert on analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow public delete on analytics_events" ON public.analytics_events;

-- Grant public select & insert access for cookieless event logging
CREATE POLICY "Allow public select on analytics_events" ON public.analytics_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert on analytics_events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on analytics_events" ON public.analytics_events FOR DELETE USING (true);
