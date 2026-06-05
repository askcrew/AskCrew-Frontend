"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface Banner {
  id: number;
  title: string;
  image: string;
  release_date?: string;
  rating?: number;
  description?: string;
  content_type?: string;
}

interface ApiBannerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: number;
    content_type: string;
    description: string;
    order: number;
    is_active: boolean;
    content_object: {
      id: number;
      name?: string;
      title?: string;
      about: string;
      cover_image?: string;
      cover_photo?: string;
      image?: string;
      rating_mean: number;
      created_at: string;
      category: {
        id: number;
        name: string;
        image: string | null;
      };
    };
    created_at: string;
    updated_at: string;
  }>;
}

const getBanners = async (): Promise<Banner[]> => {
  const response = await axiosInstance.get<ApiBannerResponse>(
    "/content/banners"
  );

  if (!response.data.results || !Array.isArray(response.data.results)) {
    return [];
  }

  return response.data.results.map((banner) => ({
    id: banner.id,
    title: banner.content_object.title || banner.content_object.name || "Untitled",
    image: banner.content_object.cover_photo || banner.content_object.cover_image || banner.content_object.image || "/lala.jpg",
    rating: banner.content_object.rating_mean,
    release_date: new Date(banner.content_object.created_at).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ),
    description: banner.description,
    content_type: banner.content_type,
  }));
};

export function NewestCarousel() {
  const {
    data: banners,
    error,
    isLoading,
  } = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  if (isLoading) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[400px] md:min-h-[600px] flex items-center justify-center">
        <p className="text-white">Loading banners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[400px] md:min-h-[600px] flex items-center justify-center">
        <p className="text-white">Error loading banners</p>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[400px] md:min-h-[600px] flex items-center justify-center">
        <p className="text-white">No banners available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {banners?.map((banner) => (
            <CarouselItem key={banner.id}>
              <CarouselSlide banner={banner} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <AutoScroller />
        <Bullets count={banners.length} />
      </Carousel>
    </div>
  );
}

const CarouselSlide = ({ banner }: { banner: Banner }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-slate-900 to-slate-800 min-h-[400px] md:min-h-[600px]">
      {/* Background Image (blurred/dimmed) */}
      <div className="absolute inset-0 opacity-30 blur-sm scale-110">
        <Image
          src={banner.image || "/lala.jpg"}
          alt={banner.title}
          className="w-full h-full object-cover object-center"
          fill
          sizes="100vw"
          priority
        />
      </div>

      {/* Foreground Image (normal size) */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div className="relative max-w-sm md:max-w-md lg:max-w-lg w-full">
          <Image
            src={banner.image || "/lala.jpg"}
            alt={banner.title}
            className="w-full h-auto object-cover rounded-lg shadow-2xl"
            width={400}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>

      {/* Linear Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative flex flex-col justify-center h-[400px] md:h-[600px] px-8 py-12 pointer-events-none">
        {/* Badge */}
        <div className="inline-block w-fit mb-4 pointer-events-auto">
          <span className="inline-block bg-orange-500 text-white md:px-3 px-1 py-1 rounded font-semibold text-sm">
            The Newest
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-6xl font-bold text-white mb-4 max-w-2xl pointer-events-auto">
          {banner.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-white pointer-events-auto">
          {banner.release_date && (
            <span className="md:text-base text-sm">{banner.release_date}</span>
          )}
          {banner.rating && (
            <div className="flex items-center gap-1">
              <span className="text-base md:text-lg">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              </span>
              <span className="md:text-base text-xs font-semibold">
                {banner.rating}
              </span>
            </div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute md:bottom-8 md:right-8 right-5 bottom-5 md:p-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
        >
          <Heart
            className={`md:size-6 size-4 ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const AutoScroller = () => {
  const { canScrollNext, scrollNext, api } = useCarousel();

  useEffect(() => {
    const interval = setInterval(() => {
      if (canScrollNext) {
        scrollNext();
      } else {
        api?.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [canScrollNext, scrollNext, api]);
  return null;
};

const Bullet = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={`transition-colors duration-500 w-5 h-3 rounded-full border-2 border-neutral-300  ${
        isActive ? "bg-orange-500 border-orange-500" : ""
      }`}
    />
  );
};

const Bullets = ({ count }: { count: number }) => {
  const { api } = useCarousel();
  const [current, setCurrent] = useState(api?.selectedScrollSnap());
  useEffect(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap());
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }
  }, [api]);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <Bullet key={index} isActive={current === index} />
      ))}
    </div>
  );
};
