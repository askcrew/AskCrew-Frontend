"use client";

import { Play, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useState, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="px-6 py-6">
      <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
        {title}
      </h2>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 shadow-lg group">
        {!isPlaying ? (
          // Thumbnail with Play Button
          <div className="relative w-full h-full">
            <img
              src={
                thumbnailUrl ||
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
              }
              alt="Trailer thumbnail"
              className="w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="relative h-20 w-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group/play border border-white/20 shadow-2xl"
              >
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-orange-500/20 to-red-500/20 group-hover/play:from-orange-500/30 group-hover/play:to-red-500/30 transition-all" />
                <div className="relative h-14 w-14 bg-white rounded-full flex items-center justify-center group-hover/play:bg-linear-to-br group-hover/play:from-orange-500 group-hover/play:to-red-500 transition-all shadow-lg">
                  <Play className="h-6 w-6 fill-black text-black ml-1 group-hover/play:fill-white group-hover/play:text-white transition-colors" />
                </div>
              </button>
            </div>

            {/* Trailer label */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-white text-xs font-semibold tracking-wide">
                {title}
              </span>
            </div>
          </div>
        ) : (
          // Video Player
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full"
              src={`${videoUrl}${
                videoUrl.includes("?") ? "&" : "?"
              }autoplay=1&mute=${isMuted ? 1 : 0}`}
              title={title}
            />

            {/* Video controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-orange-500 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button className="text-white hover:text-orange-500 transition-colors">
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional trailer info */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            HD Quality
          </span>
        </div>
      </div>
    </div>
  );
}
