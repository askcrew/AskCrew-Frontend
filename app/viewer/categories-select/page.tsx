"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import CategoryGrid from "@/components/auth/viewer/category-grid";
import ConfirmButton from "@/components/auth/viewer/confirm-button";
import Image from "next/image";
import Logo from "@/components/global/logo";

export default function Page() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  const categories = [
    { id: "horror", label: "Horror", icon: "👻" },
    { id: "comedy", label: "Comedy", icon: "😄" },
    { id: "romance", label: "Romance", icon: "💑" },
    { id: "animation", label: "Animation", icon: "🎬" },
    { id: "reality", label: "Reality", icon: "📺" },
    { id: "history", label: "History", icon: "📷" },
    { id: "music", label: "Music", icon: "🎵" },
    { id: "mystery", label: "Mystery", icon: "🎭" },
    { id: "fantasy", label: "Fantasy", icon: "🪄" },
  ];

  const toggleCategory = (id: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCategories(newSelected);
  };

  const handleConfirm = () => {
    console.log("Selected categories:", Array.from(selectedCategories));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-orange-50 to-rose-50 flex items-center justify-center px-4 py-12 lg:px-8 lg:py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <button
            className="p-2.5 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-slate-700" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          <button className="text-purple-600 font-semibold text-sm lg:text-base hover:text-purple-700 transition-colors px-3 py-1.5 hover:bg-white/60 rounded-lg">
            Skip
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl lg:rounded-4xl p-8 lg:p-12 shadow-2xl border border-white/20">
          {/* Heading Section */}
          <div className="text-center mb-10 lg:mb-14">
            <h1 className="text-3xl lg:text-5xl font-bold bg-linear-to-r from-purple-600 via-orange-500 to-pink-600 bg-clip-text text-transparent mb-4 lg:mb-5 text-balance leading-tight">
              Tell us Your Favorite Categories
            </h1>

            <p className="text-base lg:text-lg text-slate-600 leading-relaxed text-pretty max-w-xl mx-auto">
              Your picks help us suggest the best content for you — select as
              many as you like ✨
            </p>
          </div>

          {/* Selection Counter */}
          {selectedCategories.size > 0 && (
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-100 to-orange-100 rounded-full text-sm font-medium text-purple-700 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                {selectedCategories.size}{" "}
                {selectedCategories.size === 1 ? "category" : "categories"}{" "}
                selected
              </span>
            </div>
          )}

          {/* Category Grid */}
          <CategoryGrid
            categories={categories}
            selectedCategories={selectedCategories}
            onToggle={toggleCategory}
          />

          {/* Confirm Button */}
          <div className="mt-10 lg:mt-12">
            <ConfirmButton onClick={handleConfirm} />
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center mt-6 text-sm text-slate-500">
          You can always change your preferences later
        </p>
      </div>
    </div>
  );
}
