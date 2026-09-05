import { z } from "zod";

import {
  ANON_NAME_MAX_LENGTH,
  ANON_NAME_MIN_LENGTH,
  ANON_NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/features/auth/shared/auth.const";

type UpdateAccountErrorMessages = {
  anonNameLength: string;
  anonNamePattern: string;
  currentPasswordRequired: string;
  passwordLength: string;
  passwordPattern: string;
};

export function createUpdateAccountSchema(errors: UpdateAccountErrorMessages) {
  const anonNameLength = errors.anonNameLength
    .replace("{min}", String(ANON_NAME_MIN_LENGTH))
    .replace("{max}", String(ANON_NAME_MAX_LENGTH));
  const passwordLength = errors.passwordLength
    .replace("{min}", String(PASSWORD_MIN_LENGTH))
    .replace("{max}", String(PASSWORD_MAX_LENGTH));

  return z
    .object({
      anonName: z
        .string()
        .trim()
        .min(ANON_NAME_MIN_LENGTH, anonNameLength)
        .max(ANON_NAME_MAX_LENGTH, anonNameLength)
        .regex(ANON_NAME_REGEX, errors.anonNamePattern),
      currentPassword: z.string(),
      newPassword: z.string(),
    })
    .superRefine((values, ctx) => {
      if (!values.newPassword) {
        return;
      }

      if (!values.currentPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: errors.currentPasswordRequired,
        });
      }

      if (values.newPassword.length < PASSWORD_MIN_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: passwordLength,
        });
        return;
      }

      if (values.newPassword.length > PASSWORD_MAX_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: passwordLength,
        });
        return;
      }

      if (!PASSWORD_REGEX.test(values.newPassword)) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: errors.passwordPattern,
        });
      }
    });
}

export type UpdateAccountFormValues = z.infer<
  ReturnType<typeof createUpdateAccountSchema>
>;
