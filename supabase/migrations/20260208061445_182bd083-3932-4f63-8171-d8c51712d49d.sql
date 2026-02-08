-- Add admin storage policy for field-journal bucket to allow Hogon review access
CREATE POLICY "Admins can view all field journal files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'field-journal'
  AND public.has_role(auth.uid(), 'admin')
);

-- Add admin delete policy for moderation purposes
CREATE POLICY "Admins can delete field journal files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'field-journal'
  AND public.has_role(auth.uid(), 'admin')
);

-- Configure storage bucket with file size and type limits
UPDATE storage.buckets
SET 
  file_size_limit = 10485760,  -- 10MB in bytes
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ]
WHERE id = 'field-journal';