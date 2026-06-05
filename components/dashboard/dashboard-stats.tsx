"use client";

import { Star, Smartphone, Trophy, History, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accentFrom: string;
  accentTo: string;
  iconBg: string;
}

function StatItem({
  icon: Icon,
  label,
  value,
  accentFrom,
  accentTo,
  iconBg,
}: StatItemProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl lg:rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 cursor-default">
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentFrom} ${accentTo} opacity-60 group-hover:opacity-100 transition-opacity`}
      />
      {/* Hover glow */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${accentFrom} ${accentTo} rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
      />

      <div className="relative p-5 lg:p-6 xl:p-8 flex items-center gap-4 lg:gap-5">
        <div
          className={`shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ${iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-current" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  stats?: {
    mean_rating: number;
    total_completed_workshops: number;
    total_chat_rooms: number;
    total_rented_products: number;
    total_products_for_rent: number;
  };
  isLoading?: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 lg:gap-5">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-4 lg:gap-5">
      <StatItem
        icon={Star}
        label="Mean Rating"
        value={stats?.mean_rating?.toFixed(1) || "0.0"}
        accentFrom="from-orange-500"
        accentTo="to-amber-400"
        iconBg="bg-orange-50 dark:bg-orange-500/10 text-orange-500"
      />
      <StatItem
        icon={Trophy}
        label="Workshops"
        value={stats?.total_completed_workshops || 0}
        accentFrom="from-purple-500"
        accentTo="to-violet-400"
        iconBg="bg-purple-50 dark:bg-purple-500/10 text-purple-500"
      />
      <StatItem
        icon={Smartphone}
        label="Chat Rooms"
        value={stats?.total_chat_rooms || 0}
        accentFrom="from-emerald-500"
        accentTo="to-teal-400"
        iconBg="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
      />
      <StatItem
        icon={ShoppingBag}
        label="Items for Rent"
        value={stats?.total_products_for_rent || 0}
        accentFrom="from-pink-500"
        accentTo="to-rose-400"
        iconBg="bg-pink-50 dark:bg-pink-500/10 text-pink-500"
      />
    </div>
  );
}
