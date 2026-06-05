export type MovieFromPaidSubs = {
  id: number;
  name: string;
  about: string;
  price: string;
  cover_image: string;
  actors: [];
  trailer: string;
  views_count: number;
  category: {
    id: number;
    name: string;
    image: string | null;
  };
  is_ready: boolean;
  admin_approved: boolean;
  admin_approved_at: string | null;
  admin_approved_by: number | string | null;
  video: string;
  is_favorite: boolean;
  is_rated: boolean;
  is_paid: boolean;
  user_rating: number | null;
  rating_mean: number;
  rating_count: number;
  art_work_type: string;
  created_at: string;
  updated_at: string;
};

export type PaidSusResponse = {
  movies: MovieFromPaidSubs[];
  series: [];
  advertise: [];
  total_count: number;
};
