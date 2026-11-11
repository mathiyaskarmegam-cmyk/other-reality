-- ==============================================================================
-- THE OTHER REALITY — DATABASE SCHEMA & RLS POLICIES
-- Full Supabase Migration for Pseudonymous Experience-Sharing Platform
-- ==============================================================================

-- 1. Profiles (Public Pseudonymous Identities)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  avatar text NOT NULL DEFAULT 'wanderer',
  is_moderator boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON public.profiles(nickname);

-- 2. Experiences
CREATE TABLE IF NOT EXISTS public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  text_content text,
  experience_type text NOT NULL CHECK (experience_type IN ('text_only', 'photo_only', 'text_and_photo')),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'moderated_removed', 'deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_status_created ON public.experiences(status, created_at DESC);

-- 3. Experience Images
CREATE TABLE IF NOT EXISTS public.experience_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  image_url text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_experience_images_exp_id ON public.experience_images(experience_id);

-- 4. Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  reporting_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_experience_id ON public.reports(experience_id);

-- 5. Moderation Records
CREATE TABLE IF NOT EXISTS public.moderation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES public.reports(id) ON DELETE SET NULL,
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  moderator_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('dismissed', 'removed', 'warning')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_moderation_records_exp_id ON public.moderation_records(experience_id);

-- 6. Account Deletion Requests
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deletion_requests_user ON public.account_deletion_requests(user_id);

-- ==============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function to check if the current user is a moderator
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_moderator = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a public profile automatically on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar, is_moderator)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'silent_wanderer_' || SUBSTRING(NEW.id::text FROM 1 FOR 6)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'wanderer'),
    COALESCE((NEW.raw_user_meta_data->>'is_moderator')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_experience_updated ON public.experiences;
CREATE TRIGGER on_experience_updated
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Experiences Policies
-- Any visitor can view published experiences
CREATE POLICY "Published experiences are viewable by all"
  ON public.experiences FOR SELECT
  USING (status = 'published');

-- Authors can view their own experiences regardless of status (e.g. drafts or deleted)
CREATE POLICY "Authors can view own experiences"
  ON public.experiences FOR SELECT
  USING (auth.uid() = user_id);

-- Moderators can view any experience
CREATE POLICY "Moderators can view all experiences"
  ON public.experiences FOR SELECT
  USING (public.is_moderator());

-- Authors can create their own experiences
CREATE POLICY "Authors can insert own experiences"
  ON public.experiences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authors can update their own experiences
CREATE POLICY "Authors can update own experiences"
  ON public.experiences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authors can delete their own experiences
CREATE POLICY "Authors can delete own experiences"
  ON public.experiences FOR DELETE
  USING (auth.uid() = user_id);

-- Moderators can update experiences (e.g. set status = 'moderated_removed')
CREATE POLICY "Moderators can update any experience"
  ON public.experiences FOR UPDATE
  USING (public.is_moderator());

-- 3. Experience Images Policies
CREATE POLICY "Images of published experiences are viewable"
  ON public.experience_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE experiences.id = experience_images.experience_id
        AND (experiences.status = 'published' OR experiences.user_id = auth.uid() OR public.is_moderator())
    )
  );

CREATE POLICY "Experience authors can insert images"
  ON public.experience_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE experiences.id = experience_images.experience_id
        AND experiences.user_id = auth.uid()
    )
  );

CREATE POLICY "Experience authors can delete own images"
  ON public.experience_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE experiences.id = experience_images.experience_id
        AND experiences.user_id = auth.uid()
    )
  );

-- 4. Reports Policies
CREATE POLICY "Authenticated users can submit reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporting_user_id);

CREATE POLICY "Moderators can view all reports"
  ON public.reports FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Moderators can update reports"
  ON public.reports FOR UPDATE
  USING (public.is_moderator());

-- 5. Moderation Records Policies
CREATE POLICY "Moderators can view moderation records"
  ON public.moderation_records FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Moderators can insert moderation records"
  ON public.moderation_records FOR INSERT
  WITH CHECK (public.is_moderator() AND auth.uid() = moderator_user_id);

-- 6. Account Deletion Requests Policies
CREATE POLICY "Users can create their own deletion request"
  ON public.account_deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own deletion request"
  ON public.account_deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Moderators can view all deletion requests"
  ON public.account_deletion_requests FOR SELECT
  USING (public.is_moderator());

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- Note: Create bucket 'experience-images' in Supabase Dashboard or via Storage API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('experience-images', 'experience-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage Policies:
-- Allow public download of images in 'experience-images'
-- CREATE POLICY "Public read for experience images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'experience-images');

-- Allow authenticated users to upload to 'experience-images'
-- CREATE POLICY "Authenticated upload for experience images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'experience-images' AND auth.role() = 'authenticated');

-- Allow image owner to delete
-- CREATE POLICY "Owner delete for experience images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'experience-images' AND auth.uid() = owner);

