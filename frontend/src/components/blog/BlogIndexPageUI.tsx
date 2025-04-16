"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { SanityBlogPage } from "@/sanity/types/schema";
import type { BlogPostListItem } from "@/app/blog/page"; // Import type from page.tsx
import { useLanguage } from "@/lib/language-context";

interface BlogIndexPageUIProps {
	config: SanityBlogPage;
	posts: BlogPostListItem[];
}

// Helper function to format date
function formatDate(dateString?: string) {
	if (!dateString) return "No date";
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

// Function to get initials for avatar fallback
function getInitials(name?: string) {
	if (!name) return "??";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
}

export default function BlogIndexPageUI({
	config,
	posts,
}: BlogIndexPageUIProps) {
	const { getLocalizedValue } = useLanguage();

	const localizedTitle = getLocalizedValue(config.i18n_title, config.title);
	const localizedDescription = getLocalizedValue(
		config.i18n_description,
		config.description,
	);

	// For "featured" layout, organize posts
	let featuredPosts: BlogPostListItem[] = [];
	let regularPosts: BlogPostListItem[] = [];

	if (config.layout === "featured") {
		const count = config.featuredPostsCount || 3;
		if (config.showOnlyFeaturedPosts) {
			featuredPosts = posts.filter((post) => post.featured).slice(0, count);
			regularPosts = posts.filter((post) => !post.featured);
		} else {
			featuredPosts = posts.slice(0, count);
			regularPosts = posts.slice(count);
		}
	}

	return (
		<main className="container mx-auto px-4 md:px-6 py-12">
			<div className="flex flex-col gap-8 mb-16">
				<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
					{localizedTitle}
				</h1>
				{localizedDescription && (
					<p className="text-xl text-muted-foreground">
						{localizedDescription}
					</p>
				)}
			</div>

			{/* Featured Layout */}
			{config.layout === "featured" && featuredPosts.length > 0 && (
				<div className="w-full py-10">
					<div className="flex flex-col gap-14">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Main Featured Post */}
							{featuredPosts.length > 0 &&
								(() => {
									const post = featuredPosts[0];
									const localizedPostTitle = getLocalizedValue(
										post.i18n_title,
										post.title,
									);
									const localizedExcerpt = getLocalizedValue(
										post.i18n_excerpt,
										post.excerpt,
									);
									const localizedCategoryTitle = getLocalizedValue(
										post.categories?.[0]?.i18n_title,
										post.categories?.[0]?.title,
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
											className="flex flex-col gap-4 hover:opacity-75 transition-opacity md:col-span-2"
										>
											<div className="bg-muted rounded-md aspect-video overflow-hidden">
												{post.mainImage?.asset?._ref ? (
													<Image
														src={urlFor(post.mainImage.asset._ref).url()}
														alt={localizedImageAlt || localizedPostTitle || ""}
														width={1200}
														height={675}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-muted flex items-center justify-center">
														<span className="text-muted-foreground">
															No image
														</span>
													</div>
												)}
											</div>

											<div className="flex flex-row gap-4 items-center flex-wrap">
												{localizedCategoryTitle && (
													<Badge>{localizedCategoryTitle}</Badge>
												)}
												{localizedAuthorName && (
													<p className="flex flex-row gap-2 text-sm items-center">
														<span className="text-muted-foreground">By</span>{" "}
														<Avatar className="h-6 w-6">
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
														<span>{localizedAuthorName}</span>
													</p>
												)}
												{post.publishedAt && (
													<span className="text-sm text-muted-foreground">
														{formatDate(post.publishedAt)}
													</span>
												)}
											</div>

											<div className="flex flex-col gap-2">
												<h3 className="max-w-3xl text-4xl tracking-tight">
													{localizedPostTitle}
												</h3>
												{localizedExcerpt && (
													<p className="max-w-3xl text-muted-foreground text-base">
														{localizedExcerpt}
													</p>
												)}
											</div>
										</Link>
									);
								})()}

							{/* Secondary Featured Posts */}
							{featuredPosts.slice(1).map((post) => {
								const localizedPostTitle = getLocalizedValue(
									post.i18n_title,
									post.title,
								);
								const localizedExcerpt = getLocalizedValue(
									post.i18n_excerpt,
									post.excerpt,
								);
								const localizedCategoryTitle = getLocalizedValue(
									post.categories?.[0]?.i18n_title,
									post.categories?.[0]?.title,
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
										key={post._id}
										href={`/blog/${post.slug.current}`}
										className="flex flex-col gap-4 hover:opacity-75 transition-opacity"
									>
										<div className="bg-muted rounded-md aspect-video overflow-hidden">
											{post.mainImage?.asset?._ref ? (
												<Image
													src={urlFor(post.mainImage.asset._ref).url()}
													alt={localizedImageAlt || localizedPostTitle || ""}
													width={600}
													height={337}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full bg-muted flex items-center justify-center">
													<span className="text-muted-foreground">
														No image
													</span>
												</div>
											)}
										</div>

										<div className="flex flex-row gap-4 items-center flex-wrap">
											{localizedCategoryTitle && (
												<Badge>{localizedCategoryTitle}</Badge>
											)}
											{localizedAuthorName && (
												<p className="flex flex-row gap-2 text-sm items-center">
													<span className="text-muted-foreground">By</span>{" "}
													<Avatar className="h-6 w-6">
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
													<span>{localizedAuthorName}</span>
												</p>
											)}
											{post.publishedAt && (
												<span className="text-sm text-muted-foreground">
													{formatDate(post.publishedAt)}
												</span>
											)}
										</div>

										<div className="flex flex-col gap-1">
											<h3 className="max-w-3xl text-2xl tracking-tight">
												{localizedPostTitle}
											</h3>
											{localizedExcerpt && (
												<p className="max-w-3xl text-muted-foreground text-base">
													{localizedExcerpt}
												</p>
											)}
										</div>
									</Link>
								);
							})}
						</div>

						{/* Regular Posts for Featured Layout */}
						{regularPosts.length > 0 && (
							<>
								<h2 className="text-2xl font-semibold mt-10 mb-4">
									More Articles
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									{regularPosts.map((post) => {
										const localizedPostTitle = getLocalizedValue(
											post.i18n_title,
											post.title,
										);
										const localizedCategoryTitle = getLocalizedValue(
											post.categories?.[0]?.i18n_title,
											post.categories?.[0]?.title,
										);
										const localizedImageAlt = getLocalizedValue(
											post.mainImage?.i18n_alt,
											post.mainImage?.alt,
										);

										return (
											<Link
												key={post._id}
												href={`/blog/${post.slug.current}`}
												className="flex flex-col gap-4 hover:opacity-75 transition-opacity"
											>
												<div className="bg-muted rounded-md aspect-video overflow-hidden">
													{post.mainImage?.asset?._ref ? (
														<Image
															src={urlFor(post.mainImage.asset._ref).url()}
															alt={
																localizedImageAlt || localizedPostTitle || ""
															}
															width={400}
															height={225}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full bg-muted flex items-center justify-center">
															<span className="text-muted-foreground">
																No image
															</span>
														</div>
													)}
												</div>

												<div className="flex flex-row gap-2 items-center">
													{localizedCategoryTitle && (
														<Badge variant="secondary">
															{localizedCategoryTitle}
														</Badge>
													)}
													<span className="text-sm text-muted-foreground">
														{formatDate(post.publishedAt)}
													</span>
												</div>

												<h3 className="text-lg font-medium line-clamp-2">
													{localizedPostTitle}
												</h3>
											</Link>
										);
									})}
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Standard Grid Layout */}
			{config.layout === "grid" && posts.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{posts.map((post) => {
						const localizedPostTitle = getLocalizedValue(
							post.i18n_title,
							post.title,
						);
						const localizedExcerpt = getLocalizedValue(
							post.i18n_excerpt,
							post.excerpt,
						);
						const localizedCategoryTitle = getLocalizedValue(
							post.categories?.[0]?.i18n_title,
							post.categories?.[0]?.title,
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
								key={post._id}
								href={`/blog/${post.slug.current}`}
								className="flex flex-col gap-4 group"
							>
								<div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
									{post.mainImage?.asset?._ref ? (
										<Image
											src={urlFor(post.mainImage.asset._ref).url()}
											alt={localizedImageAlt || localizedPostTitle || ""}
											fill
											className="object-cover transition-transform group-hover:scale-105"
										/>
									) : (
										<div className="w-full h-full bg-muted flex items-center justify-center">
											<span className="text-muted-foreground">No image</span>
										</div>
									)}
								</div>

								<div className="flex items-center gap-2">
									{localizedCategoryTitle && (
										<Badge variant="secondary">{localizedCategoryTitle}</Badge>
									)}
									<span className="text-sm text-muted-foreground">
										{formatDate(post.publishedAt)}
									</span>
								</div>

								<h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
									{localizedPostTitle}
								</h2>

								{localizedExcerpt && (
									<p className="text-muted-foreground line-clamp-2">
										{localizedExcerpt}
									</p>
								)}

								<div className="flex items-center gap-2 mt-auto">
									<Avatar className="h-8 w-8">
										{post.author?.avatar?.asset?._ref ? (
											<AvatarImage
												src={urlFor(post.author.avatar.asset._ref).url()}
												alt={localizedAuthorAvatarAlt || localizedAuthorName}
											/>
										) : null}
										<AvatarFallback>
											{getInitials(localizedAuthorName)}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm">
										{localizedAuthorName || "Unknown author"}
									</span>
								</div>
							</Link>
						);
					})}
				</div>
			)}

			{/* Compact Layout */}
			{config.layout === "compact" && posts.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{posts.map((post) => {
						const localizedPostTitle = getLocalizedValue(
							post.i18n_title,
							post.title,
						);
						const localizedImageAlt = getLocalizedValue(
							post.mainImage?.i18n_alt,
							post.mainImage?.alt,
						);

						return (
							<Link
								key={post._id}
								href={`/blog/${post.slug.current}`}
								className="flex gap-4 items-center p-4 rounded-lg hover:bg-muted transition-colors"
							>
								{post.mainImage?.asset?._ref && (
									<div className="w-16 h-16 bg-muted rounded-md overflow-hidden relative shrink-0">
										<Image
											src={urlFor(post.mainImage.asset._ref).url()}
											alt={localizedImageAlt || localizedPostTitle || ""}
											fill
											className="object-cover"
										/>
									</div>
								)}
								<div>
									<h3 className="font-medium">{localizedPostTitle}</h3>
									<p className="text-sm text-muted-foreground">
										{post.publishedAt
											? formatDate(post.publishedAt)
											: "No date"}
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			)}

			{posts.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No blog posts found.
				</div>
			)}
		</main>
	);
}
