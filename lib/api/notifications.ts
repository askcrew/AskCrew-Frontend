import axiosInstance from "../axiosInstance";
import { Notification } from "@/types/notifications";

export async function getNotifications(): Promise<Notification[]> {
  const response = await axiosInstance.get<Notification[]>("/notifications/");
  return response.data;
}

export async function markNotificationAsRead(
  id: number,
): Promise<Notification> {
  const response = await axiosInstance.patch<Notification>(
    `/notifications/${id}/mark-read/`,
  );
  return response.data;
}

export async function markAllNotificationsAsRead(): Promise<Notification[]> {
  const response = await axiosInstance.patch<Notification[]>(
    `/notifications/mark-all-read/`,
  );
  return response.data;
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const response = await axiosInstance.get<number>(`/notifications/unread/`);
  return response.data;
}

export async function getNotification(id: number): Promise<Notification> {
  const response = await axiosInstance.get<Notification>(
    `/notifications/${id}/`,
  );
  return response.data;
}
