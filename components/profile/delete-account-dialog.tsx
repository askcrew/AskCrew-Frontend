"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import PasswordInput from "../global/password-input";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (password: string) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your password to confirm",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(
        "/auth/profiles/delete-my-account/"
      );

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userType");

      // Close dialog
      setPassword("");
      onOpenChange(false);

      // Call onConfirm callback if provided
      if (onConfirm) {
        onConfirm(password);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data?.message || "Account deleted successfully",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect to login page
        router.push("/viewer/login");
      });
    } catch (error: unknown) {
      console.error("Delete account error:", error);

      let errorMessage = "Failed to delete account. Please try again.";

      if (error && typeof error === "object") {
        const err = error as {
          response?: {
            data?: {
              message?: string;
              detail?: string;
              error?: string;
              [key: string]: unknown;
            };
            status?: number;
          };
          message?: string;
        };

        if (err.response?.data) {
          const data = err.response.data;

          if (data.message) {
            errorMessage = data.message;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (typeof data === "string") {
            errorMessage = data;
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
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-background/95 backdrop-blur-md border border-white/10 shadow-2xl">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-red-500/5 via-transparent to-pink-500/5 rounded-lg pointer-events-none" />

        {/* Icon */}
        <div className="relative flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-500/10 to-pink-500/10 flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <AlertDialogHeader className="relative text-center space-y-3">
          <AlertDialogTitle className="text-2xl font-bold">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm text-muted-foreground space-y-3">
            <p className="text-red-500 font-medium">
              Please note that this action is permanent and cannot be undone.
              Deleting your account will result in:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Loss of access to your profile and watch history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>
                  Inability to recover any remaining balances or rewards
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Removal of all personal information from our system</span>
              </li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Password Input */}
        <div className="relative space-y-2 mt-4">
          <PasswordInput
            name="password"
            value={password}
            onChange={(pass) => setPassword(pass.target.value)}
            label="Enter Your Password"
            size={"xl"}
          />
        </div>

        <AlertDialogFooter className="relative flex-col sm:flex-col gap-2 mt-6">
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!password.trim() || isDeleting}
            className="w-full bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1"
          >
            {isDeleting ? "Deleting Account..." : "Delete Account"}
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isDeleting}
            className="w-full mt-0 border-border hover:bg-muted py-6 rounded-xl font-medium transition-all order-2 disabled:opacity-50"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
