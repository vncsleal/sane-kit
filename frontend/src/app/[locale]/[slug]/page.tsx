import type { Page } from "@/sanity/types";
import { client, urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";
import RenderSection from "@/components/sections/RenderSection";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/i18n-config";
import { PAGE_QUERY } from "@/sanity/queries";


// Define the PageParams interface specifically for params
interface PageParams {
  slug: string;
  locale: Locale;
}

async function getPageData(slug: string, locale: Locale): Promise<Page | null> {
  const page = await client.fetch<Page>(PAGE_QUERY, { slug, language: locale });
  return page;
}

// Generate metadata using the PageParams interface
export async function generateMetadata({
  params,
}: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, locale } = await params; // Await params here
  const page = await getPageData(slug, locale);
  const dictionary = await getDictionary(locale);

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    };
  }

  const metadata: Metadata = {
    title: page.title || dictionary.defaultMeta.title,
  };

  if (page.description) {
    metadata.description = page.description;
  } else {
    metadata.description = dictionary.defaultMeta.description;
  }

  if (page.ogImage?.asset?._ref) {
    metadata.openGraph = {
      images: [urlFor(page.ogImage.asset._ref).width(1200).height(630).url()],
    };
  }

  return metadata;
}

// Page component using PageParams and removing searchParams
export default async function DynamicPage({
  params,
}: {
  params: Promise<PageParams>; // Type params as a Promise
}) {
  const { slug, locale } = await params; // Await params here
  const page = await getPageData(slug, locale);

  if (!page) {
    notFound();
  }

  return (
    <>
      <main>
        {page.pageBuilder?.map((section) => (
          <RenderSection key={section._key} section={section} />
        ))}
      </main>
    </>
  );
}
