"use client";

import {
  updateProfileSchema,
  type UpdateProfileFormData,
  type UpdateProfileResponse,
} from "@/Schemas/auth/update-profile";
import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import ImageInput from "@/components/global/image-input";
import PhoneInputComponent from "@/components/global/phone-input";
import { Button } from "@/components/ui/button";
import { getCurrentUserProfile } from "@/lib/actions/auth";
import axiosInstance from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useWatermarkPayment } from "@/lib/queries/payment";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { UserProfile } from "@/lib/api/profiles";

const PersonalDetailsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("/icons/user-2.svg");
  const [userData, setUserData] = useState<UserProfile | null>(null);

  const { mutate: getVerified, isPending: isVerifying } = useWatermarkPayment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullname: "",
      email: "",
      mobile_phone: "",
      personal_info: "",
    },
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUserProfile();

        if (response.success && response.data) {
          const user = response.data;
          setUserData(user);

          // Set form values
          setValue("fullname", user.fullname || "");
          setValue("email", user.email || "");
          setValue("mobile_phone", user.mobile_phone || "");
          setValue("personal_info", user.personal_info || "");

          // Set profile image preview
          if (user.profile_photo) {
            setPreviewUrl(user.profile_photo);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const handleVerifyRequest = () => {
    Swal.fire({
      title: "Get Verified Account",
      text: "Would you like to use your loyalty points for a discount on the watermark payment?",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Use Points",
      denyButtonText: "Don't Use Points",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#9333ea",
      denyButtonColor: "#f97316",
    }).then((result) => {
      if (result.isConfirmed) {
        getVerified(true);
      } else if (result.isDenied) {
        getVerified(false);
      }
    });
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      // Only send allowed fields: fullname, profile_photo, personal_info
      formData.append("fullname", data.fullname);

      if (selectedImage) {
        formData.append("profile_photo", selectedImage);
      }

      if (data.personal_info) {
        formData.append("personal_info", data.personal_info);
      }

      const response = await axiosInstance.patch<UpdateProfileResponse>(
        "/auth/profiles/update-profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || "Profile updated successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        // Optionally, you can refresh the page or redirect
        window.location.reload();
      });
    } catch (error: unknown) {
      console.error("Update profile error:", error);

      let errorMessage = "Failed to update profile. Please try again.";

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
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="md:shadow-sm rounded-lg sm:w-[500px] px-4 mx-auto my-5 sm:p-4 bg-white! z-50 isolate p-0 space-y-5">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:shadow-2xl md:ring-1 md:ring-black/5 rounded-[2.5rem] sm:w-[550px] px-6 mx-auto my-8 sm:p-10 bg-white dark:bg-zinc-950 z-50 isolate p-0 space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Profile Details
        </h2>

        {userData?.is_verified ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-xs">
            <CheckCircle2 className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Verified Account
            </span>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVerifyRequest}
            disabled={isVerifying}
            className="rounded-full h-9 px-4 text-[11px] font-black uppercase border-dashed border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all gap-2 shadow-xs"
          >
            {isVerifying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="size-4" />
                Get Verified
              </>
            )}
          </Button>
        )}
      </div>

      <div className="relative group mx-auto w-fit">
        <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-purple-600 rounded-full blur opacity-15 group-hover:opacity-30 transition duration-500" />
        <ImageInput
          primaryImage={previewUrl}
          className="mx-auto"
          onImageChange={handleImageChange}
        />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormGroup
            label="Full Name"
            type="text"
            variant={"rounded"}
            size={"xl"}
            {...register("fullname")}
            message={errors.fullname?.message}
          />

          <FormGroup
            label="Email Address"
            type="email"
            variant={"rounded"}
            size={"xl"}
            {...register("email")}
            message={errors.email?.message}
            disabled
          />

          <PhoneInputComponent
            value={watch("mobile_phone")}
            onChange={(phone) => setValue("mobile_phone", phone || "")}
            placeholder="Enter your phone number"
            errorMsg={errors.mobile_phone?.message}
            disabled
          />

          <FormText
            label="Personal Info ( optional )"
            placeholder="Tell us a bit about yourself..."
            {...register("personal_info")}
            message={errors.personal_info?.message}
          />
        </div>

        <div className="pt-2 flex flex-col gap-4">
          <Button
            variant={"linear-1"}
            type="submit"
            size={"xl"}
            className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>Saving Changes...</span>
              </div>
            ) : (
              "Save Profile Changes"
            )}
          </Button>

          {!userData?.is_verified && (
            <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-500/20">
              <AlertCircle className="size-5 text-orange-500 shrink-0" />
              <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                Verify your account to build trust and unlock more features!
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
export default PersonalDetailsForm;
