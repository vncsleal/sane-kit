import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogIndexPageUI from "@/components/blog/BlogIndexPageUI";
import { getDictionary } from "@/i18n/getDictionary";
import { i18n, hasLocale, type Locale } from "@/i18n/i18n-config";
import { sanityFetch } from "@/sanity/live";
import { BLOG_INDEX_PAGE_QUERY } from "@/sanity/queries";

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ page?: string }>;
}

async function getPageData(locale: Locale, page: number = 1, postsPerPage: number = 10) {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;

  const { data } = await sanityFetch({
    query: BLOG_INDEX_PAGE_QUERY,
    params: { start, end, language: locale },
  });
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const { data } = await sanityFetch({
    query: BLOG_INDEX_PAGE_QUERY,
    params: { start: 0, end: 10, language: locale },
    // Metadata must never contain stega
    stega: false,
  });
  const dict = await getDictionary(locale);

  if (!data?.config) {
    return {
      title: dict.blog?.defaultTitle || "Blog",
      description: dict.blog?.defaultDescription || "Blog posts",
    };
  }

  const config = data.config;
  const title = config.seo?.metaTitle || config.title || dict.blog?.defaultTitle || "Blog";
  const description =
    config.seo?.metaDescription || config.description || dict.blog?.defaultDescription || "Blog posts";

  return {
    title,
    description,
  };
}

export default async function BlogIndexPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const { page: pageParam } = await searchParams;
  const dictionary = await getDictionary(locale);

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const data = await getPageData(locale, currentPage);

  if (!data?.config) {
    notFound();
  }

  const { config, posts, totalPosts } = data;
  const postsPerPage = config.postsPerPage || 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const pagination = {
    currentPage,
    totalPages,
    totalPosts,
  };

  return (
    <BlogIndexPageUI
      config={config}
      posts={posts}
      pagination={pagination}
      dictionary={dictionary.blog}
      locale={locale}
    />
  );
}
