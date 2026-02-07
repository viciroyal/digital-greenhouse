-- Drop and recreate storage policies with correct path handling
DROP POLICY IF EXISTS "Users can upload their own field journal files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own field journal files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own field journal files" ON storage.objects;

-- Recreate with correct policy logic
-- The path format is: {user_id}/{lesson_id}/{timestamp}-{filename}
-- storage.foldername returns array of folder parts

CREATE POLICY "Users can upload their own field journal files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'field-journal' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own field journal files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'field-journal' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own field journal files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'field-journal' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Also add UPDATE policy for completeness
CREATE POLICY "Users can update their own field journal files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'field-journal' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);