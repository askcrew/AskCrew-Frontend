import { CastMember } from "./cast-member";

interface Actor {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface CastListProps {
  actors: Actor[];
}

export function CastList({ actors }: CastListProps) {
  return (
    <div className="px-6 pb-8 pt-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Actors
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {actors.length} Cast Members
        </span>
      </div>
      <div className="flex gap-4 flex-wrap pb-4 -mx-6 px-6 scrollbar-hide">
        {actors.map((actor) => (
          <CastMember
            key={actor.id}
            name={actor.name}
            role={actor.role}
            image={actor.image}
          />
        ))}
      </div>
    </div>
  );
}
