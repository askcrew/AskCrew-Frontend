import { z } from "zod";

export const appliedJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  company: z.string(),
  description: z.string(),
  status: z.enum(["upcoming", "ongoing", "concluded"]),
  location: z.string(),
  salary: z.string(),
  type: z.enum(["full-time", "part-time", "contract", "freelance"]),
  hasReviewed: z.boolean().optional(),
});

export type AppliedJob = z.infer<typeof appliedJobSchema>;

export interface ApplicantJob {
  applicant: number;
  applicant_image: string[]; // Assuming array of image URLs or paths
  applicant_name: string;
  created_at: string;
  id: number;
  is_seen: boolean;
  job: number;
  job_company: string;
  job_title: string;
  status: string;
  updated_at: string;
}
