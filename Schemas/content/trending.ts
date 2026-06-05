export interface TrendingActor {
  id: number;
  name: string;
  image: string;
}

export interface TrendingCategory {
  id: number;
  name: string;
  image: string | null;
}

export interface TrendingContent {
  id: number;
  name: string;
  about: string;
  price: string;
  cover_image: string;
  actors: TrendingActor[];
  trailer: string;
  views_count: number;
  category: TrendingCategory;
  is_ready: boolean;
  admin_approved: boolean;
  admin_approved_at: string | null;
  admin_approved_by: number | null;
  video: string;
  is_favorite: boolean;
  is_rated: boolean;
  user_rating: number | null;
  rating_mean: number;
  rating_count: number;
  art_work_type: string;
  created_at: string;
  updated_at: string;
}

export interface TrendingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TrendingContent[];
}
