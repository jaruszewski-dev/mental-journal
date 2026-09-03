"use client";

import { TagIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  JOURNAL_TAG_CATALOG,
  MAX_TAGS,
  type JournalTag,
} from "../validations/entry.schema";

type TagPickerProps = {
  value: JournalTag[];
  onChange: (tags: JournalTag[]) => void;
};

export function TagPicker({ value, onChange }: TagPickerProps) {
  const t = useTranslations("composer.tags");
  const [open, setOpen] = useState(false);

  function toggleTag(tag: JournalTag) {
    if (value.includes(tag)) {
      onChange(value.filter((item) => item !== tag));
      return;
    }

    if (value.length >= MAX_TAGS) return;

    onChange([...value, tag]);
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
            open || value.length > 0
              ? "bg-sand/15 text-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setOpen((current) => !current)}
        >
          <TagIcon className="size-3.5" />
          {t("label")}
          {value.length > 0 ? (
            <span className="text-muted-foreground">
              {value.length}/{MAX_TAGS}
            </span>
          ) : null}
        </button>

        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            className="flex cursor-pointer items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent/80"
            onClick={() => toggleTag(tag)}
          >
            {t(`items.${tag}`)}
            <XIcon className="size-3 opacity-60" />
          </button>
        ))}
      </div>

      {open ? (
        <div className="mt-3 max-h-48 space-y-3 overflow-y-auto rounded-lg bg-muted/40 p-3 ring-1 ring-border">
          {(
            Object.entries(JOURNAL_TAG_CATALOG) as [
              keyof typeof JOURNAL_TAG_CATALOG,
              readonly JournalTag[],
            ][]
          ).map(([category, tags]) => (
            <div key={category}>
              <p className="mb-1.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                {t(`categories.${category}`)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const selected = value.includes(tag);
                  const disabled = !selected && value.length >= MAX_TAGS;

                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={disabled}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs transition-colors",
                        selected
                          ? "cursor-pointer bg-primary text-primary-foreground"
                          : disabled
                            ? "cursor-not-allowed bg-background/50 text-muted-foreground opacity-40"
                            : "cursor-pointer bg-background text-muted-foreground ring-1 ring-border hover:text-foreground",
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {t(`items.${tag}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
