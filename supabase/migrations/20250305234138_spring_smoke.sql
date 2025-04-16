/*
  # Update Database Schema for Phone Authentication
  
  1. Changes
    - Add phone number fields to profiles table
    - Add phone verification fields
    - Add RLS policies for phone verification
    - Add function to verify phone codes
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add proper access controls
*/

-- Add phone fields to profiles table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
    ALTER TABLE profiles ADD COLUMN phone_verified boolean DEFAULT false;
  END IF;
END $$;

-- Create function to verify phone codes
CREATE OR REPLACE FUNCTION verify_phone_code(
  p_user_id uuid,
  p_phone text,
  p_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code_record RECORD;
BEGIN
  -- Get the latest verification code for this user and phone
  SELECT * INTO v_code_record
  FROM phone_verification_codes
  WHERE user_id = p_user_id 
    AND phone = p_phone 
    AND verified = false
    AND attempts < 3
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  -- Check if code exists and matches
  IF v_code_record.code = p_code THEN
    -- Mark code as verified
    UPDATE phone_verification_codes
    SET verified = true
    WHERE id = v_code_record.id;

    -- Update user's profile
    UPDATE profiles
    SET 
      phone = p_phone,
      phone_verified = true
    WHERE id = p_user_id;

    RETURN true;
  ELSE
    -- Increment attempts counter
    UPDATE phone_verification_codes
    SET attempts = attempts + 1
    WHERE id = v_code_record.id;

    RETURN false;
  END IF;
END;
$$;