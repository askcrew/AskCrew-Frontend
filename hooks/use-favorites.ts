import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import favoritesApi, {
  AddFavoritePayload,
  RemoveFavoritePayload,
  FavoritesResponse,
} from "@/lib/api/favorites";
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts

export function useFavorites(page = 1) {
  return useQuery<FavoritesResponse>({
    queryKey: ["favorites", page],
    queryFn: () => favoritesApi.getFavorites(page),
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddFavoritePayload) =>
      favoritesApi.addToFavorites(payload),
    onSuccess: () => {
      // Invalidate favorites query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      // You might also want to invalidate specific movie/series queries if they contain "is_favorite" status
      queryClient.invalidateQueries({ queryKey: ["movie"] });
      queryClient.invalidateQueries({ queryKey: ["series"] });

      toast.success("Added to favorites");
    },
    onError: (error: unknown) => {
      console.error("Failed to add to favorites:", error);
      toast.error("Failed to add to favorites");
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveFavoritePayload) =>
      favoritesApi.removeFromFavorites(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["movie"] });
      queryClient.invalidateQueries({ queryKey: ["series"] });

      toast.success("Removed from favorites");
    },
    onError: (error: unknown) => {
      console.error("Failed to remove from favorites:", error);
      toast.error("Failed to remove from favorites");
    },
  });
}
