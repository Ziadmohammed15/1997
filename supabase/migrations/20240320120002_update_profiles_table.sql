-- أضف هذه الحقول لجدول profiles إذا لم تكن موجودة
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS social_links JSONB,
ADD COLUMN IF NOT EXISTS preferences JSONB,
ADD COLUMN IF NOT EXISTS achievements JSONB;