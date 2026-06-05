import { z } from "zod";

export const rentalProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    ,
  type: z.string().min(1, "Type is required"),
  price_per_day: z
    .number({ invalid_type_error: "Price per day is required" })
    .positive("Price must be positive")
    .or(z.string().min(1, "Price per day is required").transform(Number))
    ,
  quantity:  z
    .number({ invalid_type_error: "Quantity is required" })
    .positive("Quantity must be positive")
    .or(z.string().min(1, "Quantity is required").transform(Number))
    ,
  location: z.string().min(1, "Location is required"),
});

export type RentalProductFormData = z.infer<typeof rentalProductSchema>;
