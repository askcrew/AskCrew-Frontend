"use client";

import { ChevronLeft, Heart, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  image: string;
  title: string;
  date: string;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function HeroSection({
  image,
  title,
  date,
  isFavorite,
  onToggleFavorite,
}: HeroSectionProps) {
  const router = useRouter();

  return (
    <div className="relative h-[60vh] w-full overflow-hidden shadow-2xl">
      {/* Background Image */}
      <Image src={image} alt={title} fill priority className="object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/90" />

      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-white/80 transition-colors"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        {/* Right side icons can go here if needed, e.g. share or more options */}
      </div>

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 group border border-white/30">
          <div className="h-12 w-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-lg">
            <Play className="h-5 w-5 fill-black text-black ml-1" />
          </div>
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
            {title}
          </h1>
          <p className="text-sm text-gray-300 font-medium">{date}</p>
        </div>
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="text-white hover:text-red-500 transition-colors mb-1 p-2 rounded-full hover:bg-white/10"
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-white",
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
