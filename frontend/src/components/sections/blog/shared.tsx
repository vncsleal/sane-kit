"use client";

import { urlFor } from "@/sanity/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import type { BlogSection } from "@/sanity/types";
import type { BLOG_POSTS_QUERYResult } from "@/sanity/types";
import { defineQuery } from 'groq';

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "blogPost"
  && language == $language
  && ($featuredOnly == false || featured == "true")
] | order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  featured,
  "author": authors[0]->{
    _id,
    name,
    avatar
  },
  "categories": categories[]->{
    _id,
    title,
    slug
  }
}`);

// Use the generated type instead of custom interface
export type BlogPostWithData = BLOG_POSTS_QUERYResult[0];

// Utility functions 
export function formatDate(dateString: string, locale: string) {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short", 
    day: "numeric",
  });
}

export function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Section header component
export const SectionHeader = ({ 
  heading = "Artigos mais recentes", 
  subheading 
}: Pick<BlogSection, 'heading' | 'subheading'>) => (
  <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
        {heading}
      </h2>
      {subheading && (
        <p className="text-lg text-muted-foreground max-w-md">
          {subheading}
        </p>
      )}
    </div>
  </div>
);

// View All button component
export const ViewAllButton = ({
  viewAllButton,
  viewAllUrl = "/blog",
  viewAllButtonText = "Ver todos os artigos",
  locale,
}: Pick<BlogSection, 'viewAllButton' | 'viewAllUrl' | 'viewAllButtonText'> & { locale: string }) => {
  if (viewAllButton !== "true") return null;
  
  const localizedUrl = `/${locale}${viewAllUrl.startsWith("/") ? viewAllUrl : `/${viewAllUrl}`}`;

  return (
    <Button className="gap-4" asChild>
      <Link href={localizedUrl}>
        {viewAllButtonText}
        <MoveRight className="w-4 h-4" />
      </Link>
    </Button>
  );
};

// Blog post card component using generated types
export const BlogPostCard = ({
  post,
  isFeatured = false,
  locale,
}: { 
  post: BlogPostWithData;
  isFeatured?: boolean;
  locale: string;
}) => {
  const localizedPostUrl = `/${locale}/blog/${post.slug?.current || ""}`;

  return (
    <Link
      href={localizedPostUrl}
      className={`flex flex-col gap-4 hover:opacity-75 transition-opacity ${
        isFeatured ? "md:col-span-2" : ""
      }`}
    >
      <div className="bg-muted rounded-md aspect-video overflow-hidden">
        {post.mainImage?.asset?._ref ? (
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.mainImage.alt || ""}
            width={isFeatured ? 1200 : 600}
            height={isFeatured ? 675 : 337}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      
      <div className="flex flex-row gap-4 items-center flex-wrap">
        {post.categories?.length ? (
          <Badge>
            {post.categories[0].title || ""}
          </Badge>
        ) : null}
        
        <p className="flex flex-row gap-2 text-sm items-center">
          <span className="text-muted-foreground">Por</span>{" "}
          <Avatar className="h-6 w-6">
            {post.author?.avatar?.asset?._ref ? (
              <AvatarImage
                src={urlFor(post.author.avatar).url()}
                alt={post.author.name || ""}
              />
            ) : null}
            <AvatarFallback>
              {getInitials(post.author?.name || "")}
            </AvatarFallback>
          </Avatar>
          <span>{post.author?.name || ""}</span>
        </p>
        
        {post.publishedAt && (
          <span className="text-sm text-muted-foreground">
            {formatDate(post.publishedAt, locale)}
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className={`max-w-3xl ${isFeatured ? "text-4xl" : "text-2xl"} tracking-tight`}>
          {post.title}
        </h3>
        {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
      </div>
    </Link>
  );
};
