import { getTranslations, setRequestLocale } from "next-intl/server";

import { LogoutButton } from "@/components/layout/logout-button";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur-sm">
        <h1 className="font-heading text-xl font-medium tracking-tight">
          {t("title")}
        </h1>
        <LogoutButton />
      </header>
      <div className="flex flex-1 flex-col px-4 py-8 text-muted-foreground">
        <p className="text-sm">{t("placeholder")}</p>
      </div>
    </main>
  );
}
