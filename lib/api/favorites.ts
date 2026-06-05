import axiosInstance from "@/lib/axiosInstance";

// Define strict types for nested objects based on user JSON
export interface Category {
  id: number;
  name: string;
  image: string | null;
}

export interface Actor {
  id: number;
  name: string;
  image: string;
}

export interface FavoriteContent {
  id: number;
  name?: string;
  title?: string;
  about?: string;
  description?: string;
  price?: string;
  cover_image?: string;
  cover_photo?: string;
  trailer?: string;
  views_count?: number;
  category?: Category;
  is_ready?: boolean;
  admin_approved?: boolean;
  admin_approved_at?: string | null;
  admin_approved_by?: number | null;
  video?: string;
  is_favorite?: boolean;
  is_rated?: boolean;
  is_paid?: boolean;
  user_rating?: number | null;
  rating_mean?: number;
  rating_count?: number;
  art_work_type?: string;
  created_at: string;
  updated_at?: string;
  actors?: Actor[];
}

export interface FavoriteItem {
  id: number;
  user: string;
  content_type: number;
  object_id: number;
  created_at: string;
  content_object: FavoriteContent;
}

export interface FavoritesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FavoriteItem[];
}

export interface AddFavoritePayload {
  content_type: "movie" | "series";
  object_id: number;
}

export interface RemoveFavoritePayload {
  content_type: "movie" | "series";
  object_id: number;
}

const favoritesApi = {
  getFavorites: async (page = 1): Promise<FavoritesResponse> => {
    const response = await axiosInstance.get<FavoritesResponse>(
      `/content/favorites/?page=${page}`,
    );
    return response.data;
  },

  addToFavorites: async (payload: AddFavoritePayload): Promise<unknown> => {
    const response = await axiosInstance.post(
      "/content/favorites/add/",
      payload,
    );
    return response.data;
  },

  removeFromFavorites: async (
    payload: RemoveFavoritePayload,
  ): Promise<unknown> => {
    const response = await axiosInstance.delete("/content/favorites/remove/", {
      data: payload,
    });
    return response.data;
  },
};

export default favoritesApi;
