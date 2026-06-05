import { z } from "zod";

export const movieSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .int("Must be an integer")
    .positive("Must be a positive number")
    .nonnegative("Price is required"),
  about: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  trailer: z.string().min(1, "Trailer is required"),
  video: z.string().min(1, "Video is required"),
});

export type MovieFormData = z.infer<typeof movieSchema>;

export interface Category {
  id: number;
  name: string;
  image: string | null;
}

export interface IMovie {
  id: number;
  name: string;
  about: string;
  price: string;
  cover_image: string;
  actors: any[];
  trailer: string;
  views_count: number;
  category: Category;
  is_ready: boolean;
  admin_approved: boolean;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
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
