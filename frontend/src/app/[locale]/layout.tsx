// app/[locale]/layout.tsx
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { CookieConsent } from '@/components/global/CookieConsent';
import { client } from '@/sanity/client';
import type { Footer as SanityFooter, Header as SanityHeader } from '@/sanity/types';
import { LanguageProvider } from '@/components/global/LanguageProvider';
import { getDictionary } from '@/i18n/getDictionary';
import { i18n, type Locale } from '@/i18n/i18n-config';
import { LAYOUT_FOOTER_QUERY, LAYOUT_HEADER_QUERY } from '@/sanity/queries';


interface Props {
  children: React.ReactNode;
  params: { locale: Locale };
}

async function getGlobals(locale: Locale): Promise<{ header: SanityHeader | null; footer: SanityFooter | null }> {
  const [header, footer] = await Promise.all([
    client.fetch<SanityHeader | null>(LAYOUT_HEADER_QUERY, { language: locale }),
    client.fetch<SanityFooter | null>(LAYOUT_FOOTER_QUERY, { language: locale }),
  ]);
  return { header, footer };
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  // Generate language alternates for SEO
  const languages = i18n.locales.reduce((acc, lang) => {
    acc[lang] = `/${lang}`;
    return acc;
  }, {} as Record<string, string>);

  return {
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const { header, footer } = await getGlobals(locale);
  const dictionary = await getDictionary(locale);

  return (
    <LanguageProvider locale={locale}>
      {header && <Header {...header} locale={locale} dictionary={dictionary} />}
      <div className="mt-20">{children}</div>
      {footer && <Footer {...footer} dictionary={dictionary.footer} />}
      <CookieConsent dictionary={dictionary.cookie} />
    </LanguageProvider>
  );
}
