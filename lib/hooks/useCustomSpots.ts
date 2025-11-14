'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createClient } from '@/lib/services/supabase-client';
import type { CustomSpot, CreateCustomSpotInput, UpdateCustomSpotInput } from '@/lib/types/custom-spots';
import type { Spot } from '@/lib/types';

/**
 * Hook for managing custom user-created surf spots
 * Provides CRUD operations with React Query for caching and optimistic updates
 */
export function useCustomSpots() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch all custom spots (public + user's private spots)
  const {
    data: customSpots = [],
    isLoading,
    error,
  } = useQuery<CustomSpot[]>({
    queryKey: ['customSpots', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create a new custom spot
  const createSpot = useMutation({
    mutationFn: async (input: CreateCustomSpotInput) => {
      if (!user) throw new Error('User must be signed in');

      const { data, error } = await supabase
        .from('custom_spots')
        .insert({
          user_id: user.id,
          ...input,
          is_public: input.is_public ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSpots'] });
    },
  });

  // Update an existing custom spot
  const updateSpot = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateCustomSpotInput }) => {
      if (!user) throw new Error('User must be signed in');

      const { data, error } = await supabase
        .from('custom_spots')
        .update(input)
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user owns the spot
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSpots'] });
    },
  });

  // Delete a custom spot
  const deleteSpot = useMutation({
    mutationFn: async (spotId: string) => {
      if (!user) throw new Error('User must be signed in');

      const { error } = await supabase
        .from('custom_spots')
        .delete()
        .eq('id', spotId)
        .eq('user_id', user.id); // Ensure user owns the spot

      if (error) throw error;
    },
    onMutate: async (spotId: string) => {
      // Optimistically update the cache
      await queryClient.cancelQueries({ queryKey: ['customSpots', user?.id] });
      const previousSpots = queryClient.getQueryData<CustomSpot[]>(['customSpots', user?.id]);

      queryClient.setQueryData<CustomSpot[]>(['customSpots', user?.id], (old = []) =>
        old.filter((spot) => spot.id !== spotId)
      );

      return { previousSpots };
    },
    onError: (error, spotId, context) => {
      // Rollback on error
      if (context?.previousSpots) {
        queryClient.setQueryData(['customSpots', user?.id], context.previousSpots);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customSpots'] });
    },
  });

  // Convert CustomSpot to Spot format for compatibility with existing components
  const convertToSpot = (customSpot: CustomSpot): Spot => {
    // Parse direction strings (e.g., "N", "NW", "270") to degrees
    const parseDirection = (dir?: string | null): number => {
      if (!dir) return 0;

      const dirMap: Record<string, number> = {
        N: 0, NNE: 22.5, NE: 45, ENE: 67.5,
        E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
        S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
        W: 270, WNW: 292.5, NW: 315, NNW: 337.5,
      };

      const upper = dir.toUpperCase();
      if (dirMap[upper] !== undefined) return dirMap[upper];

      const num = parseFloat(dir);
      return isNaN(num) ? 0 : num;
    };

    return {
      id: customSpot.id,
      name: customSpot.name,
      location: {
        lat: customSpot.latitude,
        lng: customSpot.longitude,
      },
      type: customSpot.type,
      facing: parseDirection(customSpot.best_swell_direction),
      optimalSwell: {
        minHeight: 1.0,
        maxHeight: 3.0,
        direction: parseDirection(customSpot.best_swell_direction),
        minPeriod: 8,
      },
      optimalWind: {
        direction: parseDirection(customSpot.best_wind_direction),
        maxSpeed: 10,
      },
      discovered: true,
      description: customSpot.description || undefined,
      photos: [],
    };
  };

  // Convert all custom spots to Spot format
  const customSpotsAsSpots: Spot[] = customSpots.map(convertToSpot);

  // Check if user owns a specific spot
  const isOwnSpot = (spotId: string): boolean => {
    if (!user) return false;
    return customSpots.some((spot) => spot.id === spotId && spot.user_id === user.id);
  };

  return {
    customSpots,
    customSpotsAsSpots,
    isLoading,
    error,
    createSpot,
    updateSpot,
    deleteSpot,
    isOwnSpot,
    isCreating: createSpot.isPending,
    isUpdating: updateSpot.isPending,
    isDeleting: deleteSpot.isPending,
  };
}
