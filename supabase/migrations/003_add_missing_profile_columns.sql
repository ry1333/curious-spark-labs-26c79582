-- =====================================================
-- ADD MISSING PROFILE COLUMNS
-- =====================================================
-- This migration adds the missing columns to the profiles table
-- that are referenced in the application code but don't exist in DB

-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS experience_level text CHECK (experience_level IN ('beginner', 'intermediate', 'pro')),
ADD COLUMN IF NOT EXISTS favorite_genres text[],
ADD COLUMN IF NOT EXISTS goals text[],
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create or replace function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists (in case it was created before)
DROP TRIGGER IF EXISTS update_profiles_updated_at_trigger ON public.profiles;

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_profiles_updated_at_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Backfill updated_at for existing profiles (set to created_at)
UPDATE public.profiles
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Create index on experience_level for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON public.profiles(experience_level);

-- Create index on favorite_genres using GIN for array queries
CREATE INDEX IF NOT EXISTS idx_profiles_favorite_genres ON public.profiles USING GIN(favorite_genres);

-- Add comment to table for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with onboarding data including experience level, genres, and goals';
COMMENT ON COLUMN public.profiles.display_name IS 'User display name (different from username)';
COMMENT ON COLUMN public.profiles.experience_level IS 'DJ skill level: beginner, intermediate, or pro';
COMMENT ON COLUMN public.profiles.favorite_genres IS 'Array of favorite music genres';
COMMENT ON COLUMN public.profiles.goals IS 'Array of user goals (create, remix, learn, compete, share, discover)';
COMMENT ON COLUMN public.profiles.social_links IS 'JSON object containing social media links';
