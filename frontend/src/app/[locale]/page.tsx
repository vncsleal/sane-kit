import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import RenderSection from '@/components/sections/RenderSection';
import { dictionary } from '@/i18n/dictionaries.pt-BR';
import { i18n, hasLocale, type Locale } from '@/i18n/i18n-config';
import { client } from '@/sanity/client';
import { HOME_PAGE_QUERY } from '@/sanity/queries';
import { dataAttr, resolveOpenGraphImage } from '@/sanity/utils';
import type { Page } from '@/sanity/types';

interface PageParams {
  locale: string;
}

interface Props {
  params: Promise<PageParams>;
}

async function getHomePage(locale: Locale) {
  return client.fetch<Page | null>(HOME_PAGE_QUERY, { language: locale });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const page = await getHomePage(locale);

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    };
  }

  const metadata: Metadata = { title: page.title || 'Página Inicial' };
  if (page.description) metadata.description = page.description;
  const ogImage = resolveOpenGraphImage(page.seo?.image ?? page.ogImage);
  if (ogImage) {
    metadata.openGraph = { images: [ogImage] };
  }
  return metadata;
}

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const page = await getHomePage(locale);

  if (!page) notFound();

  return (
    <main>
      {page.pageBuilder?.map((section) => (
        <div
          key={section._key}
          data-sanity={dataAttr({
            id: page._id,
            type: 'page',
            path: `pageBuilder[_key=="${section._key}"]`,
          })}
        >
          <RenderSection section={section} locale={locale} />
        </div>
      ))}
    </main>
  );
}
