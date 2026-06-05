import { Search, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-orange-500/20 rounded-2xl blur-xl" />
        <div className="relative w-full h-full bg-linear-to-br from-purple-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
          <Search className="w-9 h-9 text-purple-600" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
        Search for content
        <Sparkles className="w-5 h-5 text-orange-500" />
      </h2>
      <p className="text-muted-foreground text-sm">
        Start typing to find movies and series
      </p>
    </div>
  );
}
