"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/i18n-config";
import type { CATEGORY_PAGE_QUERYResult } from "@/sanity/types";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

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

// Use the generated types directly from CATEGORY_PAGE_QUERYResult
type CategoryFromQuery = NonNullable<CATEGORY_PAGE_QUERYResult>;
type PostFromQuery = CategoryFromQuery["posts"][0];

interface CategoryPageUIProps {
	category: CategoryFromQuery;
	posts: PostFromQuery[];
	dictionary: Dictionary;
	locale: Locale;
}

export default function CategoryPageUI({
	category,
	posts,
	dictionary,
	locale,
}: CategoryPageUIProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 6;

	// Calculate pagination
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const startIndex = (currentPage - 1) * postsPerPage;
	const endIndex = startIndex + postsPerPage;
	const currentPosts = posts.slice(startIndex, endIndex);

	// Generate pagination items
	const paginationItems = [];
	const maxPagesToShow = 5;

	let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
	const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

	if (endPage === totalPages) {
		startPage = Math.max(1, endPage - maxPagesToShow + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		paginationItems.push(
			<PaginationItem key={i}>
				<PaginationLink
					href="#"
					isActive={i === currentPage}
					onClick={(e) => {
						e.preventDefault();
						setCurrentPage(i);
					}}
				>
					{i}
				</PaginationLink>
			</PaginationItem>
		);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			{/* Category Header */}
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					{category.title || "Category"}
				</h1>
				{category.description && (
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						{category.description}
					</p>
				)}
				
			</div>

			{/* Posts Grid */}
			{currentPosts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					{currentPosts.map((post) => (
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
									<Badge variant="secondary">
										{post.categories[0].title || ""}
									</Badge>
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
									<p className="text-muted-foreground line-clamp-2">
										{post.excerpt}
									</p>
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
										<span className="text-sm">
											{post.author.name || ""}
										</span>
									</>
								)}
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-lg text-muted-foreground mb-4">
						{dictionary.category?.noArticlesFound ||
							"No articles found in this category"}
					</p>
					<Button variant="outline" asChild>
						<Link href={`/${locale}/blog`}>
							{dictionary.category?.viewAllBlogPosts || "View all posts"}
						</Link>
					</Button>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-12">
					<Pagination>
						<PaginationContent>
							{currentPage > 1 && (
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage(currentPage - 1);
										}}
									/>
								</PaginationItem>
							)}

							{paginationItems}

							{currentPage < totalPages && (
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage(currentPage + 1);
										}}
									/>
								</PaginationItem>
							)}
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
