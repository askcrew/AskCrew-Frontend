"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useRef } from "react";
import { getCurrentUserProfile } from "@/lib/actions/auth";

// API Response Types
interface MessageSender {
  id: number;
  email: string;
  fullname: string;
  type: "enterprise" | "student";
  type_int: number;
  profile_photo: string | null;
  date_joined: string;
  is_active: boolean;
  is_verified: boolean;
  mobile_phone: string;
  personal_info: string;
  points: number;
  profile: any;
  rating_count: number;
  rating_mean: number;
  wallet: string;
  water_mark: boolean;
}

interface ChatMessage {
  id: number;
  sender: MessageSender;
  content: string;
  created_at: string;
  files: any[];
}

interface ChatMessagesProps {
  roomId: string;
}

export function ChatMessages({ roomId }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get current user info
  const { data: currentUserResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const currentUserId = currentUserResponse?.success
    ? currentUserResponse.data.id
    : null;

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", roomId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chat/rooms/${roomId}/messages/`);
      return res.data;
    },
    enabled: !!roomId,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col gap-2 max-w-[70%]">
                <div className="h-12 bg-muted rounded-2xl animate-pulse w-48" />
                <div className="h-3 bg-muted rounded w-12 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load messages
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No messages yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="flex flex-col justify-end min-h-full">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            timestamp={new Date(msg.created_at)}
            isSender={currentUserId ? msg.sender.id !== currentUserId : true}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
