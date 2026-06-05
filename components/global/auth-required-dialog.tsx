"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";

// Hook for managing auth required dialog state (same pattern as payment dialog)
const useAuthRequiredDialog = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "auth-required-dialog",
    parseAsBoolean,
  );

  return {
    isOpen: isOpen || false,
    setIsOpen: (value: boolean | undefined) => setIsOpen(value || false),
  };
};

export { useAuthRequiredDialog };

export function AuthRequiredDialog() {
  const { isOpen, setIsOpen } = useAuthRequiredDialog();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/viewer/login");
    setIsOpen(false);
  };

  const handleSignUp = () => {
    router.push("/viewer/sign-up");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md pointer-events-auto rounded-3xl bg-linear-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border-none shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-orange-500 to-purple-600 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Sign In Required
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Please sign in to continue with your purchase
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-3">
          <Button
            variant="linear-1"
            size="lg"
            className="w-full"
            onClick={handleLogin}
            asChild
          >
            <Link href="/viewer/login">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-2 hover:bg-linear-to-r hover:from-orange-500/10 hover:to-purple-600/10"
            asChild
          >
            <Link href="/viewer/sign-up">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </Link>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          You can browse content freely, but a subscription is required to watch
          premium movies and series.
        </p>
      </DialogContent>
    </Dialog>
  );
}
