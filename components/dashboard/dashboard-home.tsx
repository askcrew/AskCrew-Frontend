"use client";

import { DashboardProfileHeader } from "./dashboard-profile-header";
import { DashboardStats } from "./dashboard-stats";
import { DashboardActions } from "./dashboard-actions";
import { DashboardHorizontalSection } from "./dashboard-horizontal-section";
import { MovieCard } from "@/components/global/movie-card";
import { WorkshopDashboardCard } from "./workshop-dashboard-card";
import { TalentDashboardCard } from "./talent-dashboard-card";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteContent } from "@/lib/api/favorites";

interface DashboardHomeProps {
  user: {
    id?: number;
    name: string;
    image: string;
    role: string;
    rating: number;
    reviewCount: number;
    isAvailable: boolean;
    isVerified: boolean;
    type: string;
  };
}

interface UserStats {
  mean_rating: number;
  total_completed_workshops: number;
  total_chat_rooms: number;
  total_rented_products: number;
  total_products_for_rent: number;
}

interface ApiWorkshop {
  id: number;
  title: string;
  start_date: string;
  provider_name: string;
  cover_photo: string;
}

interface ApiTalent {
  id: number;
  fullname: string;
  profile_photo: string | null;
  profile?: {
    specification?: string;
  };
}

export function DashboardHome({ user }: DashboardHomeProps) {
  const isEnterprise = user.type === "enterprise";

  // Fetch Movies
  const { data: moviesData, isLoading: isLoadingMovies } = useQuery<{
    results: FavoriteContent[];
  }>({
    queryKey: ["home-movies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/content/movies/");
      return res.data;
    },
  });

  // Fetch Workshops
  const { data: workshopsData, isLoading: isLoadingWorkshops } = useQuery<{
    results: ApiWorkshop[];
  }>({
    queryKey: ["home-workshops"],
    queryFn: async () => {
      const res = await axiosInstance.get("/workshop/");
      return res.data;
    },
  });

  // Fetch Talents (Enterprise Profiles)
  const { data: talentsData, isLoading: isLoadingTalents } = useQuery<{
    results: ApiTalent[];
  }>({
    queryKey: ["home-talents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/profiles?type=enterprise");
      return res.data;
    },
  });

  // Fetch Students
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery<{
    results: ApiTalent[];
  }>({
    queryKey: ["home-students"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/profiles?type=student");
      return res.data;
    },
  });

  // Fetch User Stats
  const { data: userStats, isLoading: isLoadingStats } = useQuery<UserStats>({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/my-stats");
      return res.data;
    },
  });

  const movies = moviesData?.results?.slice(0, 10) || [];
  const workshops = workshopsData?.results?.slice(0, 10) || [];
  const talents =
    talentsData?.results?.filter((t) => t.id !== user.id).slice(0, 10) || [];
  const students =
    studentsData?.results?.filter((s) => s.id !== user.id).slice(0, 10) || [];

  return (
    <div className="space-y-8 lg:space-y-10 xl:space-y-12 max-w-[1800px] mx-auto">
      {/* Profile Header */}
      <DashboardProfileHeader {...user} />

      {/* Stats Grid */}
      <DashboardStats stats={userStats} isLoading={isLoadingStats} />

      {/* Quick Actions */}
      <DashboardActions type={user.type} />

      {/* Content Sections */}
      <div className="space-y-10 lg:space-y-12 xl:space-y-14">
        {/* For Rent / Movies */}
        <DashboardHorizontalSection
          title="Featured Movies"
          seeMoreHref={
            isEnterprise
              ? "/enterprise/dashboard/movies"
              : "/student/dashboard/movies"
          }
        >
          {isLoadingMovies
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="min-w-[160px] max-w-[160px] lg:min-w-0 lg:max-w-none"
                >
                  <MovieCard
                    movie={{
                      ...movie,
                      actors: undefined,
                      cover_image:
                        movie.cover_image ||
                        movie.cover_photo ||
                        "/placeholder.svg",
                    }}
                  />
                </div>
              ))}
        </DashboardHorizontalSection>

        {/* New Workshops */}
        <DashboardHorizontalSection
          title="New Workshops"
          seeMoreHref={
            isEnterprise
              ? "/enterprise/dashboard/workshops/apply"
              : "/student/dashboard/workshops/apply"
          }
        >
          {isLoadingWorkshops
            ? [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))
            : workshops.map((workshop) => (
                <WorkshopDashboardCard
                  key={workshop.id}
                  id={workshop.id}
                  title={workshop.title}
                  date={new Date(workshop.start_date).toLocaleDateString(
                    "en-US",
                    { day: "numeric", month: "short" },
                  )}
                  provider={workshop.provider_name || "Professional"}
                  image={workshop.cover_photo}
                />
              ))}
        </DashboardHorizontalSection>

        {/* Find Talent */}
        <DashboardHorizontalSection
          title="Find Talent"
          seeMoreHref={
            isEnterprise
              ? "/enterprise/dashboard/talents"
              : "/student/dashboard/talents"
          }
        >
          {isLoadingTalents
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))
            : talents.map((talent) => (
                <TalentDashboardCard
                  key={talent.id}
                  id={talent.id}
                  name={talent.fullname}
                  role={talent.profile?.specification || "Professional"}
                  image={talent.profile_photo}
                  type="enterprise"
                />
              ))}
        </DashboardHorizontalSection>

        {/* Find Student */}
        <DashboardHorizontalSection
          title="Discover Students"
          seeMoreHref={
            isEnterprise
              ? "/enterprise/dashboard/talents"
              : "/student/dashboard/talents"
          }
        >
          {isLoadingStudents
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))
            : students.map((student) => (
                <TalentDashboardCard
                  key={student.id}
                  id={student.id}
                  name={student.fullname}
                  role={student.profile?.specification || "Student"}
                  image={student.profile_photo}
                  type="student"
                />
              ))}
        </DashboardHorizontalSection>
      </div>
    </div>
  );
}
