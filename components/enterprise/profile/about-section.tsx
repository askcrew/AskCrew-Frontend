interface AboutSectionProps {
  about: string;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-lg">
      <h2 className="text-lg font-bold text-foreground mb-3">About</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{about}</p>
    </div>
  );
}
