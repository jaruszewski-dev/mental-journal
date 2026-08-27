import {
  DEFAULT_APP_LOCALE,
  type AppLocale,
} from '../../../common/consts/locale.const';

export function buildVerificationLink(
  frontEndUrl: string,
  token: string,
  locale: AppLocale = DEFAULT_APP_LOCALE,
): string {
  const base = frontEndUrl.replace(/\/$/, '');
  const prefix = locale === 'en' ? '/en' : '';
return `${base}${prefix}/verify-email?token=${encodeURIComponent(token)}`;
}
