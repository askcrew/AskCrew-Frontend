"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const MobileMenu = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <button className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-800/60 bg-gray-900/60 p-2 text-white transition hover:border-gray-700 hover:bg-gray-900">
          <Menu className="size-5" />
          <span className="sr-only">Open navigation menu</span>
        </button>
      </DrawerTrigger>
      <DrawerContent className="w-full border-l border-gray-800 bg-gray-950/95 text-gray-200">
        <DialogTitle className="sr-only">Mobile Menu</DialogTitle>
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <Logo />
          <DrawerClose asChild>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-800/60 bg-gray-900/60 p-2 text-gray-200 transition hover:border-gray-700 hover:text-white">
              <X className="size-5" />
              <span className="sr-only">Close navigation menu</span>
            </button>
          </DrawerClose>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6">
          {NAV_ITEMS.map(({ label, href, className }) => {
            const displayLabel =
              label === "Swap account" && !isAuthenticated
                ? "Select account"
                : label;
            return (
              <DrawerClose key={label} asChild>
                <Link
                  href={href}
                  className={cn(
                    "rounded-lg border border-transparent bg-gray-900/40 px-4 py-3 text-base font-medium text-gray-200 transition hover:border-gray-800 hover:bg-gray-900 hover:text-white",
                    href === pathname &&
                      "border-orange-500/40 bg-orange-500/10 text-orange-400 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300",
                    className,
                  )}
                >
                  {displayLabel}
                </Link>
              </DrawerClose>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default MobileMenu;
