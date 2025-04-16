/*
  # Fix RLS Policies for Database Tables

  1. Changes
    - Add DO block to safely handle policy creation
    - Check for existing policies before creating new ones
    - Add proper error handling

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add proper access controls
*/

-- تمكين RLS على جميع الجداول
DO $$ 
BEGIN
  -- تمكين RLS
  ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS providers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS service_features ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS service_areas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS delivery_options ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS phone_verification_codes ENABLE ROW LEVEL SECURITY;

  -- إضافة سياسات الأمان للملفات الشخصية
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_insert_policy') THEN
    CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select_policy') THEN
    CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_update_policy') THEN
    CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_delete_policy') THEN
    CREATE POLICY "profiles_delete_policy" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);
  END IF;

  -- إضافة سياسات الأمان لمقدمي الخدمات
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'providers' AND policyname = 'providers_read_policy') THEN
    CREATE POLICY "providers_read_policy" ON providers FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'providers' AND policyname = 'providers_update_policy') THEN
    CREATE POLICY "providers_update_policy" ON providers FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  -- إضافة سياسات الأمان للخدمات
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'services_read_policy') THEN
    CREATE POLICY "services_read_policy" ON services FOR SELECT TO authenticated USING (status = 'active' OR provider_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'services_insert_policy') THEN
    CREATE POLICY "services_insert_policy" ON services FOR INSERT TO authenticated WITH CHECK (provider_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'services_update_policy') THEN
    CREATE POLICY "services_update_policy" ON services FOR UPDATE TO authenticated USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'services_delete_policy') THEN
    CREATE POLICY "services_delete_policy" ON services FOR DELETE TO authenticated USING (provider_id = auth.uid());
  END IF;

  -- إضافة سياسات الأمان لمميزات الخدمات
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_features' AND policyname = 'service_features_read_policy') THEN
    CREATE POLICY "service_features_read_policy" ON service_features FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_features' AND policyname = 'service_features_all_policy') THEN
    CREATE POLICY "service_features_all_policy" ON service_features FOR ALL TO authenticated 
    USING (EXISTS (
      SELECT 1 FROM services WHERE services.id = service_features.service_id AND services.provider_id = auth.uid()
    ));
  END IF;

  -- إضافة سياسات الأمان لمناطق التغطية
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_areas' AND policyname = 'service_areas_read_policy') THEN
    CREATE POLICY "service_areas_read_policy" ON service_areas FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_areas' AND policyname = 'service_areas_all_policy') THEN
    CREATE POLICY "service_areas_all_policy" ON service_areas FOR ALL TO authenticated 
    USING (EXISTS (
      SELECT 1 FROM services WHERE services.id = service_areas.service_id AND services.provider_id = auth.uid()
    ));
  END IF;

  -- إضافة سياسات الأمان لخيارات التوصيل
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'delivery_options' AND policyname = 'delivery_options_read_policy') THEN
    CREATE POLICY "delivery_options_read_policy" ON delivery_options FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'delivery_options' AND policyname = 'delivery_options_all_policy') THEN
    CREATE POLICY "delivery_options_all_policy" ON delivery_options FOR ALL TO authenticated 
    USING (EXISTS (
      SELECT 1 FROM services WHERE services.id = delivery_options.service_id AND services.provider_id = auth.uid()
    ));
  END IF;

  -- إضافة سياسات الأمان لرموز التحقق
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'phone_verification_codes' AND policyname = 'phone_verification_codes_insert_policy') THEN
    CREATE POLICY "phone_verification_codes_insert_policy" ON phone_verification_codes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'phone_verification_codes' AND policyname = 'phone_verification_codes_read_policy') THEN
    CREATE POLICY "phone_verification_codes_read_policy" ON phone_verification_codes FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;