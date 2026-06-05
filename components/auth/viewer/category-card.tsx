"use client";

import { Check } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    label: string;
    icon: string;
  };
  isSelected: boolean;
  onToggle: () => void;
}

export default function CategoryCard({
  category,
  isSelected,
  onToggle,
}: CategoryCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center gap-2 lg:gap-3 p-4 lg:p-6 rounded-2xl lg:rounded-3xl transition-all duration-200 ${
        isSelected
          ? "bg-linear-to-r from-orange-500 to-purple-600 shadow-lg scale-105"
          : "bg-muted hover:bg-slate-100 hover:shadow-md"
      }`}
      aria-pressed={isSelected}
    >
      <div className="relative">
        <span className="text-4xl lg:text-6xl block">{category.icon}</span>
        {isSelected && (
          <div className="absolute -top-1 -right-1 lg:top-0 lg:right-0 bg-white rounded-full p-1">
            <Check className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
          </div>
        )}
      </div>

      <span
        className={`text-sm lg:text-base font-semibold text-center leading-tight ${
          isSelected ? "text-white" : "text-foreground"
        }`}
      >
        {category.label}
      </span>
    </button>
  );
}
