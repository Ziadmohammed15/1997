/*
  # Update Chat System Schema and Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-enable RLS on profiles table
    - Create new RLS policies with proper permissions
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
    - Add policies for service role
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies from profiles table
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "Public profiles view access"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Auth users profile insert"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Auth users profile update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);