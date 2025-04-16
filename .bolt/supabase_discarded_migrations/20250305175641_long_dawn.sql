/*
  # Create Storage Bucket for Profile Images

  1. New Storage Bucket
    - Creates a new public bucket for storing profile images
    - Enables RLS policies for secure access

  2. Security
    - Enables RLS on the storage bucket
    - Adds policies for authenticated users to manage their own images
*/

-- Create a new public bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile_images', 'profile_images', true);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile_images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to update their own images
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile_images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profile_images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public read access to profile images
CREATE POLICY "Public read access to profile images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile_images');