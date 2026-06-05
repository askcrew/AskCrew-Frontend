import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

export interface UserProfile {
  id: number;
  email: string;
  fullname: string;
  mobile_phone: string;
  profile_photo: string | null;
  rating_mean: number;
  rating_count: number;
  is_verified: boolean;
  is_active: boolean;
  type: string;
  type_int: number;
  date_joined: string;
  personal_info: string;
  points: number;
  wallet: string;
  water_mark: boolean;
  profile: {
    city: string;
    country: string;
    specification: string;
    experience?: string; // For enterprise
    top_work_view?: number; // For enterprise
    total_bookings?: number; // For enterprise
    views: number;
    created_at: string;
    updated_at: string;
    images?: Array<{ image: string }>; // For enterprise
    videos?: Array<unknown>; // For enterprise
    // Student-specific fields
    institute?: string;
    academic_year?: string;
    skills?: string;
    cv?: string;
    facebook_link?: string;
    instagram_link?: string;
    linkedin_link?: string;
    youtube_link?: string;
    is_activated_by_admin?: boolean;
    job_applications_count?: number;
    approved_job_applications_count?: number;
    plan: {
      id: number;
      name: string;
      tier: string;
      plan_type: string;
      price: string;
      currency: string;
      is_active: boolean;
      booking_limit: number | null;
      created_at: string;
      updated_at: string;
      features: Array<{
        id: number;
        name: string;
        description: string | null;
      }>;
    };
  };
}

export const getProfileById = async (id: string): Promise<UserProfile> => {
  const response = await axiosInstance.get(`/auth/profiles/${id}/`);
  return response.data;
};

export async function getCurrentUserProfile() {
  try {
    const response = await axiosInstance.get("/auth/profiles/my-profile/");
    console.log("res", response);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error fetching user profile:", error);
    if (err.response?.status === 401) {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: err.message || "An error occurred" };
  }
}
