// frontend/src/lib/i18n-config.ts

export const i18n = {
  defaultLocale: 'pt-BR',
  locales: ['en', 'pt-BR'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

/** Type guard for values coming from route params (which are `string`). */
export function hasLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}
