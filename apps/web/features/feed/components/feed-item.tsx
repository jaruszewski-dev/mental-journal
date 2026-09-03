"use client";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { FeedItem as FeedItemType } from "../api/get-feed";
import { formatFeedTime } from "../utils/format-feed-time";

const MOOD_EMOJI: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

type FeedItemProps = {
  item: FeedItemType;
};

export function FeedItem({ item }: FeedItemProps) {
  const locale = useLocale();
  const tTags = useTranslations("composer.tags.items");
  const tMood = useTranslations("composer.mood");
  const time = formatFeedTime(item.createdAt, locale);

  return (
    <article className="border-b border-border px-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-sm font-medium text-foreground">
          {item.anonName}
        </p>
        <time
          dateTime={item.createdAt}
          className="shrink-0 text-xs text-muted-foreground"
          title={new Date(item.createdAt).toLocaleString(locale)}
        >
          {time}
        </time>
      </div>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {item.content}
      </p>

      {(item.mood != null || item.tags.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.mood != null ? (
            <span
              className="text-base"
              title={tMood(String(item.mood) as "1" | "2" | "3" | "4" | "5")}
            >
              {MOOD_EMOJI[item.mood]}
            </span>
          ) : null}

          {item.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground",
              )}
            >
              {tTags(tag as Parameters<typeof tTags>[0])}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
