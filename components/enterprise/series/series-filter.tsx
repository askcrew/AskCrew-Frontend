"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconFilter, IconSearch, IconX } from "@tabler/icons-react";

interface SeriesFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  categories: string[];
}

export function SeriesFilter({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  categories,
}: SeriesFilterProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onCategoriesChange([]);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search series..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 border-2 focus-visible:border-orange-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 border-2">
                <IconFilter className="mr-2 size-4" />
                Category
                {selectedCategories.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-sm px-1 font-normal bg-orange-500/20"
                  >
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="capitalize"
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-10 text-muted-foreground hover:text-foreground"
            >
              <IconX className="mr-2 size-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge
              variant="secondary"
              className="bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400 pl-3 pr-1 py-1.5"
            >
              Search: {searchQuery}
              <button
                onClick={() => onSearchChange("")}
                className="ml-1.5 hover:bg-orange-500/20 rounded-full p-0.5 transition-colors"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          )}
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400 pl-3 pr-1 py-1.5 capitalize"
            >
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="ml-1.5 hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
