/*
  # Add Media Support to Chat System

  1. Updates
    - Add media type and URL to messages table
    - Create storage buckets for chat media
  
  2. Security
    - Enable RLS on storage buckets
    - Add policies for authenticated users
*/

-- Add media columns to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS type text DEFAULT 'text'::text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url text;

-- Add check constraint for message type
ALTER TABLE messages ADD CONSTRAINT messages_type_check 
  CHECK (type IN ('text', 'image', 'voice', 'location'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name)
VALUES 
  ('chat_images', 'Chat Images'),
  ('chat_audio', 'Chat Audio')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for chat images
CREATE POLICY "Users can upload chat images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat_images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read chat images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat_images');

-- Storage policies for chat audio
CREATE POLICY "Users can upload chat audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat_audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read chat audio"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat_audio');