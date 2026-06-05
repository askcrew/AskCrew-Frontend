"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface TalentDashboardCardProps {
  id: number;
  name: string;
  role: string;
  image: string | null;
  type: "student" | "enterprise";
}

export function TalentDashboardCard({
  id,
  name,
  role,
  image,
  type,
}: TalentDashboardCardProps) {
  const profilePath =
    type === "student"
      ? `/talents/students/${id}`
      : `/talents/enterprise/${id}`;

  return (
    <Link
      href={profilePath}
      className="min-w-[150px] lg:min-w-0 group cursor-pointer rounded-2xl lg:rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden block"
    >
      <div className="p-5 lg:p-7 flex flex-col items-center text-center gap-4">
        {/* Avatar with gradient ring */}
        <div className="relative">
          <div className="absolute -inset-1 bg-linear-to-br from-orange-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
          <Avatar className="relative size-20 lg:size-24 ring-4 ring-gray-50 dark:ring-zinc-800 shadow-md group-hover:scale-105 transition-transform duration-500">
            <AvatarImage
              src={image || undefined}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 text-orange-500 font-black text-xl">
              {name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h4 className="text-sm lg:text-base font-black text-gray-900 dark:text-white line-clamp-1 tracking-tight">
            {name}
          </h4>
          <p className="text-[10px] lg:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {role}
          </p>
        </div>
      </div>
    </Link>
  );
}
