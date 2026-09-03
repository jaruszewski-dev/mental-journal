"use client";

import {
  BookOpenIcon,
  HomeIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { useLogoutMutation } from "@/features/auth/session/hooks/use-logout-mutation";
import { useAuthMeStore } from "@/store/auth-me.store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, labelKey: "feed" },
  { href: "/journal", icon: BookOpenIcon, labelKey: "journal" },
] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const me = useAuthMeStore((s) => s.me);
  const logoutMutation = useLogoutMutation();

  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 md:flex-col md:border-r md:border-border md:bg-card">
      <div className="flex flex-1 flex-col gap-1 px-3 py-6">
        <Link
          href="/"
          className="mb-6 px-3 font-heading text-lg font-medium tracking-tight text-foreground"
        >
          {tCommon("appName")}
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <Icon className="size-5 shrink-0 stroke-[1.5]" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <Link
            href="/account"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/account")
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <UserCircleIcon className="size-5 shrink-0 stroke-[1.5]" />
            <span className="truncate">
              {me?.anonName ?? tCommon("appName")}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground cursor-pointer"
          >
            <LogOutIcon className="size-5 shrink-0 stroke-[1.5]" />
            {tCommon("logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}
