/*
  # Complete Database Schema with Fixed RLS Policies

  1. Changes
    - Fix RLS policies for profiles table
    - Add proper authentication checks
    - Ensure proper access control for all operations
    
  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for all operations
    - Fix profile creation/update policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS providers CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_features CASCADE;
DROP TABLE IF EXISTS service_areas CASCADE;
DROP TABLE IF EXISTS delivery_options CASCADE;
DROP TABLE IF EXISTS phone_verification_codes CASCADE;

-- Create users profile table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  email text,
  phone text,
  avatar_url text,
  user_type text CHECK (user_type IN ('client', 'provider')),
  bio text,
  location text,
  phone_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create providers table
CREATE TABLE providers (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  subcategory text,
  location text NOT NULL,
  image_url text,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service features table
CREATE TABLE service_features (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create service areas table
CREATE TABLE service_areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create delivery options table
CREATE TABLE delivery_options (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('free', 'paid', 'none', 'company')),
  price numeric(10,2) CHECK (
    (type = 'paid' AND price IS NOT NULL) OR
    (type != 'paid' AND price IS NULL)
  ),
  company_name text CHECK (
    (type = 'company' AND company_name IS NOT NULL) OR
    (type != 'company' AND company_name IS NULL)
  ),
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  last_message text,
  last_message_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create conversation participants table
CREATE TABLE conversation_participants (
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count int DEFAULT 0,
  PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create phone verification codes table
CREATE TABLE phone_verification_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  phone text NOT NULL,
  code text NOT NULL,
  attempts int DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 minutes')
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Providers policies
CREATE POLICY "Providers are viewable by everyone" ON providers
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own provider profile" ON providers
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Providers can update their own profile" ON providers
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Services policies
CREATE POLICY "Active services are viewable by everyone" ON services
FOR SELECT USING (status = 'active' OR provider_id = auth.uid());

CREATE POLICY "Providers can insert their own services" ON services
FOR INSERT TO authenticated
WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update their own services" ON services
FOR UPDATE TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can delete their own services" ON services
FOR DELETE TO authenticated
USING (provider_id = auth.uid());

-- Service features policies
CREATE POLICY "Service features are viewable by everyone" ON service_features
FOR SELECT USING (true);

CREATE POLICY "Providers can manage their service features" ON service_features
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Service areas policies
CREATE POLICY "Service areas are viewable by everyone" ON service_areas
FOR SELECT USING (true);

CREATE POLICY "Providers can manage their service areas" ON service_areas
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Delivery options policies
CREATE POLICY "Delivery options are viewable by everyone" ON delivery_options
FOR SELECT USING (true);

CREATE POLICY "Providers can manage their delivery options" ON delivery_options
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON conversations
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT TO authenticated
WITH CHECK (true);

-- Conversation participants policies
CREATE POLICY "Users can view conversation participants" ON conversation_participants
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage conversation participants" ON conversation_participants
FOR ALL TO authenticated
USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view conversation messages" ON messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages" ON messages
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Phone verification codes policies
CREATE POLICY "Users can manage their verification codes" ON phone_verification_codes
FOR ALL TO authenticated
USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'storage' 
    AND c.relname = 'objects' 
    AND c.relrowsecurity
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;