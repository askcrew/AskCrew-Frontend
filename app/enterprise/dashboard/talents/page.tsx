"use client";

import { useState, useMemo } from "react";
import SearchBar from "@/components/global/search-bar";
import {
  TalentCard,
  Talent,
} from "@/components/enterprise/talents/talent-card";
import {
  TalentFilterModal,
  TalentFilters,
} from "@/components/enterprise/talents/talent-filter-modal";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useCreateChat } from "@/hooks/use-create-chat";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/actions/auth";

// API Response Types
interface ApiProfile {
  city: string;
  country: string;
  created_at: string;
  experience: string;
  images: Array<{ image: string }>;
  plan: {
    booking_limit: number;
    currency: string;
    features: Array<{ id: number; name: string; description: string | null }>;
    id: number;
    is_active: boolean;
    name: string;
    plan_type: string;
    price: string;
    tier: string;
  };
  specification: string;
  top_work_view: number;
  total_bookings: number;
  updated_at: string;
  videos: any[];
  views: number;
}

interface ApiTalent {
  date_joined: string;
  email: string;
  fullname: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  mobile_phone: string;
  personal_info: any;
  points: number;
  profile: ApiProfile;
  profile_photo: string | null;
  rating_count: number;
  rating_mean: number;
  type: string;
  type_int: number;
  wallet: string;
  water_mark: boolean;
}

// Transform API data to Talent interface
const transformApiTalentToTalent = (apiTalent: ApiTalent): Talent => {
  const location =
    apiTalent.profile?.city && apiTalent.profile?.country
      ? `${apiTalent.profile.city}, ${apiTalent.profile.country}`
      : undefined;

  const image =
    apiTalent.profile?.images?.[0]?.image ||
    apiTalent.profile_photo ||
    "/placeholder.svg";

  return {
    id: apiTalent.id.toString(),
    name: apiTalent.fullname,
    image: image,
    rating: apiTalent.rating_mean || 0,
    specification: apiTalent.profile?.specification || "Not specified",
    isOnline: apiTalent.is_active,
    bio: `${apiTalent.profile?.experience || ""} • ${
      apiTalent.profile?.total_bookings || 0
    } bookings`,
    location: location,
  };
};

const FindTalentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TalentFilters>({
    specifications: [],
    status: "all",
    rating: "all",
  });
  const router = useRouter();

  // Get current user profile to filter out from talents list
  const { data: currentUserResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
    staleTime: 1000 * 60 * 5,
  });

  const currentUserId = currentUserResponse?.success
    ? currentUserResponse.data.id
    : null;

  const { data, isLoading, error } = useQuery<{ results: ApiTalent[] }>({
    queryKey: ["enterprise-talents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/profiles?type=enterprise");
      return res.data;
    },
  });

  // Transform API data to Talent format and filter out current user
  const talents = useMemo(() => {
    if (!data?.results || !Array.isArray(data.results)) return [];
    return data.results
      .filter((apiTalent) => apiTalent.id !== currentUserId) // Filter out current user
      .map(transformApiTalentToTalent);
  }, [data, currentUserId]);

  // Filter and search talents
  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.specification
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        talent.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      // Specification filter
      const matchesSpecification =
        filters.specifications.length === 0 ||
        filters.specifications.includes(talent.specification.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "online" && talent.isOnline) ||
        (filters.status === "offline" && !talent.isOnline);

      // Rating filter
      const matchesRating =
        filters.rating === "all" || talent.rating >= parseFloat(filters.rating);

      return (
        matchesSearch && matchesSpecification && matchesStatus && matchesRating
      );
    });
  }, [talents, searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="h1 mb-2 bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Find Talents
        </h1>
        <p className="text-muted-foreground">
          Discover talented professionals, students, and creatives for your next
          project
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1 w-full sm:max-w-md"
        />
        <TalentFilterModal filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 mb-4 animate-pulse">
            <Filter className="size-8 text-purple-600" />
          </div>
          <h3 className="h3 mb-2">Loading talents...</h3>
          <p className="text-muted-foreground">
            Please wait while we fetch the latest talent profiles
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-red-500/20 mb-4">
            <Filter className="size-8 text-red-600" />
          </div>
          <h3 className="h3 mb-2 text-red-600">Error loading talents</h3>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      )}

      {/* Results count */}
      {!isLoading && !error && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Found{" "}
            <span className="font-semibold text-foreground">
              {filteredTalents.length}
            </span>{" "}
            talent{filteredTalents.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Talents Grid */}
      {!isLoading && !error && filteredTalents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <TalentCard
              key={talent.id}
              talent={talent}
              onClick={() => {
                router.push(`/talents/enterprise/${talent?.id}`);
              }}
            />
          ))}
        </div>
      ) : (
        !isLoading &&
        !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 mb-4">
              <Filter className="size-8 text-purple-600" />
            </div>
            <h3 className="h3 mb-2">No talents found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you&apos;re
              looking for
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default FindTalentsPage;
