/*
  # Fix Profiles Table RLS Policies

  1. Security Changes
    - Enable RLS on profiles table if not already enabled
    - Drop existing policies to avoid conflicts
    - Create policies for:
      - Service role can manage all profiles
      - Authenticated users can manage their own profile
      - Everyone can view profiles
    
  2. Notes
    - Ensures proper access control for user profiles
    - Handles service role access for initial profile creation
    - Maintains consistent security rules
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;

-- Allow service role full access
CREATE POLICY "Service role can manage all profiles"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to manage their own profile
CREATE POLICY "Users can manage their own profile"
ON profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow everyone to view profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles
FOR SELECT
TO public
USING (true);