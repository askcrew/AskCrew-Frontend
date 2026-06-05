"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PasswordInput from "../global/password-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
  type ChangePasswordResponse,
} from "@/Schemas/auth/change-password";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      // Only send old_password and new_password to the API
      const payload = {
        old_password: data.old_password,
        new_password: data.new_password,
      };

      const response = await axiosInstance.post<ChangePasswordResponse>(
        "/auth/change-password",
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message || "Password has been changed successfully",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });

      // Reset the form after successful password change
      reset();
    } catch (error: unknown) {
      console.error("Password change error:", error);

      let errorMessage = "Failed to change password. Please try again.";

      if (error && typeof error === "object") {
        const err = error as {
          response?: {
            data?: {
              message?: string;
              detail?: string;
              old_password?: string[];
              new_password?: string[];
              [key: string]: unknown;
            };
            status?: number;
            error?: string;
          };
          message?: string;
        };

        if (err.response?.data) {
          const data = err.response.data;

          if (data.message) {
            errorMessage = data.message;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (data.old_password) {
            errorMessage = `Old password: ${data.old_password.join(", ")}`;
          } else if (data.new_password) {
            errorMessage = `New password: ${data.new_password.join(", ")}`;
          } else if (data.error && typeof data.error === "string") {
            errorMessage = data.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Old Password */}
      <div className="space-y-2">
        <PasswordInput
          label="Old Password"
          size={"xl"}
          {...register("old_password")}
        />
        {errors.old_password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.old_password.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <PasswordInput
          label="New Password"
          size={"xl"}
          {...register("new_password")}
        />
        {errors.new_password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.new_password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <PasswordInput
          label="Confirm Password"
          size={"xl"}
          {...register("confirm_password")}
        />
        {errors.confirm_password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant={"linear-1"}
        size={"xl"}
        disabled={isLoading}
      >
        {isLoading ? "Changing Password..." : "Save Changes"}
      </Button>
    </form>
  );
}
