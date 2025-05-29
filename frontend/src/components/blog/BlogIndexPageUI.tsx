"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BLOG_INDEX_PAGE_QUERYResult } from "@/sanity/types";
import type { Dictionary } from "@/i18n/getDictionary";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { usePathname } from "next/navigation";

// Function to format date
function formatDate(dateString: string, locale: string) {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short", 
    day: "numeric",
  });
}

// Function to get author initials
function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

type BlogIndexPagePost = NonNullable<BLOG_INDEX_PAGE_QUERYResult>['posts'][0];

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

interface BlogIndexPageUIProps {
  config: NonNullable<BLOG_INDEX_PAGE_QUERYResult>['config'];
  posts: BlogIndexPagePost[];
  pagination: PaginationData;
  dictionary: Dictionary['blog'];
  locale: string;
}

export default function BlogIndexPageUI({
  config,
  posts,
  pagination,
  dictionary,
  locale,
}: BlogIndexPageUIProps) {
  const layout = config?.layout || "grid";
  const { currentPage, totalPages } = pagination;
  
  const pathname = usePathname();

  // Generate pagination items
  const paginationItems = [];
  const maxPagesToShow = 5; // Show at most 5 page numbers
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust start page if end page is at max
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  // Add page number items
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink 
          href={`${pathname}?page=${i}`}
          isActive={i === currentPage}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{config?.title || dictionary?.defaultTitle || "Blog"}</h1>
        {config?.description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {config.description}
          </p>
        )}
      </div>

      {/* Grid layout */}
      {layout === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/${locale}/blog/${post.slug?.current || ""}`}
              className="flex flex-col gap-4 hover:opacity-90 transition-opacity group"
            >
              <div className="bg-muted rounded-md aspect-video overflow-hidden">
                {post.mainImage?.asset?._ref ? (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.mainImage.alt || ""}
                    width={600}
                    height={337}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex flex-row gap-3 items-center flex-wrap">
                {post.categories?.length ? (
                  <Badge variant="secondary">{post.categories[0].title || ""}</Badge>
                ) : null}
                {post.publishedAt && (
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.publishedAt, locale)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium tracking-tight group-hover:text-primary transition-colors">
                  {post.title || ""}
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-auto">
                {post.author && (
                  <>
                    <Avatar className="h-8 w-8">
                      {post.author.avatar?.asset?._ref ? (
                        <AvatarImage
                          src={urlFor(post.author.avatar).url()}
                          alt={post.author.name || undefined}
                        />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(post.author.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author.name || ""}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Featured layout */}
      {layout === "featured" && (
        <div className="space-y-12">
          {posts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-muted rounded-md aspect-video overflow-hidden">
                {posts[0].mainImage?.asset?._ref ? (
                  <Image
                    src={urlFor(posts[0].mainImage).url()}
                    alt={posts[0].mainImage.alt || ""}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-col justify-center gap-4">
                {posts[0].categories?.length ? (
                  <Badge className="w-fit">{posts[0].categories[0].title || ""}</Badge>
                ) : null}
                <h2 className="text-3xl font-bold tracking-tight">
                  <Link href={`/${locale}/blog/${posts[0].slug?.current || ""}`} className="hover:text-primary transition-colors">
                    {posts[0].title || ""}
                  </Link>
                </h2>
                {posts[0].excerpt && (
                  <p className="text-lg text-muted-foreground">{posts[0].excerpt}</p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  {posts[0].author && (
                    <>
                      <Avatar className="h-10 w-10">
                        {posts[0].author.avatar?.asset?._ref ? (
                          <AvatarImage
                            src={urlFor(posts[0].author.avatar).url()}
                            alt={posts[0].author.name || undefined}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(posts[0].author.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{posts[0].author.name || ""}</p>
                        {posts[0].publishedAt && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(posts[0].publishedAt, locale)}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {posts.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {posts.slice(1).map((post) => (
                <Link
                  key={post._id}
                  href={`/${locale}/blog/${post.slug?.current || ""}`}
                  className="flex flex-col gap-4 hover:opacity-90 transition-opacity group"
                >
                  <div className="bg-muted rounded-md aspect-video overflow-hidden">
                    {post.mainImage?.asset?._ref ? (
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.mainImage.alt || ""}
                        width={600}
                        height={337}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-row gap-3 items-center flex-wrap">
                    {post.categories?.length ? (
                      <Badge variant="secondary">{post.categories[0].title || ""}</Badge>
                    ) : null}
                    {post.publishedAt && (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.publishedAt, locale)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                      {post.title || ""}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compact layout */}
      {layout === "compact" && (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post._id} className="border-b pb-8 mb-8 last:border-0">
              <div className="flex flex-col md:flex-row gap-8">
                {post.mainImage?.asset?._ref && (
                  <div className="md:w-1/3 bg-muted rounded-md aspect-video overflow-hidden">
                    <Link href={`/${locale}/blog/${post.slug?.current || ""}`} className="block">
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.mainImage.alt || ""}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </Link>
                  </div>
                )}
                <div className="md:w-2/3 flex flex-col gap-3">
                  {post.categories?.length ? (
                    <Badge className="w-fit">{post.categories[0].title || ""}</Badge>
                  ) : null}
                  <h2 className="text-2xl font-medium">
                    <Link href={`/${locale}/blog/${post.slug?.current || ""}`} className="hover:text-primary transition-colors">
                      {post.title || ""}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {post.author.avatar?.asset?._ref ? (
                            <AvatarImage
                              src={urlFor(post.author.avatar).url()}
                              alt={post.author.name || undefined}
                            />
                          ) : null}
                          <AvatarFallback>
                            {getInitials(post.author.name || "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{post.author.name || ""}</span>
                      </div>
                    )}
                    {post.publishedAt && (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.publishedAt, locale)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`${pathname}?page=${currentPage - 1}`} />
                </PaginationItem>
              )}

              {paginationItems}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`${pathname}?page=${currentPage + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
