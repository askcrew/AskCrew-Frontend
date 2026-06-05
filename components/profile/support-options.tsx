import { Phone, MessageCircle, Send } from "lucide-react";

const supportChannels = [
  {
    name: "Phone",
    icon: Phone,
    href: "tel:+1234567890",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    hoverBg: "hover:bg-blue-500/20",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/1234567890",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    hoverBg: "hover:bg-green-500/20",
  },
  {
    name: "Telegram",
    icon: Send,
    href: "https://t.me/support",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-400/10",
    hoverBg: "hover:bg-blue-400/20",
  },
];

export function SupportOptions() {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      {supportChannels.map((channel) => (
        <a
          key={channel.name}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex flex-col items-center gap-3 p-6 rounded-2xl ${channel.bgColor} ${channel.hoverBg} border border-transparent hover:border-white/10 transition-all duration-200 hover:scale-105`}
        >
          <div
            className={`w-16 h-16 rounded-full bg-linear-to-br ${channel.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
          >
            <channel.icon className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {channel.name}
          </span>
        </a>
      ))}
    </div>
  );
}
