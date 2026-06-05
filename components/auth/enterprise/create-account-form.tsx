"use client";
import CheckboxWithLabelGroup from "@/components/global/checkbox-with-label-group";
import FormGroup from "@/components/global/form-group";
import PasswordInput from "@/components/global/password-input";
import PhoneInputComponent from "@/components/global/phone-input";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import {
  enterpriseStepOne,
  EnterpriseStepOneData,
} from "@/Schemas/auth/enterprise-register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";

// Interface for viewer profile data
interface ViewerProfileData {
  fullname?: string;
  email?: string;
  mobile_phone?: string;
}

const CreateAccountForm = () => {
  const { next, saveStepData, formData } =
    useMultiStepContext<EnterpriseStepOneData>();

  // State for prefilled data from API
  const [prefilledData, setPrefilledData] = useState<ViewerProfileData | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<EnterpriseStepOneData>({
    resolver: zodResolver(enterpriseStepOne),
    mode: "onSubmit",
    defaultValues: {
      fullname: formData?.fullname || "",
      email: formData?.email || "",
      mobile_phone: formData?.mobile_phone || "",
      password: formData?.password || "",
      termsAccepted: formData?.termsAccepted || false,
    },
  });

  const phoneValue = watch("mobile_phone");
  const termsAccepted = watch("termsAccepted");

  // Fetch viewer profile data from API on mount
  useEffect(() => {
    const fetchViewerProfile = async () => {
      // Skip if we already have form data from navigation
      if (formData?.fullname || formData?.email) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        // Use axios directly to avoid axiosInstance interceptors that might redirect on 401
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/auth/profiles/my-profile/`,
          {
            withCredentials: true,
            // Get access token from cookie via our API route
            headers: {
              Authorization: `Bearer ${await getAccessToken()}`,
            },
          }
        );

        if (response.data) {
          const profileData: ViewerProfileData = {
            fullname: response.data.fullname,
            email: response.data.email,
            mobile_phone: response.data.mobile_phone,
          };
          setPrefilledData(profileData);
        }
      } catch (error: unknown) {
        // If 401, user doesn't have a viewer account - this is fine, just continue
        // Don't redirect or show error, just let them fill the form manually
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.log("No viewer account found, user will fill form manually");
        } else {
          console.error("Error fetching viewer profile:", error);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    // Helper to get access token from cookie API
    const getAccessToken = async (): Promise<string | null> => {
      try {
        const response = await fetch("/api/auth/status", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        return data.accessToken || null;
      } catch {
        return null;
      }
    };

    fetchViewerProfile();
  }, [formData]);

  // Effect to prefill form fields when API data is loaded
  useEffect(() => {
    if (prefilledData && !formData?.fullname) {
      if (prefilledData.fullname) {
        setValue("fullname", prefilledData.fullname);
      }
      if (prefilledData.email) {
        setValue("email", prefilledData.email);
      }
      if (prefilledData.mobile_phone) {
        setValue("mobile_phone", prefilledData.mobile_phone);
      }
    }
  }, [prefilledData, formData, setValue]);

  // Effect to reset form when formData from context changes (for back navigation)
  useEffect(() => {
    if (formData) {
      reset({
        fullname: formData.fullname || "",
        email: formData.email || "",
        mobile_phone: formData.mobile_phone || "",
        password: formData.password || "",
        termsAccepted: formData.termsAccepted || false,
      });
    }
  }, [formData, reset]);

  const onSubmit = (data: EnterpriseStepOneData) => {
    try {
      console.log("Form submitted:", data);

      // Save form data to multi-step context
      saveStepData(data);

      // Move to next step
      next();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="bg-white p-4 md:p-10 flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-500 text-sm">
          Join us in just a few steps and start streaming right away.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full grid">
        {/* User Name */}
        <FormGroup
          label="Full Name"
          type="text"
          {...register("fullname")}
          variant={"rounded"}
          size={"xl"}
          message={errors.fullname?.message}
          disabled={isLoadingProfile}
        />

        {/* Email Address */}
        <div>
          <FormGroup
            label="Email Address"
            type="email"
            placeholder="enter your email"
            {...register("email")}
            variant={"rounded"}
            size={"xl"}
            message={errors.email?.message}
            disabled={isLoadingProfile}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Mobile Number
          </label>
          <PhoneInputComponent
            value={phoneValue}
            placeholder="Enter your phone number"
            onChange={(phone) => setValue("mobile_phone", phone || "")}
            errorMsg={errors.mobile_phone?.message}
            disabled={isLoadingProfile}
          />
        </div>

        {/* Password  */}
        <div>
          <PasswordInput
            label="Password"
            variant={"rounded"}
            size={"xl"}
            {...register("password")}
            message={errors.password?.message}
          />
        </div>

        {/* Terms Checkbox  */}
        <div>
          <CheckboxWithLabelGroup
            variant={"orange"}
            checked={termsAccepted}
            onCheckedChange={(checked: boolean) =>
              setValue("termsAccepted", checked)
            }
            className="md:text-sm text-xs"
            label={
              <>
                I accept the
                <a
                  href="#"
                  className="text-gray-900 underline hover:text-orange-500"
                >
                  terms
                </a>
                and
                <a
                  href="#"
                  className="text-gray-900 underline hover:text-orange-500"
                >
                  privacy policy
                </a>
              </>
            }
          />
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm mt-1">
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          variant={"linear-1"}
          size={"xl"}
          disabled={isSubmitting || isLoadingProfile}
        >
          {isLoadingProfile
            ? "Loading..."
            : isSubmitting
            ? "Processing..."
            : "Next"}
        </Button>
      </form>
    </div>
  );
};
export default CreateAccountForm;
