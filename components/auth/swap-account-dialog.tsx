"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormGroup from "@/components/global/form-group";
import { FileUploader } from "@/components/global/file-uplaod";
import { CheckboxGroup, type Option } from "@/components/global/checkbox-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Loader2, Building2, GraduationCap, X } from "lucide-react";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/components/pricing/pricing-data";
import { PricingCard } from "@/components/pricing/pricing-card";
import CustomSelect from "@/components/global/custom-select";
import { Badge } from "@/components/ui/badge";

// ==========================================
// Types and Schemas
// ==========================================

interface SwapAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountType: "enterprise" | "student";
  missingFields?: string[];
}

// Student complete profile schema
const studentCompleteSchema = z.object({
  institute: z.string().min(1, "Institute is required"),
  specification: z
    .array(z.string())
    .min(1, "Select at least one specification"),
  academic_year: z.string().min(1, "Academic year is required"),
  skills: z.string().min(1, "Skills are required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  facebook_link: z.string().optional(),
  instagram_link: z.string().optional(),
  linkedin_link: z.string().optional(),
  youtube_link: z.string().optional(),
  plan_id: z.number().optional(),
});

type StudentCompleteData = z.infer<typeof studentCompleteSchema>;

// Enterprise complete profile schema
const enterpriseCompleteSchema = z.object({
  specification: z
    .array(z.string())
    .min(1, "Select at least one specification"),
  experience: z.array(z.string()).min(1, "Select experience level"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  plan_id: z.number().optional(),
});

type EnterpriseCompleteData = z.infer<typeof enterpriseCompleteSchema>;

// ==========================================
// Options
// ==========================================

const formatLabel = (str: string) => {
  if (!str || typeof str !== "string") return "";
  return str
    .split("_")
    .map((word) => {
      if (word === "/") return "/";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/ \/ /g, " / ")
    .replace(/Dop/g, "DOP")
    .replace(/Vfx/g, "VFX")
    .replace(/Cgi/g, "CGI");
};

const fallbackSpecifications: Record<string, string[]> = {
  direction: [
    "director",
    "executive_director",
    "assistant_director",
    "art_director",
    "lighting_director",
    "scenic_director",
    "workshop_director",
  ],
  acting: [
    "actor",
    "actress",
    "lead_actor",
    "supporting_actor",
    "character_actor",
    "extra_/_background_actor",
    "stand_in",
    "stunt_double",
    "voice_actor",
  ],
  production: [
    "producer",
    "executive_producer",
    "line_producer",
    "co_producer",
    "production_manager",
    "production_assistant",
    "production_coordinator",
    "location_manager",
  ],
  cinematography: [
    "director_of_photography_dop",
    "camera_operator",
    "photographer",
    "1st_assistant_camera_focus_puller",
    "2nd_assistant_camera_clapper",
    "steadicam_operator",
    "crane_operator",
  ],
  sound: [
    "sound_engineer",
    "sound_designer",
    "sound_recordist_/_production_mixer",
    "re_recording_mixer",
    "foley_artist",
    "sound_editor",
  ],
  lighting: [
    "gaffer",
    "lighting_technician",
    "best_boy_electric",
    "generator_operator",
  ],
  art_set_decoration: [
    "production_designer",
    "set_designer",
    "set_decorator",
    "scenic_artist",
    "prop_master_/_props",
    "construction_coordinator",
    "painter",
  ],
  graphics_vfx: [
    "vfx_artist",
    "graphic_designer",
    "vfx_supervisor",
    "motion_graphics_artist",
    "cgi_artist",
    "compositor",
  ],
  editing: [
    "video_editor",
    "assistant_editor",
    "online_editor",
    "offline_editor",
    "colorist",
  ],
  makeup_wardrobe: [
    "makeup_artist",
    "makeup_assistant",
    "special_effects_makeup_artist",
    "hair_stylist",
    "costume_designer",
    "costume_assistant",
    "wardrobe_supervisor",
    "stylist",
  ],
  engineering_technicians: [
    "chief_engineer",
    "studio_technician",
    "video_engineer",
    "camera_technician",
    "rigging_technician",
    "chroma_key_technician",
  ],
  writing_preparation: [
    "scriptwriter",
    "author_/_writer",
    "screenwriter",
    "copywriter",
    "preparer_/_developer",
    "researcher",
    "dialogue_writer",
  ],
};

const experienceOptions: Option[] = [
  { label: "Beginner ( less than 1 year )", value: "Beginner" },
  { label: "Intermediate ( 1 - 3 years )", value: "intermediate" },
  { label: "Advanced ( 3 - 7 years )", value: "advanced" },
  { label: "Expert ( +7 years )", value: "expert" },
];

const academicYearOptions: Option[] = [
  { label: "1st Year", value: "1" },
  { label: "2nd Year", value: "2" },
  { label: "3rd Year", value: "3" },
  { label: "4th Year", value: "4" },
  { label: "Graduate", value: "graduate" },
  { label: "Post Graduate", value: "post-graduate" },
];

// ==========================================
// Student Form Component
// ==========================================

function StudentCompleteForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  const { data: plansData, isLoading: isPlansLoading, isError: isPlansError, refetch: refetchPlansData } = useQuery({
    queryKey: ["plans", "student"],
    queryFn: () => fetchPlans("student"),
  });

  const studentPlans = plansData?.studentPlans || [];

  const categoryOptions = Object.keys(fallbackSpecifications).map((key) => ({
    label: formatLabel(key),
    value: key,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StudentCompleteData>({
    resolver: zodResolver(studentCompleteSchema),
    defaultValues: {
      institute: "",
      specification: [],
      academic_year: "",
      skills: "",
      country: "",
      city: "",
      facebook_link: "",
      instagram_link: "",
      linkedin_link: "",
      youtube_link: "",
      plan_id: undefined,
    },
  });

  const currentCategoryOptions: Option[] = (() => {
    if (!selectedCategory || !fallbackSpecifications[selectedCategory]) {
      return [];
    }
    return fallbackSpecifications[selectedCategory].map((item: string) => ({
      label: formatLabel(item),
      value: item,
    }));
  })();

  const currentCategoryValues = (() => {
    if (!selectedCategory || !fallbackSpecifications[selectedCategory]) {
      return [];
    }
    const categorySpecs = fallbackSpecifications[selectedCategory];
    return watch("specification").filter((s) => categorySpecs.includes(s));
  })();

  const onSubmit = async (data: StudentCompleteData) => {
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("institute", data.institute);
      formData.append("academic_year", data.academic_year);
      formData.append("skills", data.skills);
      formData.append("country", data.country);
      formData.append("city", data.city);

      // Append specifications
      data.specification.forEach((spec) => {
        formData.append("specification", spec);
      });

      // Optional fields
      if (data.facebook_link)
        formData.append("facebook_link", data.facebook_link);
      if (data.instagram_link)
        formData.append("instagram_link", data.instagram_link);
      if (data.linkedin_link)
        formData.append("linkedin_link", data.linkedin_link);
      if (data.youtube_link) formData.append("youtube_link", data.youtube_link);

      // CV file
      if (cvFile) {
        formData.append("cv", cvFile);
      }

      // Add plan_id
      const planToSubmit = selectedPlanId || data.plan_id;
      if (planToSubmit) {
        formData.append("plan_id", planToSubmit.toString());
      }

      // Step 1: Complete the profile
      const response = await axiosInstance.post(
        "/auth/profiles/complete-student-profile/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Check for payment redirect
      if (response.data?.payment?.transaction?.url) {
        window.location.replace(response.data.payment.transaction.url);
        return;
      }

      // Step 2: Try swap again
      const swapResponse = await axiosInstance.post(
        "/auth/profiles/swap-to-student/",
      );

      if (swapResponse.data?.success || swapResponse.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your account has been swapped to Student successfully!",
        }).then(() => {
          onSuccess();
          router.push("/student/dashboard");
        });
      }
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.error("Error completing student profile:", error);
      const errorMsg =
        error.response?.data?.message ||
        (error.response?.data && typeof error.response.data === "object"
          ? Object.values(error.response.data).flat().join(", ")
          : "Failed to complete profile. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = (id: number) => {
    setSelectedPlanId(id);
    const plan = studentPlans.find((p) => p.id === id);
    const price =
      typeof plan?.price === "string" ? parseFloat(plan.price) : plan?.price;
    const isFree = plan && (price === 0 || plan.tier?.toLowerCase() === "free");

    if (!isFree) {
      // For paid plans, submit immediately with this plan ID
      handleSubmit((data) => onSubmit({ ...data, plan_id: id }))();
    }
  };

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Choose your student plan</h2>
          <p className="text-sm text-muted-foreground">
            Select a plan to complete your swap
          </p>
        </div>
        <ScrollArea className="h-[50vh] pr-4">
          <div className="grid grid-cols-1 gap-4 p-1">
            {isPlansLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading plans...</p>
              </div>
            ) : isPlansError ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <p className="text-sm text-red-500">Failed to load plans.</p>
                <Button size="sm" variant="outline" onClick={() => refetchPlansData()}>
                  Retry
                </Button>
              </div>
            ) : studentPlans.length === 0 ? (
              <p className="text-center py-10 text-sm text-muted-foreground">No plans available.</p>
            ) : (
              studentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`transition-all duration-200 rounded-2xl ${
                    selectedPlanId === plan.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <PricingCard plan={plan} onSelect={handlePlanSelect} />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1"
            variant="linear-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Skip & Swap"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep(2);
      }}
      className="space-y-6"
    >
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-5 p-1">
          {/* Institute */}
          <FormGroup
            label="Institute"
            placeholder="Enter your institute name"
            {...register("institute")}
            message={errors.institute?.message}
            size="xl"
          />

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Academic Year
            </label>
            <CheckboxGroup
              options={academicYearOptions}
              value={watch("academic_year") ? [watch("academic_year")] : []}
              onValueChange={(value) =>
                setValue("academic_year", value[0] || "")
              }
              listClassName="grid grid-cols-2 gap-2"
            />
            {errors.academic_year && (
              <p className="text-red-500 text-sm mt-1">
                {errors.academic_year.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <FormGroup
            label="Skills"
            placeholder="e.g., Acting, Editing, Photography"
            {...register("skills")}
            message={errors.skills?.message}
            size="xl"
          />

          {/* Specification */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Specification
            </label>
            <CustomSelect
              label="Select Category"
              placeholder="Choose a category..."
              options={categoryOptions}
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            />

            {selectedCategory && (
              <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-medium text-gray-700">
                  Select roles in {formatLabel(selectedCategory)}:
                </h3>
                <CheckboxGroup
                  options={currentCategoryOptions}
                  value={currentCategoryValues}
                  listClassName="grid md:grid-cols-2 gap-4"
                  onValueChange={(value: string[]) => {
                    const categorySpecs = fallbackSpecifications[selectedCategory];
                    
                    // Remove all current category specs from the global list
                    const otherCategorySpecs: string[] = watch("specification").filter(
                      (s) => !categorySpecs.includes(s)
                    );
                    
                    // Add the new selections for this category
                    const newSpecs = Array.from(new Set([...otherCategorySpecs, ...value]));
                    
                    setValue("specification", newSpecs);
                  }}
                />
              </div>
            )}

            {/* Selected Specs Summary */}
            {watch("specification").length > 0 && (
              <div className="pt-6 border-t mt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Selected Specifications ({watch("specification").length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {watch("specification").map((spec, index) => (
                    <Badge
                      key={`${spec}-${index}`}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200"
                    >
                      {formatLabel(spec)}
                      <button
                        type="button"
                        onClick={() => {
                          const newSpecs = watch("specification").filter((s) => s !== spec);
                          setValue("specification", newSpecs);
                        }}
                        className="p-0.5 hover:bg-orange-200 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {errors.specification && (
              <p className="text-red-500 text-sm mt-1">
                {errors.specification.message}
              </p>
            )}
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-2 gap-4">
            <FormGroup
              label="Country"
              placeholder="Your country"
              {...register("country")}
              message={errors.country?.message}
              size="xl"
            />
            <FormGroup
              label="City"
              placeholder="Your city"
              {...register("city")}
              message={errors.city?.message}
              size="xl"
            />
          </div>

          {/* CV Upload */}
          <FileUploader
            label="Upload your CV (optional)"
            maxFiles={1}
            onChange={(files) => setCvFile(files?.[0] || null)}
          />

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Social Media Links (Optional)
            </h3>
            <FormGroup
              label="Facebook"
              placeholder="https://facebook.com/yourprofile"
              {...register("facebook_link")}
              size="xl"
            />
            <FormGroup
              label="Instagram"
              placeholder="https://instagram.com/yourprofile"
              {...register("instagram_link")}
              size="xl"
            />
            <FormGroup
              label="LinkedIn"
              placeholder="https://linkedin.com/in/yourprofile"
              {...register("linkedin_link")}
              size="xl"
            />
            <FormGroup
              label="YouTube"
              placeholder="https://youtube.com/yourchannel"
              {...register("youtube_link")}
              size="xl"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="linear-1"
          disabled={isSubmitting}
          className="flex-1"
        >
          Next: Choose Plan
        </Button>
      </div>
    </form>
  );
}

// ==========================================
// Enterprise Form Component
// ==========================================

function EnterpriseCompleteForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: plansData, isLoading: isPlansLoading, isError: isPlansError, refetch: refetchPlansData } = useQuery({
    queryKey: ["plans", "enterprise"],
    queryFn: () => fetchPlans("enterprise"),
  });

  const enterprisePlans = plansData?.enterprisePlans || [];

  const categoryOptions = Object.keys(fallbackSpecifications).map((key) => ({
    label: formatLabel(key),
    value: key,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EnterpriseCompleteData>({
    resolver: zodResolver(enterpriseCompleteSchema),
    defaultValues: {
      specification: [],
      experience: [],
      country: "",
      city: "",
      plan_id: undefined,
    },
  });

  const currentCategoryOptions: Option[] = (() => {
    if (!selectedCategory || !fallbackSpecifications[selectedCategory]) {
      return [];
    }
    return fallbackSpecifications[selectedCategory].map((item: string) => ({
      label: formatLabel(item),
      value: item,
    }));
  })();

  const currentCategoryValues = (() => {
    if (!selectedCategory || !fallbackSpecifications[selectedCategory]) {
      return [];
    }
    const categorySpecs = fallbackSpecifications[selectedCategory];
    return watch("specification").filter((s) => categorySpecs.includes(s));
  })();

  const onSubmit = async (data: EnterpriseCompleteData) => {
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("country", data.country);
      formData.append("city", data.city);

      // Append specifications
      data.specification.forEach((spec) => {
        formData.append("specification", spec);
      });

      // Append experience
      data.experience.forEach((exp) => {
        formData.append("experience", exp);
      });

      // Images
      images.forEach((img) => {
        formData.append("images", img);
      });

      // Add plan_id
      const planToSubmit = selectedPlanId || data.plan_id;
      if (planToSubmit) {
        formData.append("plan_id", planToSubmit.toString());
      }

      // Step 1: Complete the profile
      const response = await axiosInstance.post(
        "/auth/profiles/complete-enterprise-profile/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Check for payment redirect
      if (response.data?.payment?.transaction?.url) {
        window.location.replace(response.data.payment.transaction.url);
        return;
      }

      // Step 2: Try swap again
      const swapResponse = await axiosInstance.post(
        "/auth/profiles/swap-to-enterprise/",
      );

      if (swapResponse.data?.success || swapResponse.status === 200) {
        Swal.fire({
          icon: "info",
          title: "Account Submitted!",
          text: "Your enterprise account request has been submitted successfully. It is now waiting for admin activation. You will be notified once your account is approved.",
          confirmButtonText: "Got it",
        }).then(() => {
          onSuccess();
          // Don't redirect to dashboard - account needs admin approval
        });
      }
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;

      console.error("Error completing enterprise profile:", error);

      const errorMsg =
        error.response?.data?.message ||
        (error.response?.data && typeof error.response.data === "object"
          ? Object.values(error.response.data).flat().join(", ")
          : "Failed to complete profile. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = (id: number) => {
    setSelectedPlanId(id);
    const plan = enterprisePlans.find((p) => p.id === id);
    const price =
      typeof plan?.price === "string" ? parseFloat(plan.price) : plan?.price;
    const isFree = plan && (price === 0 || plan.tier?.toLowerCase() === "free");

    if (!isFree) {
      // For paid plans, submit immediately with this plan ID
      handleSubmit((data) => onSubmit({ ...data, plan_id: id }))();
    }
  };

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Choose your enterprise plan</h2>
          <p className="text-sm text-muted-foreground">
            Select a plan to complete your swap
          </p>
        </div>
        <ScrollArea className="h-[50vh] pr-4">
          <div className="grid grid-cols-1 gap-4 p-1">
            {isPlansLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading plans...</p>
              </div>
            ) : isPlansError ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <p className="text-sm text-red-500">Failed to load plans.</p>
                <Button size="sm" variant="outline" onClick={() => refetchPlansData()}>
                  Retry
                </Button>
              </div>
            ) : enterprisePlans.length === 0 ? (
              <p className="text-center py-10 text-sm text-muted-foreground">No plans available.</p>
            ) : (
              enterprisePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`transition-all duration-200 rounded-2xl ${
                    selectedPlanId === plan.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <PricingCard plan={plan} onSelect={handlePlanSelect} />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1"
            variant="linear-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Skip & Swap"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep(2);
      }}
      className="space-y-6"
    >
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-5 p-1">
          {/* Specification */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Specification
            </label>
            <CustomSelect
              label="Select Category"
              placeholder="Choose a category..."
              options={categoryOptions}
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            />

            {selectedCategory && (
              <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-medium text-gray-700">
                  Select roles in {formatLabel(selectedCategory)}:
                </h3>
                <CheckboxGroup
                  options={currentCategoryOptions}
                  value={currentCategoryValues}
                  listClassName="grid md:grid-cols-2 gap-4"
                  onValueChange={(value: string[]) => {
                    const categorySpecs = fallbackSpecifications[selectedCategory];
                    
                    // Remove all current category specs from the global list
                    const otherCategorySpecs: string[] = watch("specification").filter(
                      (s) => !categorySpecs.includes(s)
                    );
                    
                    // Add the new selections for this category
                    const newSpecs = Array.from(new Set([...otherCategorySpecs, ...value]));
                    
                    setValue("specification", newSpecs);
                  }}
                />
              </div>
            )}

            {/* Selected Specs Summary */}
            {watch("specification").length > 0 && (
              <div className="pt-6 border-t mt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Selected Specifications ({watch("specification").length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {watch("specification").map((spec, index) => (
                    <Badge
                      key={`${spec}-${index}`}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200"
                    >
                      {formatLabel(spec)}
                      <button
                        type="button"
                        onClick={() => {
                          const newSpecs = watch("specification").filter((s) => s !== spec);
                          setValue("specification", newSpecs);
                        }}
                        className="p-0.5 hover:bg-orange-200 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {errors.specification && (
              <p className="text-red-500 text-sm mt-1">
                {errors.specification.message}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Experience Level
            </label>
            <CheckboxGroup
              options={experienceOptions}
              value={watch("experience")}
              onValueChange={(value) => {
                const singleValue =
                  value.length > 0 ? [value[value.length - 1]] : [];
                setValue("experience", singleValue);
              }}
              listClassName="grid grid-cols-1 gap-2"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-2 gap-4">
            <FormGroup
              label="Country"
              placeholder="Your country"
              {...register("country")}
              message={errors.country?.message}
              size="xl"
            />
            <FormGroup
              label="City"
              placeholder="Your city"
              {...register("city")}
              message={errors.city?.message}
              size="xl"
            />
          </div>

          {/* Portfolio Images */}
          <FileUploader
            label="Upload Portfolio Images (optional)"
            maxFiles={5}
            onChange={(files) => setImages(files || [])}
          />
        </div>
      </ScrollArea>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="linear-1"
          disabled={isSubmitting}
          className="flex-1"
        >
          Next: Choose Plan
        </Button>
      </div>
    </form>
  );
}

// ==========================================
// Main Dialog Component
// ==========================================

export function SwapAccountDialog({
  open,
  onOpenChange,
  accountType,
}: SwapAccountDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                accountType === "enterprise"
                  ? "bg-linear-to-br from-orange-500 to-orange-600"
                  : "bg-linear-to-br from-purple-500 to-purple-600"
              }`}
            >
              {accountType === "enterprise" ? (
                <Building2 className="w-6 h-6 text-white" />
              ) : (
                <GraduationCap className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">
                Complete Your{" "}
                {accountType === "enterprise" ? "Enterprise" : "Student"}{" "}
                Profile
              </DialogTitle>
              <DialogDescription>
                Please fill in the required information to complete your account
                swap.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {accountType === "student" ? (
          <StudentCompleteForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <EnterpriseCompleteForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
