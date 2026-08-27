import { setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";

type MainLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MainLayout({
  children,
  params,
}: MainLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AppShell>{children}</AppShell>;
}
