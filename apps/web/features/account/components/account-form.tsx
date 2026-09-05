"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateAccountMutation } from "@/features/account/hooks/use-update-account-mutation";
import {
  createUpdateAccountSchema,
  type UpdateAccountFormValues,
} from "@/features/account/validations/update-account.schema";
import {
  ANON_NAME_MAX_LENGTH,
  ANON_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/features/auth/shared/auth.const";
import { PasswordInput } from "@/features/auth/shared/password-input";
import { useAuthMeStore } from "@/store/auth-me.store";

function initialFromAnonName(anonName?: string) {
  const trimmed = anonName?.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

export function AccountForm() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const me = useAuthMeStore((s) => s.me);

  const schema = useMemo(
    () =>
      createUpdateAccountSchema({
        anonNameLength: t("errors.anonNameLength", {
          min: ANON_NAME_MIN_LENGTH,
          max: ANON_NAME_MAX_LENGTH,
        }),
        anonNamePattern: t("errors.anonNamePattern"),
        currentPasswordRequired: t("errors.currentPasswordRequired"),
        passwordLength: t("errors.passwordLength", {
          min: PASSWORD_MIN_LENGTH,
          max: PASSWORD_MAX_LENGTH,
        }),
        passwordPattern: t("errors.passwordPattern"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      anonName: me?.anonName ?? "",
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (me?.anonName) {
      reset({
        anonName: me.anonName,
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [me?.anonName, reset]);

  const mutation = useUpdateAccountMutation();

  function onSubmit(values: UpdateAccountFormValues) {
    const payload: {
      anonName?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {};

    if (values.anonName !== me?.anonName) {
      payload.anonName = values.anonName;
    }

    if (values.newPassword) {
      payload.currentPassword = values.currentPassword;
      payload.newPassword = values.newPassword;
    }

    if (!payload.anonName && !payload.newPassword) {
      return;
    }

    mutation.mutate(payload, {
      onSuccess: (data) => {
        reset({
          anonName: data.anonName,
          currentPassword: "",
          newPassword: "",
        });
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
      noValidate
    >
      <div className="flex flex-col items-center gap-3">
        <div
          aria-hidden
          className="flex size-20 items-center justify-center rounded-full bg-accent font-heading text-2xl font-medium text-foreground"
        >
          {initialFromAnonName(me?.anonName)}
        </div>
        <p className="text-sm text-muted-foreground">{t("avatarHint")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="anonName">{t("anonName")}</Label>
        <Input
          id="anonName"
          type="text"
          autoComplete="username"
          aria-invalid={!!errors.anonName}
          className="h-10 bg-background"
          {...register("anonName")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {errors.anonName?.message ?? "\u00a0"}
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <p className="font-heading text-base font-medium tracking-tight">
          {t("passwordSection")}
        </p>

        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            className="h-10 bg-background"
            showLabel={tCommon("showPassword")}
            hideLabel={tCommon("hidePassword")}
            {...register("currentPassword")}
          />
          <p className="min-h-4 text-xs text-destructive">
            {errors.currentPassword?.message ?? "\u00a0"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword">{t("newPassword")}</Label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            className="h-10 bg-background"
            showLabel={tCommon("showPassword")}
            hideLabel={tCommon("hidePassword")}
            {...register("newPassword")}
          />
          <p
            className={
              errors.newPassword
                ? "min-h-4 text-xs text-destructive"
                : "min-h-4 text-xs text-muted-foreground"
            }
          >
            {errors.newPassword?.message ?? t("passwordHint")}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending || !isDirty}
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
