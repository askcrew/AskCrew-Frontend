import { cn } from "@/lib/utils";
import { FC } from "react";

type MovieCategoryBadgeProps = {
  category: string;
  className?: string;
};

const MovieCategoryBadge: FC<MovieCategoryBadgeProps> = ({
  category,
  className,
}) => {
  return (
    <div
      className={cn(
        "px-3 py-1 z-40 text-sm rounded-full text-white font-bold bg-black/70 flex items-center justify-center",
        className
      )}
    >
      {category}
    </div>
  );
};
export default MovieCategoryBadge;
