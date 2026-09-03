"use client";

import { GlobeIcon, LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type VisibilityToggleProps = {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
};

export function VisibilityToggle({ isPublic, onChange }: VisibilityToggleProps) {
  const t = useTranslations("composer.visibility");

  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        isPublic
          ? "bg-sand/15 text-sand"
          : "bg-muted text-muted-foreground",
      )}
      onClick={() => onChange(!isPublic)}
    >
      {isPublic ? (
        <>
          <GlobeIcon className="size-3.5" />
          {t("public")}
        </>
      ) : (
        <>
          <LockIcon className="size-3.5" />
          {t("private")}
        </>
      )}
    </button>
  );
}
