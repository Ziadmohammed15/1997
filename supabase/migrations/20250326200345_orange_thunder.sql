/*
  # Security Policies

  1. Row Level Security Policies
    - Control access to all tables
    - Implement proper data isolation
    - Set up appropriate access rules
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop profiles policies
  DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  
  -- Drop services policies
  DROP POLICY IF EXISTS "Active services are viewable by everyone" ON services;
  DROP POLICY IF EXISTS "Providers can insert services" ON services;
  DROP POLICY IF EXISTS "Providers can update own services" ON services;
  DROP POLICY IF EXISTS "Providers can delete own services" ON services;
  
  -- Drop service features policies
  DROP POLICY IF EXISTS "Features are viewable with service" ON service_features;
  DROP POLICY IF EXISTS "Providers can manage features" ON service_features;
  
  -- Drop delivery options policies
  DROP POLICY IF EXISTS "Delivery options are viewable with service" ON delivery_options;
  DROP POLICY IF EXISTS "Providers can manage delivery options" ON delivery_options;
  
  -- Drop service areas policies
  DROP POLICY IF EXISTS "Areas are viewable with service" ON service_areas;
  DROP POLICY IF EXISTS "Providers can manage areas" ON service_areas;
  
  -- Drop bookings policies
  DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
  DROP POLICY IF EXISTS "Clients can create bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
  
  -- Drop reviews policies
  DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
  DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
  
  -- Drop favorites policies
  DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
  DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;
  
  -- Drop conversations policies
  DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can view own conversation participants" ON conversation_participants;
  DROP POLICY IF EXISTS "Users can view conversation messages" ON messages;
  DROP POLICY IF EXISTS "Users can send messages" ON messages;
  
  -- Drop storage policies
  DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
END $$;

-- Create new policies

-- Profiles policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Public profiles view access'
  ) THEN
    CREATE POLICY "Public profiles view access"
    ON profiles FOR SELECT
    TO public
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Services policies
CREATE POLICY "Active services view access"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Provider services insert"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Provider services update"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Provider services delete"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- Service features policies
CREATE POLICY "Service features view access"
ON service_features FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND (services.status = 'active' OR services.provider_id = auth.uid())
  )
);

CREATE POLICY "Provider features management"
ON service_features FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Delivery options policies
CREATE POLICY "Delivery options view access"
ON delivery_options FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND (services.status = 'active' OR services.provider_id = auth.uid())
  )
);

CREATE POLICY "Provider delivery options management"
ON delivery_options FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Service areas policies
CREATE POLICY "Service areas view access"
ON service_areas FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND (services.status = 'active' OR services.provider_id = auth.uid())
  )
);

CREATE POLICY "Provider areas management"
ON service_areas FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Bookings policies
CREATE POLICY "Bookings view access"
ON bookings FOR SELECT
TO authenticated
USING (
  client_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = bookings.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Client bookings create"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Bookings update access"
ON bookings FOR UPDATE
TO authenticated
USING (
  client_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = bookings.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Reviews policies
CREATE POLICY "Reviews public view"
ON reviews FOR SELECT
TO public
USING (true);

CREATE POLICY "Reviews create access"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Reviews update access"
ON reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Reviews delete access"
ON reviews FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Favorites policies
CREATE POLICY "Favorites view access"
ON favorites FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Favorites management"
ON favorites FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Conversations policies
CREATE POLICY "Conversations view access"
ON conversations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Conversation participants policies
CREATE POLICY "Conversation participants view access"
ON conversation_participants FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Messages view access"
ON messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Messages create access"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Storage policies
CREATE POLICY "Storage public access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('services', 'avatars', 'chat_images'));

CREATE POLICY "Storage upload access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('services', 'avatars', 'chat_images') AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Storage delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('services', 'avatars', 'chat_images') AND
  (storage.foldername(name))[1] = auth.uid()::text
);