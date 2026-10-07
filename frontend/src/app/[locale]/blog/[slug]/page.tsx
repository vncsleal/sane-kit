import { client, urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";
import BlogPostPage, { type ExpandedBlogPost } from "@/components/blog/BlogPostPage";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { i18n, hasLocale, type Locale } from "@/i18n/i18n-config";
import type { BLOG_POST_PAGE_QUERY_RESULT } from "@/sanity/types";
import { BLOG_POST_PAGE_QUERY } from "@/sanity/queries";
import { siteUrl } from "@/sanity/env";
import { buildBlogPostingJsonLd } from "@/lib/structured-data";

interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Fetch raw page data from the composite query
async function getPageData(slug: string, locale: Locale): Promise<BLOG_POST_PAGE_QUERY_RESULT | null> {
  return client.fetch(BLOG_POST_PAGE_QUERY, { slug, language: locale });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const page = await getPageData(slug, locale);
  const dict = await getDictionary(locale);

  if (!page || !page.title) {
    return {
      title: dict.notFound.pageTitle,
      description: dict.notFound.pageMessage,
    };
  }

  const metadata: Metadata = {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt || dict.defaultMeta.description,
  };

  if (page.seo?.image) {
    metadata.openGraph = {
      images: [urlFor(page.seo.image).width(1200).height(630).url()],
    };
  }

  if (page.seo?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export default async function Page({ params }: PageProps) {
  const { slug, locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const page = await getPageData(slug, locale);
  const dictionary = await getDictionary(locale);

  if (!page || !page._id || !page.title || !page.slug || !page.publishedAt || !page.author) {
    notFound();
  }

  const finalData: ExpandedBlogPost = {
    _id: page._id,
    _type: "blogPost",
    title: page.title,
    slug: { current: page.slug.current || "" },
    publishedAt: page.publishedAt,
    ...(page.excerpt && { excerpt: page.excerpt }),
    ...(page.mainImage && { 
      mainImage: {
        asset: page.mainImage.asset || undefined,
        hotspot: page.mainImage.hotspot || undefined,
        crop: page.mainImage.crop || undefined,
        alt: page.mainImage.alt || undefined,
        _type: "image"
      }
    }),
    ...(page.body && { body: page.body }),
    ...(page.featured && { featured: page.featured }),
    author: {
      _id: page.author._id,
      _type: "author",
      _createdAt: "",
      _updatedAt: "",
      _rev: "",
      name: page.author.name || undefined,
      slug: page.author.slug || undefined,
      avatar: page.author.avatar || undefined,
      bio: page.author.bio || undefined,
      email: page.author.email || undefined,
      role: page.author.role || undefined,
      socialLinks: page.author.socialLinks?.map(link => ({
        ...link,
        _type: "socialLink" as const,
        platform: link.platform || undefined,
        url: link.url || undefined,
        username: link.username || undefined,
      })) || undefined,
    },
    authors: page.authors?.map(author => ({
      _id: author._id,
      _type: "author" as const,
      _createdAt: "",
      _updatedAt: "",
      _rev: "",
      name: author.name || undefined,
      slug: author.slug || undefined,
      avatar: author.avatar || undefined,
      bio: author.bio || undefined,
      email: author.email || undefined,
      role: author.role || undefined,
      socialLinks: author.socialLinks?.map(link => ({
        ...link,
        _type: "socialLink" as const,
        platform: link.platform || undefined,
        url: link.url || undefined,
        username: link.username || undefined,
      })) || undefined,
    })),
    categories: page.categories?.map(category => ({
      originalReferenceId: category._id,
      i18nId: category._id,
      localized: {
        _id: category._id,
        _type: "category" as const,
        _createdAt: "",
        _updatedAt: "",
        _rev: "",
        title: category.title || undefined,
        slug: category.slug || { _type: "slug", current: "" },
        description: category.description || undefined,
      },
      _id: category._id,
      title: category.title || undefined,
      slug: category.slug || undefined,
      description: category.description || undefined,
    })),
  };

  const jsonLd = buildBlogPostingJsonLd({
    headline: page.seo?.title || page.title || "",
    url: `${siteUrl}/${locale}/blog/${slug}`,
    description: page.seo?.description || page.excerpt || undefined,
    image: page.seo?.image ? urlFor(page.seo.image).width(1200).height(630).url() : undefined,
    datePublished: page.publishedAt || undefined,
    authorName: page.author?.name || undefined,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BlogPostPage post={finalData} dictionary={dictionary} locale={locale} />
    </>
  );
}
