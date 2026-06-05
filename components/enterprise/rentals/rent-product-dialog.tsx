"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import { IconPackage, IconSend } from "@tabler/icons-react";
import { ApiRentalProduct } from "./products-data-table/schema";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";

// Zod schema for booking validation
const bookingSchema = z
  .object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    quantity: z.string().min(1, "Quantity must be at least 1"),
    item: z.string().min(1, "Item is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

type BookingFormData = z.infer<typeof bookingSchema>;

interface RentProductDialogProps {
  product: ApiRentalProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RentProductDialog({
  product,
  open,
  onOpenChange,
}: RentProductDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      quantity: "1",
      item: String(product.id),
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await axiosInstance.post("/booking/bookings/", {
        start_date: data.start_date,
        end_date: data.end_date,
        quantity: data.quantity,
        item: product.id,
      });

      if (response.status === 201) {
        onOpenChange(false);
        Swal.fire({
          icon: "success",
          title: "Request Sent!",
          text: "Your rental request has been sent successfully.",
          confirmButtonColor: "#f97316",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err instanceof Error ? err.message : "Failed to send rental request",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // Calculate duration and price
  const calculateRental = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return null;

    const totalPrice = days * Number(product.price_per_day);

    return { days, totalPrice };
  };

  const rental = calculateRental();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconPackage className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Rent Product
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            <span className="font-semibold text-foreground">
              {product.name}
            </span>
            <br />
            Fill in the rental details to send a request to the owner.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-4">
            {/* Rental Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormGroup
                  label="Start Date"
                  type="date"
                  {...register("start_date")}
                  className="h-11 border-2 focus-visible:border-orange-500"
                  message={errors.start_date?.message as string}
                />
              </div>
              <div className="space-y-2">
                <FormGroup
                  label="End Date"
                  type="date"
                  {...register("end_date")}
                  className="h-11 border-2 focus-visible:border-orange-500"
                  message={errors.end_date?.message as string}
                />
              </div>
            </div>
            <div className="grid grid-cols-1  gap-4">
              <FormGroup
                label="Quantity"
                type="number"
                {...register("quantity")}
                className="h-11 border-2 focus-visible:border-orange-500"
                message={errors.quantity?.message as string}
              />
            </div>

            {/* Rental Summary */}
            {rental && (
              <div className="p-4 rounded-lg bg-linear-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20 space-y-2">
                <Label className="text-base font-semibold text-foreground">
                  Rental Summary
                </Label>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">
                    {rental.days} {rental.days === 1 ? "day" : "days"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Daily Rate:</span>
                  <span className="font-semibold">
                    ${product.price_per_day}/day
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold border-t border-orange-500/20 pt-2 mt-2">
                  <span className="text-foreground">Total Price:</span>
                  <span className="text-orange-600">${rental.totalPrice}</span>
                </div>
              </div>
            )}

            {/* Message to Owner */}
            {/* <div className="space-y-2">
              <FormText
                label="Message to Owner (Optional)"
                placeholder="Add any special requests or questions for the owner..."
                {...register("message")}
                className="min-h-[100px] resize-none border-2 focus-visible:border-orange-500"
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 border-2 hover:bg-muted transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!rental || isSubmitting}
              className="flex-1 h-11 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50"
            >
              <IconSend className="mr-2 size-4" />
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
