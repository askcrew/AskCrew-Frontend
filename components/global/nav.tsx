"use client";

import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const activeClassNames =
  "text-orange-500 hover:text-orange-400 font-semibold md:ml-2 md:px-4 md:py-2 md:bg-orange-500/10 md:rounded-lg";

const SiteNav = () => {
  const pathnname = usePathname();
  const { isAuthenticated, userType } = useAuth();

  // Filter out Login and Sign Up items if user is a logged-in viewer
  const filteredNavItems =
    isAuthenticated && userType === "viewer"
      ? NAV_ITEMS.filter(
          (item) => item.label !== "Login" && item.label !== "Sign Up",
        )
      : NAV_ITEMS;

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {filteredNavItems.map(({ label, href, className }) => {
        const isActive = pathnname === href;
        const displayLabel =
          label === "Swap account" && !isAuthenticated
            ? "Select account"
            : label;

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "text-neutral-500 font-semibold transition-colors hover:text-neutral-400 whitespace-nowrap",
              className,
              isActive && activeClassNames,
            )}
          >
            {displayLabel}
          </Link>
        );
      })}
    </nav>
  );
};
export default SiteNav;
