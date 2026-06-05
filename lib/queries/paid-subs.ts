import { useQuery } from "@tanstack/react-query";
import { getPaidMovies } from "../api/paid-subs";

export const usePaidMovies = () => {
  return useQuery({
    queryKey: ["paid-movies"],
    queryFn: getPaidMovies,
  });
};