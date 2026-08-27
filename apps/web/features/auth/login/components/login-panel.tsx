import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

type LoginPanelProps = {
  verified: boolean;
};

export async function LoginPanel({ verified }: LoginPanelProps) {
  const t = await getTranslations("auth.login");

  return (
    <div className="flex flex-col gap-4">
      {verified ? (
        <p className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          {t("verifiedBanner")}
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">{t("placeholder")}</p>
      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="text-foreground underline-offset-4 hover:underline"
        >
          {t("registerLink")}
        </Link>
      </p>
    </div>
  );
}
