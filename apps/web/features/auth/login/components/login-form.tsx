"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/features/auth/login/hooks/use-login-mutation";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/login/validations/login.schema";
import { Link } from "@/i18n/navigation";

type LoginFormProps = {
  verified?: boolean;
};

export function LoginForm({ verified = false }: LoginFormProps) {
  const t = useTranslations("auth.login");

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
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useLoginMutation();

  function onSubmit(values: LoginFormValues) {
    mutation.mutate(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
      noValidate
    >
      {verified ? (
        <p className="mb-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          {t("verifiedBanner")}
        </p>
      ) : null}

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
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className="h-10 bg-card"
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
