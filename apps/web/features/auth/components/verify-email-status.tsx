"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useVerifyEmailQuery } from "@/features/auth/hooks/use-verify-email-query";
import { Link, useRouter } from "@/i18n/navigation";
import { getApiErrorMessage } from "@/lib/api-error";

type VerifyEmailStatusProps = {
  token: string | undefined;
};

export function VerifyEmailStatus({ token }: VerifyEmailStatusProps) {
  const t = useTranslations("auth.verifyEmail");
  const router = useRouter();
  const query = useVerifyEmailQuery(token);

  useEffect(() => {
    if (!query.isSuccess) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace({ pathname: "/login", query: { verified: "1" } });
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [query.isSuccess, router]);

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-heading text-xl font-medium tracking-tight">
          {t("missingTitle")}
        </p>
        <p className="text-sm text-muted-foreground">{t("missingBody")}</p>
        <Link
          href="/register"
          className="text-sm text-foreground underline-offset-4 hover:underline"
        >
          {t("registerLink")}
        </Link>
      </div>
    );
  }

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-heading text-xl font-medium tracking-tight">
          {t("pendingTitle")}
        </p>
        <p className="text-sm text-muted-foreground">{t("pendingBody")}</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-heading text-xl font-medium tracking-tight">
          {t("errorTitle")}
        </p>
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(query.error, t("errorGeneric"))}
        </p>
        <Link
          href="/login"
          className="text-sm text-foreground underline-offset-4 hover:underline"
        >
          {t("loginLink")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-xl font-medium tracking-tight">
        {t("successTitle")}
      </p>
      <p className="text-sm text-muted-foreground">{t("successBody")}</p>
    </div>
  );
}
