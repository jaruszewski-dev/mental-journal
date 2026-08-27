import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoginView } from "@/features/auth";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ verified?: string | string[] }>;
};

function isVerifiedFlag(value: string | string[] | undefined): boolean {
  if (value === "1" || value === "true") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.includes("1") || value.includes("true");
  }
  return false;
}

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { verified } = await searchParams;

  return <LoginView verified={isVerifiedFlag(verified)} />;
}
