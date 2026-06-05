import { z } from "zod";

export const workshopSchema = z.object({
  id: z.string(),
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  number_of_participants: z.number(),
  description: z.string(),
  location: z.string().optional(),
  specialization: z.string().optional(),
  cover_image: z.string().optional(),
});

export type Workshop = z.infer<typeof workshopSchema>;

export const workshopCreateSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  cover_image: z.any().optional(),
  location: z.string().nonempty("Location is required"),
  start_date: z.string().nonempty("Start date is required"),
  end_date: z.string().optional(),
  start_time: z.string().nonempty("Start time is required"),
  end_time: z.string().optional(),
  specialization: z.string().nonempty("Specialization is required"),
  number_of_participants: z
    .number({ invalid_type_error: "Must be a number" })
    .int("Must be an integer")
    .positive("Must be a positive number")
    .nonnegative("Number of participants is required"),
});
export type WorkshopCreateSchemaType = z.infer<typeof workshopCreateSchema>;

export interface WorkshopApplication {
  id: number;
  registration_date: string;
  status: string;
  user: number;
  user_email: string;
  user_fullname: string;
  user_photo: string;
  user_rating_count: number;
  user_rating_mean: number;
  workshop: number;
}

export interface AppliedWorkshops {
  next: string | null;
  prev: string | null;
  results: WorkshopApplication[];
  count: number;
}
