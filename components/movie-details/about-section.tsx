import { Star } from "lucide-react";

interface AboutSectionProps {
  description: string;
  rating: number;
}

export function AboutSection({ description, rating }: AboutSectionProps) {
  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          About
        </h2>
        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800/50">
          <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
            {rating}
          </span>
        </div>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
