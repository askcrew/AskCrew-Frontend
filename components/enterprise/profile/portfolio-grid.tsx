import { Badge } from "@/components/ui/badge";

interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  role: string;
}

interface PortfolioGridProps {
  portfolio: PortfolioItem[];
}

export function PortfolioGrid({ portfolio }: PortfolioGridProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-lg">
      <h2 className="text-lg font-bold text-foreground mb-5">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            {/* Movie poster */}
            <div className="aspect-2/3 relative overflow-hidden bg-linear-to-br from-purple-500/20 to-pink-500/20">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Title and role on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-bold text-xs mb-1 line-clamp-2">
                  {item.title}
                </p>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                  {item.role}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
