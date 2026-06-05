import { useMutation } from "@tanstack/react-query";
import { createWatermarkPayment } from "@/lib/api/payment";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export const useWatermarkPayment = () => {
  return useMutation({
    mutationFn: (usePoints?: boolean) => createWatermarkPayment(usePoints),
    onSuccess: (data) => {
      if (data.transaction?.url) {
        // Redirect to the payment URL
        window.location.href = data.transaction.url;
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Could not initiate payment. Please try again.",
        });
      }
    },
    onError: (error: AxiosError) => {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text:
          // @ts-expect-error nior
          error.response?.data?.message ||
          "An unexpected error occurred during payment initiation.",
      });
    },
  });
};
