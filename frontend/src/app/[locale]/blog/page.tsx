import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import BlogIndexPageUI from "@/components/blog/BlogIndexPageUI";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/i18n-config";
import type { BLOG_INDEX_PAGE_QUERYResult } from "@/sanity/types";
import { BLOG_INDEX_PAGE_QUERY } from "@/sanity/queries";


interface PageParams {
  locale: Locale;
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ page?: string }>;
}

async function getPageData(locale: Locale, page: number = 1, postsPerPage: number = 10): Promise<BLOG_INDEX_PAGE_QUERYResult | null> {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  
  return client.fetch<BLOG_INDEX_PAGE_QUERYResult>(
    BLOG_INDEX_PAGE_QUERY,
    { start, end, language: locale }
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageData(locale);
  const dict = await getDictionary(locale);
  
  if (!data?.config) {
    return {
      title: dict.blog?.defaultTitle || "Blog",
      description: dict.blog?.defaultDescription || "Blog posts",
    };
  }

  const config = data.config;
  const title = config.seo?.metaTitle || config.title || dict.blog?.defaultTitle || "Blog";
  const description = config.seo?.metaDescription || config.description || dict.blog?.defaultDescription || "Blog posts";

  return {
    title,
    description,
  };
}

export default async function BlogIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
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
