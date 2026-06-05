"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import type { TrendingContent, TrendingResponse } from "@/Schemas/content/trending";
import { ChevronLeft, Volume2, VolumeX, Heart, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAddToFavorites, useRemoveFromFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRequiredDialog } from "@/components/global/auth-required-dialog";
import Swal from "sweetalert2";

interface TrailerData { contentId: number; trailerUrl: string | null; isLoading: boolean; }

function TrailersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startId = searchParams.get("startId");
  const { mutate: addFav } = useAddToFavorites();
  const { mutate: removeFav } = useRemoveFromFavorites();
  const { isAuthenticated } = useAuth();
  const { setIsOpen: setAuthOpen } = useAuthRequiredDialog();
  const [content, setContent] = useState<TrendingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailers, setTrailers] = useState<Map<number, TrailerData>>(new Map());
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [favOverrides, setFavOverrides] = useState<Map<number, boolean>>(new Map());
  const [animatingFavs, setAnimatingFavs] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const p: Record<string, string> = { page: "1" };
        const c = searchParams.get("categories");
        if (c) p.category = c;
        const r = await axiosInstance.get<TrendingResponse>("/content/trending/", { params: p });
        setContent(r.data.results);
        if (startId) { const i = r.data.results.findIndex((x) => x.id.toString() === startId); if (i !== -1) setIdx(i); }
      } catch { Swal.fire({ icon: "error", title: "Error", text: "Failed to load." }); }
      finally { setLoading(false); }
    })();
  }, [startId, searchParams]);

  const fetchTrailer = useCallback(async (id: number) => {
    setTrailers((p) => { const n = new Map(p); n.set(id, { contentId: id, trailerUrl: null, isLoading: true }); return n; });
    try {
      const r = await axiosInstance.get(`/content/videos/movie/${id}/trailer-token`);
      setTrailers((p) => { const n = new Map(p); n.set(id, { contentId: id, trailerUrl: r.data.embed_url || r.data.token || r.data, isLoading: false }); return n; });
    } catch { setTrailers((p) => { const n = new Map(p); n.set(id, { contentId: id, trailerUrl: null, isLoading: false }); return n; }); }
  }, []);

  useEffect(() => {
    if (!content.length) return;
    [idx - 1, idx, idx + 1].filter((i) => i >= 0 && i < content.length).forEach((i) => { if (!trailers.has(content[i].id)) fetchTrailer(content[i].id); });
  }, [idx, content, trailers, fetchTrailer]);

  useEffect(() => {
    if (loading || !content.length) return;
    const si = startId ? content.findIndex((x) => x.id.toString() === startId) : 0;
    if (si > 0) requestAnimationFrame(() => slideRefs.current.get(si)?.scrollIntoView({ behavior: "auto" }));
  }, [loading, content, startId]);

  useEffect(() => {
    if (!containerRef.current || !content.length) return;
    const obs = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && e.intersectionRatio >= 0.6) { const i = Number(e.target.getAttribute("data-index")); if (!isNaN(i)) setIdx(i); } }); }, { root: containerRef.current, threshold: 0.6 });
    slideRefs.current.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [content]);

  const handleFav = (e: React.MouseEvent, item: TrendingContent) => {
    e.stopPropagation();
    if (!isAuthenticated) { setAuthOpen(true); return; }
    const currentFav = favOverrides.get(item.id) ?? item.is_favorite;
    const newFav = !currentFav;
    // Optimistic UI update
    setFavOverrides((p) => { const n = new Map(p); n.set(item.id, newFav); return n; });
    // Trigger animation
    setAnimatingFavs((p) => { const n = new Set(p); n.add(item.id); return n; });
    setTimeout(() => setAnimatingFavs((p) => { const n = new Set(p); n.delete(item.id); return n; }), 600);
    // API call
    const pl = { content_type: (item.art_work_type?.toLowerCase() === "series" ? "series" : "movie") as "series" | "movie", object_id: item.id };
    if (currentFav) removeFav(pl); else addFav(pl);
  };

  if (loading) return <div className="fixed inset-0 bg-black flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" /></div>;
  if (!content.length) return <div className="fixed inset-0 bg-black flex items-center justify-center z-50"><Button variant="outline" onClick={() => router.back()} className="text-white border-white/30">Go Back</Button></div>;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent">
        <Button variant="ghost" size="icon" onClick={() => router.push("/explore")} className="text-white hover:bg-white/20 rounded-full"><ChevronLeft className="size-6" /></Button>
        <span className="text-white font-semibold text-sm">{idx + 1} / {content.length}</span>
        <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)} className="text-white hover:bg-white/20 rounded-full">{muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}</Button>
      </div>
      <div ref={containerRef} className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {content.map((item, index) => {
          const t = trailers.get(item.id);
          const active = index === idx;
          const src = t?.trailerUrl ? `${t.trailerUrl}${t.trailerUrl.includes("?") ? "&" : "?"}autoplay=${active ? 1 : 0}&mute=${muted ? 1 : 0}` : "";
          return (
            <div key={item.id} data-index={index} ref={(el) => { if (el) slideRefs.current.set(index, el); }} className="h-full w-full snap-start snap-always relative">
              {t?.isLoading ? <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white" /></div>
              : src ? <iframe src={active ? src : ""} className="absolute inset-0 w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              : <div className="absolute inset-0 flex flex-col items-center justify-center"><img src={item.cover_image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-30" /><Play className="size-16 text-white/50 mb-2" /><p className="text-white/50 text-sm">Trailer not available</p></div>}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-10 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white text-xl font-bold truncate">{item.name}</h2>
                    <p className="text-white/70 text-sm line-clamp-2 mt-1">{item.about}</p>
                    <div className="flex items-center gap-3 mt-2"><div className="flex items-center gap-1"><Star className="size-4 fill-yellow-400 text-yellow-400" /><span className="text-white text-sm font-semibold">{item.rating_mean.toFixed(1)}</span></div><span className="text-white/50 text-sm">{item.category.name}</span></div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <button onClick={(e) => handleFav(e, item)} className="flex flex-col items-center gap-1"><Heart className={cn("size-7 transition-all duration-300", (favOverrides.get(item.id) ?? item.is_favorite) ? "fill-red-500 text-red-500" : "text-white", animatingFavs.has(item.id) && "animate-heart-pop scale-125")} /><span className="text-white/70 text-xs">Favorite</span></button>
                    <button onClick={() => router.push(`/movie/${item.id}`)} className="flex flex-col items-center gap-1"><Play className="size-7 text-white" /><span className="text-white/70 text-xs">Watch</span></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrailersPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" /></div>}>
      <TrailersContent />
    </Suspense>
  );
}
