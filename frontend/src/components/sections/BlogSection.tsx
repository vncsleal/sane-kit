"use client"; // Ensure this is a client component

import { client } from "@/sanity/client";
import type {
	SanityBlogSection,
	SanityBlogPost,
	SanityAuthor,
	SanityCategory,
} from "@/sanity/types/schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import { MoveRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context"; // Import useLanguage
import { useState, useEffect } from "react"; // Import useState and useEffect for client-side fetching

// Interface for fetched post data
export interface BlogPostWithData
	extends Omit<SanityBlogPost, "author" | "categories"> {
	author: SanityAuthor;
	categories?: SanityCategory[];
}

// Function to format date (can be moved to utils if used elsewhere)
function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
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

// Main component remains a Client Component
export default function BlogSection(props: SanityBlogSection) {
	const {
		heading = "Latest articles", // Default value
		i18n_heading,
		subheading,
		i18n_subheading,
		postsToShow = 3,
		showFeaturedPostLarge = true,
		featuredPostsOnly = false,
		variant = "default",
		viewAllButton = false,
		viewAllUrl = "/blog",
		viewAllButtonText = "View all", // Default value
		i18n_viewAllButtonText,
	} = props;

	const { getLocalizedValue } = useLanguage(); // Use the hook for localization
	const [posts, setPosts] = useState<BlogPostWithData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Localize section texts using the hook
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);
	const localizedViewAllButtonText = getLocalizedValue(
		i18n_viewAllButtonText,
		viewAllButtonText,
	);

	useEffect(() => {
		const fetchPosts = async () => {
			setIsLoading(true);
			setError(null);
			let query = `*[_type == "blogPost"] | order(publishedAt desc, _updatedAt desc)`;
			if (featuredPostsOnly) {
				query = `*[_type == "blogPost" && featured == true] | order(publishedAt desc, _updatedAt desc)`;
			}

			try {
				const fetchedPosts: BlogPostWithData[] = await client.fetch(`
                    ${query}[0...${postsToShow}]{
                        _id,
                        title,
                        i18n_title,
                        slug,
                        publishedAt,
                        excerpt,
                        i18n_excerpt,
                        mainImage{
                            ...,
                            i18n_alt
                        },
                        featured,
                        "author": author->{
                            _id,
                            name,
                            i18n_name,
                            slug,
                            avatar{
                                ...,
                                i18n_alt
                            },
                            bio,
                            i18n_bio
                        },
                        "categories": categories[]->{
                            _id,
                            title,
                            i18n_title,
                            slug,
                            description,
                            i18n_description
                        }
                    }
                `);
				setPosts(fetchedPosts);
			} catch (err) {
				console.error("Error fetching blog posts:", err);
				setError("Failed to load posts.");
				setPosts([]); // Ensure posts is empty on error
			} finally {
				setIsLoading(false);
			}
		};

		fetchPosts();
	}, [postsToShow, featuredPostsOnly]); // Re-fetch if these props change

	const hasPosts = !isLoading && !error && posts.length > 0;
	const featuredPost =
		variant === "default" && showFeaturedPostLarge && hasPosts
			? posts[0]
			: null;
	const regularPosts =
		variant === "default" && showFeaturedPostLarge && hasPosts
			? posts.slice(1)
			: posts;

	// --- Render Logic (similar to BlogSectionUI but integrated here) ---

	if (isLoading) {
		// Optional: Render a loading state
		return (
			<section className="w-full py-20 lg:py-40">
				<div className="container mx-auto px-4 md:px-6 text-center">
					Loading posts...
				</div>
			</section>
		);
	}

	if (error) {
		// Optional: Render an error state
		return (
			<section className="w-full py-20 lg:py-40">
				<div className="container mx-auto px-4 md:px-6 text-center text-destructive">
					{error}
				</div>
			</section>
		);
	}

	// Grid variant (Blog1 style)
	if (variant === "grid") {
		return (
			<section className="w-full py-20 lg:py-40">
				<div className="container mx-auto flex flex-col gap-14">
					<div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
						<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
							{localizedHeading}
						</h2>
						{viewAllButton && (
							<Button className="gap-4" asChild>
								<Link
									href={
										viewAllUrl.startsWith("/") ? viewAllUrl : `/${viewAllUrl}`
									}
								>
									{localizedViewAllButtonText}
									<MoveRight className="w-4 h-4" />
								</Link>
							</Button>
						)}
					</div>

					{!hasPosts ? (
						<div className="text-center py-20 text-muted-foreground">
							No blog posts found.
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{posts.map((post) => (
								<Link
									key={post._id}
									href={`/blog/${post.slug.current}`}
									className="flex flex-col gap-2 hover:opacity-75 transition-opacity group"
								>
									<div className="bg-muted rounded-md aspect-video mb-4 overflow-hidden">
										{post.mainImage?.asset?._ref ? (
											<Image
												src={urlFor(post.mainImage).url()}
												alt={
													getLocalizedValue(
														post.mainImage.i18n_alt,
														post.mainImage.alt,
													) || ""
												}
												width={400}
												height={225}
												className="w-full h-full object-cover transition-transform group-hover:scale-105"
											/>
										) : null}
									</div>
									<h3 className="text-xl tracking-tight group-hover:text-primary transition-colors">
										{getLocalizedValue(post.i18n_title, post.title)}
									</h3>
									{post.excerpt && (
										<p className="text-muted-foreground text-base line-clamp-2">
											{getLocalizedValue(post.i18n_excerpt, post.excerpt)}
										</p>
									)}
								</Link>
							))}
						</div>
					)}
				</div>
			</section>
		);
	}

	// Default variant (existing layout)
	return (
		<section className="w-full py-20 lg:py-40">
			<div className="container mx-auto px-4 md:px-6 flex flex-col gap-14">
				<div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
					{/* Heading and Subheading */}
					<div className="flex flex-col gap-2">
						<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
							{localizedHeading}
						</h2>
						{localizedSubheading && (
							<p className="text-lg text-muted-foreground max-w-md">
								{localizedSubheading}
							</p>
						)}
					</div>
					{/* View All Button */}
					{viewAllButton && (
						<Button className="gap-4" asChild>
							<Link
								href={
									viewAllUrl.startsWith("/") ? viewAllUrl : `/${viewAllUrl}`
								}
							>
								{localizedViewAllButtonText}
								<MoveRight className="w-4 h-4" />
							</Link>
						</Button>
					)}
				</div>

				{!hasPosts ? (
					<div className="text-center py-20 text-muted-foreground">
						No blog posts found.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Featured Post */}
						{featuredPost && (
							<Link
								href={`/blog/${featuredPost.slug.current}`}
								className="flex flex-col gap-4 hover:opacity-75 transition-opacity md:col-span-2"
							>
								<div className="bg-muted rounded-md aspect-video overflow-hidden">
									{featuredPost.mainImage?.asset?._ref ? (
										<Image
											src={urlFor(featuredPost.mainImage).url()}
											alt={
												getLocalizedValue(
													featuredPost.mainImage.i18n_alt,
													featuredPost.mainImage.alt,
												) || ""
											}
											width={1200}
											height={675}
											className="w-full h-full object-cover"
										/>
									) : null}
								</div>
								<div className="flex flex-row gap-4 items-center flex-wrap">
									{featuredPost.categories?.length ? (
										<Badge>
											{getLocalizedValue(
												featuredPost.categories[0].i18n_title,
												featuredPost.categories[0].title,
											)}
										</Badge>
									) : null}
									<p className="flex flex-row gap-2 text-sm items-center">
										<span className="text-muted-foreground">By</span>{" "}
										<Avatar className="h-6 w-6">
											{featuredPost.author.avatar?.asset?._ref ? (
												<AvatarImage
													src={urlFor(featuredPost.author.avatar).url()}
													alt={getLocalizedValue(
														featuredPost.author.i18n_name,
														featuredPost.author.name,
													)}
												/>
											) : null}
											<AvatarFallback>
												{getInitials(
													getLocalizedValue(
														featuredPost.author.i18n_name,
														featuredPost.author.name,
													) || "",
												)}
											</AvatarFallback>
										</Avatar>
										<span>
											{getLocalizedValue(
												featuredPost.author.i18n_name,
												featuredPost.author.name,
											)}
										</span>
									</p>
									{featuredPost.publishedAt && (
										<span className="text-sm text-muted-foreground">
											{formatDate(featuredPost.publishedAt)}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="max-w-3xl text-4xl tracking-tight">
										{getLocalizedValue(
											featuredPost.i18n_title,
											featuredPost.title,
										)}
									</h3>
									{featuredPost.excerpt && (
										<p className="max-w-3xl text-muted-foreground text-base">
											{getLocalizedValue(
												featuredPost.i18n_excerpt,
												featuredPost.excerpt,
											)}
										</p>
									)}
								</div>
							</Link>
						)}

						{/* Regular Posts */}
						{regularPosts.map((post) => (
							<Link
								href={`/blog/${post.slug.current}`}
								key={post._id}
								className="flex flex-col gap-4 hover:opacity-75 transition-opacity"
							>
								<div className="bg-muted rounded-md aspect-video overflow-hidden">
									{post.mainImage?.asset?._ref ? (
										<Image
											src={urlFor(post.mainImage).url()}
											alt={
												getLocalizedValue(
													post.mainImage.i18n_alt,
													post.mainImage.alt,
												) || ""
											}
											width={600}
											height={337}
											className="w-full h-full object-cover"
										/>
									) : null}
								</div>
								<div className="flex flex-row gap-4 items-center flex-wrap">
									{post.categories?.length ? (
										<Badge>
											{getLocalizedValue(
												post.categories[0].i18n_title,
												post.categories[0].title,
											)}
										</Badge>
									) : null}
									<p className="flex flex-row gap-2 text-sm items-center">
										<span className="text-muted-foreground">By</span>{" "}
										<Avatar className="h-6 w-6">
											{post.author.avatar?.asset?._ref ? (
												<AvatarImage
													src={urlFor(post.author.avatar).url()}
													alt={getLocalizedValue(
														post.author.i18n_name,
														post.author.name,
													)}
												/>
											) : null}
											<AvatarFallback>
												{getInitials(
													getLocalizedValue(
														post.author.i18n_name,
														post.author.name,
													) || "",
												)}
											</AvatarFallback>
										</Avatar>
										<span>
											{getLocalizedValue(
												post.author.i18n_name,
												post.author.name,
											)}
										</span>
									</p>
									{post.publishedAt && (
										<span className="text-sm text-muted-foreground">
											{formatDate(post.publishedAt)}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-1">
									<h3 className="max-w-3xl text-2xl tracking-tight">
										{getLocalizedValue(post.i18n_title, post.title)}
									</h3>
									{post.excerpt && (
										<p className="max-w-3xl text-muted-foreground text-base">
											{getLocalizedValue(post.i18n_excerpt, post.excerpt)}
										</p>
									)}
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
