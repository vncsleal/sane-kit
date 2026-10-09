import type { Page } from "@/sanity/types";
import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import RenderSection from "@/components/sections/RenderSection";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { i18n, hasLocale, type Locale } from "@/i18n/i18n-config";
import { PAGE_QUERY } from "@/sanity/queries";
import { dataAttr, resolveOpenGraphImage } from "@/sanity/utils";


// Define the PageParams interface specifically for params
interface PageParams {
  slug: string;
  locale: string;
}

async function getPageData(slug: string, locale: Locale): Promise<Page | null> {
  const page = await client.fetch<Page>(PAGE_QUERY, { slug, language: locale });
  return page;
}

// Generate metadata using the PageParams interface
export async function generateMetadata({
  params,
}: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params; // Await params here
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const page = await getPageData(slug, locale);
  const dictionary = await getDictionary(locale);

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    };
  }

  const metadata: Metadata = {
    title: page.seo?.title || page.title || dictionary.defaultMeta.title,
    description:
      page.seo?.description || page.description || dictionary.defaultMeta.description,
  };

  const ogImage = resolveOpenGraphImage(page.seo?.image);
  if (ogImage) {
    metadata.openGraph = { images: [ogImage] };
  }

  if (page.seo?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

// Page component using PageParams and removing searchParams
export default async function DynamicPage({
  params,
}: {
  params: Promise<PageParams>; // Type params as a Promise
}) {
  const { slug, locale: rawLocale } = await params; // Await params here
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const page = await getPageData(slug, locale);

  if (!page) {
    notFound();
  }

  return (
    <>
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
    </>
  );
}
