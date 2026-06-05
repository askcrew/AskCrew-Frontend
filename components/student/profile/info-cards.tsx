import { MapPin, Briefcase } from "lucide-react";

interface InfoCardsProps {
  location: string;
  roleType: string;
}

export function InfoCards({ location, roleType }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Location */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 p-3 rounded-xl">
            <MapPin className="size-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Location</p>
            <p className="text-sm font-semibold text-foreground">{location}</p>
          </div>
        </div>
      </div>

      {/* Role Type */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-orange-500/10 to-pink-500/10 p-3 rounded-xl">
            <Briefcase className="size-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Role Type</p>
            <p className="text-sm font-semibold text-foreground">{roleType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
