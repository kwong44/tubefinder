import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/services/supabase-client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { FavoriteSpot } from '@/lib/types/favorites';

/**
 * Hook to manage user's favorite spots
 * Provides queries and mutations with optimistic updates
 */
export function useFavorites() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Query to fetch user's favorites
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery<FavoriteSpot[]>({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorite_spots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to add a favorite
  const addFavorite = useMutation({
    mutationFn: async (spotId: string) => {
      if (!user) throw new Error('User must be signed in');

      const { data, error } = await supabase
        .from('favorite_spots')
        .insert({ user_id: user.id, spot_id: spotId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (spotId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<FavoriteSpot[]>([
        'favorites',
        user?.id,
      ]);

      // Optimistically update
      queryClient.setQueryData<FavoriteSpot[]>(
        ['favorites', user?.id],
        (old = []) => [
          ...old,
          {
            id: `temp-${Date.now()}`,
            user_id: user?.id || '',
            spot_id: spotId,
            created_at: new Date().toISOString(),
          },
        ]
      );

      return { previousFavorites };
    },
    onError: (error, spotId, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          ['favorites', user?.id],
          context.previousFavorites
        );
      }
      console.error('Failed to add favorite:', error);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  // Mutation to remove a favorite
  const removeFavorite = useMutation({
    mutationFn: async (spotId: string) => {
      if (!user) throw new Error('User must be signed in');

      const { error } = await supabase
        .from('favorite_spots')
        .delete()
        .eq('user_id', user.id)
        .eq('spot_id', spotId);

      if (error) throw error;
    },
    onMutate: async (spotId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<FavoriteSpot[]>([
        'favorites',
        user?.id,
      ]);

      // Optimistically update
      queryClient.setQueryData<FavoriteSpot[]>(
        ['favorites', user?.id],
        (old = []) => old.filter((fav) => fav.spot_id !== spotId)
      );

      return { previousFavorites };
    },
    onError: (error, spotId, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          ['favorites', user?.id],
          context.previousFavorites
        );
      }
      console.error('Failed to remove favorite:', error);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  // Helper to check if a spot is favorited
  const isFavorite = (spotId: string) => {
    return favorites.some((fav) => fav.spot_id === spotId);
  };

  // Helper to toggle favorite status
  const toggleFavorite = async (spotId: string) => {
    if (!user) {
      throw new Error('Please sign in to save favorites');
    }

    if (isFavorite(spotId)) {
      await removeFavorite.mutateAsync(spotId);
    } else {
      await addFavorite.mutateAsync(spotId);
    }
  };

  return {
    favorites,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    addFavorite: addFavorite.mutateAsync,
    removeFavorite: removeFavorite.mutateAsync,
    isAdding: addFavorite.isPending,
    isRemoving: removeFavorite.isPending,
  };
}
