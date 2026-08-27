import { setRequestLocale } from "next-intl/server";

import { AuthShell } from "@/features/auth";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthShell>{children}</AuthShell>;
}
