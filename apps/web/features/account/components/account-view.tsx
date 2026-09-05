"use client";

import { useTranslations } from "next-intl";

import { AccountForm } from "@/features/account/components/account-form";

export function AccountView() {
  const t = useTranslations("account");

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6">
      <h1 className="font-heading text-2xl font-medium tracking-tight">
        {t("title")}
      </h1>
      <AccountForm />
    </div>
  );
}
