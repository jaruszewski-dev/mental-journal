import { z } from "zod";

import {
  ANON_NAME_MAX_LENGTH,
  ANON_NAME_MIN_LENGTH,
  ANON_NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "./auth.const";

type RegisterErrorMessages = {
  emailRequired: string;
  emailInvalid: string;
  anonNameLength: string;
  anonNamePattern: string;
  passwordLength: string;
  passwordPattern: string;
};

export function createRegisterSchema(errors: RegisterErrorMessages) {
  const anonNameLength = errors.anonNameLength
    .replace("{min}", String(ANON_NAME_MIN_LENGTH))
    .replace("{max}", String(ANON_NAME_MAX_LENGTH));
  const passwordLength = errors.passwordLength
    .replace("{min}", String(PASSWORD_MIN_LENGTH))
    .replace("{max}", String(PASSWORD_MAX_LENGTH));

  return z.object({
    email: z
      .string()
      .trim()
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
    anonName: z
      .string()
      .trim()
      .min(ANON_NAME_MIN_LENGTH, anonNameLength)
      .max(ANON_NAME_MAX_LENGTH, anonNameLength)
      .regex(ANON_NAME_REGEX, errors.anonNamePattern),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, passwordLength)
      .max(PASSWORD_MAX_LENGTH, passwordLength)
      .regex(PASSWORD_REGEX, errors.passwordPattern),
  });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
