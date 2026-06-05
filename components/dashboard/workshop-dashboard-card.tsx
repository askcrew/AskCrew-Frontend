"use client";

import Image from "next/image";
import { Calendar, User2 } from "lucide-react";
import Link from "next/link";

interface WorkshopDashboardCardProps {
  id: number;
  title: string;
  date: string;
  provider: string;
  image: string;
}

export function WorkshopDashboardCard({
  id,
  title,
  date,
  provider,
  image,
}: WorkshopDashboardCardProps) {
  return (
    <Link
      href={`/student/dashboard/workshops/${id}/apply`} // Navigating to the specific workshop
      className="min-w-[280px] lg:min-w-0 group cursor-pointer overflow-hidden rounded-2xl lg:rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Date badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <Calendar className="size-3 text-orange-500" />
          <span className="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            {date}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
          <h3 className="text-lg lg:text-xl font-black text-white tracking-tight drop-shadow-lg group-hover:text-orange-200 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      {/* Provider */}
      <div className="p-4 lg:p-5 flex items-center gap-2">
        <div className="size-7 lg:size-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
          <User2 className="size-3.5 lg:size-4 text-orange-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Hosted by
          </p>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">
            {provider}
          </p>
        </div>
      </div>
    </Link>
  );
}
