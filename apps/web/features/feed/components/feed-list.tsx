"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { useFeedInfiniteQuery } from "../hooks/use-feed-infinite-query";
import { FeedItem } from "./feed-item";
import { FeedSkeleton } from "./feed-skeleton";

const ESTIMATED_ITEM_SIZE = 140;
const LOADER_SIZE = 220;

export function FeedList() {
  const t = useTranslations("feed");
  const query = useFeedInfiniteQuery();
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  const rowCount = query.hasNextPage ? items.length + 1 : items.length;

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: (index) =>
      index >= items.length ? LOADER_SIZE : ESTIMATED_ITEM_SIZE,
    overscan: 6,
    scrollMargin,
  });

  useLayoutEffect(() => {
    if (!listRef.current) return;
    setScrollMargin(listRef.current.offsetTop);
  }, [items.length, query.isPending]);

  const virtualItems = virtualizer.getVirtualItems();
  const lastVirtualIndex = virtualItems.at(-1)?.index;

  useEffect(() => {
    if (
      lastVirtualIndex == null ||
      lastVirtualIndex < items.length - 1 ||
      !query.hasNextPage ||
      query.isFetchingNextPage
    ) {
      return;
    }

    void query.fetchNextPage();
  }, [
    lastVirtualIndex,
    items.length,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
  ]);

  if (query.isPending) {
    return (
      <div aria-busy="true" aria-label={t("loading")}>
        <FeedSkeleton />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 py-8">
        <p className="text-sm text-destructive">{t("error")}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => query.refetch()}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-8 text-sm text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  return (
    <div ref={listRef} className="relative w-full">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index >= items.length;
          const item = items[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${
                  virtualRow.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {isLoaderRow ? (
                <div
                  aria-busy={query.isFetchingNextPage}
                  aria-label={t("loadingMore")}
                >
                  <FeedSkeleton
                    count={2}
                    className={
                      query.isFetchingNextPage ? "opacity-100" : "opacity-55"
                    }
                  />
                </div>
              ) : item ? (
                <FeedItem item={item} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
