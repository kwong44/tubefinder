'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createClient } from '@/lib/services/supabase-client';
import type { SpotReview, ReviewWithUser, SubmitReviewInput, UpdateReviewInput } from '@/lib/types/ratings';

const REVIEWS_PER_PAGE = 10;

/**
 * Hook to fetch and manage spot reviews
 */
export function useSpotReviews(spotId: string, page: number = 1) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch reviews for a spot with pagination
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery<{ reviews: ReviewWithUser[]; totalCount: number }>({
    queryKey: ['reviews', spotId, page],
    queryFn: async () => {
      const from = (page - 1) * REVIEWS_PER_PAGE;
      const to = from + REVIEWS_PER_PAGE - 1;

      // Get reviews with user email and rating joined
      const { data, error, count } = await supabase
        .from('spot_reviews')
        .select(`
          *,
          rating:spot_ratings!rating_id(rating),
          user:auth.users!user_id(email)
        `, { count: 'exact' })
        .eq('spot_id', spotId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Transform data to include rating value and user email
      const reviews: ReviewWithUser[] = (data || []).map((review: any) => ({
        ...review,
        rating: review.rating?.rating,
        user_email: review.user?.email,
      }));

      return {
        reviews,
        totalCount: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch user's review for this spot
  const {
    data: userReview,
    isLoading: isLoadingUserReview,
  } = useQuery<SpotReview | null>({
    queryKey: ['userReview', spotId, user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('spot_reviews')
        .select('*')
        .eq('spot_id', spotId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Submit new review (with rating)
  const submitReview = useMutation({
    mutationFn: async (input: SubmitReviewInput) => {
      if (!user) throw new Error('User must be signed in');

      // First, upsert the rating
      const { data: ratingData, error: ratingError } = await supabase
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

      if (ratingError) throw ratingError;

      // Then insert or update the review
      const reviewPayload = {
        user_id: user.id,
        spot_id: input.spot_id,
        rating_id: ratingData.id,
        review_text: input.review_text,
        experience_level: input.experience_level || null,
        visited_date: input.visited_date || null,
      };

      // Check if review exists
      const { data: existingReview } = await supabase
        .from('spot_reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('spot_id', input.spot_id)
        .single();

      let reviewData;
      if (existingReview) {
        // Update existing review
        const { data, error } = await supabase
          .from('spot_reviews')
          .update({
            ...reviewPayload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingReview.id)
          .select()
          .single();

        if (error) throw error;
        reviewData = data;
      } else {
        // Insert new review
        const { data, error } = await supabase
          .from('spot_reviews')
          .insert(reviewPayload)
          .select()
          .single();

        if (error) throw error;
        reviewData = data;
      }

      return reviewData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', spotId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', spotId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['ratings', spotId] });
      queryClient.invalidateQueries({ queryKey: ['userRating', spotId, user?.id] });
    },
  });

  // Update existing review
  const updateReview = useMutation({
    mutationFn: async ({ reviewId, input }: { reviewId: string; input: UpdateReviewInput }) => {
      if (!user) throw new Error('User must be signed in');

      const { data, error } = await supabase
        .from('spot_reviews')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', spotId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', spotId, user?.id] });
    },
  });

  // Delete review
  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error('User must be signed in');

      const { error } = await supabase
        .from('spot_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', spotId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', spotId, user?.id] });
    },
  });

  // Vote helpful on a review
  const voteHelpful = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error('User must be signed in');

      // Check if already voted
      const { data: existingVote } = await supabase
        .from('review_helpful_votes')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Remove vote
        const { error } = await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add vote
        const { error } = await supabase
          .from('review_helpful_votes')
          .insert({
            review_id: reviewId,
            user_id: user.id,
          });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', spotId] });
    },
  });

  // Check if user voted helpful on a review
  const { data: helpfulVotes = {} } = useQuery<Record<string, boolean>>({
    queryKey: ['helpfulVotes', spotId, user?.id],
    queryFn: async () => {
      if (!user) return {};

      const { data, error } = await supabase
        .from('review_helpful_votes')
        .select('review_id')
        .eq('user_id', user.id)
        .in('review_id', reviewsData?.reviews.map(r => r.id) || []);

      if (error) throw error;

      const votes: Record<string, boolean> = {};
      (data || []).forEach(vote => {
        votes[vote.review_id] = true;
      });

      return votes;
    },
    enabled: !!user && !!reviewsData,
    staleTime: 5 * 60 * 1000,
  });

  const totalPages = reviewsData ? Math.ceil(reviewsData.totalCount / REVIEWS_PER_PAGE) : 0;

  return {
    reviews: reviewsData?.reviews || [],
    totalCount: reviewsData?.totalCount || 0,
    totalPages,
    currentPage: page,
    userReview,
    helpfulVotes,
    isLoading,
    isLoadingUserReview,
    error,
    submitReview,
    updateReview,
    deleteReview,
    voteHelpful,
    isSubmitting: submitReview.isPending,
    isUpdating: updateReview.isPending,
    isDeleting: deleteReview.isPending,
    isVoting: voteHelpful.isPending,
  };
}
