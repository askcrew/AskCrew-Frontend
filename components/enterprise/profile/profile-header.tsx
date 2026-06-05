"use client";

import { Star, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  role: string;
  isAvailable: boolean;
  isVerified: boolean;
}

export function ProfileHeader({
  name,
  image,
  rating,
  reviewCount,
  role,
  isAvailable,
  isVerified,
}: ProfileHeaderProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
      <div className="flex flex-col items-center text-center">
        {/* Avatar with availability indicator */}
        <div className="relative mb-4">
          <Avatar className="size-32 ring-4 ring-border shadow-xl">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white font-bold text-3xl">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {/* Availability indicator */}
          {isAvailable && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-4 border-card shadow-lg">
              <CheckCircle className="size-5 text-white" />
            </div>
          )}
        </div>

        {/* Name with verification */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">{name}</h1>
          {isVerified && (
            <Image src={"/icons/verified.svg"} width={24} height={24} alt="" />
          )}
        </div>

        {/* Availability status */}
        {isAvailable && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-3">
            Available
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "size-5",
                star <= Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : star === Math.ceil(rating)
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
              )}
            />
          ))}
          <span className="ml-2 text-sm font-bold text-foreground">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Review count */}
        <p className="text-sm text-muted-foreground mb-4">
          ({reviewCount} reviews)
        </p>

        {/* Role badge */}
        <Badge className="bg-linear-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 px-4 py-1.5 text-sm font-semibold">
          {role}
        </Badge>
      </div>
    </div>
  );
}
