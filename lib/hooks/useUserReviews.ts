import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/services/supabase-client';
import type { ReviewWithUser } from '@/lib/types/ratings';

export function useUserReviews(userId: string | undefined) {
  const supabase = createClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['userReviews', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('spot_reviews')
        .select(`
          *,
          rating:spot_ratings!rating_id(rating)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to include rating
      const reviewsWithRating: ReviewWithUser[] = (data || []).map((review: any) => ({
        ...review,
        rating: review.rating?.rating,
        user_email: null, // Not needed for own reviews
      }));

      return reviewsWithRating;
    },
    enabled: !!userId,
  });

  return {
    reviews,
    reviewCount: reviews.length,
    isLoading,
    error,
  };
}
