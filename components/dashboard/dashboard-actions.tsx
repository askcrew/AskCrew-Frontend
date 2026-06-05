"use client";

import { Clapperboard, Briefcase, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionItemProps {
  label: string;
  description: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
  onClick?: () => void;
}

function ActionItem({
  label,
  description,
  icon: Icon,
  gradientFrom,
  gradientTo,
  onClick,
}: ActionItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full h-auto p-0 overflow-hidden rounded-2xl lg:rounded-3xl border-0 bg-linear-to-br ${gradientFrom} ${gradientTo} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex-1 min-w-[160px]`}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <div className="relative w-full px-5 py-5 lg:px-7 lg:py-6 xl:px-8 xl:py-7 flex items-center gap-4">
        <div className="shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-base lg:text-lg font-black text-white tracking-tight">
            {label}
          </h3>
          <p className="text-xs lg:text-sm text-white/70 font-medium">
            {description}
          </p>
        </div>
        <ArrowRight className="shrink-0 w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </button>
  );
}

interface DashboardActionsProps {
  type: string;
}

export function DashboardActions({ type }: DashboardActionsProps) {
  const router = useRouter();
  const isEnterprise = type === "enterprise";

  const actions = [
    {
      label: isEnterprise ? "My Workshops" : "Browse Workshops",
      description: isEnterprise ? "Manage events" : "Find training",
      icon: Clapperboard,
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-600",
      path: isEnterprise
        ? "/enterprise/dashboard/workshops/my-workshop"
        : "/student/dashboard/workshops/apply",
    },
    {
      label: isEnterprise ? "Manage Jobs" : "Find Jobs",
      description: isEnterprise ? "Job postings" : "Search careers",
      icon: Briefcase,
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-600",
      path: isEnterprise
        ? "/enterprise/dashboard/jobs"
        : "/student/dashboard/jobs/apply",
    },
    {
      label: isEnterprise ? "My Products" : "Rent Equipment",
      description: isEnterprise ? "Manage rentals" : "Browse catalog",
      icon: ShoppingBag,
      gradientFrom: "from-pink-500",
      gradientTo: "to-rose-600",
      path: isEnterprise
        ? "/enterprise/dashboard/rentals"
        : "/student/dashboard/rentals/rent",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-5">
      {actions.map((action) => (
        <ActionItem
          key={action.label}
          {...action}
          onClick={() => router.push(action.path)}
        />
      ))}
    </div>
  );
}
