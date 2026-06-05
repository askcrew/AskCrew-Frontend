import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRewards,
  fetchMyCodes,
  fetchRewardHistory,
  redeemReward,
} from "@/lib/api/rewards";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export const useRewards = () => {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: fetchRewards,
  });
};

export const useMyCodes = () => {
  return useQuery({
    queryKey: ["my-reward-codes"],
    queryFn: fetchMyCodes,
  });
};

export const useRewardHistory = () => {
  return useQuery({
    queryKey: ["reward-history"],
    queryFn: fetchRewardHistory,
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: number) => redeemReward(rewardId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-reward-codes"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["reward-history"] });

      Swal.fire({
        icon: "success",
        title: "Reward Redeemed!",
        html: `
          <div class="space-y-2">
            <p>${data.message}</p>
            <div class="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-purple-500 mt-4">
              <p class="text-sm text-gray-500 uppercase font-black">Your Code</p>
              <p class="text-2xl font-black text-purple-600 tracking-widest">${data.code}</p>
            </div>
            <p class="text-xs text-muted-foreground mt-2">You can find this code in your rewards history</p>
          </div>
        `,
        confirmButtonColor: "#9333ea",
      });
    },
    onError: (error: AxiosError) => {
      Swal.fire({
        icon: "error",
        title: "Redemption Failed",
        text:
          // @ts-expect-error nior
          error.response?.data?.message ||
          "Something went wrong. Please check your points balance.",
        confirmButtonColor: "#ef4444",
      });
    },
  });
};
