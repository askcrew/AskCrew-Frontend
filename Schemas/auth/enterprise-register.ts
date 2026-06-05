import { z } from "zod";

// Zod validation schema
export const createEnterpriseSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  mobile_phone: z.string().min(1, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  myWork: z.string().min(1, "Please select your work type"),
  images: z.string().optional(),
});

export type CreateEnterpriseFormData = z.infer<typeof createEnterpriseSchema>;

export const enterpriseStepOne = createEnterpriseSchema.pick({
  fullname: true,
  email: true,
  mobile_phone: true,
  password: true,
  termsAccepted: true,
});

export const enterpriseStepFour = createEnterpriseSchema.pick({
  country: true,
  city: true,
  myWork: true,
  images: true,
});

export type EnterpriseStepOneData = z.infer<typeof enterpriseStepOne>;
export type EnterpriseStepFourData = z.infer<typeof enterpriseStepFour>;
