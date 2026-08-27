import type { AppLocale } from '../../../common/consts/locale.const';

export interface SendVerificationEmailInput {
  to: string;
  verificationLink: string;
  locale: AppLocale;
}

export interface SendVerificationEmailPort {
  execute(input: SendVerificationEmailInput): Promise<void>;
}

export const SEND_VERIFICATION_EMAIL_PORT = Symbol(
  'SEND_VERIFICATION_EMAIL_PORT',
);
