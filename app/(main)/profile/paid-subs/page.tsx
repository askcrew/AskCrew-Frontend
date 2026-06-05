"use client";

import { usePaidMovies } from "@/lib/queries/paid-subs";
import { MovieCard } from "@/components/global/movie-card";
import { Loader2, PlayCircle, Film, Tv, MonitorPlay } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieFromPaidSubs } from "@/types/movie";

export default function PaidSubsPage() {
  const { data, isLoading, error } = usePaidMovies();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading your paid content...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
            Failed to load content
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const movies = data?.movies || [];
  const series = data?.series || [];
  const advertise = data?.advertise || [];
  const hasContent =
    movies.length > 0 || series.length > 0 || advertise.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-6">
        <div className="relative">
          <div className="absolute -inset-4 bg-linear-to-r from-purple-500/20 to-orange-500/20 blur-2xl rounded-full" />
          <PlayCircle className="h-20 w-20 text-muted-foreground relative z-10 opacity-20" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">No paid content yet</h2>
          <p className="text-muted-foreground max-w-sm">
            Content you purchase or subscribe to will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Safe casting function for MovieCard
  const castMovie = (item: MovieFromPaidSubs, type: "movie" | "series") => {
    return {
      ...item,
      contentType: type,
      // Fix type mismatches
      admin_approved_by:
        typeof item.admin_approved_by === "string"
          ? parseInt(item.admin_approved_by)
          : item.admin_approved_by,
    }; // Using any here because MovieCard interface is very permissive but has some strict number fields
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <header className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-black tracking-tight mb-2">
          My{" "}
          <span className="bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Paid Subscriptions
          </span>
        </h1>
        <p className="text-muted-foreground">
          Manage and access all your premium content in one place.
        </p>
      </header>

      <Tabs defaultValue="movies" className="w-full">
        <div className="flex justify-center sm:justify-start mb-8">
          <TabsList className="bg-secondary/50 p-1 rounded-2xl h-auto border border-border/40">
            <TabsTrigger
              value="movies"
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm data-[state=active]:text-purple-600 gap-2 transition-all font-bold"
            >
              <Film className="h-4 w-4" />
              Movies ({movies.length})
            </TabsTrigger>
            <TabsTrigger
              value="series"
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm data-[state=active]:text-purple-600 gap-2 transition-all font-bold"
            >
              <Tv className="h-4 w-4" />
              Series ({series.length})
            </TabsTrigger>
            <TabsTrigger
              value="advertise"
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm data-[state=active]:text-purple-600 gap-2 transition-all font-bold"
            >
              <MonitorPlay className="h-4 w-4" />
              Adverts ({advertise.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="movies" className="mt-0">
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie: MovieFromPaidSubs) => (
                <MovieCard key={movie.id} movie={castMovie(movie, "movie")} />
              ))}
            </div>
          ) : (
            <EmptyCategory message="You haven't purchased any movies yet." />
          )}
        </TabsContent>

        <TabsContent value="series" className="mt-0">
          {series.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {series.map((item: MovieFromPaidSubs) => (
                <MovieCard key={item.id} movie={castMovie(item, "series")} />
              ))}
            </div>
          ) : (
            <EmptyCategory message="You haven't subscribed to any series yet." />
          )}
        </TabsContent>

        <TabsContent value="advertise" className="mt-0">
          {advertise.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {advertise.map((item: MovieFromPaidSubs) => (
                <MovieCard key={item.id} movie={castMovie(item, "movie")} />
              ))}
            </div>
          ) : (
            <EmptyCategory message="Your advertisements will appear here." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyCategory({ message }: { message: string }) {
  return (
    <div className="py-20 text-center bg-secondary/20 rounded-3xl border border-dashed border-border/60">
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
