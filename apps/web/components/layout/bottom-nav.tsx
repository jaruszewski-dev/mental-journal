"use client";

import { BookOpenIcon, HomeIcon, UserCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, labelKey: "feed" },
  { href: "/journal", icon: BookOpenIcon, labelKey: "journal" },
  { href: "/account", icon: UserCircleIcon, labelKey: "account" },
] as const;


export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-sm md:hidden">
      {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.625rem] font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-5 stroke-[1.5]",
                active && "text-sand",
              )}
            />
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
