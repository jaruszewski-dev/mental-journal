"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import GB from "country-flag-icons/react/3x2/GB";
import PL from "country-flag-icons/react/3x2/PL";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_FLAGS = {
  pl: PL,
  en: GB,
} as const;

export function LocaleSwitcher() {
  const locale = useLocale() as keyof typeof LOCALE_FLAGS;
  const t = useTranslations("common");
  const pathname = usePathname();
  const CurrentFlag = LOCALE_FLAGS[locale] ?? PL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-2 bg-card/90 backdrop-blur-sm",
        )}
        aria-label={t("language")}
      >
        <CurrentFlag aria-hidden className="h-3.5 w-5 rounded-[2px]" />
        <span className="uppercase tracking-wide">{locale}</span>
        <ChevronDownIcon className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-40">
        {routing.locales.map((item) => {
          const typedLocale = item as keyof typeof LOCALE_FLAGS;
          const ItemFlag = LOCALE_FLAGS[typedLocale] ?? PL;
          const selected = typedLocale === locale;

          return (
            <DropdownMenuLinkItem
              key={item}
              className="gap-2"
              closeOnClick
              render={<Link href={pathname} locale={typedLocale} />}
            >
              <ItemFlag aria-hidden className="h-3.5 w-5 rounded-[2px]" />
              <span>{t(`locales.${item}`)}</span>
              {selected ? (
                <CheckIcon className="ml-auto size-4 opacity-70" />
              ) : null}
            </DropdownMenuLinkItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
