import { setRequestLocale } from "next-intl/server";

import { FeedList } from "@/features/feed/components/feed-list";
import { Composer } from "@/features/journal/components/composer";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col pb-16 md:pb-0">
      <Composer />
      <FeedList />
    </main>
  );
}
