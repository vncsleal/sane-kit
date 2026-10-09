// app/[locale]/layout.tsx
import {headers} from 'next/headers'
import Header from '@/components/global/Header'
import Footer from '@/components/global/Footer'
import {CookieConsent} from '@/components/global/CookieConsent'
import {sanityFetch} from '@/sanity/live'
import {LanguageProvider} from '@/components/global/LanguageProvider'
import {getDictionary} from '@/i18n/getDictionary'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {LAYOUT_FOOTER_QUERY, LAYOUT_HEADER_QUERY} from '@/sanity/queries'
import {getLanguageAlternates} from '@/sanity/translations'

interface Props {
  children: React.ReactNode
  params: Promise<{locale: string}>
}

async function getGlobals(locale: Locale) {
  const [{data: header}, {data: footer}] = await Promise.all([
    sanityFetch({query: LAYOUT_HEADER_QUERY, params: {language: locale}}),
    sanityFetch({query: LAYOUT_FOOTER_QUERY, params: {language: locale}}),
  ])
  return {header, footer}
}

export async function generateMetadata({params}: Props) {
  const {locale: rawLocale} = await params
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
  const pathname = (await headers()).get('x-pathname') ?? `/${locale}`
  const languages = await getLanguageAlternates(pathname, locale)

  return {
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
  }
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale: rawLocale} = await params
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
  const pathname = (await headers()).get('x-pathname') ?? `/${locale}`

  const [{header, footer}, dictionary, alternates] = await Promise.all([
    getGlobals(locale),
    getDictionary(locale),
    getLanguageAlternates(pathname, locale),
  ])

  return (
    <LanguageProvider locale={locale}>
      {header && <Header {...header} locale={locale} dictionary={dictionary} />}
      <div className="mt-20">{children}</div>
      {footer && (
        <Footer
          {...footer}
          locale={locale}
          alternates={alternates}
          languageNames={dictionary.header.languages}
          dictionary={dictionary.footer}
        />
      )}
      <CookieConsent dictionary={dictionary.cookie} />
    </LanguageProvider>
  )
}
