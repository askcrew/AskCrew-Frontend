"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PaymentContextType {
  contentId: string | null;
  contentType: string | null;
  setPaymentContent: (id: string, type: string) => void;
  clearPaymentContent: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [contentId, setContentId] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);

  const setPaymentContent = (id: string, type: string) => {
    setContentId(id);
    setContentType(type);
  };

  const clearPaymentContent = () => {
    setContentId(null);
    setContentType(null);
  };

  return (
    <PaymentContext.Provider
      value={{ contentId, contentType, setPaymentContent, clearPaymentContent }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentContext must be used within PaymentProvider");
  }
  return context;
}
