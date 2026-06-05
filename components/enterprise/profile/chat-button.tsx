import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  onClick?: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="w-full bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl py-6 text-base"
    >
      <MessageCircle className="size-5 mr-2" />
      Start Chat
    </Button>
  );
}
