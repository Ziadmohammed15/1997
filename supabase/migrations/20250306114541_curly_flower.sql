/*
  # Fix Profiles Table RLS Policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Enable RLS on profiles table
    - Add new policies for:
      - Public read access
      - Authenticated users managing their own profile
      - Service role full access
  
  2. Security
    - Enable RLS on profiles table
    - Add granular policies for different access levels
    - Ensure users can only manage their own profiles
    - Allow public read access
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop all policies on profiles table
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
  DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
  DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies

-- Allow public read access to all profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to manage their own profile
CREATE POLICY "Users can manage their own profile"
ON profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow service role full access
CREATE POLICY "Service role can manage all profiles"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);