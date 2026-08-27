"use client";

import { CircleAlert, Link2Off, Loader2, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { AuthStatusMessage } from "@/features/auth/shared/auth-status-message";
import { useVerifyEmailQuery } from "@/features/auth/verify-email/hooks/use-verify-email-query";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
      <AuthStatusMessage
        icon={Link2Off}
        tone="muted"
        title={t("missingTitle")}
        body={t("missingBody")}
        action={
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t("registerLink")}
          </Link>
        }
      />
    );
  }

  if (query.isPending) {
    return (
      <AuthStatusMessage
        icon={Loader2}
        tone="pending"
        spin
        title={t("pendingTitle")}
        body={t("pendingBody")}
      />
    );
  }

  if (query.isError) {
    return (
      <AuthStatusMessage
        icon={CircleAlert}
        tone="error"
        title={t("errorTitle")}
        body={t("errorGeneric")}
        action={
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t("loginLink")}
          </Link>
        }
      />
    );
  }

  return (
    <AuthStatusMessage
      icon={MailCheck}
      tone="success"
      title={t("successTitle")}
      body={t("successBody")}
    />
  );
}
