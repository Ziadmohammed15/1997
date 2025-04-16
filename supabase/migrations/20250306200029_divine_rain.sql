/*
  # Create Storage Bucket for Services

  1. New Storage
    - Creates a new public bucket called 'services' for storing service images
    - Enables public access for reading images
    - Sets up security policies for image uploads

  2. Security
    - Only authenticated users can upload images
    - Users can only delete their own images
    - Everyone can view images
*/

-- Create a new storage bucket for services
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true);

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'services');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'services'
  AND owner = auth.uid()
);

-- Allow users to update and delete their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'services' AND owner = auth.uid());

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services' AND owner = auth.uid());