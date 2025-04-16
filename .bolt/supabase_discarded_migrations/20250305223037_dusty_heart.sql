/*
  # Fix profiles table RLS policies

  1. Changes
    - Update RLS policies for profiles table to allow proper access
    - Add policy for inserting new profiles
    - Add policy for updating own profile
    - Add policy for reading profiles

  2. Security
    - Enable RLS on profiles table
    - Ensure users can only modify their own profile
    - Allow reading of public profile information
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "user_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم إدخال ملفه الشخصي" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم تحديث ملفه الشخصي" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم حذف ملفه الشخصي" ON profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم قراءة ملفه الشخصي" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Add trigger to automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();