"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { usePaymentContext } from "@/contexts/payment-context";
import usePaymentDialog from "@/hooks/use-payment-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle,
  Film,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRequiredDialog } from "@/components/global/auth-required-dialog";
import {
  useAddToFavorites,
  useRemoveFromFavorites,
} from "@/hooks/use-favorites";
import { Heart } from "lucide-react";

// ==========================================
// Types
// ==========================================
interface Category {
  id: number;
  name: string;
  image: string | null;
}

interface SeriesData {
  id: number;
  title: string;
  about: string;
  cover_photo: string;
  category: Category;
  seasons_count: number;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}

interface SeasonData {
  id: number;
  series: SeriesData;
  season_number: number;
  price: string;
  cover_photo: string;
  trailer: string;
  episodes_count: number;
  created_at: string;
  updated_at: string;
  is_paid?: boolean;
}

interface EpisodeData {
  id: number;
  season: number;
  episode_number: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  created_at: string;
}

interface SeasonsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SeasonData[];
}

interface EpisodesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EpisodeData[];
}

// ==========================================
// API Functions
// ==========================================
const getSeriesDetails = async (id: string): Promise<SeriesData> => {
  const response = await axiosInstance.get(`/content/series/${id}`);
  return response.data;
};

const getSeasons = async (seriesId: string): Promise<SeasonsResponse> => {
  const response = await axiosInstance.get(
    `/content/seasons?series=${seriesId}`,
  );
  return response.data;
};

const getEpisodes = async (seasonId: number): Promise<EpisodesResponse> => {
  const response = await axiosInstance.get(
    `/content/episodes?season=${seasonId}`,
  );
  return response.data;
};

const getVideoToken = async (
  contentType: string,
  id: number,
): Promise<string> => {
  const response = await axiosInstance.get(
    `/content/videos/${contentType}/${id}/token`,
  );
  return response.data.embed_url || response.data.token || response.data;
};

const getTrailerToken = async (
  contentType: string,
  id: number,
): Promise<string> => {
  const response = await axiosInstance.get(
    `/content/videos/${contentType}/${id}/trailer-token`,
  );
  return response.data.embed_url || response.data.token || response.data;
};

// ==========================================
// Components
// ==========================================
interface SeasonCardProps {
  season: SeasonData;
  isExpanded: boolean;
  onToggle: () => void;
  onBuy: () => void;
  onPlayEpisode: (episodeId: number) => void;
  onPlayTrailer: () => void;
}

function SeasonCard({
  season,
  isExpanded,
  onToggle,
  onBuy,
  onPlayEpisode,
  onPlayTrailer,
}: SeasonCardProps) {
  const price = parseFloat(season.price);
  const isFree = price === 0;
  const canWatch = isFree || season.is_paid;

  const { data: episodes, isLoading: isLoadingEpisodes } =
    useQuery<EpisodesResponse>({
      queryKey: ["episodes", season.id],
      queryFn: () => getEpisodes(season.id),
      enabled: isExpanded,
    });

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Season Header */}
      <div
        className="p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        {/* Season Cover */}
        <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
          {season.cover_photo ? (
            <Image
              src={season.cover_photo}
              alt={`Season ${season.season_number}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          {canWatch && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Season Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">
              Season {season.season_number}
            </h3>
            {canWatch ? (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                {isFree ? "Free" : "Owned"}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-orange-500/10 text-orange-600 border-orange-500/20"
              >
                <Lock className="w-3 h-3 mr-1" />${price.toFixed(2)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {season.episodes_count} episode
            {season.episodes_count !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!canWatch && (
            <Button
              size="sm"
              variant="linear-1"
              onClick={(e) => {
                e.stopPropagation();
                onBuy();
              }}
            >
              Buy Season
            </Button>
          )}
          {season.trailer && (
            <Button
              size="sm"
              variant="outline"
              className="hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer();
              }}
            >
              <Film className="w-4 h-4 mr-2" />
              Trailer
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Episodes List */}
      {isExpanded && (
        <div className="border-t border-border/50 bg-muted/30">
          {isLoadingEpisodes ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary" />
            </div>
          ) : episodes?.results && episodes.results.length > 0 ? (
            <div className="divide-y divide-border/50">
              {episodes.results.map((episode) => (
                <EpisodeRow
                  key={episode.id}
                  episode={episode}
                  canWatch={canWatch || false}
                  onPlay={() => onPlayEpisode(episode.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No episodes available yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface EpisodeRowProps {
  episode: EpisodeData;
  canWatch: boolean;
  onPlay: () => void;
}

function EpisodeRow({ episode, canWatch, onPlay }: EpisodeRowProps) {
  return (
    <div
      className={cn(
        "p-4 flex items-center gap-4 transition-colors",
        canWatch ? "hover:bg-muted/50 cursor-pointer" : "opacity-60",
      )}
      onClick={canWatch ? onPlay : undefined}
    >
      {/* Episode Thumbnail */}
      <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
        {episode.thumbnail ? (
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500/20 to-orange-500/20">
            <Film className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        {canWatch && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-black ml-0.5" />
            </div>
          </div>
        )}
        {!canWatch && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white/70" />
          </div>
        )}
      </div>

      {/* Episode Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            E{episode.episode_number}
          </span>
          <h4 className="font-medium truncate">{episode.title}</h4>
        </div>
        {episode.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {episode.description}
          </p>
        )}
      </div>

      {/* Duration */}
      {episode.duration && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          <Clock className="w-4 h-4" />
          <span>{episode.duration}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Main Page Component
// ==========================================
export default function SeriesDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const status = searchParams.get("status");
  const hasPaymentSuccess = status === "payment-successful";

  const { setPaymentContent } = usePaymentContext();
  const { setIsOpen } = usePaymentDialog();

  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [playingEpisodeId, setPlayingEpisodeId] = useState<number | null>(null);
  const [playingTrailerId, setPlayingTrailerId] = useState<{
    id: number;
    type: "season" | "series";
  } | null>(null);

  // Fetch series details
  const {
    data: series,
    isLoading: isLoadingSeries,
    error: seriesError,
  } = useQuery<SeriesData>({
    queryKey: ["series", id],
    queryFn: () => getSeriesDetails(id),
    enabled: !!id,
  });

  // Fetch seasons
  const { data: seasonsData, isLoading: isLoadingSeasons } =
    useQuery<SeasonsResponse>({
      queryKey: ["seasons", id],
      queryFn: () => getSeasons(id),
      enabled: !!id,
    });

  // Fetch video token for trailer
  const { data: trailerVideoUrl, isLoading: isLoadingTrailer } =
    useQuery<string>({
      queryKey: ["trailer-video", playingTrailerId],
      queryFn: () =>
        getTrailerToken(playingTrailerId!.type, playingTrailerId!.id),
      enabled: !!playingTrailerId,
    });

  // Fetch video token for playing episode
  const { data: episodeVideoUrl, isLoading: isLoadingVideo } = useQuery<string>(
    {
      queryKey: ["episode-video", playingEpisodeId],
      queryFn: () => getVideoToken("episode", playingEpisodeId!),
      enabled: !!playingEpisodeId,
    },
  );

  /* hooks */
  const { mutate: addToFavorites } = useAddToFavorites();
  const { mutate: removeFromFavorites } = useRemoveFromFavorites();

  const { isAuthenticated } = useAuth();
  const { setIsOpen: setAuthDialogOpen } = useAuthRequiredDialog();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    if (!series) return;

    const payload = {
      content_type: "series" as const,
      object_id: series.id,
    };

    if (series.is_favorite) {
      removeFromFavorites(payload);
    } else {
      addToFavorites(payload);
    }
  };

  const handleBuySeason = (seasonId: number) => {
    // Check if user is authenticated before allowing payment
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    setPaymentContent(seasonId.toString(), "season");
    setIsOpen(true);
  };

  const handlePlayEpisode = (episodeId: number) => {
    setPlayingEpisodeId(episodeId);
    setPlayingTrailerId(null);
  };

  const closePlayer = () => {
    setPlayingEpisodeId(null);
    setPlayingTrailerId(null);
  };

  // Loading state
  if (isLoadingSeries) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">Loading series...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (seriesError || !series) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <span className="text-3xl">!</span>
          </div>
          <h3 className="text-xl font-bold">Failed to Load Series</h3>
          <p className="text-muted-foreground">
            We couldn&apos;t load the series details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={series.cover_photo}
          alt={series.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <div className="flex items-start gap-2 mb-3">
              <Badge
                variant="secondary"
                className="bg-purple-500/10 text-purple-600 border-purple-500/20"
              >
                TV Series
              </Badge>
              {series.category && (
                <Badge variant="outline">{series.category.name}</Badge>
              )}
              {hasPaymentSuccess && (
                <Badge className="bg-green-500 text-white animate-pulse">
                  ✓ Purchase Successful
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {series.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>
                {series.seasons_count} Season
                {series.seasons_count !== 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span>{new Date(series.created_at).getFullYear()}</span>
            </div>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="text-white hover:text-red-500 transition-colors mb-4 p-2 rounded-full hover:bg-white/10"
          >
            <Heart
              className={cn(
                "h-8 w-8 transition-colors",
                series.is_favorite ? "fill-red-500 text-red-500" : "text-white",
              )}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {series.about}
          </p>
        </section>

        {/* Seasons */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Seasons ({seasonsData?.count || 0})
          </h2>

          {isLoadingSeasons ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-muted rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : seasonsData?.results && seasonsData.results.length > 0 ? (
            <div className="space-y-4">
              {seasonsData.results.map((season) => (
                <SeasonCard
                  key={season.id}
                  season={season}
                  isExpanded={expandedSeason === season.id}
                  onToggle={() =>
                    setExpandedSeason(
                      expandedSeason === season.id ? null : season.id,
                    )
                  }
                  onBuy={() => handleBuySeason(season.id)}
                  onPlayEpisode={handlePlayEpisode}
                  onPlayTrailer={() =>
                    setPlayingTrailerId({ id: season.id, type: "season" })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No seasons available yet</p>
            </div>
          )}
        </section>
      </div>

      {/* Video Player Modal */}
      {(playingEpisodeId || playingTrailerId) && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-6xl mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
              onClick={closePlayer}
            >
              ✕
            </Button>
            {isLoadingVideo || isLoadingTrailer ? (
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
              </div>
            ) : episodeVideoUrl || trailerVideoUrl ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={episodeVideoUrl || trailerVideoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              </div>
            ) : (
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                Failed to load video
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
