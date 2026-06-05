"use client";

import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import CustomSelect from "@/components/global/custom-select";
import { FileUploader } from "@/components/global/file-uplaod";
import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { ISeries } from "./schema";


const seriesSchema = z.object({
  title: z.string().min(2, "Title is required"),
  about: z.string().min(10, "About must be at least 10 characters"),
  category_id: z.string().min(1, "Category is required"),
});

type SeriesFormValues = z.infer<typeof seriesSchema>;

interface SeriesFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
  series?: ISeries;
}

export function SeriesForm({ series, onCancel }: SeriesFormProps) {
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Add loading state
 const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      title: series?.title || "",
      about: series?.about || "",
      category_id:  series?.category?.id?.toString() || "",
    },
  });
  console.log("series",series);
  
  // Fetch categories using tanstack query
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/categories");
      return res.data.categories;
    },
  });

  // Transform categories for CustomSelect
  const categoryOptions = categoriesData
    ? categoriesData.map((cat: { id: number; name: string }) => ({
        label: cat.name,
        value: cat.id,
      }))
    : [];

  const handleCoverImage = (file: File[] | null) => {
    setCoverImage(file ? file[0] : null);
  };
  const onSubmit = async (data: SeriesFormValues) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", data.title);
      formDataToSend.append("category_id", data.category_id);
      formDataToSend.append("about", data.about || "");
      if (coverImage) {
        formDataToSend.append("cover_photo", coverImage);
      }

      let response;
      if (series && series.id) {
        // Edit mode: PATCH to /content/series/{id}/
        response = await axiosInstance.patch(
          `/content/series/${series.id}/`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Add mode: POST to /content/series/
        response = await axiosInstance.post(
          "/content/series/",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response.status === 200 || response.status === 201) {
        onCancel();
        Swal.fire({
          icon: "success",
          title: series ? "Series Updated" : "Series Added",
          text: `The series has been ${series ? "updated" : "added"} successfully.`,
        });
        reset();
        setCoverImage(null);
        window.location.reload();
      }
    } catch (e: unknown) {
      const error = e as AxiosError<{ message: string }>;
      console.error("Error:", error);
      onCancel();
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred while submitting the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
      
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Cover Photo */}
        <FileUploader
          label="Series Cover Photo"
          maxFiles={1}
          onChange={handleCoverImage}
        />

        {/* Series Title */}
        <FormGroup
          label="Series Title"
          placeholder="e.g., Behind the Lens"
          {...register("title")}
          className="h-11 border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
          message={errors.title?.message}
        />

        {/* About */}
        <FormText
          label="About"
          placeholder="Describe your series, its theme, and what viewers can expect..."
          {...register("about")}
          className="min-h-37.5 resize-none border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
          message={errors.about?.message}
        />

        {/* Category */}
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Category"
              options={categoryOptions}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={
                isCategoriesLoading ? "Loading..." : "Select category"
              }
              size={"xl"}
              className="w-full"
              message={
                categoriesError
                  ? "Failed to load categories"
                  : (errors.category_id?.message as string)
              }
            />
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11 border-2 hover:bg-muted transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-11 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
        >
          <IconSparkles className="mr-2 size-4" />
          {series ? "Update Series" : "Add Series"}
        </Button>
      </div>
    </form>
  );
}
