"use client";

import { Star, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useWatermarkPayment } from "@/lib/queries/payment";
import Swal from "sweetalert2";

interface DashboardProfileHeaderProps {
  name: string;
  image: string;
  role: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isVerified: boolean;
}

export function DashboardProfileHeader({
  name,
  image,
  role,
  rating,
  reviewCount,
  isAvailable,
  isVerified,
}: DashboardProfileHeaderProps) {
  const { mutate: getVerified, isPending } = useWatermarkPayment();

  const handleVerifyRequest = () => {
    Swal.fire({
      title: "Get Verified Account",
      text: "Would you like to use your loyalty points for a discount on the watermark payment?",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Use Points",
      denyButtonText: "Don\u0027t Use Points",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#9333ea",
      denyButtonColor: "#f97316",
    }).then((result) => {
      if (result.isConfirmed) {
        getVerified(true);
      } else if (result.isDenied) {
        getVerified(false);
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-purple-600 p-[1px]">
      {/* Inner card */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-5 sm:p-8 lg:p-10">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 lg:gap-8">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div className="p-1 rounded-[1.75rem] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 shadow-xl shadow-orange-500/20">
              <Avatar className="size-24 sm:size-28 lg:size-32 rounded-3xl ring-4 ring-white dark:ring-zinc-900">
                <AvatarImage src={image} alt={name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-orange-100 to-purple-100 text-orange-600 font-black text-3xl lg:text-4xl rounded-3xl">
                  {name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            {isAvailable && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-3 py-1 rounded-full shadow-lg border border-green-100 dark:border-green-900">
                <div className="relative">
                  <div className="size-2.5 bg-green-500 rounded-full" />
                  <div className="absolute inset-0 size-2.5 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Available
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-3 lg:space-y-4 min-w-0">
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 flex-wrap">
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {name}
                </h2>
                {isVerified ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <CheckCircle2 className="size-4 fill-blue-500 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Verified
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVerifyRequest}
                    disabled={isPending}
                    className="rounded-full h-8 px-4 text-[10px] font-black uppercase border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all gap-1.5 shadow-sm"
                  >
                    {isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="size-3.5" />
                        Get Verified
                      </>
                    )}
                  </Button>
                )}
              </div>
              <p className="text-sm lg:text-base font-semibold text-gray-400 dark:text-gray-500">
                {role}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 lg:size-5 ${
                      star <= Math.floor(rating)
                        ? "fill-orange-400 text-orange-400"
                        : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-black text-orange-500">
                {rating.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-gray-400">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
