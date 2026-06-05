"use client";

import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

interface UserInfo {
  id: number;
  email: string;
  fullname: string;
  type: "enterprise" | "student";
  profile_photo: string;
}

interface LastMessage {
  id: number;
  sender: UserInfo;
  content: string;
  created_at: string;
}

interface ChatRoomResponse {
  id: number;
  participant1: UserInfo;
  participant2: UserInfo;
  last_message: LastMessage | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export function useCreateChat() {
  const router = useRouter();

  const mutation = useMutation<ChatRoomResponse, Error, number>({
    mutationFn: async (userId: number) => {
      const res = await axiosInstance.post("/chat/rooms/get-or-create/", {
        user_id: userId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Navigate to the chat room
      router.push(`/chat/${data.id}`);
    },
  });

  return mutation;
}
