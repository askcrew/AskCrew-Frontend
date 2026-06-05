"use client";

import { useAuth } from "@/hooks/use-auth";
import ProfileDropdown from "@/components/kokonutui/profile-dropdown";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export function AuthAwareProfileSection() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
      </div>
    );
  }

  // Show login/signup buttons for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/viewer/login">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-foreground hover:text-orange-500 hover:bg-orange-500/10"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </Link>
        <Link href="/viewer/sign-up">
          <Button
            variant="linear-1"
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Join</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Show profile dropdown for authenticated users
  return <ProfileDropdown />;
}
