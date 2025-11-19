'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createClient } from '@/lib/services/supabase-client';
import type { SpotRating, RatingSummary, SubmitRatingInput } from '@/lib/types/ratings';

/**
 * Hook to fetch and manage spot ratings
 */
export function useSpotRatings(spotId: string) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch all ratings for a spot
  const {
    data: ratings = [],
    isLoading: isLoadingRatings,
    error: ratingsError,
  } = useQuery<SpotRating[]>({
    queryKey: ['ratings', spotId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spot_ratings')
        .select('*')
        .eq('spot_id', spotId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user's rating for this spot
  const {
    data: userRating,
    isLoading: isLoadingUserRating,
  } = useQuery<SpotRating | null>({
    queryKey: ['userRating', spotId, user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('spot_ratings')
        .select('*')
        .eq('spot_id', spotId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Calculate rating summary
  const ratingSummary: RatingSummary | null = ratings.length > 0 ? {
    spot_id: spotId,
    average_rating: ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length,
    total_ratings: ratings.length,
    rating_distribution: {
      1: ratings.filter(r => r.rating === 1).length,
      2: ratings.filter(r => r.rating === 2).length,
      3: ratings.filter(r => r.rating === 3).length,
      4: ratings.filter(r => r.rating === 4).length,
      5: ratings.filter(r => r.rating === 5).length,
    },
  } : null;

  // Submit or update rating
  const submitRating = useMutation({
    mutationFn: async (input: SubmitRatingInput) => {
      if (!user) throw new Error('User must be signed in');

      // Upsert (insert or update if exists)
      const { data, error } = await supabase
        .from('spot_ratings')
        .upsert({
          user_id: user.id,
          spot_id: input.spot_id,
          rating: input.rating,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,spot_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['ratings', spotId] });
      queryClient.invalidateQueries({ queryKey: ['userRating', spotId, user?.id] });
    },
  });

  // Delete rating
  const deleteRating = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User must be signed in');

      const { error } = await supabase
        .from('spot_ratings')
        .delete()
        .eq('spot_id', spotId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', spotId] });
      queryClient.invalidateQueries({ queryKey: ['userRating', spotId, user?.id] });
    },
  });

  return {
    ratings,
    ratingSummary,
    userRating,
    isLoadingRatings,
    isLoadingUserRating,
    ratingsError,
    submitRating,
    deleteRating,
    isSubmitting: submitRating.isPending,
    isDeleting: deleteRating.isPending,
  };
}
