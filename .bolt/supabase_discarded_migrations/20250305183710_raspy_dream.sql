/*
  # Fix Database Policies

  1. Changes
    - Fix infinite recursion in conversation_participants policies
    - Fix profiles table RLS policies
    - Add missing indexes
    - Optimize query performance

  2. Security
    - Update RLS policies to prevent recursion
    - Add proper profile access controls
    - Ensure proper authentication checks
*/

-- Fix conversation_participants policies by removing recursive checks
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update their participant status" ON conversation_participants;
DROP POLICY IF EXISTS "Users can delete their participant status" ON conversation_participants;

-- Create new non-recursive policies
CREATE POLICY "View conversation participants"
ON conversation_participants FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Add conversation participants"
ON conversation_participants FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
  )
);

CREATE POLICY "Update participant status"
ON conversation_participants FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Delete participant status"
ON conversation_participants FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Fix profiles table policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "user_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;

-- Create new profile policies
CREATE POLICY "View public profile info"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- Add trigger to automatically create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_id)
  VALUES (new.id, new.email, new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;