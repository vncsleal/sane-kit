// frontend/src/lib/i18n-config.ts

export const i18n = {
  defaultLocale: 'pt-BR',
  locales: ['en', 'pt-BR'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
