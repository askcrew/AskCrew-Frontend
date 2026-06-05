"use client";

import { getCurrentUserProfile } from "@/lib/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function DashboardContent() {
  const { data: userProfileResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const userData = userProfileResponse?.success
    ? userProfileResponse?.data
    : null;

  const user = {
    id: userData?.id,
    name: userData?.fullname || "User",
    image: userData?.profile_photo || "",
    role: userData?.profile?.specification || "Student",
    rating: userData?.rating_mean || 0,
    reviewCount: userData?.rating_count || 0,
    isAvailable: userData?.is_active || false,
    isVerified: userData?.is_verified || false,
    type: "student",
    stats: {
      views: userData?.profile?.views || 0,
      bookings: userData?.profile?.total_bookings || 0,
      topWorkView: userData?.profile?.top_work_view || 0,
    },
  };

  return <DashboardHome user={user} />;
}

export default function Page() {
  return (
    <div className="relative flex flex-1 flex-col min-h-screen">
      {/* Subtle background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 bg-gray-50/80 dark:bg-zinc-950/80">
        <Suspense
          fallback={
            <div className="flex h-[50vh] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
