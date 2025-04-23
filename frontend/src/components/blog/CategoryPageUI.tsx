"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/client";
import type { SanityCategory } from "@/sanity/types/schema";
import { useLanguage } from "@/lib/language-context";
import type { BlogPostData } from "@/app/blog/[slug]/page";

interface CategoryPageUIProps {
	category: SanityCategory;
	posts: BlogPostData[];
}

// Helper function to format date
function formatDate(dateString?: string) {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

// Function to get author initials for avatar fallback
function getInitials(name?: string) {
	if (!name) return "??";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
}

// Define translations for static text
const staticText = {
	noArticlesFound: {
		en: "No articles found in this category.",
		pt_BR: "Nenhum artigo encontrado nesta categoria.",
	},
	viewAllBlogPosts: {
		en: "View all blog posts",
		pt_BR: "Ver todos os posts",
	},
	noImage: {
		en: "No image",
		pt_BR: "Sem imagem",
	},
};

export default function CategoryPageUI({
	category,
	posts,
}: CategoryPageUIProps) {
	const { getLocalizedValue, language } = useLanguage();

	const localizedCategoryTitle = getLocalizedValue(
		category.i18n_title,
		category.title,
	);
	const localizedCategoryDescription = getLocalizedValue(
		category.i18n_description,
		category.description,
	);

	// Localize static text
	const localizedNoArticles =
		staticText.noArticlesFound[language] || staticText.noArticlesFound.en;
	const localizedViewAll =
		staticText.viewAllBlogPosts[language] || staticText.viewAllBlogPosts.en;
	const localizedNoImage =
		staticText.noImage[language] || staticText.noImage.en;

	return (
		<main className="container mx-auto px-4 md:px-6 py-12">
			<div className="flex flex-col gap-12">
				{/* Category Header */}
				<div className="flex flex-col gap-4 max-w-3xl">
					<Badge className="w-fit">{localizedCategoryTitle}</Badge>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						{localizedCategoryTitle}
					</h1>
					{localizedCategoryDescription && (
						<p className="text-xl text-muted-foreground">
							{localizedCategoryDescription}
						</p>
					)}
				</div>

				{/* Category Posts */}
				<div className="flex flex-col gap-8">
					{posts.length === 0 ? (
						<div className="text-center py-20">
							<p className="text-muted-foreground text-lg">
								{localizedNoArticles}
							</p>
							<Button asChild className="mt-8">
								<Link href="/blog">{localizedViewAll}</Link>
							</Button>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{posts.map((post: BlogPostData) => {
									const localizedPostTitle = getLocalizedValue(
										post.i18n_title,
										post.title,
									);
									const localizedExcerpt = getLocalizedValue(
										post.i18n_excerpt,
										post.excerpt,
									);
									const localizedAuthorName = getLocalizedValue(
										post.author?.i18n_name,
										post.author?.name,
									);
									const localizedImageAlt = getLocalizedValue(
										post.mainImage?.i18n_alt,
										post.mainImage?.alt,
									);
									const localizedAuthorAvatarAlt = getLocalizedValue(
										post.author?.avatar?.i18n_alt,
										post.author?.avatar?.alt,
									);

									return (
										<Link
											href={`/blog/${post.slug.current}`}
											key={post._id}
											className="flex flex-col gap-4 group hover:opacity-80 transition-opacity"
										>
											<div className="bg-muted rounded-md aspect-video overflow-hidden relative">
												{post.mainImage?.asset?._ref ? (
													<Image
														src={urlFor(post.mainImage.asset._ref).url()}
														alt={localizedImageAlt || localizedPostTitle || ""}
														fill
														className="object-cover transition-transform group-hover:scale-105"
													/>
												) : (
													<div className="w-full h-full bg-muted flex items-center justify-center">
														<span className="text-muted-foreground">
															{localizedNoImage}
														</span>
													</div>
												)}
											</div>

											<div className="flex flex-row gap-4 items-center">
												<span className="text-sm text-muted-foreground">
													{formatDate(post.publishedAt)}
												</span>
											</div>

											<h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
												{localizedPostTitle}
											</h2>

											{localizedExcerpt && (
												<p className="text-muted-foreground line-clamp-2">
													{localizedExcerpt}
												</p>
											)}

											{localizedAuthorName && (
												<div className="flex items-center gap-2 mt-auto">
													<Avatar className="h-8 w-8">
														{post.author?.avatar?.asset?._ref ? (
															<AvatarImage
																src={urlFor(
																	post.author.avatar.asset._ref,
																).url()}
																alt={
																	localizedAuthorAvatarAlt ||
																	localizedAuthorName
																}
															/>
														) : null}
														<AvatarFallback>
															{getInitials(localizedAuthorName)}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm">{localizedAuthorName}</span>
												</div>
											)}
										</Link>
									);
								})}
							</div>

							<div className="flex justify-center pt-8">
								<Button asChild>
									<Link href="/blog">{localizedViewAll}</Link>
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
