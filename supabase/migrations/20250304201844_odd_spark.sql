-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create storage bucket for avatars if it doesn't exist
DO $$
BEGIN
  -- Create avatars bucket
  INSERT INTO storage.buckets (id, name)
  VALUES ('avatars', 'avatars')
  ON CONFLICT (id) DO NOTHING;

  -- Set public access for avatars bucket
  UPDATE storage.buckets
  SET public = true
  WHERE id = 'avatars';
END $$;