import { z } from "zod";

export const changePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(1, "Old password is required")
      .min(8, "Password must be at least 8 characters"),
    new_password: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: "New password must be different from old password",
    path: ["new_password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}
