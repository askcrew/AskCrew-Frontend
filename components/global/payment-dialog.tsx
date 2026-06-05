"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FaApplePay,
  FaCcVisa,
  FaGooglePay,
  FaPaypal,
  FaWallet,
} from "react-icons/fa";
import { ChevronLeft } from "lucide-react";

import { CouponCodeInput } from "@/components/global/coupon-code-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import usePaymentDialog from "@/hooks/use-payment-dialog";
import { payForContent } from "@/lib/actions/payment";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { usePaymentContext } from "@/contexts/payment-context";

type PaymentMethod = {
  id: string;
  label: string;
  icon: IconType;
  accent: string;
};

const paymentMethods: PaymentMethod[] = [
  {
    id: "visa",
    label: "Visa Card",
    icon: FaCcVisa,
    accent: "text-[#1A1F71]",
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    icon: FaApplePay,
    accent: "text-black",
  },
  {
    id: "google-pay",
    label: "Google Pay",
    icon: FaGooglePay,
    accent: "text-[#1967d2]",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: FaPaypal,
    accent: "text-[#003087]",
  },
];

export default function PaymentDialog() {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [couponCode, setCouponCode] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isOpen, setIsOpen } = usePaymentDialog();
  const { contentId, contentType, clearPaymentContent } = usePaymentContext();
  const router = useRouter();

  const handlePayment = async () => {
    if (!contentId || !contentType) {
      console.error("Content ID or type is missing");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("data", {
        content_id: contentId,
        content_type: contentType,
        with_wallet: useWallet,
        code: couponCode || undefined,
      });
      const response = await payForContent({
        content_id: contentId,
        content_type: contentType,
        with_wallet: useWallet,
        code: couponCode || undefined,
      });

      console.log("Payment successful:", response);

      // Close dialog and clear content
      setIsOpen(false);
      clearPaymentContent();

      // Refresh the page to show the movie player
      router.refresh();
    } catch (error) {
      console.error("Payment failed:", error);
      // You can add error toast notification here
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-[425px] rounded-[36px] bg-[#f4f0eb] p-8 md:p-10",
          "shadow-[0_25px_80px_rgba(14,13,20,0.35)] border-none max-h-[90vh] overflow-y-auto"
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Pay for film or series</DialogTitle>
          <DialogDescription>
            Secure and easy payments, select your preferred way to complete the
            subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-900 shadow-sm"
            aria-label="Go back"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-[11px] font-semibold text-slate-500">
            pay for film or series
          </span>
          <span className="size-11" aria-hidden="true" />
        </div>

        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-1 rounded-full border border-purple-200 bg-white px-4 py-1 text-sm font-semibold text-purple-600">
            <span className="bg-purple-600 px-2 py-1 text-white rounded-full text-xs tracking-widest">
              B
            </span>
            <span className="tracking-[0.15em] text-[11px] text-slate-500 uppercase">
              SV
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Choose your payment method
          </h1>
          <p className="text-sm text-slate-500">
            Secure and easy payments, select your preferred way to complete the
            subscription.
          </p>
        </div>

        <CouponCodeInput
          helperText="Optional"
          className="mb-6"
          isChecking
          onChange={setCouponCode}
        />

        {/* Wallet Option */}
        <div className="mb-4 flex items-center space-x-2 bg-white rounded-2xl border border-purple-200 px-5 py-4">
          <Checkbox
            id="use-wallet"
            checked={useWallet}
            onCheckedChange={(checked) => setUseWallet(checked as boolean)}
          />
          <label
            htmlFor="use-wallet"
            className="flex items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 shadow-inner">
              <FaWallet className="size-5 text-green-600" />
            </div>
            <span className="text-slate-900">Pay with Wallet</span>
          </label>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.id}
              onSelect={() => setSelectedMethod(method.id)}
            />
          ))}
        </div>

        <Button
          variant="linear-1"
          size="xl"
          className="mt-8"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Confirm"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

type PaymentMethodCardProps = {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
};

function PaymentMethodCard({
  method,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  const Icon = method.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition",
        "bg-white shadow-sm hover:shadow-md",
        isSelected
          ? "border-purple-400 ring-1 ring-purple-200"
          : "border-transparent"
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 shadow-inner">
        <Icon className={cn("size-8", method.accent)} />
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold text-slate-900">{method.label}</p>
      </div>
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border text-xs font-medium transition",
          isSelected
            ? "border-purple-500 bg-purple-500 text-white"
            : "border-slate-200 text-slate-400"
        )}
        aria-hidden="true"
      >
        {isSelected ? "✓" : ""}
      </span>
    </button>
  );
}
