import { z } from "zod";

export const questionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  answersCount: z.number(),
  viewsCount: z.number(),
  status: z.enum(["open", "answered", "closed"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Question = z.infer<typeof questionSchema>;
