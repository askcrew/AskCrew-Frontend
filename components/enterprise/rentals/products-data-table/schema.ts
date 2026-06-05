import { z } from "zod";

export const rentalProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  pricePerDay: z.number(),
  pricePerWeek: z.number(),
  pricePerMonth: z.number(),
  images: z.array(z.string()),
  condition: z.enum(["excellent", "good", "fair"]),
  available: z.boolean(),
  location: z.string(),
  specifications: z.array(z.string()),
  totalRentals: z.number(),
  pendingRequests: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RentalProduct = z.infer<typeof rentalProductSchema>;

export const rentalRequestSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  renterName: z.string(),
  renterEmail: z.string(),
  renterAvatar: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.number(),
  durationType: z.enum(["days", "weeks", "months"]),
  totalPrice: z.number(),
  status: z.enum(["pending", "approved", "rejected", "completed", "cancelled"]),
  message: z.string(),
  createdAt: z.string(),
});

export type RentalRequest = z.infer<typeof rentalRequestSchema>;

export const apiRentalProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  price_per_day: z.string(),
  quantity: z.number(),
  location: z.string(),
  image: z.string(),
  is_active: z.boolean(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.number(),
  created_by_email: z.string(),
  created_by_fullname: z.string(),
  created_by_rating_count: z.number(),
  created_by_rating_mean: z.number(),
});

export type ApiRentalProduct = z.infer<typeof apiRentalProductSchema>;

export const apiRentalRequestSchema = z.object({
  id: z.number(),
  item: z.number(),
  item_name: z.string(),
  user: z.number(),
  user_email: z.string(),
  user_fullname: z.string(),
  user_photo: z.string().nullable(),
  user_rating_count: z.number(),
  user_rating_mean: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  quantity: z.number(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ApiRentalRequest = z.infer<typeof apiRentalRequestSchema>;
