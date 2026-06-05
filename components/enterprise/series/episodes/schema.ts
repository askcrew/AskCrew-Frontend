import { z } from "zod";
import { ISeason } from "../seasons/schema";

export const episodeSchema = z.object({
  episode_number: z.string().min(1, "Episode number is required"),
  season_id: z.string().min(1, "Season ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  video: z.string().min(1, "Video is required"),
});

export type Episode = z.infer<typeof episodeSchema>;

export interface IEpisode {
  id: number | string;
  season: ISeason
  episode_number: number;
  title: string;
  description: string;
  video: string;
  views_count: number;
  is_favorite: boolean;
  is_rated: boolean;
  user_rating: number | null;
  rating_mean: number | null;
  rating_count: number;
  art_work_type: string;
  created_at: string;
  updated_at: string;
}

export interface IEpisodes {
  results: IEpisode[];
  count: number;
  next: string | null;
  previous: string | null;
}