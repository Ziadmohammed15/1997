/*
  # User Profiles and Reviews Schema

  1. Changes
    - Add additional profile fields
    - Create notifications table
    - Create reviews table
    - Create favorites table
    - Add helper functions
  
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- تحديث جدول profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cover_image text,
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_completed_services integer DEFAULT 0;

-- إنشاء جدول للإشعارات
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  data jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT notifications_type_check CHECK (type IN ('booking', 'message', 'review', 'achievement', 'system'))
);

-- إنشاء جدول للتقييمات
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول للمفضلة
CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, service_id)
);

-- تحديث سياسات الأمان

-- سياسات الإشعارات
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- سياسات التقييمات
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- سياسات المفضلة
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
ON favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
ON favorites FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_service ON favorites(user_id, service_id);

-- إنشاء الوظائف المساعدة

-- وظيفة تحديث إحصائيات المستخدم
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS trigger AS $$
DECLARE
  service_provider_id uuid;
BEGIN
  -- Get the provider ID from the service
  SELECT provider_id INTO service_provider_id
  FROM services
  WHERE id = NEW.service_id;
  
  -- تحديث عدد التقييمات
  IF service_provider_id IS NOT NULL THEN
    UPDATE profiles
    SET total_reviews = (
      SELECT count(*)
      FROM reviews r
      JOIN services s ON r.service_id = s.id
      WHERE s.provider_id = service_provider_id
    )
    WHERE id = service_provider_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المحفز لتحديث الإحصائيات
CREATE TRIGGER update_user_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- وظيفة إضافة إنجاز جديد
CREATE OR REPLACE FUNCTION add_achievement(
  user_id uuid,
  achievement_type text,
  achievement_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
DECLARE
  achievement jsonb;
BEGIN
  -- إنشاء الإنجاز
  achievement := jsonb_build_object(
    'type', achievement_type,
    'date', CURRENT_TIMESTAMP,
    'data', achievement_data
  );
  
  -- إضافة الإنجاز للمستخدم
  UPDATE profiles
  SET achievements = achievements || achievement
  WHERE id = user_id;
  
  -- إنشاء إشعار بالإنجاز
  INSERT INTO notifications (
    user_id,
    type,
    title,
    content,
    data
  ) VALUES (
    user_id,
    'achievement',
    'إنجاز جديد!',
    CASE achievement_type
      WHEN 'first_service' THEN 'تهانينا! لقد أضفت أول خدمة لك'
      WHEN 'popular_service' THEN 'تهانينا! أصبحت خدمتك من الخدمات المميزة'
      ELSE 'تهانينا! لقد حققت إنجازاً جديداً'
    END,
    achievement
  );
END;
$$ LANGUAGE plpgsql;