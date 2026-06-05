"use client";

import CategoryCard from "./category-card";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CategoryGridProps {
  categories: Category[];
  selectedCategories: Set<string>;
  onToggle: (id: string) => void;
}

export default function CategoryGrid({
  categories,
  selectedCategories,
  onToggle,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-8">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isSelected={selectedCategories.has(category.id)}
          onToggle={() => onToggle(category.id)}
        />
      ))}
    </div>
  );
}
