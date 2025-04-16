/*
  # Fix Profiles Table RLS Policies

  1. Changes
    - Drop existing RLS policies on profiles table
    - Create new RLS policies that allow:
      - Public read access to all profiles
      - Authenticated users to manage their own profile
      - Service role to manage all profiles
    - Enable RLS on profiles table

  2. Security
    - Ensures users can only modify their own profile
    - Allows public read access for profile information
    - Maintains service role access for system operations
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;

-- Create new policies
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);