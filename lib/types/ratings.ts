// Spot ratings and reviews type definitions

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SpotRating {
  id: string;
  user_id: string;
  spot_id: string;
  rating: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface SpotReview {
  id: string;
  user_id: string;
  spot_id: string;
  rating_id: string;
  review_text: string;
  experience_level?: ExperienceLevel | null;
  visited_date?: string | null;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUser extends SpotReview {
  user_email?: string;
  rating?: number; // Joined from spot_ratings
}

export interface RatingSummary {
  spot_id: string;
  average_rating: number;
  total_ratings: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface SubmitRatingInput {
  spot_id: string;
  rating: number;
}

export interface SubmitReviewInput {
  spot_id: string;
  rating: number;
  review_text: string;
  experience_level?: ExperienceLevel;
  visited_date?: string; // ISO date string
}

export interface UpdateReviewInput {
  review_text?: string;
  experience_level?: ExperienceLevel;
  visited_date?: string;
}

export interface ReviewHelpfulVote {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;
}
