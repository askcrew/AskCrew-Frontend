import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { ChevronRight, Sparkles } from "lucide-react";

type LinkItem = {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  featured?: boolean;
};

type NavDropDownMenuProps = {
  className?: string;
  title: string;
  links: LinkItem[];
};

const NavDropDownMenu: FC<NavDropDownMenuProps> = ({
  className,
  title,
  links,
}: NavDropDownMenuProps) => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground hover:text-purple-600 transition-colors font-medium">
            {title}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={cn(
              className,
              "relative bg-background/90 backdrop-blur-md border border-white/10 shadow-xl rounded-xl overflow-hidden z-200"
            )}
          >
            {/* Subtle gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Content */}
            <ul className="grid gap-1 p-3 md:w-[380px]">
              {links.map((link, index) => (
                <ListItem
                  key={link.label}
                  title={link.label}
                  href={link.href}
                  description={link.description}
                  icon={link.icon}
                  featured={link.featured}
                  index={index}
                >
                  {link.label}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default NavDropDownMenu;

function ListItem({
  title,
  href,
  description,
  icon,
  featured,
  index,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  description?: string;
  icon?: string;
  featured?: boolean;
  index?: number;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group relative block select-none rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-muted/50",
            featured && "bg-purple-500/5 border border-purple-500/10"
          )}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            {icon && (
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0 group-hover:bg-purple-500/10 transition-colors">
                {icon}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground group-hover:text-neutral-500 transition-colors">
                  {title}
                </span>
                {featured && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 font-medium">
                    New
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {description}
                </p>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
