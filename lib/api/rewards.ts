import axiosInstance from "@/lib/axiosInstance";

export interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  image: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface RewardCode {
  code: string;
  reward: Reward;
  created_at: string;
  is_active: boolean;
}

export interface RewardHistory {
  points: number;
  title: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchRewards = async (): Promise<PaginatedResponse<Reward>> => {
  const response = await axiosInstance.get("/reward/rewards/");
  return response.data;
};

export const fetchMyCodes = async (): Promise<
  PaginatedResponse<RewardCode>
> => {
  const response = await axiosInstance.get("/reward/codes/");
  return response.data;
};

export const fetchRewardHistory = async (): Promise<
  PaginatedResponse<RewardHistory>
> => {
  const response = await axiosInstance.get("/reward/history/");
  return response.data;
};

export const redeemReward = async (rewardId: number) => {
  const response = await axiosInstance.post("/reward/redeem/", {
    reward_id: rewardId,
  });
  return response.data;
};
