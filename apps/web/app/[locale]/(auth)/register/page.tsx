import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { RegisterView } from "@/features/auth";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.register" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterView />;
}
