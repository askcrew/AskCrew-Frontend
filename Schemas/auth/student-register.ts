import { z } from "zod";

// Zod validation schema
export const createStudentSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  mobile_phone: z.string().min(1, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  profile_photo: z.string().optional(),
  institute: z.string().min(1, "Institute is required"),
  personal_info: z.string().optional(),
  cv: z.string().optional(),
  academic_year: z.string().min(1, "Academic Year is required"),
  facebook_link: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (/^https?:\/\/.+/i.test(val) && val.includes("facebook.com")),
      "Must be a valid Facebook link"
    ),
  instagram_link: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (/^https?:\/\/.+/i.test(val) && val.includes("instagram.com")),
      "Must be a valid Instagram link"
    ),
  linkedin_link: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (/^https?:\/\/.+/i.test(val) && val.includes("linkedin.com")),
      "Must be a valid LinkedIn link"
    ),
  youtube_link: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (/^https?:\/\/.+/i.test(val) &&
          (val.includes("youtube.com") || val.includes("youtu.be"))),
      "Must be a valid YouTube link"
    ),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

export const studentStepOne = createStudentSchema.pick({
  fullname: true,
  email: true,
  mobile_phone: true,
  password: true,
  termsAccepted: true,
});

export const studentStepThree = createStudentSchema.pick({
  institute: true,
  personal_info: true,
  cv: true,
});
export const studentStepFour = createStudentSchema.pick({
  facebook_link: true,
  instagram_link: true,
  linkedin_link: true,
  youtube_link: true,
});
export const studentStepFive = createStudentSchema.pick({
  country: true,
  city: true,
  academic_year: true,
  profile_photo: true,
});

export type studentStepOneData = z.infer<typeof studentStepOne>;
export type studentStepThreeData = z.infer<typeof studentStepThree>;
export type studentStepFourData = z.infer<typeof studentStepFour>;
export type studentStepFiveData = z.infer<typeof studentStepFive>;
