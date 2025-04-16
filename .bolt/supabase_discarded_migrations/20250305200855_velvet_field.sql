/*
  # إنشاء نظام التقييمات

  1. الجداول الجديدة
    - `reviews` - جدول التقييمات:
      - `id` - معرف التقييم
      - `reviewer_id` - معرف المقيم
      - `reviewed_id` - معرف الشخص المقيم
      - `service_id` - معرف الخدمة (اختياري)
      - `rating` - التقييم (1-5)
      - `comment` - التعليق
      - `created_at` - تاريخ الإنشاء

  2. الأمان
    - تمكين RLS
    - إضافة سياسات للقراءة والكتابة
*/

-- إنشاء جدول التقييمات
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  
  -- منع المستخدم من تقييم نفسه
  CONSTRAINT cannot_review_self CHECK (reviewer_id != reviewed_id)
);

-- تمكين RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- سياسات RLS
CREATE POLICY "يمكن للجميع قراءة التقييمات"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "يمكن للمستخدم إضافة تقييم"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "يمكن للمستخدم تعديل تقييمه"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "يمكن للمستخدم حذف تقييمه"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- إنشاء الفهارس
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_reviews_service ON reviews(service_id);

-- دالة لتحديث متوسط التقييم
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- تحديث تقييم المستخدم المقيم
  UPDATE profiles
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE reviewed_id = NEW.reviewed_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewed_id = NEW.reviewed_id
    )
  WHERE id = NEW.reviewed_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المحفز
CREATE TRIGGER update_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_profile_rating();