-- ====================================================================
-- NEXUS PORTFOLIO PLATFORM — SUPABASE DATABASE SCHEMA MIGRATION
-- Production-Ready Schema with Row Level Security (RLS) & Constraints
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  interests TEXT[] DEFAULT '{}',
  is_available_for_hire BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  screenshots TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Full-Stack',
  github_url TEXT,
  demo_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  architecture_notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- --------------------------------------------------------------------
-- 3. CERTIFICATES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_id TEXT NOT NULL,
  verification_url TEXT NOT NULL,
  pdf_url TEXT,
  image_preview TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cloud Architecture',
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  skills_covered TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_published ON public.certificates(is_published);
CREATE INDEX IF NOT EXISTS idx_certificates_category ON public.certificates(category);

-- --------------------------------------------------------------------
-- 4. SKILLS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100) DEFAULT 80,
  years_of_experience NUMERIC(3, 1) DEFAULT 1.0,
  icon TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

-- --------------------------------------------------------------------
-- 5. EDUCATION TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  grade_or_gpa TEXT,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  location TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. ACHIEVEMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Award',
  badge_icon TEXT,
  url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. SOCIAL LINKS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. CONTACT MESSAGES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES:
-- 1. Profiles: Anyone can view profile
CREATE POLICY "Public read profiles" ON public.profiles
  FOR SELECT TO anon, authenticated
  USING (true);

-- 2. Projects: Public can only view published projects
CREATE POLICY "Public read published projects" ON public.projects
  FOR SELECT TO anon
  USING (is_published = true);

-- Authenticated admins can view all projects (drafts & published)
CREATE POLICY "Admin read all projects" ON public.projects
  FOR SELECT TO authenticated
  USING (true);

-- 3. Certificates: Public can only view published certificates
CREATE POLICY "Public read published certificates" ON public.certificates
  FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Admin read all certificates" ON public.certificates
  FOR SELECT TO authenticated
  USING (true);

-- 4. Skills: Public read
CREATE POLICY "Public read skills" ON public.skills
  FOR SELECT TO anon, authenticated
  USING (true);

-- 5. Education: Public read
CREATE POLICY "Public read education" ON public.education
  FOR SELECT TO anon, authenticated
  USING (true);

-- 6. Achievements: Public read
CREATE POLICY "Public read achievements" ON public.achievements
  FOR SELECT TO anon, authenticated
  USING (true);

-- 7. Social Links: Public read active links
CREATE POLICY "Public read active social links" ON public.social_links
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Admin read all social links" ON public.social_links
  FOR SELECT TO authenticated
  USING (true);

-- 8. Contact Messages: Public can insert new message (sanitized)
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 2 AND 
    char_length(email) >= 5 AND 
    char_length(message) >= 10
  );

-- Only authenticated admins can read/update/delete contact messages
CREATE POLICY "Admin read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Admin delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (true);

-- --------------------------------------------------------------------
-- ADMIN WRITE POLICIES (C-U-D) - Authenticated users only
-- --------------------------------------------------------------------
CREATE POLICY "Admin manage profiles" ON public.profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin update projects" ON public.projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin delete projects" ON public.projects
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert certificates" ON public.certificates
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin update certificates" ON public.certificates
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin delete certificates" ON public.certificates
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin manage skills" ON public.skills
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage education" ON public.education
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage achievements" ON public.achievements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage social links" ON public.social_links
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- STORAGE CONFIGURATION & POLICIES
-- --------------------------------------------------------------------
-- To be executed in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates-docs', 'certificates-docs', true) ON CONFLICT DO NOTHING;

-- Public can read storage files
-- CREATE POLICY "Public read portfolio media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-media');
-- CREATE POLICY "Public read certificate docs" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'certificates-docs');

-- Only authenticated admins can upload/modify/delete storage files
-- CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('portfolio-media', 'certificates-docs'));
-- CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('portfolio-media', 'certificates-docs'));
-- CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('portfolio-media', 'certificates-docs'));
