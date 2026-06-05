import { z } from "zod";

export const seriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  about: z.string(),
  cover_photo: z.string(),
  category: z.string(),
  episodesCount: z.number(),
  viewsCount: z.number(),
  rating: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Series = z.infer<typeof seriesSchema>;

export interface ISeries {
  id: number;
  title: string;
  about: string;
  cover_photo: string;
  category: {
    id: number;
    name: string;
    image: string | null;
  };
  seasons_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}
