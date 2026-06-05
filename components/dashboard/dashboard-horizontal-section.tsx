"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DashboardHorizontalSectionProps {
  title: string;
  seeMoreHref?: string;
  children: React.ReactNode;
  columns?: number;
}

export function DashboardHorizontalSection({
  title,
  seeMoreHref = "#",
  children,
  columns,
}: DashboardHorizontalSectionProps) {
  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 lg:h-8 rounded-full bg-linear-to-b from-orange-500 to-purple-600" />
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>
        <Link
          href={seeMoreHref}
          className="group flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-bold text-sm lg:text-base transition-colors px-3 py-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-500/10"
        >
          See More
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Content - Grid on large screens, horizontal scroll on small */}
      <div
        className={`
          flex gap-4 lg:gap-5 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide
          lg:mx-0 lg:px-0 lg:pb-0 lg:overflow-x-visible
          ${
            columns
              ? `lg:grid lg:grid-cols-${columns}`
              : "lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          }
        `}
      >
        {children}
      </div>
    </div>
  );
}
