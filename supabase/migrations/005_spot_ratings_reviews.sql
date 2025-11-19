-- Spot Ratings and Reviews
-- Allow users to rate and review surf spots

-- Create spot_ratings table
CREATE TABLE IF NOT EXISTS public.spot_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, spot_id)
);

-- Create spot_reviews table
CREATE TABLE IF NOT EXISTS public.spot_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id TEXT NOT NULL,
  rating_id UUID REFERENCES public.spot_ratings(id) ON DELETE CASCADE,
  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 10 AND char_length(review_text) <= 2000),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  visited_date DATE,
  helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create review_helpful_votes table to track who voted
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.spot_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(review_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spot_ratings_spot_id ON public.spot_ratings(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_ratings_user_id ON public.spot_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_spot_ratings_spot_rating ON public.spot_ratings(spot_id, rating);
CREATE INDEX IF NOT EXISTS idx_spot_reviews_spot_id ON public.spot_reviews(spot_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spot_reviews_user_id ON public.spot_reviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review ON public.review_helpful_votes(review_id);

-- Enable Row Level Security
ALTER TABLE public.spot_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spot_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spot_ratings

-- 1. Anyone can view ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON public.spot_ratings
  FOR SELECT
  USING (true);

-- 2. Authenticated users can insert their own ratings
CREATE POLICY "Authenticated users can insert ratings"
  ON public.spot_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON public.spot_ratings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON public.spot_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for spot_reviews

-- 1. Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.spot_reviews
  FOR SELECT
  USING (true);

-- 2. Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can insert reviews"
  ON public.spot_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON public.spot_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON public.spot_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for review_helpful_votes

-- 1. Anyone can view helpful votes (for counting)
CREATE POLICY "Helpful votes are viewable by everyone"
  ON public.review_helpful_votes
  FOR SELECT
  USING (true);

-- 2. Authenticated users can vote
CREATE POLICY "Authenticated users can vote helpful"
  ON public.review_helpful_votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can remove their own votes
CREATE POLICY "Users can delete their own votes"
  ON public.review_helpful_votes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_spot_ratings_updated_at
  BEFORE UPDATE ON public.spot_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spot_reviews_updated_at
  BEFORE UPDATE ON public.spot_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update helpful_count when votes change
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.spot_reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.spot_reviews
    SET helpful_count = GREATEST(0, helpful_count - 1)
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for helpful count updates
CREATE TRIGGER update_helpful_count_on_vote
  AFTER INSERT OR DELETE ON public.review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Grant permissions
GRANT ALL ON public.spot_ratings TO authenticated;
GRANT SELECT ON public.spot_ratings TO anon;

GRANT ALL ON public.spot_reviews TO authenticated;
GRANT SELECT ON public.spot_reviews TO anon;

GRANT ALL ON public.review_helpful_votes TO authenticated;
GRANT SELECT ON public.review_helpful_votes TO anon;
