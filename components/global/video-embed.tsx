"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

interface VideoEmbedProps {
  videoUrl: string;
  title: string;
}

export function VideoEmbed({ videoUrl, title }: VideoEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen().catch(console.error);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative group rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 ${
        isFullscreen ? "w-screen h-screen rounded-none" : ""
      }`}
    >
      {/* Video Container with 16:9 Aspect Ratio */}
      <div
        className={`relative ${
          isFullscreen ? "w-full h-full" : "w-full aspect-video"
        }`}
      >
        {/* Iframe */}
        <iframe
          src={videoUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />

        {/* Gradient Overlay for Controls */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Bar with Title */}
        <div className="absolute top-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-white text-xs font-semibold tracking-wide">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-white/80">Live</span>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            {/* Left side - Video info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="text-xs font-medium text-white/80">
                  HD Quality
                </span>
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-3">
              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className="relative h-10 w-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20 group/btn"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-orange-500/0 to-purple-600/0 group-hover/btn:from-orange-500/30 group-hover/btn:to-purple-600/30 transition-all duration-300" />
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-white transition-colors group-hover/btn:text-orange-300" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-white transition-colors group-hover/btn:text-orange-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Corner decorations for premium feel */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-white/60 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              PREMIUM
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen hint overlay */}
      {!isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="hidden md:flex items-center gap-2 text-white/50 text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Maximize2 className="h-3 w-3" />
            <span>Press F for fullscreen</span>
          </div>
        </div>
      )}
    </div>
  );
}
