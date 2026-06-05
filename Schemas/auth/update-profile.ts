import { z } from "zod";

export const updateProfileSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().optional(), // Read-only field
  mobile_phone: z.string().optional(), // Read-only field
  profile_photo: z.instanceof(File).optional(),
  personal_info: z.string().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export interface UpdateProfileResponse {
  message: string;
  success: boolean;
  data?: any;
}
