"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/features/auth/login/hooks/use-login-mutation";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/login/validations/login.schema";
import { PasswordInput } from "@/features/auth/shared/password-input";
import { useResendVerificationMutation } from "@/features/auth/verify-email/hooks/use-resend-verification-mutation";
import { Link } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const [showResend, setShowResend] = useState(false);

  const loginSchema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useLoginMutation({
    onUnverified: () => setShowResend(true),
  });
  const resendMutation = useResendVerificationMutation();

  function onSubmit(values: LoginFormValues) {
    setShowResend(false);
    mutation.mutate(values);
  }

  function onResend() {
    const email = getValues("email").trim().toLowerCase();
    if (!email) {
      return;
    }
    resendMutation.mutate({ email });
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
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className="h-10 bg-card"
          showLabel={tCommon("showPassword")}
          hideLabel={tCommon("hidePassword")}
          {...register("password")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {errors.password?.message ?? "\u00a0"}
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={mutation.isPending}
      >
        {t("submit")}
      </Button>

      {showResend ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={resendMutation.isPending}
          onClick={onResend}
        >
          {t("resendVerification")}
        </Button>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="text-foreground underline-offset-4 hover:underline"
        >
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}
