/*
  # Fix Profiles Table RLS Policies

  1. Changes
    - Drop and recreate RLS policies for profiles table
    - Add comprehensive policies for all operations
    - Ensure no policy conflicts by checking existence

  2. Security
    - Enable RLS on profiles table
    - Service role has full access
    - Authenticated users can manage their own profiles
    - Public read access for all profiles
*/

DO $$ BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
    DROP POLICY "Users can insert their own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    DROP POLICY "Users can update their own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
    DROP POLICY "Profiles are viewable by everyone" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can delete their own profile') THEN
    DROP POLICY "Users can delete their own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Service role can manage all profiles') THEN
    DROP POLICY "Service role can manage all profiles" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can manage their own profile') THEN
    DROP POLICY "Users can manage their own profile" ON profiles;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies
DO $$ BEGIN
  -- Service role can do everything
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Service role can manage all profiles') THEN
    CREATE POLICY "Service role can manage all profiles"
    ON profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;

  -- Users can manage their own profile
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can manage their own profile') THEN
    CREATE POLICY "Users can manage their own profile"
    ON profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;

  -- Everyone can view profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
    CREATE POLICY "Profiles are viewable by everyone"
    ON profiles
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;