"use client";

import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import CustomSelect from "@/components/global/custom-select";
import LocationInput from "@/components/global/location-input";
import { FileUploader } from "@/components/global/file-uplaod";
import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import * as React from "react";
import { ApiRentalProduct } from "./products-data-table/schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import {
  RentalProductFormData,
  rentalProductSchema,
} from "@/Schemas/enterprise/rental-product";

const types = [
  { label: "Tool", value: "tool" },
  { label: "Studio", value: "studio" },
];

interface ProductFormProps {
  product?: ApiRentalProduct;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function ProductForm({
  product,
  onCancel,
  onSuccess,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [image, setImage] = React.useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<RentalProductFormData>({
    resolver: zodResolver(rentalProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      type: product?.type || "",
      price_per_day: product?.price_per_day
        ? Number(product.price_per_day)
        : undefined,
      location: product?.location || "",
      quantity: product?.quantity,
    },
  });

  const onSubmit = async (data: RentalProductFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("quantity", data.quantity.toString());
      formData.append("type", data.type);
      formData.append("price_per_day", data.price_per_day.toString());
      formData.append("location", data.location);

      // Add images if any
      if (image) {
        formData.append("image", image);
      }

      // Check if updating or creating
      if (product?.id) {
        // Update existing product
        await axiosInstance.put(`/booking/items/${product.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        await axiosInstance.post("/booking/items/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product created successfully!");
      }

      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error(
        `Error ${product?.id ? "updating" : "creating"} product:`,
        error
      );
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as unknown as { response?: { data?: { message?: string } } })
              .response?.data?.message
          : undefined;
      toast.error(
        errorMessage ||
          `Failed to ${
            product?.id ? "update" : "create"
          } product. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Product Images */}

        <FileUploader
          label="Product Images"
          onChange={(files) => setImage(files?.[0] || null)}
          primaryPreviewFile={product?.image || undefined}
        />
        {/* Product Name */}

        <FormGroup
          label="Product Name"
          placeholder="e.g., Sony A7 III Camera Body"
          {...register("name")}
          className="h-11 border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
          message={errors.name?.message}
        />

        {/* Description */}

        <FormText
          label="Description"
          placeholder="Describe your product, its features, and condition..."
          {...register("description")}
          className="min-h-30 resize-none border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
          message={errors.description?.message}
        />

        {/* Category and Condition */}
        <div className="grid grid-cols md:grid-cols-2  gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CustomSelect
                options={types}
                placeholder="Select type"
                label="Type"
                className="h-11 border-2"
                onValueChange={field.onChange}
                value={field.value || product?.type}
                message={errors.type?.message}
              />
            )}
          />

          <FormGroup
            label="Quantity"
            type="number"
            placeholder="5"
            {...register("quantity")}
            className="h-11 border-2 focus-visible:border-orange-500"
            message={errors.quantity?.message}
          />
        </div>

        {/* Pricing */}
        <div className="space-y-4 p-4 rounded-lg bg-linear-to-br from-orange-500/5 to-purple-500/5 border border-orange-500/20">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-4 bg-linear-to-b from-orange-500 to-purple-600 rounded-full"></span>
            Rental Pricing
          </h3>
          <div className="grid grid-cols-1  gap-4">
            <FormGroup
              label="Price per Day ($)"
              type="number"
              placeholder="75"
              {...register("price_per_day")}
              className="h-11 border-2 focus-visible:border-orange-500"
              message={errors.price_per_day?.message}
            />

            {/* <Controller
              name="pricePerWeek"
              control={control}
              render={({ field }) => (
                <FormGroup
                  label="Price per Week ($)"
                  name="pricePerWeek"
                  type="number"
                  placeholder="450"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-11 border-2 focus-visible:border-orange-500"
                  message={errors.pricePerWeek?.message}
                  required
                />
              )}
            /> */}
            {/* <Controller
              name="pricePerMonth"
              control={control}
              render={({ field }) => (
                <FormGroup
                  label="Price per Month ($)"
                  name="pricePerMonth"
                  type="number"
                  placeholder="1500"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-11 border-2 focus-visible:border-orange-500"
                  message={errors.pricePerMonth?.message}
                  required
                />
              )}
            /> */}
          </div>
        </div>

        {/* Location */}
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <LocationInput
              label="Product Location"
              className="rounded-lg"
              placeholder="Enter location"
              {...field}
              message={errors.location?.message}
            />
          )}
        />

        {/* Specifications */}
        {/* <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-foreground">
              Specifications
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSpecification}
              className="h-8 border-2 border-orange-500/30 hover:bg-orange-500/10"
            >
              <IconPlus className="mr-1 size-3" />
              Add Spec
            </Button>
          </div>
          <div className="space-y-2">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Key (e.g., Sensor)"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecificationChange(index, "key", e.target.value)
                  }
                  className="h-10 border-2 focus-visible:border-orange-500"
                />
                <Input
                  placeholder="Value (e.g., 24.2MP Full-Frame)"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecificationChange(index, "value", e.target.value)
                  }
                  className="h-10 border-2 focus-visible:border-orange-500"
                />
                {specifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSpecification(index)}
                    className="h-10 w-10 text-destructive hover:bg-destructive/10"
                  >
                    <IconX className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.specifications && (
            <p className="text-sm text-destructive">
              {errors.specifications.message}
            </p>
          )}
        </div> */}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11 border-2 hover:bg-muted transition-all"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 h-11 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
          disabled={isSubmitting}
        >
          <IconSparkles className="mr-2 size-4" />
          {isSubmitting
            ? "Submitting..."
            : product
            ? "Update Product"
            : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
