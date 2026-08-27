"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResendVerificationMutation } from "@/features/auth/verify-email/hooks/use-resend-verification-mutation";

type ResendFormValues = {
  email: string;
};

export function ResendVerificationForm() {
  const t = useTranslations("auth.verifyEmail");

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .min(1, t("errors.emailRequired"))
          .email(t("errors.emailInvalid")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useResendVerificationMutation();

  function onSubmit(values: ResendFormValues) {
    mutation.mutate({ email: values.email.trim().toLowerCase() });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-sm flex-col gap-3 text-left"
      noValidate
    >
      <p className="text-center text-sm text-muted-foreground">
        {t("resendPrompt")}
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="resend-email">{t("email")}</Label>
        <Input
          id="resend-email"
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

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
      >
        {t("resendSubmit")}
      </Button>
    </form>
  );
}
