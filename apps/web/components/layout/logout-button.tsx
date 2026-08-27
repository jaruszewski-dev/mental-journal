"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/session/hooks/use-logout-mutation";

export function LogoutButton() {
  const t = useTranslations("common");
  const mutation = useLogoutMutation();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {t("logout")}
    </Button>
  );
}
