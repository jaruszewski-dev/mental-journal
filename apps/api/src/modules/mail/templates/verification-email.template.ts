import {
  DEFAULT_APP_LOCALE,
  type AppLocale,
} from '../../../common/consts/locale.const';

type VerificationEmailContent = {
  subject: string;
  html: string;
  text: string;
};

const CONTENT: Record<
  AppLocale,
  (verificationLink: string) => VerificationEmailContent
> = {
  pl: (verificationLink) => ({
    subject: 'Potwierdź adres e-mail',
    html: `
            <p>Witaj w Mental Journal.</p>
            <p><a href="${verificationLink}">Kliknij, aby potwierdzić adres e-mail</a></p>
            <p>Jeśli nie zakładałeś konta, możesz zignorować tę wiadomość.</p>
        `,
    text: `Potwierdź adres e-mail: ${verificationLink}`,
  }),
  en: (verificationLink) => ({
    subject: 'Verify your email',
    html: `
            <p>Welcome to Mental Journal.</p>
            <p><a href="${verificationLink}">Click here to verify your email</a></p>
            <p>If you did not create an account, you can ignore this email.</p>
        `,
    text: `Verify your email: ${verificationLink}`,
  }),
};

export function verificationEmailContent(
  verificationLink: string,
  locale: AppLocale = DEFAULT_APP_LOCALE,
): VerificationEmailContent {
  return (CONTENT[locale] ?? CONTENT[DEFAULT_APP_LOCALE])(verificationLink);
}
