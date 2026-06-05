import { HeroSection } from "@/components/home/hero-section";
import { ContinueWatching } from "@/components/home/continue-watching";
import { SeriesAndMovies } from "@/components/home/series-and-movies";
import MarqueeTopPicks from "@/components/home/marquee";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-linear-to-br from-orange-500/15 via-transparent to-purple-600/15 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <MarqueeTopPicks />
        <ContinueWatching />
        <SeriesAndMovies />
      </div>
    </main>
  );
}
