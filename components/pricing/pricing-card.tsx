import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  id: number;
  name: string;
  price: string | number;
  period: string;
  tier: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  badge?: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelect?: (planId: number) => void;
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  const getTierStyles = (tier: string) => {
    const t = tier?.toLowerCase() || "";

    // High-end / Diamond Tier (Pink/Rose)
    if (
      t.includes("diamond") ||
      t.includes("ultimate") ||
      t.includes("infinite")
    ) {
      return {
        card: "bg-white/40 dark:bg-pink-950/20 border-white/40 dark:border-pink-500/30",
        glow: "shadow-[0_0_40px_-10px_rgba(219,39,119,0.3)] hover:shadow-[0_0_50px_-5px_rgba(219,39,119,0.5)]",
        orb: "bg-pink-500/10",
        badge: "bg-linear-to-r from-pink-600 to-rose-600 text-white",
        icon: "bg-pink-100/80 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
        button:
          "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/30",
        price: "text-pink-600 dark:text-pink-400",
        featureIcon: Sparkles,
      };
    }

    // Mid-tier / Enterprise (Purple)
    if (
      t.includes("premium") ||
      t.includes("business") ||
      t.includes("enterprise") ||
      t.includes("gold") ||
      t.includes("advance")
    ) {
      return {
        card: "bg-white/40 dark:bg-purple-950/20 border-white/40 dark:border-purple-500/30",
        glow: "shadow-[0_0_40px_-10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_-5px_rgba(147,51,234,0.5)]",
        orb: "bg-purple-500/10",
        badge: "bg-linear-to-r from-purple-600 to-indigo-600 text-white",
        icon: "bg-purple-100/80 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
        button:
          "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30",
        price: "text-purple-600 dark:text-purple-400",
        featureIcon: ShieldCheck,
      };
    }

    // Base / Pro Tier (Orange)
    if (
      t.includes("pro") ||
      t.includes("popular") ||
      t.includes("recommended")
    ) {
      return {
        card: "bg-white/40 dark:bg-orange-950/20 border-white/40 dark:border-orange-500/30",
        glow: "shadow-[0_0_40px_-10px_rgba(234,88,12,0.3)] hover:shadow-[0_0_50px_-5px_rgba(234,88,12,0.5)]",
        orb: "bg-orange-500/10",
        badge: "bg-linear-to-r from-orange-500 to-orange-600 text-white",
        icon: "bg-orange-100/80 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
        button:
          "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/30",
        price: "text-orange-600 dark:text-orange-400",
        featureIcon: Zap,
      };
    }

    // Silver / Free / Standard Tier (Metallic Slate)
    return {
      card: "bg-white/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-500/30",
      glow: "shadow-[0_0_40px_-10px_rgba(203,213,225,0.4)] hover:shadow-[0_0_50px_-5px_rgba(203,213,225,0.6)]",
      orb: "bg-white/20 dark:bg-slate-400/10",
      badge:
        "bg-linear-to-r from-slate-200 via-slate-400 to-slate-300 text-slate-900 shadow-slate-500/20",
      icon: "bg-slate-100/80 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 shadow-inner",
      button:
        "bg-slate-700 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-lg shadow-slate-500/30",
      price: "text-slate-800 dark:text-slate-200",
      featureIcon: ShieldCheck,
    };
  };

  const styles = getTierStyles(plan.tier);
  const Icon = styles.featureIcon;

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 transition-all duration-500 border backdrop-blur-xl flex flex-col h-full group overflow-hidden",
        styles.card,
        styles.glow,
        plan.highlighted && "ring-1 ring-white/20 dark:ring-white/10",
      )}
    >
      {/* Dynamic Animated Orb */}
      <div
        className={cn(
          "absolute -right-20 -top-20 w-64 h-64 blur-3xl rounded-full transition-all duration-700 group-hover:scale-125 group-hover:-translate-x-10 group-hover:translate-y-10 opacity-50",
          styles.orb,
        )}
      />

      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-6 py-2 rounded-full text-[10px] font-black shadow-2xl backdrop-blur-md border border-white/20",
              styles.badge,
            )}
          >
            <Icon className="w-3 h-3 animate-pulse" />
            {plan.badge.toUpperCase()}
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6 relative z-10">
        <div
          className={cn(
            "w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner",
            styles.icon,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight">
          {plan.name}
        </h3>
        <p className="text-muted-foreground/80 text-xs font-medium leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Price Section */}
      <div className="mb-8 relative z-10">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-5xl font-black tracking-tighter drop-shadow-sm",
              styles.price,
            )}
          >
            ${plan.price}
          </span>
          <span className="text-muted-foreground font-bold text-base opacity-60">
            /{plan.period}
          </span>
        </div>
      </div>

      {/* Features List */}
      <div className="grow relative z-10">
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-xs font-medium text-foreground/90 group/item"
            >
              <div
                className={cn(
                  "mt-0.5 shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover/item:scale-110",
                  styles.icon,
                )}
              >
                <Check className="w-3 h-3 stroke-4" />
              </div>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-auto">
        <Button
          onClick={() => onSelect?.(plan.id)}
          className={cn(
            "w-full py-6 rounded-2xl font-black text-base transition-all duration-500 active:scale-95 border border-white/10",
            styles.button,
          )}
        >
          {plan.buttonText}
        </Button>
      </div>
    </div>
  );
}
