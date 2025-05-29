import { client } from "@/sanity/client";
import CategoryPageUI from "@/components/blog/CategoryPageUI";
import { Locale, i18n } from "@/i18n/i18n-config"; 
import { getDictionary } from "@/i18n/getDictionary";
import type {
  CATEGORY_PAGE_QUERYResult,
} from "@/sanity/types";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORY_PAGE_QUERY } from "@/sanity/queries";


// Define PageParams interface
interface PageParams {
  slug: string;
  locale: Locale;
}

// Define SearchParams interface
interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// Define PageProps to expect a Promise of PageParams
interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>; 
}

// Fetch the category by slug and locale using the composite query
async function getCategory(slug: string, locale: Locale): Promise<CATEGORY_PAGE_QUERYResult | null> {
  return client.fetch<CATEGORY_PAGE_QUERYResult | null>(CATEGORY_PAGE_QUERY, { slug, language: locale });
}

export async function generateMetadata(
  { params }: PageProps, 
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const dictionary = await getDictionary(locale);
  const result = await getCategory(slug, locale);

  if (!result) {
    return {
      title: dictionary.notFound.categoryTitle,
      description: dictionary.notFound.categoryMessage,
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: result.title ? `${result.title} | ${dictionary.app.title}` : dictionary.notFound.categoryTitle,
    description: result.description || dictionary.blog.defaultDescription,
    openGraph: {
      images: [...previousImages],
    },
  };
}

// Generate static paths for all categories and locales
export async function generateStaticParams(): Promise<PageParams[]> {
  const locales = i18n.locales;
  const allParams: PageParams[] = [];

  for (const locale of locales) {
    const categoriesForLocale = await client.fetch<Array<{ slug: { current: string } }>>(
      `*[
        _type == "category"
        && language == $language
      ]{
        _id,
        title,
        slug,
        description
      }`,
      { language: locale }
    );
    categoriesForLocale.forEach(category => {
      if (category.slug?.current) {
        allParams.push({ slug: category.slug.current, locale: locale as Locale });
      }
    });
  }
  return allParams;
}

export default async function CategoryPage({
  params}: PageProps) { 
  const { slug, locale } = await params;
  const dictionary = await getDictionary(locale);
  const result = await getCategory(slug, locale);

  if (!result) {
    notFound();
  }

  return (
    <CategoryPageUI
      category={result} 
      posts={result.posts}
      dictionary={dictionary}
      locale={locale} 
    />
  );
}
