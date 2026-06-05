import { z } from "zod";
import { ISeries } from "../schema";


const actorSchema = z.object({
  name: z.string().min(1, "Actor name is required"),
  image: z.string().optional(),
});

 export const seasonSchema = z.object({
  season_number: z.string().min(1, "Season number is required"),
  series_id: z.string().min(1, "Series ID is required"),
  // title: z.string().min(2, "Title is required"),
  price: z.string().min(1, "Price is required"),
  // release_date: z.string().min(1, "Release date is required"),
  actors: z.array(actorSchema).min(1, "At least one actor is required"),
  trailer: z.string().min(1, "Trailer is required"),
});

export type SeasonFormValues = z.infer<typeof seasonSchema>;

export interface IActor {
  id: number;
  name: string;
  image?: string;
}

export interface ISeason {
  id: number;
  series: ISeries;
  season_number: number;
  title: string;
  cover_photo: string;
  trailer: string;
  price: string;
  actors: IActor[];
  episodes_count: number;
  release_date?: string;
  created_at: string;
  updated_at: string;
  art_work_type: string;
}
