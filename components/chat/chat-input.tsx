"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { ChatEmojiPicker } from "../global/emoji-picker";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

interface ChatInputProps {
  roomId: string;
}

export function ChatInput({ roomId }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await axiosInstance.post(
        `/chat/rooms/${roomId}/send-message/`,
        { content }
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ["chat-messages", roomId] });
      // Also invalidate chat rooms list to update last message
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      // Clear input
      setInputValue("");
    },
  });

  const handleSendMessage = () => {
    const trimmedMessage = inputValue.trim();
    if (trimmedMessage && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(trimmedMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function onEmojiSelect(emoji: string) {
    setInputValue((prev) => prev + ` ${emoji}`);
  }

  return (
    <div className="p-4 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
            className="pr-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
          <ChatEmojiPicker onEmojiSelect={onEmojiSelect} />
        </div>
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || sendMessageMutation.isPending}
          className="bg-(--clr-brand-orange) hover:bg-(--clr-brand-orange)/90 text-white shrink-0 shadow-sm disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
