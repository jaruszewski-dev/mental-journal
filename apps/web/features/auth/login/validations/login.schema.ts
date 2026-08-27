import { z } from "zod";

type LoginErrorMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

export function createLoginSchema(errors: LoginErrorMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
    password: z.string().min(1, errors.passwordRequired),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
