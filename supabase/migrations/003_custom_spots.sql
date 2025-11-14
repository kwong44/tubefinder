-- Custom Spots Table
-- Allows users to create and share their own surf spots

-- Create custom_spots table
CREATE TABLE IF NOT EXISTS public.custom_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reef', 'beach', 'point', 'unknown')),
  description TEXT,
  best_swell_direction TEXT,
  best_wind_direction TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_spots_user_id ON public.custom_spots(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_spots_location ON public.custom_spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_custom_spots_created_at ON public.custom_spots(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.custom_spots ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Anyone can view public custom spots
CREATE POLICY "Public custom spots are viewable by everyone"
  ON public.custom_spots
  FOR SELECT
  USING (is_public = true);

-- 2. Users can view their own private spots
CREATE POLICY "Users can view their own custom spots"
  ON public.custom_spots
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Authenticated users can create spots
CREATE POLICY "Authenticated users can create custom spots"
  ON public.custom_spots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can update their own spots
CREATE POLICY "Users can update their own custom spots"
  ON public.custom_spots
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Users can delete their own spots
CREATE POLICY "Users can delete their own custom spots"
  ON public.custom_spots
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_spots_updated_at
  BEFORE UPDATE ON public.custom_spots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.custom_spots TO authenticated;
GRANT SELECT ON public.custom_spots TO anon;
