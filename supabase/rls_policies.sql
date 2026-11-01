-- ====================================================================
-- NEXUS PORTFOLIO PLATFORM — ROW LEVEL SECURITY (RLS) POLICIES
-- Security Architecture Reference & Enforcement Definitions
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. CONTACT MESSAGES (Anti-Abuse & Private Dispatch)
-- --------------------------------------------------------------------
-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing if needed
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anon cannot read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin delete contact messages" ON public.contact_messages;

-- Policy 1: Anonymous public can only INSERT messages that meet strict length/format constraints
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 2 AND char_length(name) <= 100 AND
    char_length(email) >= 5 AND char_length(email) <= 255 AND
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
    char_length(subject) >= 3 AND char_length(subject) <= 200 AND
    char_length(message) >= 10 AND char_length(message) <= 5000
  );

-- Policy 2: Public/Anon CANNOT SELECT (read) any contact messages
-- (By default, when RLS is enabled and no policy grants SELECT to anon, all anon SELECTs return 0 rows)

-- Policy 3: Authenticated Admin has full access to read messages
CREATE POLICY "Admin read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 4: Authenticated Admin can update read status
CREATE POLICY "Admin update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Authenticated Admin can delete contact messages
CREATE POLICY "Admin delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- --------------------------------------------------------------------
-- 2. PROJECTS TABLE (Public Read-Only Published, Admin Full CRUD)
-- --------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
DROP POLICY IF EXISTS "Admin read all projects" ON public.projects;
DROP POLICY IF EXISTS "Admin insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admin update projects" ON public.projects;
DROP POLICY IF EXISTS "Admin delete projects" ON public.projects;

-- Public can only view published projects
CREATE POLICY "Public read published projects"
  ON public.projects
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Admin can view all projects (drafts and published)
CREATE POLICY "Admin read all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can mutate projects
CREATE POLICY "Admin insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- --------------------------------------------------------------------
-- 3. CERTIFICATES TABLE (Public Read-Only Published, Admin Full CRUD)
-- --------------------------------------------------------------------
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin read all certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin insert certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin update certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin delete certificates" ON public.certificates;

CREATE POLICY "Public read published certificates"
  ON public.certificates
  FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Admin read all certificates"
  ON public.certificates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin insert certificates"
  ON public.certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin update certificates"
  ON public.certificates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin delete certificates"
  ON public.certificates
  FOR DELETE
  TO authenticated
  USING (true);

-- --------------------------------------------------------------------
-- 4. PROFILES, SKILLS, EDUCATION, ACHIEVEMENTS & SOCIAL LINKS
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read education" ON public.education FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read active social links" ON public.social_links FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admin read all social links" ON public.social_links FOR SELECT TO authenticated USING (true);

-- Admin mutation policies (INSERT / UPDATE / DELETE restricted to authenticated users)
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage achievements" ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 5. STORAGE BUCKET SECURITY
-- --------------------------------------------------------------------
-- Public read for media assets:
-- CREATE POLICY "Public read portfolio media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-media');
-- CREATE POLICY "Public read certificate docs" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'certificates-docs');

-- Admin upload / update / delete only:
-- CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('portfolio-media', 'certificates-docs'));
-- CREATE POLICY "Admin modify media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('portfolio-media', 'certificates-docs'));
-- CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('portfolio-media', 'certificates-docs'));
