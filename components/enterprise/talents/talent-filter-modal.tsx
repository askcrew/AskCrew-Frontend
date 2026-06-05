"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckboxGroup,
  CheckboxOption,
} from "@/components/global/custom-checkbox-group";
import { CustomRadioGroup } from "@/components/global/custom-radio-group";

export interface TalentFilters {
  specifications: string[];
  status: "all" | "online" | "offline";
  rating: string;
}

interface TalentFilterModalProps {
  filters: TalentFilters;
  onFiltersChange: (filters: TalentFilters) => void;
}

const SPECIFICATIONS: CheckboxOption[] = [
  { label: "Actor", value: "actor", id: "actor" },
  { label: "Producer", value: "producer", id: "producer" },
  { label: "Director", value: "director", id: "director" },
  { label: "Cinematographer", value: "cinematographer", id: "cinematographer" },
  { label: "Editor", value: "editor", id: "editor" },
  { label: "Writer", value: "writer", id: "writer" },
  { label: "Student", value: "student", id: "student" },
  { label: "Other", value: "other", id: "other" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

const RATING_OPTIONS = [
  { label: "All Ratings", value: "all" },
  { label: "4+ Stars", value: "4" },
  { label: "3+ Stars", value: "3" },
  { label: "2+ Stars", value: "2" },
];

export function TalentFilterModal({
  filters,
  onFiltersChange,
}: TalentFilterModalProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<TalentFilters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: TalentFilters = {
      specifications: [],
      status: "all",
      rating: "all",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFilterCount =
    localFilters.specifications.length +
    (localFilters.status !== "all" ? 1 : 0) +
    (localFilters.rating !== "all" ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 relative bg-linear-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all"
        >
          <Filter className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Filter Talents
          </DialogTitle>
          <DialogDescription>
            Refine your search to find the perfect talent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Specifications Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">
              Specialization
            </h3>
            <CheckboxGroup
              options={SPECIFICATIONS}
              value={localFilters.specifications}
              onChange={(specifications) =>
                setLocalFilters({ ...localFilters, specifications })
              }
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Status</h3>
            <CustomRadioGroup
              options={STATUS_OPTIONS}
              value={localFilters.status}
              onValueChange={(status) =>
                setLocalFilters({
                  ...localFilters,
                  status: status as "all" | "online" | "offline",
                })
              }
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">
              Minimum Rating
            </h3>
            <CustomRadioGroup
              options={RATING_OPTIONS}
              value={localFilters.rating}
              onValueChange={(rating) =>
                setLocalFilters({ ...localFilters, rating })
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 sm:flex-none bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
