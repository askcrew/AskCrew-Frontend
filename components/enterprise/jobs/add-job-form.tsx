"use client";
import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "@/lib/axiosInstance";
import { FileUploader } from "@/components/global/file-uplaod";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface AddJobFormProps {
  onCancel: () => void;
}

type JobFormInputs = {
  company_name: string;
  job_title: string;
  about: string;
  is_active: boolean;
  image: File[];
};

export function AddJobForm({ onCancel }: AddJobFormProps) {
  const [uploading, setUploading] = useState(false);
  const router=useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobFormInputs>({
    defaultValues: {
      company_name: "",
      job_title: "",
      about: "",
      is_active: true,
      image: [],
    },
  });

  const onSubmit = async (data: JobFormInputs) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("company_name", data.company_name);
      formData.append("job_title", data.job_title);
      formData.append("about", data.about);
      formData.append("is_active", String(data.is_active));
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      const res = await axiosInstance.post("/community/jobs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        reset();
        onCancel();
        Swal.fire({
          icon: "success",
          title: "Job Created!",
          text: "The job has been posted successfully.",
        });
        router.push("enterprise/dashboard/jobs/my-jobs");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unexpected Response",
          text: `Status: ${res.status}`,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to create job.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
      {/* Company Name */}
      <FormGroup
        label="Company Name *"
        placeholder="e.g., Warner Bros"
        
        {...register("company_name", { required: "Company name is required" })}
        message={errors.company_name?.message}
      />

      {/* Job Title */}
      <FormGroup
        label="Job Title *"
        placeholder="e.g., Lead Actor - Drama Series"
        {...register("job_title", { required: "Job title is required" })}
        message={errors.job_title?.message}
      />

      {/* About (Company Description) */}
      <FormText
        label="About Company *"
        placeholder="Describe the Company"
        rows={4}
        
        {...register("about", { required: "About is required" })}
        message={errors.about?.message}
      />

      {/* Is Active */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          {...register("is_active")}
          defaultChecked
        />
        <label htmlFor="is_active" className="text-sm">
          Active
        </label>
      </div>

      {/* Image Upload */}
      <Controller
        name="image"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FileUploader
            label="Company Logo"
            maxFiles={1}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={uploading || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600"
          disabled={uploading || isSubmitting}
        >
          {uploading || isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
}
