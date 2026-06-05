"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Talent {
  id: string;
  name: string;
  image: string;
  rating: number;
  specification: string;
  isOnline: boolean;
  bio?: string;
  location?: string;
}

interface TalentCardProps {
  talent: Talent;
  onClick?: () => void;
}

export function TalentCard({ talent, onClick }: TalentCardProps) {
  const { name, image, rating, specification, isOnline, bio, location } =
    talent;
 
  return (
    <div
      onClick={onClick}
      className="group/talentcard cursor-pointer bg-card border border-border rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:border-accent-blue/30"
    >
      <div className="flex items-start gap-4">
        {/* Avatar with online status */}
        <div className="relative shrink-0">
          <Avatar className="size-16 ring-2 ring-border group-hover/talentcard:ring-accent-blue/50 transition-all duration-300">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {/* Online/Offline status indicator */}
          <div
            className={cn(
              "absolute bottom-0 right-0 size-4 rounded-full border-2 border-card",
              isOnline ? "bg-green-500" : "bg-red-400"
            )}
            title={isOnline ? "Online" : "Offline"}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base truncate group-hover/talentcard:text-accent-blue transition-colors">
                {name}
              </h3>
              <Badge
                variant="secondary"
                className="mt-1 bg-linear-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
              >
                {specification}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-lg shrink-0">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {bio}
            </p>
          )}

          {/* Location */}
          {location && (
            <p className="text-xs text-muted-foreground">📍 {location}</p>
          )}
        </div>
      </div>

      {/* Hover effect gradient line */}
      <div className="mt-4 h-0.5 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 scale-x-0 group-hover/talentcard:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
}
