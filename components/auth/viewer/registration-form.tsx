"use client";

import type React from "react";

import CheckboxWithLabelGroup from "@/components/global/checkbox-with-label-group";
import FormGroup from "@/components/global/form-group";
import Logo from "@/components/global/logo";
import PasswordInput from "@/components/global/password-input";
import PhoneInputComponent from "@/components/global/phone-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileUploader } from "@/components/global/file-uplaod";
import FormText from "@/components/global/form-text";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  viewerRegisterSchema,
  type ViewerRegisterFormData,
  type ViewerRegisterResponse,
} from "@/Schemas/auth/viewer-register";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ViewerRegisterFormData>({
    resolver: zodResolver(viewerRegisterSchema),
    defaultValues: {
      fullname: "",
      email: "",
      mobile_phone: "",
      password: "",
      personal_info: "",
      termsAccepted: false,
      profile_photo: undefined,
    } as unknown as ViewerRegisterFormData,
  });

  const onSubmit = async (data: ViewerRegisterFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("mobile_phone", data.mobile_phone);
      formData.append("password", data.password);

      if (data.profile_photo) {
        formData.append("profile_photo", data.profile_photo);
      }

      if (data.personal_info) {
        formData.append("personal_info", data.personal_info);
      }

      console.log("📤 Sending registration request:", {
        fullname: data.fullname,
        email: data.email,
        mobile_phone: data.mobile_phone,
        has_profile_photo: !!data.profile_photo,
        has_personal_info: !!data.personal_info,
        baseURL: axiosInstance.defaults.baseURL,
      });

      // Try multiple variations of the signup endpoint to handle 404s
      const signupEndpoints = [
        "v1/auth/signup",
        "v1/auth/signup/",
        "api/v1/auth/signup",
        "https://admin.askcrews.com/api/v1/auth/signup",
        "auth/signup",
      ];

      let response;
      let lastError: any = null;

      for (const endpoint of signupEndpoints) {
        try {
          console.log(`🚀 Attempting viewer signup at: ${endpoint}`);
          
          // Use a clean axios instance or override headers to ensure multipart/form-data works
          response = await axiosInstance.post<ViewerRegisterResponse>(
            endpoint,
            formData,
            {
              headers: {
                // Let the browser set the boundary automatically
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(`✅ Success at: ${endpoint}`);
          break;
        } catch (e: any) {
          if (e.response?.status !== 404) {
            console.error(`❌ Server Error at ${endpoint}:`, e.response?.data);
            throw e;
          }
          lastError = e;
          // Continue to next endpoint
        }
      }

      if (!response) {
        throw lastError || new Error("Registration endpoint not found.");
      }

      console.log("✅ Registration successful:", response.data);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text:
          response.data.message ||
          "Account created successfully! Please choose your account type.",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect to OTP verification page
        router.push("/viewer/verify-otp");
      });
    } catch (error: unknown) {
      console.error("❌ Registration error:", error);

      let errorMessage = "Failed to create account. Please try again.";

      if (error && typeof error === "object") {
        const err = error as {
          response?: {
            data?: unknown;
            status?: number;
            statusText?: string;
          };
          message?: string;
        };

        console.log("Error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        });

        if (err.response?.data) {
          const data = err.response.data as Record<string, unknown>;

          if (typeof data === "string") {
            errorMessage = data;
          } else if (data.message && typeof data.message === "string") {
            errorMessage = data.message;
          } else if (data.detail && typeof data.detail === "string") {
            errorMessage = data.detail;
          } else if (data.errors && typeof data.errors === "object") {
            errorMessage = Object.entries(data.errors)
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`,
              )
              .join("; ");
          } else {
            errorMessage = JSON.stringify(data);
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
    <div className="w-full container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:block text-white">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Start Your{" "}
            <span className="bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Streaming
            </span>{" "}
            Journey
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join millions of users enjoying unlimited entertainment. Create your
            account in seconds and start streaming your favorite content today.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Unlimited streaming access
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Watch on any device
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Cancel anytime
            </li>
          </ul>
        </div>

        {/* Right Side - Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-500 text-sm">
              Join us in just a few steps and start streaming right away.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <FormGroup
                label="Full Name"
                {...register("fullname")}
                variant={"rounded"}
                size={"xl"}
                message={errors?.fullname?.message}
              />
            </div>

            {/* Email Address */}
            <div>
              <FormGroup
                label="Email Address"
                placeholder="enter your email"
                {...register("email")}
                variant={"rounded"}
                size={"xl"}
                message={errors.email?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mobile Number
              </label>
              <PhoneInputComponent
                value={watch("mobile_phone")}
                onChange={(phone) => setValue("mobile_phone", phone || "")}
                placeholder="Enter your phone number"
                errorMsg={errors.mobile_phone?.message}
              />
            </div>

            {/* Password */}
            <div>
              <PasswordInput
                label="Password"
                {...register("password")}
                variant={"rounded"}
                size={"xl"}
                message={errors.password?.message}
              />
            </div>

            <div>
              <FileUploader
                label="Upload your profile picture ( optional )"
                maxFiles={1}
                onChange={(files) => {
                  if (files && files.length > 0) {
                    setValue("profile_photo", files[0]);
                  }
                }}
              />
              {errors.profile_photo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profile_photo.message}
                </p>
              )}
            </div>

            <div>
              <FormText
                label="Personal Info ( optional )"
                placeholder="some info about you...."
                {...register("personal_info")}
                message={errors.personal_info?.message}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 my-6">
              <CheckboxWithLabelGroup
                variant={"orange"}
                checked={watch("termsAccepted")}
                onCheckedChange={(checked) =>
                  setValue("termsAccepted", checked as boolean)
                }
                label={
                  <>
                    I accept the{" "}
                    <a
                      href="#"
                      className="text-gray-900 underline hover:text-orange-500"
                    >
                      terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-gray-900 underline hover:text-orange-500"
                    >
                      privacy policy
                    </a>
                  </>
                }
              />
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm mt-1">
                {errors.termsAccepted.message}
              </p>
            )}

            {/* Register Button */}
            <Button
              type="submit"
              variant={"linear-1"}
              size={"xl"}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-6 mb-8">
            {/* Google */}
            <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Image
                src="/icons/google.svg"
                alt="google"
                width={24}
                height={24}
              />
              <span className="sr-only">Sign in with google</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-700 text-sm">
              Already Registered?{" "}
              <Link
                href="/viewer/login"
                className="text-orange-500 font-semibold hover:text-orange-600 underline"
              >
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
