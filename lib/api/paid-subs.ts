import axiosInstance from "../axiosInstance";
import { PaidSusResponse } from "@/types/movie";

export const getPaidMovies = async () => {
  const response = await axiosInstance.get<PaidSusResponse>(
    `/content/paid-content`,
  );
  return response.data;
};
