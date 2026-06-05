const Bullet = ({ isActive, index }: { isActive: boolean; index: number }) => {
  return (
    <div className="relative flex-1">
      <div
        className={`transition-all duration-500 h-2 rounded-full shadow-sm ${
          isActive
            ? "bg-linear-to-r from-purple-600 to-orange-600 shadow-lg shadow-purple-500/50"
            : "bg-muted"
        }`}
      />
      {isActive && (
        <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-orange-600 rounded-full blur-sm opacity-50 animate-pulse" />
      )}
    </div>
  );
};

export const Bullets = ({
  current,
  length,
}: {
  current: number;
  length: number;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>
          Step {current} of {length}
        </span>
        <span>{Math.round((current / length) * 100)}% Complete</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length }).map((_, index) => (
          <Bullet key={index} isActive={current - 1 >= index} index={index} />
        ))}
      </div>
    </div>
  );
};
