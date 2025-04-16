/*
  # Fix Profiles RLS Policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new comprehensive RLS policies that allow:
      - Users to create their own profile
      - Users to read and update their own profile
      - Public read access for basic profile information
      
  2. Security
    - Enable RLS on profiles table
    - Add policies for CRUD operations
    - Ensure users can only modify their own data
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "user_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم إدخال ملفه الشخصي" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم تحديث ملفه الشخصي" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم حذف ملفه الشخصي" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم قراءة ملفه الشخصي" ON profiles;

-- Create new policies

-- Allow users to create their own profile
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow public read access for basic profile information
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);