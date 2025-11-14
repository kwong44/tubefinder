export interface FavoriteSpot {
  id: string;
  user_id: string;
  spot_id: string;
  created_at: string;
}

export interface FavoritesResponse {
  favorites: FavoriteSpot[];
}
