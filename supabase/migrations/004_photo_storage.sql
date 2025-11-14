-- Photo Storage Bucket
-- Setup for storing spot photos with public access

-- Create storage bucket for spot photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('spot-photos', 'spot-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for spot photos

-- 1. Anyone can view public photos
CREATE POLICY "Public photos are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spot-photos');

-- 2. Authenticated users can upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'spot-photos' AND
    auth.role() = 'authenticated'
  );

-- 3. Users can update their own photos
CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'spot-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Users can delete their own photos
CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'spot-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create spot_photos table to track photo metadata
CREATE TABLE IF NOT EXISTS public.spot_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id TEXT NOT NULL, -- Can reference custom_spots.id or FAMOUS_SPOTS id
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_spot_photos_spot_id ON public.spot_photos(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_photos_user_id ON public.spot_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_spot_photos_created_at ON public.spot_photos(created_at DESC);

-- Enable RLS
ALTER TABLE public.spot_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spot_photos

-- 1. Anyone can view photo metadata
CREATE POLICY "Photo metadata is viewable by everyone"
  ON public.spot_photos
  FOR SELECT
  USING (true);

-- 2. Authenticated users can insert photo metadata
CREATE POLICY "Authenticated users can insert photo metadata"
  ON public.spot_photos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own photo metadata
CREATE POLICY "Users can update their own photo metadata"
  ON public.spot_photos
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own photo metadata
CREATE POLICY "Users can delete their own photo metadata"
  ON public.spot_photos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.spot_photos TO authenticated;
GRANT SELECT ON public.spot_photos TO anon;
