import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { AuthCookieAPI } from "../axiosInstance";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  getNotification,
} from "../api/notifications";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

export const useNotification = (id: number) => {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => getNotification(id),
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationsCount,
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: markNotificationAsRead,
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
  });
};

export function useNotificationStream() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function setupStream() {
      try {
        const { accessToken, isAuthenticated } =
          await AuthCookieAPI.getStatus();
        if (!isAuthenticated || !accessToken) return;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        // Construct the full URL for SSE.
        // For SSE, we use the absolute URL to avoid proxy issues with EventSource
        const absoluteBaseUrl = "https://admin.askcrews.com/api/v1";
        const streamUrl = `${absoluteBaseUrl}/notifications/stream/?token=${accessToken}`;

        eventSource = new EventSource(streamUrl);

        eventSource.onmessage = (event) => {
          console.log("New notification received via SSE:", event.data);

          // Play notification sound
          const audio = new Audio("/sounds/not.mp3");
          audio.play().catch((err) => {
            console.warn("Notification sound blocked by browser:", err);
          });

          // Invalidate notifications queries to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });
        };

        eventSource.onerror = (error) => {
          console.error("SSE Connection Error:", error);
          eventSource?.close();
        };
      } catch (err) {
        console.error("Failed to setup notification stream:", err);
      }
    }

    setupStream();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [queryClient]);
}
