interface CastMemberProps {
  name: string;
  role: string;
  image: string;
}

export function CastMember({ name, role, image }: CastMemberProps) {
  return (
    <div className="flex flex-col gap-3 w-[140px] group cursor-pointer">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </span>
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 line-clamp-1">
          {role}
        </span>
      </div>
    </div>
  );
}
