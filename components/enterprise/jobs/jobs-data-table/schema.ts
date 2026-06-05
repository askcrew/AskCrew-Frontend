import { z } from "zod";

export const jobSchema = z.object({
  id: z.number(),
  company_name: z.string(),
  job_title: z.string(),
  about: z.string(),
  is_active: z.boolean(),
  image: z.string().nullable(),
  author: z.number(),
  author_name: z.string(),
  author_specification: z.string().nullable(),
  applications_count: z.number(),
  applied: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Job = z.infer<typeof jobSchema>;
