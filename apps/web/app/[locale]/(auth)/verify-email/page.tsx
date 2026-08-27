import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { VerifyEmailView } from "@/features/auth";

type VerifyEmailPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
};

function pickToken(
  token: string | string[] | undefined,
): string | undefined {
  if (typeof token === "string" && token.length > 0) {
    return token;
  }
  if (Array.isArray(token) && typeof token[0] === "string" && token[0]) {
    return token[0];
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: VerifyEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.verifyEmail" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: VerifyEmailPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { token: rawToken } = await searchParams;

  return <VerifyEmailView token={pickToken(rawToken)} />;
}
