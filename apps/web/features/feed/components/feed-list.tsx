"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { useFeedInfiniteQuery } from "../hooks/use-feed-infinite-query";
import { FeedItem } from "./feed-item";

export function FeedList() {
  const t = useTranslations("feed");
  const query = useFeedInfiniteQuery();

  if (query.isPending) {
    return (
      <div className="px-4 py-8 text-sm text-muted-foreground">
        {t("loading")}
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

  const items = query.data.pages.flatMap((page) => page.items);

  if (items.length === 0) {
    return (
      <div className="px-4 py-8 text-sm text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {items.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}

      {query.hasNextPage ? (
        <div className="flex justify-center px-4 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={query.isFetchingNextPage}
            onClick={() => query.fetchNextPage()}
          >
            {query.isFetchingNextPage ? t("loadingMore") : t("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
