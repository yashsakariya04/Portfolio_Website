
-- PROFILE (singleton row)
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Yash Sakariya',
  title text NOT NULL DEFAULT 'AI/ML Engineer & Backend Developer',
  taglines text[] NOT NULL DEFAULT ARRAY['Agentic AI Engineer','Backend Architect','AI Product Builder','Generative AI Developer','Multi-Agent Systems Engineer'],
  summary text NOT NULL DEFAULT '',
  email text DEFAULT 'sakariyayash04@gmail.com',
  phone text DEFAULT '+91 7016484630',
  location text DEFAULT 'Ahmedabad, Gujarat, India',
  github_url text DEFAULT 'https://github.com/yashsakariya',
  linkedin_url text DEFAULT 'https://linkedin.com/in/yashsakariya',
  resume_url text,
  profile_photo_url text,
  availability_status text DEFAULT 'Open to Work',
  years_experience int DEFAULT 2,
  projects_count int DEFAULT 6,
  coffees_count int DEFAULT 500,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  long_description text,
  tech_stack text[] DEFAULT '{}',
  github_url text,
  live_url text,
  thumbnail_url text,
  screenshots text[] DEFAULT '{}',
  architecture_highlights text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_flagship boolean DEFAULT false,
  order_index int DEFAULT 0,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  proficiency int DEFAULT 80,
  icon_name text,
  color text DEFAULT '#00d4ff',
  order_index int DEFAULT 0
);

CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  type text DEFAULT 'internship',
  location text,
  start_date text,
  end_date text,
  is_current boolean DEFAULT false,
  description text,
  responsibilities text[] DEFAULT '{}',
  tech_used text[] DEFAULT '{}',
  logo_url text,
  order_index int DEFAULT 0
);

CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  category text DEFAULT 'work',
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  date text,
  category text
);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Admin role system
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

-- Enable RLS
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Public read on portfolio tables
CREATE POLICY "public read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "public read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "public read achievements" ON public.achievements FOR SELECT USING (true);

-- Admin can do everything on portfolio tables
CREATE POLICY "admin all profile" ON public.profile FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all projects" ON public.projects FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all skills" ON public.skills FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all experience" ON public.experience FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all gallery" ON public.gallery FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all achievements" ON public.achievements FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Contact messages: anyone can submit, only admin can view/manage
CREATE POLICY "anyone insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update messages" ON public.contact_messages FOR UPDATE USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete messages" ON public.contact_messages FOR DELETE USING (public.has_role(auth.uid(),'admin'));

-- user_roles: users can read own roles; admin manages
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-photos','profile-photos',true),
  ('project-thumbnails','project-thumbnails',true),
  ('project-screenshots','project-screenshots',true),
  ('resume','resume',true),
  ('gallery-photos','gallery-photos',true),
  ('company-logos','company-logos',true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read for all six; admin write
CREATE POLICY "public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('profile-photos','project-thumbnails','project-screenshots','resume','gallery-photos','company-logos'));
CREATE POLICY "admin write storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('profile-photos','project-thumbnails','project-screenshots','resume','gallery-photos','company-logos') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update storage" ON storage.objects FOR UPDATE USING (bucket_id IN ('profile-photos','project-thumbnails','project-screenshots','resume','gallery-photos','company-logos') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete storage" ON storage.objects FOR DELETE USING (bucket_id IN ('profile-photos','project-thumbnails','project-screenshots','resume','gallery-photos','company-logos') AND public.has_role(auth.uid(),'admin'));
