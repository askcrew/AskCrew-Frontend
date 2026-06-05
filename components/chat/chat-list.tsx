"use client";

import { ChatCard } from "./chat-card";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

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

interface ChatRoom {
  id: number;
  participant1: UserInfo;
  participant2: UserInfo;
  last_message: LastMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

const formatTimestamp = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export function ChatList() {
  const router = useRouter();

  const {
    data: chatRooms,
    isLoading,
    error,
  } = useQuery<ChatRoom[]>({
    queryKey: ["chat-rooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat/rooms/");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 px-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg p-3 animate-pulse"
          >
            <div className="size-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm text-muted-foreground">Failed to load chats</p>
      </div>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      {chatRooms.map((room) => {
        // Determine the other participant (not the current user)
        // For now, we'll show participant2, but you might want to determine the current user
        const otherParticipant = room.participant2;

        return (
          <ChatCard
            key={room.id}
            name={otherParticipant?.fullname}
            message={room.last_message?.content}
            time={formatTimestamp(room.last_message?.created_at)}
            avatar={otherParticipant?.profile_photo}
            unreadCount={room?.unread_count}
            onClick={() => router.push(`/chat/${room.id}`)}
          />
        );
      })}
    </div>
  );
}
