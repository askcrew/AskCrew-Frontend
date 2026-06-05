import { PricingCard, PricingPlan } from "./pricing-card";

interface PricingGridProps {
  plans: PricingPlan[];
}

export function PricingGrid({ plans }: PricingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan, index) => (
        <PricingCard key={index} plan={plan} />
      ))}
    </div>
  );
}
