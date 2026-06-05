"use client";

import { useAuth } from "@/hooks/use-auth";
import { NotificationMenu } from "./notification-menu";
import { AuthAwareProfileSection } from "./auth-aware-profile";
import MobileMenu from "./mobile-menu";

import Logo from "./logo";
import SiteNav from "./nav";

export function MainHeader() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="sticky md:top-4 top-0 z-50 md:mx-6 md:mt-4 md:rounded-2xl border-b border-white/10 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
        {/* Logo */}
        <div className="flex justify-start">
          <Logo />
        </div>

        {/* Navigation Categories */}
        <div className="flex justify-center">
          <SiteNav />
        </div>

        <div className="flex gap-2 justify-end">
          <div className=" items-center flex gap-4">
            {isAuthenticated && <NotificationMenu />}
            <AuthAwareProfileSection />
          </div>
          <div className="md:hidden block">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
