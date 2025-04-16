/*
  # Admin Users and Role Management

  1. Tables
    - admin_users: Store admin user information
    - Add role column to profiles
  
  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access
    - Create helper functions for admin management
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  is_super_admin boolean DEFAULT false,
  permissions text[],
  created_at timestamptz DEFAULT now()
);

-- Add role column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN role text CHECK (role IN ('admin', 'provider', 'client'));
  END IF;
END $$;

-- Admin policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin full access" ON admin_users;
DROP POLICY IF EXISTS "Public read access" ON admin_users;

-- Create new policies
CREATE POLICY "Admin full access"
ON admin_users
FOR ALL
TO public
USING (
  (auth.uid() = user_id) OR
  (EXISTS (
    SELECT 1 FROM admin_users admin_users_1
    WHERE admin_users_1.user_id = auth.uid() AND admin_users_1.is_super_admin = true
  ))
);

CREATE POLICY "Public read access"
ON admin_users
FOR SELECT
TO public
USING (true);

-- Create function to safely add admin user
CREATE OR REPLACE FUNCTION add_admin_user(
  p_user_id uuid,
  p_is_super_admin boolean DEFAULT false,
  p_permissions text[] DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
  END IF;
  
  -- Check if admin already exists
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = p_user_id) THEN
    -- Update existing admin
    UPDATE admin_users
    SET 
      is_super_admin = p_is_super_admin,
      permissions = COALESCE(p_permissions, permissions)
    WHERE user_id = p_user_id
    RETURNING id INTO v_admin_id;
  ELSE
    -- Create new admin
    INSERT INTO admin_users (user_id, is_super_admin, permissions)
    VALUES (p_user_id, p_is_super_admin, p_permissions)
    RETURNING id INTO v_admin_id;
  END IF;
  
  -- Update profile role if needed
  UPDATE profiles
  SET role = 'admin'
  WHERE id = p_user_id
  AND (role IS NULL OR role != 'admin');
  
  RETURN v_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to safely update user role
CREATE OR REPLACE FUNCTION update_user_role(
  p_user_id uuid,
  p_role text
)
RETURNS boolean AS $$
BEGIN
  -- Validate role
  IF p_role NOT IN ('admin', 'provider', 'client') THEN
    RAISE EXCEPTION 'Invalid role: %. Must be admin, provider, or client', p_role;
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
  END IF;
  
  -- Update profile role
  UPDATE profiles
  SET role = p_role
  WHERE id = p_user_id;
  
  -- If role is admin, ensure admin_users entry exists
  IF p_role = 'admin' AND NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = p_user_id) THEN
    INSERT INTO admin_users (user_id, is_super_admin)
    VALUES (p_user_id, false);
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = p_user_id
    AND is_super_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;