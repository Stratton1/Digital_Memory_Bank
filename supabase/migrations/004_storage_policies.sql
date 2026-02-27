-- ============================================================
-- Migration 004: Storage policies for memory-photos bucket
-- ============================================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'memory-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to view all photos (needed for shared memories)
CREATE POLICY "Anyone can view memory photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'memory-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'memory-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access (bucket is public)
CREATE POLICY "Public read access for memory photos"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'memory-photos');
