-- First, disable RLS to reset everything
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Then enable it again
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to wine images" ON storage.objects;

-- Create a single policy for authenticated users to do everything
CREATE POLICY "Allow authenticated users full access to wine-images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'wine-images')
WITH CHECK (bucket_id = 'wine-images');

-- Create a policy for public read access
CREATE POLICY "Allow public read access to wine-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'wine-images');

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert into wine-images bucket
CREATE POLICY "Allow authenticated users to insert into wine-images bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'wine-images');

-- Create policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'wine-images' AND owner = auth.uid());

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'wine-images' AND owner = auth.uid());

-- Create policy to allow public read access to wine-images bucket
CREATE POLICY "Allow public read access to wine-images bucket"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'wine-images'); 