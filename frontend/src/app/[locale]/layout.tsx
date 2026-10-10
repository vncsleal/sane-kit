// app/[locale]/layout.tsx
import {draftMode, headers} from 'next/headers'
import {Suspense} from 'react'
import {VisualEditing} from 'next-sanity/visual-editing'

import Header from '@/components/global/Header'
import Footer from '@/components/global/Footer'
import {CookieConsent} from '@/components/global/CookieConsent'
import DraftModeToast from '@/components/global/DraftModeToast'
import {LanguageProvider} from '@/components/global/LanguageProvider'
import {handleError} from '@/app/client-utils'
import {getDictionary, type Dictionary} from '@/i18n/getDictionary'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {cachedSanity, getDynamicFetchOptions, SanityLive} from '@/sanity/live'
import {LAYOUT_FOOTER_QUERY, LAYOUT_HEADER_QUERY} from '@/sanity/queries'
import {getLanguageAlternates} from '@/sanity/translations'

interface Props {
  children: React.ReactNode
  params: Promise<{locale: string}>
}

function resolveLocale(rawLocale: string): Locale {
  return hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
}

export async function generateMetadata({params}: Props) {
  const {locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const pathname = (await headers()).get('x-pathname') ?? `/${locale}`
  const languages = await getLanguageAlternates(pathname, locale)

  return {
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
  }
}

/**
 * Locale shell. The header and footer read request-time data (`draftMode()`,
 * `cookies()`, `headers()`) to resolve the fetch perspective and the language
 * alternates, so they stream inside `<Suspense>` while the page content and
 * this shell prerender.
 */
export default async function LocaleLayout({children, params}: Props) {
  const {locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const {isEnabled: isDraftMode} = await draftMode()
  const dictionary = await getDictionary(locale)

  return (
    <LanguageProvider locale={locale}>
      <Suspense fallback={null}>
        <LayoutHeader locale={locale} dictionary={dictionary} />
      </Suspense>
      <div className="mt-20">{children}</div>
      <Suspense fallback={null}>
        <LayoutFooter locale={locale} dictionary={dictionary} />
      </Suspense>
      <CookieConsent dictionary={dictionary.cookie} />
      <SanityLive includeDrafts={isDraftMode} onError={handleError} />
      {isDraftMode && (
        <>
          <DraftModeToast />
          <VisualEditing />
        </>
      )}
    </LanguageProvider>
  )
}

async function LayoutHeader({locale, dictionary}: {locale: Locale; dictionary: Dictionary}) {
  const {perspective, variant, stega} = await getDynamicFetchOptions()
  const {data: header} = await cachedSanity({
    query: LAYOUT_HEADER_QUERY,
    params: {language: locale},
    perspective,
    variant,
    stega,
  })

  if (!header) return null

  return <Header {...header} locale={locale} dictionary={dictionary} />
}

async function LayoutFooter({locale, dictionary}: {locale: Locale; dictionary: Dictionary}) {
  const {perspective, variant, stega} = await getDynamicFetchOptions()
  const pathname = (await headers()).get('x-pathname') ?? `/${locale}`

  const [{data: footer}, alternates] = await Promise.all([
    cachedSanity({
      query: LAYOUT_FOOTER_QUERY,
      params: {language: locale},
      perspective,
      variant,
      stega,
    }),
    getLanguageAlternates(pathname, locale),
  ])

  if (!footer) return null

  return (
    <Footer
      {...footer}
      locale={locale}
      alternates={alternates}
      languageNames={dictionary.header.languages}
      dictionary={dictionary.footer}
    />
  )
}
