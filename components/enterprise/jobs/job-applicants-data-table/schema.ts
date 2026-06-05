import { z } from "zod";

export const jobApplicantSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  specification: z.string(),
  profile: z.enum(["student", "enterprise"]),
  email: z.email(),
  skills: z.array(z.string()),
  location: z.string(),
  education: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
  experience: z.string(),
  portfolio: z.url().optional(),
});

export type JobApplicant = z.infer<typeof jobApplicantSchema>;
