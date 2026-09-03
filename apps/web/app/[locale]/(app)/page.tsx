import { getTranslations, setRequestLocale } from "next-intl/server";

import { Composer } from "@/features/journal/components/composer";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="flex flex-1 flex-col pb-16 md:pb-0">
      <Composer />

      <div className="flex flex-1 flex-col px-4 py-8 text-muted-foreground">
        <p className="text-sm">{t("placeholder")}</p>
      </div>
    </main>
  );
}
