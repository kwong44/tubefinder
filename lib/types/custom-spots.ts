// Custom spots type definitions

export interface CustomSpot {
  id: string;
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'reef' | 'beach' | 'point' | 'unknown';
  description?: string | null;
  best_swell_direction?: string | null;
  best_wind_direction?: string | null;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomSpotInput {
  name: string;
  latitude: number;
  longitude: number;
  type: 'reef' | 'beach' | 'point' | 'unknown';
  description?: string;
  best_swell_direction?: string;
  best_wind_direction?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_public?: boolean;
}

export interface UpdateCustomSpotInput {
  name?: string;
  latitude?: number;
  longitude?: number;
  type?: 'reef' | 'beach' | 'point' | 'unknown';
  description?: string;
  best_swell_direction?: string;
  best_wind_direction?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_public?: boolean;
}
