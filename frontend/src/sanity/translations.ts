import {client} from './client'
import {LANGUAGE_ALTERNATES_QUERY} from './queries'
import {i18n, type Locale} from '@/i18n/i18n-config'

function buildPath(type: string, slug: string, locale: string): string {
  const base =
    type === 'page'
      ? slug === '/'
        ? ''
        : `/${slug}`
      : type === 'blogPost'
        ? `/blog/${slug}`
        : type === 'author'
          ? `/blog/author/${slug}`
          : type === 'category'
            ? `/blog/category/${slug}`
            : `/${slug}`

  return `/${locale}${base}`
}

/**
 * Server-side language alternates for the current path, resolved from the
 * `translation.metadata` documents. Returns a map of locale -> href for the
 * language switcher, so the browser never queries Sanity directly.
 */
export async function getLanguageAlternates(
  pathname: string,
  locale: Locale,
): Promise<Record<string, string>> {
  const base = pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) : pathname
  const segments = base.split('/').filter(Boolean)
  const last = segments[segments.length - 1]

  const map: Record<string, string> = {[locale]: pathname}

  if (!last) {
    for (const l of i18n.locales) map[l] = `/${l}`
    return map
  }

  const data = await client.fetch(LANGUAGE_ALTERNATES_QUERY, {
    slug: last,
    currentLanguage: locale,
  })

  for (const translation of data?.translations ?? []) {
    const value = translation.value
    if (value?.language && value.slug) {
      map[value.language] = buildPath(value._type, value.slug, value.language)
    }
  }

  return map
}
