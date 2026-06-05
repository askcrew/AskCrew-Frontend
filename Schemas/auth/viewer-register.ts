import { z } from "zod";

export const viewerRegisterSchema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  mobile_phone: z
    .string()
    .min(1, "Mobile phone is required")
    .min(10, "Mobile phone must be at least 10 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  profile_photo: z
    .instanceof(File, { message: "Profile photo is required" })
    .optional(),
  personal_info: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
});

export type ViewerRegisterFormData = z.infer<typeof viewerRegisterSchema>;

export interface ViewerRegisterResponse {
  message: string;
  user: {
    id: number;
    fullname: string;
    email: string;
    mobile_phone: string;
    profile_photo?: string | null;
    personal_info?: string | null;
    is_active: boolean;
    is_verified: boolean;
    type: string;
    date_joined: string;
  };
  favorite_categories: any[];
  created_at: string;
  updated_at: string;
}
