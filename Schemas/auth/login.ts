import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface PlanFeature {
  id: number;
  name: string;
  description: string | null;
}

export interface Plan {
  id: number;
  plan_type: string;
  tier: string;
  name: string;
  price: string;
  currency: string;
  booking_limit: number | null;
  is_active: boolean;
  features: PlanFeature[];
  created_at: string;
  updated_at: string;
}

export interface ProfileImage {
  image: string;
}


export interface Profile {
  specification: string;
  experience: string;
  country: string;
  city: string;
  plan: Plan;
  images: ProfileImage[];
  videos: any[];
  views: number;
  total_bookings: number;
  top_work_view: number;
  created_at: string;
  updated_at: string;
}
export interface LoginResponse {
  message: string;
  tokens: {
    access: string;
    access_expires_at: string;
    token_type: string;
  };
  user: {
    id: number;
      email: string;
      fullname: string;
      mobile_phone: string;
      wallet: string;
      points: number;
      profile_photo: string|null ;
      personal_info: string;
      is_verified: boolean;
      is_active: boolean;
      type: string;
      date_joined: string;
      profile: Profile;
      type_int: number;
      rating_count: number;
      rating_mean: number;
    }
}
