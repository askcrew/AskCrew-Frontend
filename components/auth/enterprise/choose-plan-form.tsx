"use client";

import { PricingCard, PricingPlan } from "@/components/pricing/pricing-card";
import { fetchPlans } from "@/components/pricing/pricing-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import axiosInstance from "@/lib/axiosInstance";
import { base64ToFile } from "@/lib/base64ToFile";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
interface EnterpriseFormData extends Record<string, unknown> {
  fullname?: string;
  email?: string;
  mobile_phone?: string;
  password?: string;
  city?: string;
  country?: string;
  myWork?: string;
  personalInfo?: string;
  termsAccepted?: string | boolean;
  experience?: string[];
  specification?: string[];
  images?: string | File;
}

const ChoosePlanForm = () => {
  const router = useRouter();
  const { formData, clearData, previous } = useMultiStepContext<EnterpriseFormData>();
  const [planId, setPlanId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (selectedPlanId?: number) => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      // Append all text fields safely
      const fields: (keyof EnterpriseFormData)[] = [
        "fullname",
        "email",
        "mobile_phone",
        "password",
        "city",
        "country",
        "myWork",
        "personalInfo",
        "termsAccepted",
      ];

      fields.forEach((field) => {
        const value = formData[field];
        if (value !== undefined && value !== null) {
          formDataToSend.append(field as string, String(value));
        }
      });

      // Append arrays properly
      formData.experience?.forEach((exp) =>
        formDataToSend.append("experience", exp),
      );
      formData.specification?.forEach((spec) =>
        formDataToSend.append("specification", spec),
      );

      // Use the selected plan ID or find free plan as fallback
      let finalPlanId = selectedPlanId || planId;

      if (!finalPlanId) {
        const freePlanId = data?.find(
          (plan: PricingPlan) =>
            plan.tier?.toLowerCase() === "free" ||
            plan.name?.toLowerCase().includes("free") ||
            parseFloat(plan.price as string) === 0,
        )?.id;
        finalPlanId = freePlanId || null;
      }

      if (finalPlanId) {
        formDataToSend.append("plan_id", finalPlanId.toString());
      }

      // Handle image/file data
      if (
        formData.images &&
        typeof formData.images === "string" &&
        formData.images.trim() !== ""
      ) {
        try {
          const imageFile = base64ToFile(formData.images, "profile_picture.jpg");
          if (imageFile) {
            formDataToSend.append("images", imageFile);
          }
        } catch (error) {
          console.error("Failed to convert Base64 to file:", error);
        }
      } else if (formData.images instanceof File) {
        formDataToSend.append("images", formData.images);
      }

      // Try multiple variations of the signup endpoint to handle 404s
      const signupEndpoints = [
        "auth/register/enterprise",
        "v1/auth/register/enterprise",
        "auth/enterprise/register",
        "v1/auth/enterprise/register",
        "auth/enterprise/signup",
        "auth/signup/enterprise",
        "v1/auth/enterprise/signup",
        "v1/auth/signup/enterprise",
        "auth/register",
        "auth/signup",
      ];

      let response;
      let lastError: any = null;
      let triedEndpoints: string[] = [];

      for (let endpoint of signupEndpoints) {
        // Try variations: relative, absolute, and with/without trailing slash
        const variations = [
          endpoint,
          `/${endpoint}`,
          `${endpoint}/`,
          `/${endpoint}/`,
        ];
        
        for (const variant of variations) {
          if (triedEndpoints.includes(variant)) continue;
          triedEndpoints.push(variant);
          
          try {
            console.log(`🚀 Attempting signup at: ${variant}`);
            response = await axiosInstance.post(
              variant,
              formDataToSend,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );
            console.log(`✅ Success at: ${variant}`);
            break;
          } catch (e: any) {
            if (e.response?.status !== 404) {
              // Validation error or 500 - stop and show to user
              console.error(`❌ Server Error at ${variant}:`, e.response?.data);
              throw e;
            }
            // Just a 404, continue to next variant
          }
        }
        if (response) break;
      }

      if (!response) {
        console.error("All tried endpoints failed with 404:", triedEndpoints);
        throw new Error(`Registration endpoint not found on server. Please ensure the backend is running and the enterprise signup path is correct.`);
      }

      if (response.status === 201 || response.status === 200) {
        if (response.data?.payment?.transaction?.url) {
          clearData();
          window.location.replace(response.data.payment.transaction.url);
          return;
        }

        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data?.message || "Signup successful!",
        }).then(() => {
          clearData();
          setIsSubmitting(false);
          router.push("/viewer/login");
        });
      } else {
        const errorMsg =
          response.data?.message ||
          (response.data?.errors
            ? Object.values(response.data.errors).join("\n")
            : "Something went wrong.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
        });
      }
    } catch (e: unknown) {
      const error = e as AxiosError<{
        message?: string;
        errors?: Record<string, string[] | string>;
      }>;
      console.error("Error:", error);
      setIsSubmitting(false);

      let errorMsg = "";
      const responseData = error.response?.data;

      if (responseData) {
        if (typeof responseData === "object" && responseData !== null) {
          if (responseData.message) {
            errorMsg = responseData.message;
          } else if (responseData.errors) {
            errorMsg = Object.values(responseData.errors)
              .map((err) => (Array.isArray(err) ? err.join("\n") : err))
              .join("\n");
          } else {
            // Fallback for other object structures
            errorMsg = Object.values(responseData)
              .map((val) => (Array.isArray(val) ? val.join("\n") : String(val)))
              .join("\n");
          }
        } else if (typeof responseData === "string") {
          errorMsg = responseData;
        } else {
          errorMsg = "An error occurred. Please check your input.";
        }
      } else {
        errorMsg = "Network error. Please try again later.";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg || "An unexpected error occurred.",
      });
    }
  };
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["enterprisePlans"],
    queryFn: async () => {
      const plans = await fetchPlans("enterprise");
      return plans.enterprisePlans;
    },
  });

  const handlePlanSelect = (selectedPlanId: number) => {
    const selectedPlan = data?.find(
      (plan: PricingPlan) => plan.id === selectedPlanId,
    );
    const isFree = 
      selectedPlan &&
      (selectedPlan.tier?.toLowerCase() === "free" ||
        selectedPlan.name?.toLowerCase().includes("free") ||
        parseFloat(selectedPlan.price as string) === 0);

    setPlanId(selectedPlanId);

    if (isFree) {
      // For free plan, just highlight it
      return;
    }

    // For paid plans, submit immediately
    onSubmit(selectedPlanId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center gap-4 min-w-[300px]">
        <svg
          className="animate-spin h-10 w-10 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading plans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-500 font-medium">
          Failed to load plans. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  console.log("planId", planId);

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black tracking-tight">Choose your plan</h2>
        <p className="text-muted-foreground font-medium">
          Select the plan that best fits your business needs
        </p>
      </div>
      
      <ScrollArea className="h-[550px] w-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-1">
          {data &&
            data.map((plan: PricingPlan) => (
              <div
                key={plan.id}
                className={`transition-all duration-300 ${
                  planId === plan.id ? "scale-[1.02]" : ""
                }`}
              >
                <PricingCard plan={plan} onSelect={handlePlanSelect} />
              </div>
            ))}
        </div>
      </ScrollArea>

      <div className="flex gap-4 justify-between pt-8 border-t">
        <Button
          variant="outline"
          onClick={previous}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => onSubmit()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Skip for now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChoosePlanForm;
