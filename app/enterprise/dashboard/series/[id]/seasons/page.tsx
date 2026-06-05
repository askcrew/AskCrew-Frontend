"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconVideo, IconSparkles } from "@tabler/icons-react";
import { ISeason} from "@/components/enterprise/series/seasons/schema";
import { SeasonCard } from "@/components/enterprise/series/seasons/season-card";
import { AddSeasonDialog } from "@/components/enterprise/series/seasons/add-season-dialog";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";


export default function SeasonsPage() {
  const params = useParams();
  const router = useRouter();
  const seriesId = params.id as string;
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", seriesId],
    queryFn: async () => {
      const res = await axiosInstance.get("/content/seasons?series=" + seriesId);
      return res.data;
    },
  });



  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/enterprise/dashboard/series")}
        className="w-fit hover:bg-orange-500/10"
      >
        <IconArrowLeft className="mr-2 size-4" />
        Back to Series
      </Button>

      {/* Series Header */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <IconVideo className="size-8 text-orange-500" />
                <h1 className="text-3xl font-bold tracking-tight">
                  {data?.results[0]?.series?.title}
                </h1>
              </div>
              <p className="text-base text-muted-foreground mb-4">
              {data?.results[0]?.series?.about}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <IconSparkles className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {data?.results?.length} {data?.results?.length === 1 ? "Season" : "Seasons"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <IconVideo className="size-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {data?.results[0]?.episodes_count} Total
                Episodes
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                 {data?.results[0]?.series?.category?.name} Category
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Season Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
          Seasons
        </h2>
        <AddSeasonDialog />
      </div>

      {/* Seasons Grid */}
   
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
          <div className="col-span-full flex justify-center items-center py-12">
            <svg
              className="animate-spin h-6 w-6 text-muted-foreground mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading Seasons...
          </div>
        )}
          {data?.results?.map((season:ISeason) => (
            <SeasonCard key={season.id} season={season} />
          ))}
        </div>
          {data?.results?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
          <IconVideo className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No seasons yet
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
            Get started by adding the first season to this series!
          </p>
          <AddSeasonDialog />
        </div>
            )}
      
    </div>
  );
}
