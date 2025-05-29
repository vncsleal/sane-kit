import type { Page } from '@/sanity/types';
import { client, urlFor } from '@/sanity/client';
import { notFound } from 'next/navigation';
import RenderSection from '@/components/sections/RenderSection';
import { dictionary } from '@/i18n/dictionaries.pt-BR';
import type { Metadata } from 'next';
import { HOME_PAGE_QUERY } from '@/sanity/queries';



interface PageParams {
  locale: string;
}

interface Props {
  params: Promise<PageParams>;
}

async function getHomePage(locale: string): Promise<Page | null> {
  return client.fetch<Page | null>(HOME_PAGE_QUERY, { language: locale });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getHomePage(locale);

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    };
  }

  const metadata: Metadata = { title: page.title || 'Página Inicial' };
  if (page.description) metadata.description = page.description;
  if (page.ogImage?.asset?._ref) {
    metadata.openGraph = {
      images: [urlFor(page.ogImage).width(1200).height(630).url()],
    };
  }
  return metadata;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const page = await getHomePage(locale);
  if (!page) notFound();
  return (
    <main>
      {page.pageBuilder?.map((section) => (
        <RenderSection key={section._key} section={section} />
      ))}
    </main>
  );
}
