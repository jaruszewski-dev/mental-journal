"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/features/auth/register/hooks/use-register-mutation";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/features/auth/register/validations/register.schema";
import {
  ANON_NAME_MAX_LENGTH,
  ANON_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/features/auth/shared/auth.const";
import { Link } from "@/i18n/navigation";
import { getApiErrorMessage } from "@/lib/api-error";

export function RegisterForm() {
  const t = useTranslations("auth.register");

  const registerSchema = useMemo(
    () =>
      createRegisterSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        anonNameLength: t("errors.anonNameLength", {
          min: ANON_NAME_MIN_LENGTH,
          max: ANON_NAME_MAX_LENGTH,
        }),
        anonNamePattern: t("errors.anonNamePattern"),
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
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      anonName: "",
      password: "",
    },
  });

  const mutation = useRegisterMutation();

  function onSubmit(values: RegisterFormValues) {
    mutation.mutate(values);
  }

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-heading text-xl font-medium tracking-tight">
          {t("successTitle")}
        </p>
        <p className="text-sm text-muted-foreground">{t("successBody")}</p>
        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="text-foreground underline-offset-4 hover:underline"
          >
            {t("loginLink")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="h-10 bg-card"
          {...register("email")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {errors.email?.message ?? "\u00a0"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="anonName">{t("anonName")}</Label>
        <Input
          id="anonName"
          type="text"
          autoComplete="username"
          aria-invalid={!!errors.anonName}
          className="h-10 bg-card"
          {...register("anonName")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {errors.anonName?.message ?? "\u00a0"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          className="h-10 bg-card"
          {...register("password")}
        />
        <p
          className={
            errors.password
              ? "min-h-4 text-xs text-destructive"
              : "min-h-4 text-xs text-muted-foreground"
          }
        >
          {errors.password?.message ?? t("passwordHint")}
        </p>
      </div>

      <p className="min-h-5 text-sm text-destructive" role="alert">
        {mutation.isError
          ? getApiErrorMessage(mutation.error, t("errors.generic"))
          : "\u00a0"}
      </p>

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={mutation.isPending}
      >
        {t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="text-foreground underline-offset-4 hover:underline"
        >
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}
