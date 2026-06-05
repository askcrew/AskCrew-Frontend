"use client";

import { Button } from "@/components/ui/button";

interface PaymentFooterProps {
  price: number;
  onPay?: () => void;
}

export function PaymentFooter({ price, onPay }: PaymentFooterProps) {
  return (
    <div className="md:static fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-background via-background/95 to-transparent z-50">
      <Button
        onClick={onPay}
        variant={"linear-1"}
        size="xl"
        className="w-full shadow-xl"
      >
        Pay ${price}
      </Button>
    </div>
  );
}
