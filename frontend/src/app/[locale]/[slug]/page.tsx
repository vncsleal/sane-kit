import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RenderSection from "@/components/sections/RenderSection";
import { getDictionary } from "@/i18n/getDictionary";
import { i18n, hasLocale, type Locale } from "@/i18n/i18n-config";
import { sanityFetch } from "@/sanity/live";
import { PAGE_QUERY } from "@/sanity/queries";
import { dataAttr, resolveOpenGraphImage } from "@/sanity/utils";

// Define the PageParams interface specifically for params
interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Generate metadata using the PageParams interface
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const { data: page } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug, language: locale },
    // Metadata must never contain stega
    stega: false,
  });
  const dictionary = await getDictionary(locale);

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    };
  }

  const metadata: Metadata = {
    title: page.seo.title || page.title || dictionary.defaultMeta.title,
    description:
      page.seo.description || page.description || dictionary.defaultMeta.description,
  };

  const ogImage = resolveOpenGraphImage(page.seo.image);
  if (ogImage) {
    metadata.openGraph = { images: [ogImage] };
  }

  if (page.seo.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

// Page component using PageParams and removing searchParams
export default async function DynamicPage({ params }: PageProps) {
  const { slug, locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const { data: page } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug, language: locale },
  });

  if (!page) {
    notFound();
  }

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
