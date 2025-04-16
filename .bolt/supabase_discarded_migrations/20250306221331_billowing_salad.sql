/*
  # إنشاء مخطط قاعدة البيانات

  1. الجداول الأساسية
    - `profiles`: معلومات المستخدمين
    - `services`: الخدمات المعروضة
    - `service_features`: مميزات الخدمات
    - `delivery_options`: خيارات التوصيل
    - `service_areas`: مناطق تغطية الخدمة
    - `conversations`: المحادثات
    - `messages`: الرسائل
    - `online_status`: حالة الاتصال

  2. الأمان
    - تفعيل RLS لجميع الجداول
    - إضافة سياسات الوصول المناسبة
    - إعداد العلاقات والقيود

  3. التخزين
    - إنشاء مجلدات التخزين للصور والملفات
    - إعداد سياسات الوصول للتخزين
*/

-- إنشاء مجلد التخزين للخدمات
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- إنشاء مجلد التخزين للمحادثات
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat_media', 'chat_media', true)
ON CONFLICT (id) DO NOTHING;

-- إنشاء جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS profiles (
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

-- إنشاء جدول مقدمي الخدمات
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- إنشاء جدول مميزات الخدمات
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول خيارات التوصيل
CREATE TABLE IF NOT EXISTS delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- إنشاء جدول مناطق التغطية
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول المحادثات
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_message text,
  last_message_time timestamptz
);

-- إنشاء جدول المشاركين في المحادثات
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

-- إنشاء جدول الرسائل
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'image', 'voice', 'location')),
  media_url text,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- إنشاء جدول مرفقات الرسائل
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول حالة الاتصال
CREATE TABLE IF NOT EXISTS online_status (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now()
);

-- تفعيل RLS لجميع الجداول
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_status ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الوصول للملفات الشخصية
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- إنشاء سياسات الوصول للخدمات
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Providers can create services"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own services"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can delete own services"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- إنشاء سياسات الوصول لمميزات الخدمات
CREATE POLICY "Anyone can view service features"
ON service_features FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can manage service features"
ON service_features FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM services
  WHERE services.id = service_features.service_id
  AND services.provider_id = auth.uid()
));

-- إنشاء سياسات الوصول لخيارات التوصيل
CREATE POLICY "Anyone can view delivery options"
ON delivery_options FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can manage delivery options"
ON delivery_options FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM services
  WHERE services.id = delivery_options.service_id
  AND services.provider_id = auth.uid()
));

-- إنشاء سياسات الوصول لمناطق التغطية
CREATE POLICY "Anyone can view service areas"
ON service_areas FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can manage service areas"
ON service_areas FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM services
  WHERE services.id = service_areas.service_id
  AND services.provider_id = auth.uid()
));

-- إنشاء سياسات الوصول للمحادثات
CREATE POLICY "Users can view their conversations"
ON conversations FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM conversation_participants
  WHERE conversation_participants.conversation_id = id
  AND conversation_participants.user_id = auth.uid()
));

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

-- إنشاء سياسات الوصول للمشاركين في المحادثات
CREATE POLICY "Users can view conversation participants"
ON conversation_participants FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join conversations"
ON conversation_participants FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- إنشاء سياسات الوصول للرسائل
CREATE POLICY "Users can view conversation messages"
ON messages FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM conversation_participants
  WHERE conversation_participants.conversation_id = messages.conversation_id
  AND conversation_participants.user_id = auth.uid()
));

CREATE POLICY "Users can send messages"
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

-- إنشاء سياسات الوصول لمرفقات الرسائل
CREATE POLICY "Users can view message attachments"
ON message_attachments FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM messages m
  JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
  WHERE m.id = message_attachments.message_id
  AND cp.user_id = auth.uid()
));

-- إنشاء سياسات الوصول لحالة الاتصال
CREATE POLICY "Users can view online status"
ON online_status FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their online status"
ON online_status FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- إنشاء سياسات الوصول للتخزين
CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Anyone can view chat media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat_media');

CREATE POLICY "Authenticated users can upload chat media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat_media');

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- إنشاء الدوال المساعدة
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message = NEW.content,
    last_message_time = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
  AND user_id != NEW.sender_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المشغلات
CREATE TRIGGER update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

CREATE TRIGGER increment_unread_count
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_unread_count();