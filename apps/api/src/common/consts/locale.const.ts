export const APP_LOCALES = ['pl', 'en'] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_APP_LOCALE: AppLocale = 'pl';
