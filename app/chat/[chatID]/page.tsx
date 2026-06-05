"use client";

import { use } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

// API Response Types
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

interface ChatRoomDetails {
  id: number;
  participant1: UserInfo;
  participant2: UserInfo;
  last_message: LastMessage | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ChatMainPageProps {
  params: Promise<{
    chatID: string;
  }>;
}

const ChatMainPage = ({ params }: ChatMainPageProps) => {
  const { chatID } = use(params);

  // Fetch room details
  const { data: roomDetails, isLoading } = useQuery<ChatRoomDetails>({
    queryKey: ["chat-room", chatID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chat/rooms/${chatID}/`);
      return res.data;
    },
    enabled: !!chatID,
  });

  // Get current user ID from localStorage (you might want to get this from a context or auth hook)
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      // You might want to store this in localStorage or get from auth context
      // For now, we'll use participant2 as the "other" user
      return null;
    }
    return null;
  };

  // Determine the other participant (not the current user)
  const otherParticipant =
    roomDetails?.participant2 || roomDetails?.participant1;

    console.log("data",roomDetails);
    
  return (
    <div className="flex flex-col h-full w-full bg-background relative">
      <div className="absolute inset-0 bg-linear-to-br from-orange-50/30 via-background to-purple-50/30 pointer-events-none" />

      {isLoading ? (
        <div className="flex items-center justify-between border-b p-4 bg-background/95">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      ) : otherParticipant ? (
        <ChatHeader
          name={otherParticipant.fullname}
          status="online"
          avatarUrl={otherParticipant.profile_photo}
        />
      ) : (
        <ChatHeader name="Chat" status="offline" />
      )}

      <ChatMessages roomId={chatID} />
      <ChatInput roomId={chatID} />
    </div>
  );
};

export default ChatMainPage;
