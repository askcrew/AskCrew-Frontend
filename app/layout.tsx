import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import Providers from "./providers";
import PaymentDialog from "@/components/global/payment-dialog";
import { AuthRequiredDialog } from "@/components/global/auth-required-dialog";
import AuthEventListener from "@/components/global/auth-event-listener";
import { PaymentProvider } from "@/contexts/payment-context";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Ask Crew - Start your art work journey",
  description: "Select your favorite categories to personalize your content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <PaymentProvider>
            <AuthEventListener />
            {children}
            <Suspense>
              <PaymentDialog />
              <AuthRequiredDialog />
            </Suspense>
          </PaymentProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
